import exifr from "exifr";

export async function readMetadata(file) {
  if (!(file instanceof File)) {
    throw new Error("Le fichier fourni n'est pas une image valide.");
  }

  const metadata = await exifr.parse(file, {
    tiff: true,
    ifd0: true,
    exif: true,
    gps: true,
    xmp: true,
    iptc: true,
  });

  return metadata ?? {};
}