const MM_PER_INCH = 25.4;
const DPI = 300;

const createSheet = (id, label, widthInches, heightInches) => ({
  id,
  label,
  widthInches,
  heightInches
});

const withOrientation = (sheet, orientation = "landscape") => {
  const isLandscape = orientation === "landscape";
  const widthInches = isLandscape
    ? Math.max(sheet.widthInches, sheet.heightInches)
    : Math.min(sheet.widthInches, sheet.heightInches);
  const heightInches = isLandscape
    ? Math.min(sheet.widthInches, sheet.heightInches)
    : Math.max(sheet.widthInches, sheet.heightInches);

  return {
    ...sheet,
    orientation,
    widthInches,
    heightInches,
    widthPx: Math.round(widthInches * DPI),
    heightPx: Math.round(heightInches * DPI),
    widthMm: Number((widthInches * MM_PER_INCH).toFixed(2)),
    heightMm: Number((heightInches * MM_PER_INCH).toFixed(2))
  };
};

export const SHEET_SIZES = [
  createSheet("a4", "A4", 8.27, 11.69),
  createSheet("a5", "A5", 5.83, 8.27),
  createSheet("4x6", "4 x 6 in", 4, 6),
  createSheet("letter", "Letter", 8.5, 11)
];

export const DEFAULT_SHEET_ID = "a5";
export const DEFAULT_ORIENTATION = "landscape";
export const DEFAULT_ROWS = 2;
export const DEFAULT_COLS = 5;
export const DEFAULT_SPACING_MM = 3;
export const DEFAULT_MARGIN_MM = 3;
export const DEFAULT_BORDER_WIDTH_MM = 0.3;
export const DEFAULT_BORDER_COLOR = "#000000";
export const DEFAULT_IMAGE_RATIO = 35 / 45;

const GRID_PRESETS = {
  "a5:portrait": {
    rows: 4,
    cols: 3,
    spacingMm: 3,
    marginMm: 3,
    borderWidthMm: 0.3,
    borderColor: "#000000"
  },
  "a5:landscape": {
    rows: 2,
    cols: 5,
    spacingMm: 3,
    marginMm: 3,
    borderWidthMm: 0.3,
    borderColor: "#000000"
  },
  "4x6:landscape": {
    rows: 2,
    cols: 5,
    spacingMm: 3,
    marginMm: 3,
    borderWidthMm: 0.3,
    borderColor: "#000000"
  },
  "letter:landscape": {
    rows: 2,
    cols: 5,
    spacingMm: 3,
    marginMm: 3,
    borderWidthMm: 0.3,
    borderColor: "#000000"
  },
  "a4:landscape": {
    rows: 4,
    cols: 8,
    spacingMm: 3,
    marginMm: 3,
    borderWidthMm: 0.3,
    borderColor: "#000000"
  }
};

export const mmToPx = (mm) => (mm / MM_PER_INCH) * DPI;
export const pxToMm = (px) => (px / DPI) * MM_PER_INCH;

export const getSheetById = (id, orientation = DEFAULT_ORIENTATION) => {
  const baseSheet = SHEET_SIZES.find((sheet) => sheet.id === id) ?? SHEET_SIZES[0];
  return withOrientation(baseSheet, orientation);
};

export const getGridPreset = (sheetId, orientation) => {
  const preset = GRID_PRESETS[`${sheetId}:${orientation}`];
  if (preset) {
    return preset;
  }

  return {
    rows: DEFAULT_ROWS,
    cols: DEFAULT_COLS,
    spacingMm: DEFAULT_SPACING_MM,
    marginMm: DEFAULT_MARGIN_MM,
    borderWidthMm: DEFAULT_BORDER_WIDTH_MM,
    borderColor: DEFAULT_BORDER_COLOR
  };
};
