import { useState } from "react";

import { readMetadata } from "../services/metadata/metadataService";
import { classifyMetadata } from "../utils/metadataClassifier";

function useImageMetadata() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function analyzeImage(file) {
    setSelectedImage(file);
    setMetadata(null);
    setError("");
    setIsAnalyzing(true);

    try {
      const extractedMetadata = await readMetadata(file);
      const metadataSummary = classifyMetadata(extractedMetadata);

      setMetadata({
        raw: extractedMetadata,
        summary: metadataSummary,
      });
    } catch (err) {
      console.error("Erreur lors de l'analyse des métadonnées :", err);

      setError("Impossible d'analyser les métadonnées de cette image.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function resetAnalysis() {
    setSelectedImage(null);
    setMetadata(null);
    setIsAnalyzing(false);
    setError("");
  }

  return {
    selectedImage,
    metadata,
    isAnalyzing,
    error,
    analyzeImage,
    resetAnalysis,
  };
}

export default useImageMetadata;