
import { useEffect, useState } from "react";
import useImageCleaning from "../../hooks/useImageCleaning";

function ImageCleaningPanel({ file }) {
  const {
    cleanedImage,
    isCleaning,
    cleaningError,
    verification,
    verificationError,
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

          
            {verification && (
            <div
                className={`cleaning-result__verification ${
                verification.isClean
                    ? "cleaning-result__verification--success"
                    : "cleaning-result__verification--warning"
                }`}
                role="status"
            >
                {verification.isClean ? (
                <>
                    <strong>Vérification réussie</strong>
                    <p>
                    Aucune métadonnée reconnue par l'analyseur
                    n'a été détectée dans l'image nettoyée.
                    </p>
                </>
                ) : (
                <>
                    <strong>Des métadonnées restent détectées</strong>
                    <p>
                    Nombre de champs détectés :
                    {" "}
                    {verification.summary.totalFields}
                    </p>
                </>
                )}
            </div>
            )}

            {verificationError && (
            <p className="cleaning-panel__error" role="alert">
                {verificationError}
            </p>
            )}

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