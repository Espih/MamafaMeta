export function formatMetadataValue(value) {
  if (value === undefined || value === null || value === "") {
    return "Non renseigné";
  }

  if (value instanceof Date) {
    return value.toLocaleString("fr-FR");
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "Valeur non affichable";
    }
  }

  return String(value);
}

export function formatMetadataKey(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}