import ImageUploader from "../../components/image/ImageUploader";
import ImagePreview from "../../components/image/ImagePreview";
import MetadataSummary from "../../components/metadata/MetadataSummary";
import MetadataDetails from "../../components/metadata/MetadataDetails";
import ImageCleaningPanel from "../../components/metadata/ImageCleaningPanel";
import useImageMetadata from "../../hooks/useImageMetadata";

import "./Home.css";

function Home() {
  const {
    selectedImage,
    metadata,
    isAnalyzing,
    error,
    analyzeImage,
    resetAnalysis,
  } = useImageMetadata();

  const hasAnalysis = selectedImage && metadata;

  return (
    <main className="home">
      <header className="home__header">
        <div className="home__brand">
          <div className="home__logo">2M</div>

          <span className="home__brand-name">MamafaMeta</span>
        </div>

        <span className="home__privacy">Privacy First</span>
      </header>

      {!hasAnalysis ? (
        <section className="home__welcome">
          <div className="home__welcome-content">
            <span className="home__badge">Analyse locale</span>

            <h1 className="home__title">
              Analysez les métadonnées de vos images.
            </h1>

            <p className="home__description">
              CleanMeta analyse les informations intégrées dans vos images
              directement depuis votre navigateur.
            </p>

            <div className="home__actions">
              <ImageUploader onImageSelect={analyzeImage} />
            </div>

            {isAnalyzing && (
              <div className="home__status">
                <span className="home__status-indicator" />
                Analyse des métadonnées en cours...
              </div>
            )}

            {error && <p className="home__error">{error}</p>}
          </div>
        </section>
      ) : (
        <section className="analysis">
          <div className="analysis__header">
            <div>
              <span className="analysis__eyebrow">Analyse terminée</span>

              <h1 className="analysis__title">
                Informations de votre image
              </h1>
            </div>

            <button
              className="analysis__new-button"
              type="button"
              onClick={resetAnalysis}
            >
              Nouvelle image
            </button>
          </div>

          <div className="analysis__grid">
            <section className="analysis__image-panel">
              <div className="analysis__panel-header">
                <div>
                  <span className="analysis__panel-label">Image</span>
                  <h2>Aperçu</h2>
                </div>
              </div>

              <ImagePreview file={selectedImage} />
            </section>

            <section className="analysis__metadata-panel">
              <MetadataSummary summary={metadata.summary} />
            </section>
          </div>

          <MetadataDetails metadata={metadata.raw} />
          <ImageCleaningPanel file={selectedImage} />

        </section>
      )}
    </main>
  );
}

export default Home;