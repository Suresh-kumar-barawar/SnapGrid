function GuideSection() {
  return (
    <section className="mx-auto mt-6 max-w-7xl rounded-2xl bg-white p-5 shadow-card">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Complete User Guide</h2>
      <p className="mt-2 text-sm text-slate-600">
        This section explains exactly how to use SnapGrid from start to finish. Follow the steps in order and you can generate print-ready passport photo sheets without trial and error.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">1. Choose Sheet Setup</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Select your paper type from Sheet Size.</li>
            <li>Choose Landscape or Portrait orientation.</li>
            <li>When you change sheet settings, grid defaults update automatically for that format.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">2. Add and Manage Photos</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Use Select photos for initial upload, then use + Add photos to append more.</li>
            <li>Each thumbnail card has a remove button at the top-right.</li>
            <li>Selected card becomes the active image for crop editing.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">3. Set How Many Times Each Photo Prints</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Every selected photo has its own Print Count.</li>
            <li>Use the minus and plus buttons for quick adjustment.</li>
            <li>The grid is filled in order of your photos using these counts, one by one.</li>
            <li>If total assigned count exceeds grid capacity, the app automatically prevents overflow.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">4. Crop Each Photo Independently</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Click Crop / Adjust Photo to open the editor.</li>
            <li>Drag the crop box to move it and drag corner handles to resize.</li>
            <li>Crop settings apply only to the active photo, not to all photos.</li>
            <li>Use Apply crop to save or Cancel to discard changes.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">5. Fine Tune Grid Controls</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Rows and Columns decide total grid slots.</li>
            <li>Spacing controls the gap between photos.</li>
            <li>Margin controls outer whitespace around the sheet.</li>
            <li>Border width and border color style every printed photo frame.</li>
            <li>Reset to defaults restores only grid controls for the current sheet and orientation.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">6. Preview and Download</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Live Preview shows a scaled view of the high-resolution 300 DPI output.</li>
            <li>Use Download as PDF or JPG from the preview section.</li>
            <li>File names include sheet and grid dimensions for easy tracking.</li>
          </ul>
        </article>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Best Practice Checklist</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Use clear, front-facing photos with neutral background whenever required by your document rules.</li>
          <li>Keep Assigned count equal to total grid slots for fully filled sheets.</li>
          <li>Review borders, spacing, and crop before downloading final output.</li>
          <li>If layout looks crowded, increase rows or reduce print counts per image.</li>
          <li>If photos look too small, reduce rows and columns or switch to a larger sheet format.</li>
        </ul>
      </div>
    </section>
  );
}

export default GuideSection;
