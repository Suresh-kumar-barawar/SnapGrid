const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

function SheetSelector({
  sheetSizes,
  selectedSheetId,
  orientation,
  onSheetChange,
  onOrientationChange,
  compact = false
}) {
  if (compact) {
    return (
      <div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="sheet-select">
            Sheet Size
            <select
              id="sheet-select"
              className={`${inputClass} mt-1`}
              value={selectedSheetId}
              onChange={(event) => onSheetChange(event.target.value)}
              aria-label="Select paper size"
            >
              {sheetSizes.map((sheet) => (
                <option key={sheet.id} value={sheet.id}>
                  {sheet.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="orientation-select">
            Sheet Orientation
            <select
              id="orientation-select"
              className={`${inputClass} mt-1`}
              value={orientation}
              onChange={(event) => onOrientationChange(event.target.value)}
              aria-label="Select orientation"
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Tip: Use Grid Controls to adjust number of images, spacing, margins, and border settings.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-4 shadow-card">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
        Sheet Size
      </h2>
      <label className="block text-sm font-medium text-slate-700" htmlFor="sheet-select">
        Select paper size
      </label>
      <select
        id="sheet-select"
        className={`${inputClass} mt-2`}
        value={selectedSheetId}
        onChange={(event) => onSheetChange(event.target.value)}
      >
        {sheetSizes.map((sheet) => (
          <option key={sheet.id} value={sheet.id}>
            {sheet.label}
          </option>
        ))}
      </select>

      <label className="mt-3 block text-sm font-medium text-slate-700" htmlFor="orientation-select">
        Orientation
      </label>
      <select
        id="orientation-select"
        className={`${inputClass} mt-2`}
        value={orientation}
        onChange={(event) => onOrientationChange(event.target.value)}
      >
        <option value="landscape">Landscape (Default)</option>
        <option value="portrait">Portrait</option>
      </select>
    </section>
  );
}

export default SheetSelector;
