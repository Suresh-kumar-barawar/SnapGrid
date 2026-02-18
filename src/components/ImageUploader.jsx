import { useRef } from "react";

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve({ element: image, src: String(reader.result), name: file.name });
      image.onerror = () => reject(new Error(`Could not read image: ${file.name}`));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });

function ImageUploader({
  images,
  activeImageIndex,
  remainingSlots,
  onActiveImageChange,
  onAddImages,
  totalSlots,
  totalAssigned,
  onRepeatCountChange,
  onRemoveImage,
  onClear,
  onOpenAdjustModal,
  error
}) {
  const fileInputRef = useRef(null);

  const hasImage = images.length > 0;
  const activeImage = hasImage ? images[activeImageIndex] ?? images[0] : null;

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const hasInvalid = files.some((file) => !file.type.startsWith("image/"));
    if (hasInvalid) {
      onAddImages([], "Please select valid image files only.");
      event.target.value = "";
      return;
    }

    const allowedFiles = files.slice(0, remainingSlots);
    const overflow = files.length > remainingSlots;

    try {
      const loadedImages = await Promise.all(allowedFiles.map(readImageFile));
      onAddImages(
        loadedImages,
        overflow ? `Only ${remainingSlots} additional image(s) can be added for current grid.` : ""
      );
    } catch (readError) {
      onAddImages([], readError.message || "Failed to read one or more selected files.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-card">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
        Image Source
      </h2>

      <button
        type="button"
        onClick={handleFileSelectClick}
        disabled={remainingSlots === 0}
        className="flex w-full items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
      >
        {hasImage ? "Select photos" : "Select photos"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />

      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-medium text-slate-700">
          Upload clear photos for best print quality.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            Assigned: {totalAssigned}/{totalSlots}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Remaining: {Math.max(0, totalSlots - totalAssigned)}
          </span>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {hasImage ? (
          <img src={activeImage?.src} alt="Selected" className="h-44 w-full object-cover" />
        ) : (
          <div className="flex h-44 items-center justify-center text-sm text-slate-500">
            No photos selected
          </div>
        )}
      </div>

      {hasImage ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={`${image.name}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => onActiveImageChange(index)}
                  className={`w-full overflow-hidden rounded-lg border-2 ${
                    index === activeImageIndex ? "border-brand-600" : "border-slate-200"
                  }`}
                  title={`Photo ${index + 1}`}
                >
                  <img src={image.src} alt={`Photo ${index + 1}`} className="h-14 w-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow hover:bg-red-700"
                  aria-label={`Remove image ${index + 1}`}
                  title="Remove this photo"
                >
                  x
                </button>
              </div>
              <label
                htmlFor={`repeat-count-${index}`}
                className="mt-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-600"
              >
                Print Count
              </label>
              <div className="mt-1 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    onRepeatCountChange(index, String(Math.max(0, Number(image.repeatCount || 0) - 1)))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-slate-900 text-lg font-bold leading-none text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 active:scale-95"
                  aria-label={`Decrease print count for image ${index + 1}`}
                  title="Decrease count"
                >
                  -
                </button>
                <input
                  id={`repeat-count-${index}`}
                  type="number"
                  min="0"
                  step="1"
                  value={image.repeatCount}
                  onChange={(event) => onRepeatCountChange(index, event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-center text-sm font-semibold text-slate-800 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  aria-label={`Repeat count for image ${index + 1}`}
                  title="How many times to print this image"
                />
                <button
                  type="button"
                  onClick={() =>
                    onRepeatCountChange(index, String(Number(image.repeatCount || 0) + 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-slate-900 text-lg font-bold leading-none text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 active:scale-95"
                  aria-label={`Increase print count for image ${index + 1}`}
                  title="Increase count"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {hasImage ? (
        <button
          type="button"
          onClick={handleFileSelectClick}
          disabled={remainingSlots === 0}
          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Add photos
        </button>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenAdjustModal}
          disabled={!hasImage}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Crop / Adjust Photo
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasImage}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear image
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}

export default ImageUploader;

