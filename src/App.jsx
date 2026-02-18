import { useEffect, useMemo, useRef, useState } from "react";
import SheetSelector from "./components/SheetSelector";
import ImageUploader from "./components/ImageUploader";
import GridControls from "./components/GridControls";
import CanvasPreview from "./components/CanvasPreview";
import ImageAdjustModal from "./components/ImageAdjustModal";
import GuideSection from "./components/GuideSection";
import {
  DEFAULT_ORIENTATION,
  DEFAULT_SHEET_ID,
  SHEET_SIZES,
  getGridPreset,
  getSheetById
} from "./utils/sheetSizes";
import { drawGridOnCanvas } from "./utils/generateGrid";
import {
  downloadCanvasImage,
  downloadCanvasPdf,
  getFileBaseName
} from "./utils/downloadHelpers";

const DEFAULT_CROP_RECT = {
  x: 0,
  y: 0,
  width: 1,
  height: 1
};
const DEFAULT_GRID_PRESET = getGridPreset(DEFAULT_SHEET_ID, DEFAULT_ORIENTATION);

function App() {
  const canvasRef = useRef(null);

  const [sheetId, setSheetId] = useState(DEFAULT_SHEET_ID);
  const [orientation, setOrientation] = useState(DEFAULT_ORIENTATION);
  const [rows, setRows] = useState(DEFAULT_GRID_PRESET.rows);
  const [cols, setCols] = useState(DEFAULT_GRID_PRESET.cols);
  const [spacingMm, setSpacingMm] = useState(DEFAULT_GRID_PRESET.spacingMm);
  const [marginMm, setMarginMm] = useState(DEFAULT_GRID_PRESET.marginMm);
  const [borderWidthMm, setBorderWidthMm] = useState(DEFAULT_GRID_PRESET.borderWidthMm);
  const [borderColor, setBorderColor] = useState(DEFAULT_GRID_PRESET.borderColor);

  const [imageItems, setImageItems] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const selectedSheet = useMemo(
    () => getSheetById(sheetId, orientation),
    [sheetId, orientation]
  );
  const totalSlots = rows * cols;
  const totalAssigned = imageItems.reduce(
    (sum, item) => sum + (Number.parseInt(item.repeatCount, 10) || 0),
    0
  );
  const remainingSlots = Math.max(0, totalSlots - imageItems.length);
  const activeImage = imageItems[activeImageIndex] ?? imageItems[0] ?? null;

  useEffect(() => {
    const preset = getGridPreset(sheetId, orientation);
    setRows(preset.rows);
    setCols(preset.cols);
    setSpacingMm(preset.spacingMm);
    setMarginMm(preset.marginMm);
    setBorderWidthMm(preset.borderWidthMm);
    setBorderColor(preset.borderColor);
  }, [sheetId, orientation]);

  useEffect(() => {
    if (imageItems.length <= totalSlots) {
      return;
    }
    setImageItems((prev) => prev.slice(0, totalSlots));
    setActiveImageIndex(0);
    setUploadError(`Only ${totalSlots} image(s) allowed for current grid.`);
  }, [totalSlots, imageItems.length]);

  useEffect(() => {
    if (imageItems.length === 0) {
      setActiveImageIndex(0);
      return;
    }
    setActiveImageIndex((prev) => Math.min(prev, imageItems.length - 1));
  }, [imageItems.length]);

  useEffect(() => {
    let cancelled = false;

    const render = () => {
      setIsRendering(true);
      window.requestAnimationFrame(() => {
        if (cancelled) {
          return;
        }

        const result = drawGridOnCanvas({
          canvas: canvasRef.current,
          imageItems,
          sheet: selectedSheet,
          rows,
          cols,
          spacingMm,
          marginMm,
          borderWidthMm,
          borderColor
        });

        setRenderError(result.error ?? "");
        setIsRendering(false);
      });
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [selectedSheet, imageItems, rows, cols, spacingMm, marginMm, borderWidthMm, borderColor]);

  const onAddImages = (images, nextUploadError) => {
    if (nextUploadError && images.length === 0) {
      setUploadError(nextUploadError);
      return;
    }

    setImageItems((prev) => [
      ...prev,
      ...images.map((image) => ({ ...image, cropRect: DEFAULT_CROP_RECT, repeatCount: 1 }))
    ]);
    if (images.length > 0) {
      setActiveImageIndex(imageItems.length);
      setIsCropModalOpen(true);
    }
    setUploadError(nextUploadError || "");
  };

  const handleClearImage = () => {
    setImageItems([]);
    setActiveImageIndex(0);
    setIsCropModalOpen(false);
    setUploadError("");
  };

  const handleRepeatCountChange = (index, rawValue) => {
    const parsed = Number.parseInt(rawValue, 10);
    const nextValue = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);

    const sumOthers = imageItems.reduce((sum, item, itemIndex) => {
      if (itemIndex === index) {
        return sum;
      }
      return sum + (Number.parseInt(item.repeatCount, 10) || 0);
    }, 0);

    const maxAllowed = Math.max(0, totalSlots - sumOthers);
    const clamped = Math.min(nextValue, maxAllowed);

    setImageItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, repeatCount: clamped } : item
      )
    );

    if (nextValue > maxAllowed) {
      setUploadError(`Maximum total prints is ${totalSlots} for this grid.`);
    } else {
      setUploadError("");
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageItems((prev) => prev.filter((_, index) => index !== indexToRemove));
    setActiveImageIndex((prev) => {
      if (prev > indexToRemove) {
        return prev - 1;
      }
      if (prev === indexToRemove) {
        return 0;
      }
      return prev;
    });
  };

  const handleApplyCrop = (nextCropRect) => {
    setImageItems((prev) =>
      prev.map((item, index) =>
        index === activeImageIndex ? { ...item, cropRect: nextCropRect } : item
      )
    );
    setIsCropModalOpen(false);
  };

  const handleReset = () => {
    const preset = getGridPreset(sheetId, orientation);
    setRows(preset.rows);
    setCols(preset.cols);
    setSpacingMm(preset.spacingMm);
    setMarginMm(preset.marginMm);
    setBorderWidthMm(preset.borderWidthMm);
    setBorderColor(preset.borderColor);
  };

  const fileBaseName = getFileBaseName({ sheetId, rows, cols });

  const handlePdfDownload = () => {
    try {
      downloadCanvasPdf(canvasRef.current, fileBaseName, selectedSheet);
    } catch (downloadError) {
      setRenderError(downloadError.message);
    }
  };

  const handlePngDownload = () => {
    try {
      downloadCanvasImage(canvasRef.current, fileBaseName, "png");
    } catch (downloadError) {
      setRenderError(downloadError.message);
    }
  };

  const handleJpgDownload = () => {
    try {
      downloadCanvasImage(canvasRef.current, fileBaseName, "jpg");
    } catch (downloadError) {
      setRenderError(downloadError.message);
    }
  };

  const statusText = `Sheet: ${selectedSheet.label} (${orientation}) | Canvas: ${selectedSheet.widthPx} x ${
    selectedSheet.heightPx
  } px | Grid: ${rows} x ${cols} (${rows * cols} photos) | Photos: ${imageItems.length} | Assigned: ${totalAssigned}/${totalSlots}`;

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <header className="mx-auto mb-6 max-w-7xl rounded-2xl bg-white/95 p-5 shadow-card backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">SnapGrid</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span>Passport Photo Grid Generator</span>
              <span className="text-slate-300">|</span>
              <a
                href="https://www.linkedin.com/in/sureshkumarbarawar/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 font-semibold text-brand-700 transition hover:bg-brand-100 hover:text-brand-800"
              >
                Developed by Suresh Kumar
              </a>
            </div>
          </div>
          <div className="w-full max-w-2xl space-y-2">
            <SheetSelector
              sheetSizes={SHEET_SIZES}
              selectedSheetId={sheetId}
              orientation={orientation}
              onSheetChange={setSheetId}
              onOrientationChange={setOrientation}
              compact
            />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
        <aside className="space-y-4">
          <ImageUploader
            images={imageItems}
            activeImageIndex={activeImageIndex}
            remainingSlots={remainingSlots}
            onAddImages={onAddImages}
            onActiveImageChange={setActiveImageIndex}
            totalSlots={totalSlots}
            totalAssigned={totalAssigned}
            onRepeatCountChange={handleRepeatCountChange}
            onRemoveImage={handleRemoveImage}
            onClear={handleClearImage}
            onOpenAdjustModal={() => setIsCropModalOpen(true)}
            error={uploadError}
          />
          <GridControls
            rows={rows}
            cols={cols}
            spacingMm={spacingMm}
            marginMm={marginMm}
            borderWidthMm={borderWidthMm}
            borderColor={borderColor}
            onRowsChange={setRows}
            onColsChange={setCols}
            onSpacingChange={setSpacingMm}
            onMarginChange={setMarginMm}
            onBorderWidthChange={setBorderWidthMm}
            onBorderColorChange={setBorderColor}
            onReset={handleReset}
          />
        </aside>

        <section>
          <CanvasPreview
            canvasRef={canvasRef}
            sheet={selectedSheet}
            isRendering={isRendering}
            error={renderError}
            statusText={statusText}
            onPdfDownload={handlePdfDownload}
            onPngDownload={handlePngDownload}
            onJpgDownload={handleJpgDownload}
            downloadDisabled={Boolean(renderError) || isRendering}
          />
        </section>
      </main>

      <GuideSection />

      <ImageAdjustModal
        isOpen={isCropModalOpen && Boolean(activeImage)}
        imageSrc={activeImage?.src ?? ""}
        cropRect={activeImage?.cropRect ?? DEFAULT_CROP_RECT}
        onClose={() => setIsCropModalOpen(false)}
        onApply={handleApplyCrop}
      />
    </div>
  );
}

export default App;
