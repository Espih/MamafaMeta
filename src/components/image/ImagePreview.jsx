import { useEffect, useState } from "react";

function ImagePreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!file || !previewUrl) {
    return null;
  }

  return (
    <div className="image-preview">
      <img
        className="image-preview__image"
        src={previewUrl}
        alt={`Aperçu de ${file.name}`}
      />

      <div className="image-preview__info">
        <span className="image-preview__filename">{file.name}</span>

        <span className="image-preview__size">
          {(file.size / 1024 / 1024).toFixed(2)} Mo
        </span>
      </div>
    </div>
  );
}

export default ImagePreview;