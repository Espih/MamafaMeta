const CATEGORY_ICONS = {
  device: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="metadata-summary__icon"
    >
      <path
        d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 6h6M10 18h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  date: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="metadata-summary__icon"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 3v4M8 3v4M3 10h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  location: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="metadata-summary__icon"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  ),

  author: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="metadata-summary__icon"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  iptc: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="metadata-summary__icon"
    >
      <path
        d="M4 5h16v14H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8M8 13h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  xmp: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="metadata-summary__icon"
    >
      <path
        d="M5 4h14v16H5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 9 6 6M15 9l-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  software: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="metadata-summary__icon"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 21h8M12 18v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

function MetadataSummary({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <section className="metadata-summary">
      <div className="metadata-summary__header">
        {summary.hasSensitiveMetadata && (
            <div className="metadata-summary__privacy-alert">
                <div className="metadata-summary__privacy-icon">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="metadata-summary__privacy-svg"
                >
                    <path
                    d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-3Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    />
                    <path
                    d="M12 8v4M12 16h.01"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    />
                </svg>
                </div>

                <div>
                <strong>
                    {summary.sensitiveFields}{" "}
                    {summary.sensitiveFields > 1 ? "données sensibles" : "donnée sensible"}
                </strong>

                <span>
                    Certaines métadonnées peuvent révéler des informations privées.
                </span>
                </div>
            </div>
            )}
        <div>
          <span className="metadata-summary__eyebrow">
            Résultat de l'analyse
          </span>

          <h2 className="metadata-summary__title">
            Métadonnées détectées
          </h2>
        </div>

        <div className="metadata-summary__count">
            {summary.totalFields}
        </div>
      </div>

      {summary.categories.length > 0 ? (
            <div className="metadata-summary__categories">
                {summary.categories.map((category) => (
                <div
                    className={`metadata-summary__category ${
                    category.sensitive
                        ? "metadata-summary__category--sensitive"
                        : ""
                    }`}
                    key={category.key}
                >
                    <div className="metadata-summary__category-icon">
                    {CATEGORY_ICONS[category.key]}
                    </div>

                    <div className="metadata-summary__category-content">
                    <span className="metadata-summary__category-label">
                        {category.label}
                    </span>

                    <span className="metadata-summary__category-count">
                        {category.count}{" "}
                        {category.count > 1 ? "champs" : "champ"}
                    </span>
                    </div>

                    {category.sensitive && (
                    <span className="metadata-summary__sensitive">
                        Sensible
                    </span>
                    )}
                </div>
                ))}
            </div>
            ) : (
        <p className="metadata-summary__empty">
          Aucune métadonnée détectée dans cette image.
        </p>
      )}
    </section>
  );
}

export default MetadataSummary;