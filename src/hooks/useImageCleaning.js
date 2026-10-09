
import { useState } from "react";

import { cleanImageMetadata } from "../services/image/imageService";

function useImageCleaning() {
  const [cleanedImage, setCleanedImage] = useState(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaningError, setCleaningError] = useState("");

  async function cleanImage(file) {
    setIsCleaning(true);
    setCleaningError("");
    setCleanedImage(null);

    try {
      const result = await cleanImageMetadata(file);
      setCleanedImage(result);
      return result;
    } catch (error) {
      setCleaningError(
        error instanceof Error
          ? error.message
          : "Le nettoyage de l'image a échoué.",
      );

      return null;
    } finally {
      setIsCleaning(false);
    }
  }

  function resetCleaning() {
    setCleanedImage(null);
    setIsCleaning(false);
    setCleaningError("");
  }

  return {
    cleanedImage,
    isCleaning,
    cleaningError,
    cleanImage,
    resetCleaning,
  };
}

export default useImageCleaning;