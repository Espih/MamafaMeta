
const JPEG_METADATA_MARKERS = new Set([
  0xe1, // EXIF et XMP
  0xed, // IPTC / Photoshop
  0xfe, // Commentaires JPEG
]);

const PNG_METADATA_CHUNKS = new Set([
  "eXIf",
  "tEXt",
  "zTXt",
  "iTXt",
  "tIME",
]);

export async function cleanImageMetadata(file) {
  if (!(file instanceof File)) {
    throw new Error("Le fichier fourni est invalide.");
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let cleanedBytes;

  if (file.type === "image/jpeg") {
    cleanedBytes = cleanJpeg(bytes);
  } else if (file.type === "image/png") {
    cleanedBytes = cleanPng(bytes);
  } else {
    throw new Error(
      "Le nettoyage sans réencodage prend actuellement en charge JPEG et PNG.",
    );
  }

  const extension = file.name.match(/\.[^.]+$/)?.[0] ?? "";
  const basename = extension
    ? file.name.slice(0, -extension.length)
    : file.name;

  return new File(
    [cleanedBytes],
    `${basename}-cleaned${extension}`,
    {
      type: file.type,
      lastModified: Date.now(),
    },
  );
}

function cleanJpeg(bytes) {
  if (
    bytes.length < 4 ||
    bytes[0] !== 0xff ||
    bytes[1] !== 0xd8
  ) {
    throw new Error("Le fichier JPEG semble invalide.");
  }

  const parts = [bytes.slice(0, 2)];
  let offset = 2;
  let foundScan = false;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      throw new Error("Structure JPEG invalide.");
    }

    const markerStart = offset;

    while (offset < bytes.length && bytes[offset] === 0xff) {
      offset++;
    }

    if (offset >= bytes.length) {
      throw new Error("Fichier JPEG incomplet.");
    }

    const marker = bytes[offset++];

    // Les marqueurs de fin et de début d'image sont sans longueur.
    if (marker === 0xd9) {
      parts.push(bytes.slice(markerStart, offset));
      break;
    }

    if (marker === 0xda) {
      if (offset + 2 > bytes.length) {
        throw new Error("Fichier JPEG incomplet.");
      }

      const segmentLength =
        (bytes[offset] << 8) | bytes[offset + 1];

      const scanStart = offset + segmentLength;

      if (segmentLength < 2 || scanStart > bytes.length) {
        throw new Error("Segment JPEG invalide.");
      }

      parts.push(bytes.slice(markerStart));
      foundScan = true;
      break;
    }

    // Marqueurs sans segment de longueur.
    if (
      marker === 0x01 ||
      (marker >= 0xd0 && marker <= 0xd7)
    ) {
      parts.push(bytes.slice(markerStart, offset));
      continue;
    }

    if (offset + 2 > bytes.length) {
      throw new Error("Fichier JPEG incomplet.");
    }

    const segmentLength =
      (bytes[offset] << 8) | bytes[offset + 1];

    const segmentEnd = offset + segmentLength;

    if (segmentLength < 2 || segmentEnd > bytes.length) {
      throw new Error("Segment JPEG invalide.");
    }

    if (!JPEG_METADATA_MARKERS.has(marker)) {
      parts.push(bytes.slice(markerStart, segmentEnd));
    }

    offset = segmentEnd;
  }

  if (!foundScan) {
    throw new Error("Données d'image JPEG introuvables.");
  }

  return concatenate(parts);
}

function cleanPng(bytes) {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];

  if (
    bytes.length < 8 ||
    !signature.every((value, index) => bytes[index] === value)
  ) {
    throw new Error("Le fichier PNG semble invalide.");
  }

  const parts = [bytes.slice(0, 8)];
  let offset = 8;
  let foundEnd = false;

  while (offset + 12 <= bytes.length) {
    const length =
      bytes[offset] * 0x1000000 +
      bytes[offset + 1] * 0x10000 +
      bytes[offset + 2] * 0x100 +
      bytes[offset + 3];

    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7],
    );

    const end = offset + 12 + length;

    if (end > bytes.length) {
      throw new Error("Chunk PNG incomplet.");
    }

    if (!PNG_METADATA_CHUNKS.has(type)) {
      parts.push(bytes.slice(offset, end));
    }

    offset = end;

    if (type === "IEND") {
      foundEnd = true;
      break;
    }
  }

  if (!foundEnd) {
    throw new Error("Fin du fichier PNG introuvable.");
  }

  if (offset < bytes.length) {
    parts.push(bytes.slice(offset));
  }

  return concatenate(parts);
}

function concatenate(parts) {
  const totalLength = parts.reduce(
    (total, part) => total + part.length,
    0,
  );

  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }

  return result;
}