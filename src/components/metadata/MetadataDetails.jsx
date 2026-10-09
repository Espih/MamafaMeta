import {
  formatMetadataKey,
  formatMetadataValue,
} from "../../utils/metadataFormatter";

function MetadataDetails({ metadata }) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <section className="metadata-details">
        <div className="metadata-details__header">
          <div>
            <span className="metadata-details__eyebrow">
              Informations
            </span>

            <h2 className="metadata-details__title">
              Détails des métadonnées
            </h2>
          </div>
        </div>

        <p className="metadata-details__empty">
          Aucune métadonnée disponible.
        </p>
      </section>
    );
  }

  const entries = Object.entries(metadata).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "",
  );

  return (
    <section className="metadata-details">
      <div className="metadata-details__header">
        <div>
          <span className="metadata-details__eyebrow">
            Informations
          </span>

          <h2 className="metadata-details__title">
            Détails des métadonnées
          </h2>
        </div>

        <span className="metadata-details__count">
          {entries.length}
        </span>
      </div>

      <div className="metadata-details__list">
        {entries.map(([key, value]) => (
          <div className="metadata-details__row" key={key}>
            <span className="metadata-details__key">
              {formatMetadataKey(key)}
            </span>

            <span className="metadata-details__value">
              {formatMetadataValue(value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MetadataDetails;