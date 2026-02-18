function DownloadButtons({ onPdf, onPng, onJpg, disabled, compact = false }) {
  const classBase =
    "rounded-lg px-4 py-2 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-700">Download as:</span>
        <button
          type="button"
          onClick={onPdf}
          disabled={disabled}
          className={`${classBase} bg-slate-900 hover:bg-slate-800 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-400`}
        >
          PDF
        </button>
        <span className="text-slate-400">|</span>
        <button
          type="button"
          onClick={onJpg}
          disabled={disabled}
          className={`${classBase} bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400`}
        >
          JPG
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-4 shadow-card lg:sticky lg:top-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
        Download
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPdf}
          disabled={disabled}
          className={`${classBase} bg-slate-900 hover:bg-slate-800 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-400`}
        >
          PDF
        </button>
        <button
          type="button"
          onClick={onPng}
          disabled={disabled}
          className={`${classBase} bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-slate-400`}
        >
          PNG
        </button>
        <button
          type="button"
          onClick={onJpg}
          disabled={disabled}
          className={`${classBase} bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400`}
        >
          JPG
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Filename format: snapgrid-sheet-rowsxcols.ext
      </p>
    </section>
  );
}

export default DownloadButtons;
