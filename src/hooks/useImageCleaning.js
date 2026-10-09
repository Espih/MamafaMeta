
import { useState } from "react";

import { cleanImageMetadata } from "../services/image/imageService";
import { readMetadata } from "../services/metadata/metadataService";
import { classifyMetadata } from "../utils/metadataClassifier";

function useImageCleaning() {
  const [cleanedImage, setCleanedImage] = useState(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaningError, setCleaningError] = useState("");
  const [verification, setVerification] = useState(null);
  const [verificationError, setVerificationError] = useState("");

  async function cleanImage(file) {
    setIsCleaning(true);
    setCleaningError("");
    setVerificationError("");
    setVerification(null);
    setCleanedImage(null);

    try {
      const result = await cleanImageMetadata(file);

      setCleanedImage(result);

      try {
        const extractedMetadata = await readMetadata(result);
        const summary = classifyMetadata(extractedMetadata);

        setVerification({
          summary,
          isClean: summary.totalFields === 0,
        });
      } catch (error) {
        console.error("Erreur lors de la vérification :", error);

        setVerificationError(
          "L'image a été nettoyée, mais la vérification des métadonnées a échoué.",
        );
      }

      return result;
    } catch (error) {
      console.error("Erreur lors du nettoyage :", error);

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
    setVerification(null);
    setVerificationError("");
  }

  return {
    cleanedImage,
    isCleaning,
    cleaningError,
    verification,
    verificationError,
    cleanImage,
    resetCleaning,
  };
}

export default useImageCleaning;