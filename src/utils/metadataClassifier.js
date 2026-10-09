const METADATA_FIELDS = {
  device: {
    label: "Appareil",
    sensitive: false,
    fields: [
      "Make",
      "Model",
      "LensModel",
      "LensMake",
      "BodySerialNumber",
      "CameraOwnerName",
      "HostComputer",
    ],
  },

  date: {
    label: "Date et heure",
    sensitive: false,
    fields: [
      "DateTime",
      "DateTimeOriginal",
      "CreateDate",
      "ModifyDate",
      "DateTimeDigitized",
      "MetadataDate",
    ],
  },

  location: {
    label: "Localisation",
    sensitive: true,
    fields: [
      "GPSLatitude",
      "GPSLongitude",
      "GPSAltitude",
      "GPSLatitudeRef",
      "GPSLongitudeRef",
      "GPSPosition",
      "GPSDateStamp",
      "GPSTimeStamp",
    ],
  },

  author: {
    label: "Auteur",
    sensitive: true,
    fields: [
      "Artist",
      "Creator",
      "By-line",
      "Byline",
      "Copyright",
      "CopyrightNotice",
      "OwnerName",
    ],
  },

  iptc: {
    label: "IPTC",
    sensitive: true,
    fields: [
      "Headline",
      "Caption-Abstract",
      "Description",
      "Keywords",
      "City",
      "Country-PrimaryLocationName",
      "Province-State",
      "Sub-location",
    ],
  },

  xmp: {
    label: "XMP",
    sensitive: false,
    fields: [
      "XMP",
      "CreatorTool",
      "DocumentID",
      "InstanceID",
      "OriginalDocumentID",
      "History",
    ],
  },

  software: {
    label: "Logiciel",
    sensitive: false,
    fields: [
      "Software",
      "CreatorTool",
      "ProcessingSoftware",
      "HostComputer",
    ],
  },
};

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function getMetadataEntries(metadata) {
  return Object.entries(metadata).filter(([, value]) => hasValue(value));
}

function findCategory(key) {
  for (const [categoryKey, category] of Object.entries(METADATA_FIELDS)) {
    if (category.fields.includes(key)) {
      return {
        key: categoryKey,
        label: category.label,
        sensitive: category.sensitive,
      };
    }
  }

  return null;
}

export function classifyMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return {
      categories: [],
      totalFields: 0,
      sensitiveFields: 0,
      hasSensitiveMetadata: false,
      hasMetadata: false,
    };
  }

  const entries = getMetadataEntries(metadata);

  const categoryResults = Object.entries(METADATA_FIELDS)
    .map(([key, category]) => {
      const fields = entries.filter(([field]) =>
        category.fields.includes(field),
      );

      return {
        key,
        label: category.label,
        sensitive: category.sensitive,
        count: fields.length,
      };
    })
    .filter((category) => category.count > 0);

  const sensitiveFields = entries.filter(([key]) => {
    const category = findCategory(key);
    return category?.sensitive;
  }).length;

  return {
    categories: categoryResults,
    totalFields: entries.length,
    sensitiveFields,
    hasSensitiveMetadata: sensitiveFields > 0,
    hasMetadata: entries.length > 0,
  };
}