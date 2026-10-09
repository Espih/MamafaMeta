import { useRef } from "react";

function ImageUploader({ onImageSelect }) {
  const fileInputRef = useRef(null);

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onImageSelect(file);
  }

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/tiff"
        onChange={handleFileChange}
        hidden
      />

      <button
        className="home__button"
        type="button"
        onClick={handleButtonClick}
      >
        Choisir une image
      </button>
    </div>
  );
}

export default ImageUploader;