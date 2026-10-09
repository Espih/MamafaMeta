
import { useEffect, useState } from "react";
import useImageCleaning from "../../hooks/useImageCleaning";

function ImageCleaningPanel({ file }) {
  const {
    cleanedImage,
    isCleaning,
    cleaningError,
    cleanImage,
  } = useImageCleaning();

  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!cleanedImage) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(cleanedImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [cleanedImage]);

  async function handleClean() {
    await cleanImage(file);
  }

  return (
    <section className="cleaning-panel">
      <div className="cleaning-panel__header">
        <div>
          <span className="cleaning-panel__eyebrow">
            Protection de la vie privée
          </span>

          <h2>Nettoyer les métadonnées</h2>

          <p>
            Supprimez les informations intégrées à votre image
            sans réencoder ses pixels.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="cleaning-panel__button"
        onClick={handleClean}
        disabled={isCleaning}
      >
        {isCleaning
          ? "Nettoyage en cours..."
          : "Nettoyer les métadonnées"}
      </button>

      {cleaningError && (
        <p className="cleaning-panel__error" role="alert">
          {cleaningError}
        </p>
      )}

      {cleanedImage && previewUrl && (
        <div className="cleaning-result">
          <div className="cleaning-result__header">
            <span className="cleaning-result__status">
              Image nettoyée
            </span>

            <h3>Résultat du nettoyage</h3>
          </div>

          <img
            className="cleaning-result__image"
            src={previewUrl}
            alt="Aperçu de l'image nettoyée"
          />

          <p className="cleaning-result__filename">
            {cleanedImage.name}
          </p>

          <p className="cleaning-result__size">
            Taille : {(cleanedImage.size / 1024).toFixed(1)} Ko
          </p>

          <a
            className="cleaning-result__download"
            href={previewUrl}
            download={cleanedImage.name}
          >
            Télécharger l'image nettoyée
          </a>
        </div>
      )}

      <p className="cleaning-panel__note">
        Le nettoyage sans réencodage est actuellement disponible
        pour les images JPEG et PNG.
      </p>
    </section>
  );
}

export default ImageCleaningPanel;