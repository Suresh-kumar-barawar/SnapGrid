import { useMemo } from "react";
import DownloadButtons from "./DownloadButtons";

const PREVIEW_MAX_WIDTH = 560;

function CanvasPreview({
  canvasRef,
  sheet,
  statusText,
  isRendering,
  error,
  onPdfDownload,
  onPngDownload,
  onJpgDownload,
  downloadDisabled
}) {
  const previewHeight = useMemo(() => {
    if (!sheet) {
      return PREVIEW_MAX_WIDTH;
    }

    return Math.round((sheet.heightPx / sheet.widthPx) * PREVIEW_MAX_WIDTH);
  }, [sheet]);

  return (
    <section className="rounded-2xl bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Live Preview</h2>
        <span className="text-xs text-slate-500">300 DPI render</span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            maxWidth: `${PREVIEW_MAX_WIDTH}px`,
            height: "auto",
            aspectRatio: `${sheet.widthPx} / ${sheet.heightPx}`
          }}
          className="mx-auto rounded-lg bg-white shadow"
        />

        {isRendering ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-medium text-slate-700">
            Rendering high-resolution preview...
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-600">{statusText}</p>
          <p className="mt-1 text-xs text-slate-500">
            Preview area: {PREVIEW_MAX_WIDTH} x {previewHeight} px (scaled)
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <DownloadButtons
            onPdf={onPdfDownload}
            onPng={onPngDownload}
            onJpg={onJpgDownload}
            disabled={downloadDisabled}
            compact
          />
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}

export default CanvasPreview;
