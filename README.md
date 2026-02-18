# SnapGrid

SnapGrid is a print-focused passport photo grid generator built with React, Vite, Tailwind CSS, Canvas API, and jsPDF.

It helps you generate high-resolution photo sheets (300 DPI), control layout precisely, and export ready-to-print files.

## Developed By

[Suresh Kumar](https://www.linkedin.com/in/sureshkumarbarawar/)

---

## Key Features

- Sheet presets: `A4`, `A5`, `4 x 6 in`, `Letter`
- Orientation support: `Landscape` / `Portrait`
- Live 300 DPI canvas preview
- Multi-image upload with slot-aware limits
- Per-image crop editor (independent crop for each photo)
- Per-image print count with quick `+` / `-` controls
- Individual image remove button from selection
- Adjustable grid controls:
  - Rows
  - Columns
  - Spacing (mm)
  - Margin (mm)
  - Border width (mm)
  - Border color
- Export options:
  - PDF
  - JPG
- No watermark
- Responsive UI

---

## How It Works

1. Select **Sheet Size** and **Sheet Orientation**.
2. Upload photos using **Select photos**.
3. Add more photos with **+ Add photos**.
4. Set per-image **Print Count** using:
   - Minus button
   - Number input
   - Plus button
5. Optionally open **Crop / Adjust Photo** for the active image.
6. Adjust layout in **Grid Controls**.
7. Check **Live Preview** and download as PDF/JPG.

### Print Count Logic

- The grid fills based on each image's print count, in order.
- Example:
  - Image1 = 2
  - Image2 = 4
  - Image3 = 2
  - Image4 = 2
- Render order becomes:
  - `1, 1, 2, 2, 2, 2, 3, 3, 4, 4`

### Capacity Rules

- Total available slots = `rows x columns`
- Assigned counts cannot exceed total slots.
- Upload additions are limited by remaining photo slots for current grid.

---

## Default Presets

The app applies grid defaults based on selected sheet + orientation.

Current startup default:
- Sheet Size: `A5`
- Orientation: `Landscape`

Common configured presets include:
- A5 Portrait: `4 x 3`, spacing `3`, margin `3`, border `0.3`
- A5 Landscape: `2 x 5`, spacing `3`, margin `3`, border `0.3`
- 4x6 Landscape: `2 x 5`, spacing `3`, margin `3`, border `0.3`
- Letter Landscape: `2 x 5`, spacing `3`, margin `3`, border `0.3`
- A4 Landscape: `4 x 8`, spacing `3`, margin `3`, border `0.3`

---

## Tech Stack

- React (functional components + hooks)
- Vite
- Tailwind CSS
- HTML5 Canvas API
- jsPDF
- ESLint

---

## Project Structure

```text
src/
  components/
    CanvasPreview.jsx
    DownloadButtons.jsx
    GridControls.jsx
    GuideSection.jsx
    ImageAdjustModal.jsx
    ImageUploader.jsx
    SheetSelector.jsx
  utils/
    downloadHelpers.js
    generateGrid.js
    sheetSizes.js
  App.jsx
  main.jsx
  index.css
public/
  favicon.svg
index.html
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Export Details

- PDF export uses `jsPDF` with sheet dimension mapping.
- JPG export uses canvas high-resolution data.
- Filename format:
  - `snapgrid-{sheet}-{rows}x{cols}.ext`

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import project in Vercel.
3. Select framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

---

## Environment

Copy sample env file:

```bash
cp .env.example .env
```

Use `VITE_` prefix for any new environment variable.

---

## Troubleshooting

- If styles/components look stale, do a hard refresh (`Ctrl + F5`).
- If build issues occur after dependency changes:
  1. remove `node_modules`
  2. run `npm install`
  3. run `npm run lint` and `npm run build`
- If assigned counts do not fill sheet, verify:
  - Rows x Columns capacity
  - Per-image Print Count totals

---

## License

This project is for personal/product use. Add your preferred license file if needed.
