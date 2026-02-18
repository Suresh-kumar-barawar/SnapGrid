const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

const clampToPositiveInteger = (value) => Math.max(1, Number.parseInt(value, 10) || 1);

const clampToNonNegative = (value) => Math.max(0, Number.parseFloat(value) || 0);

function GridControls({
  rows,
  cols,
  spacingMm,
  marginMm,
  borderWidthMm,
  borderColor,
  onRowsChange,
  onColsChange,
  onSpacingChange,
  onMarginChange,
  onBorderWidthChange,
  onBorderColorChange,
  onReset
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-card">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
        Grid Controls
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="rows-input">
          Rows
          <input
            id="rows-input"
            type="number"
            min="1"
            step="1"
            className={`${inputClass} mt-1`}
            value={rows}
            onChange={(event) => onRowsChange(clampToPositiveInteger(event.target.value))}
          />
        </label>
        <label className="text-sm font-medium text-slate-700" htmlFor="cols-input">
          Columns
          <input
            id="cols-input"
            type="number"
            min="1"
            step="1"
            className={`${inputClass} mt-1`}
            value={cols}
            onChange={(event) => onColsChange(clampToPositiveInteger(event.target.value))}
          />
        </label>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="spacing-input">
          Spacing (mm)
          <input
            id="spacing-input"
            type="number"
            min="0"
            step="0.5"
            className={`${inputClass} mt-1`}
            value={spacingMm}
            onChange={(event) => onSpacingChange(clampToNonNegative(event.target.value))}
          />
        </label>
        <label className="text-sm font-medium text-slate-700" htmlFor="margin-input">
          Margin (mm)
          <input
            id="margin-input"
            type="number"
            min="0"
            step="0.5"
            className={`${inputClass} mt-1`}
            value={marginMm}
            onChange={(event) => onMarginChange(clampToNonNegative(event.target.value))}
          />
        </label>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="border-width-input">
          Border (mm)
          <input
            id="border-width-input"
            type="number"
            min="0"
            step="0.1"
            className={`${inputClass} mt-1`}
            value={borderWidthMm}
            onChange={(event) => onBorderWidthChange(clampToNonNegative(event.target.value))}
          />
        </label>
        <label className="text-sm font-medium text-slate-700" htmlFor="border-color-input">
          Border Color
          <input
            id="border-color-input"
            type="color"
            className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-slate-300 bg-white p-1"
            value={borderColor}
            onChange={(event) => onBorderColorChange(event.target.value)}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Reset to defaults
      </button>
    </section>
  );
}

export default GridControls;
