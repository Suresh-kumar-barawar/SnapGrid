import { mmToPx } from "./sheetSizes";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const clampCropRect = (cropRect) => {
  const width = clamp(cropRect?.width ?? 1, 0.08, 1);
  const height = clamp(cropRect?.height ?? 1, 0.08, 1);
  const x = clamp(cropRect?.x ?? 0, 0, 1 - width);
  const y = clamp(cropRect?.y ?? 0, 0, 1 - height);
  return { x, y, width, height };
};

const getCropSourceRect = (image, cropRect) => {
  const crop = clampCropRect(cropRect);
  return {
    sx: crop.x * image.width,
    sy: crop.y * image.height,
    sWidth: crop.width * image.width,
    sHeight: crop.height * image.height
  };
};

export const generateGridLayout = ({
  sheet,
  rows,
  cols,
  spacingMm,
  marginMm
}) => {
  const safeRows = clamp(Number(rows) || 1, 1, 9999);
  const safeCols = clamp(Number(cols) || 1, 1, 9999);
  const marginPx = Math.max(0, mmToPx(Number(marginMm) || 0));
  const spacingPx = Math.max(0, mmToPx(Number(spacingMm) || 0));

  const availableWidth =
    sheet.widthPx - marginPx * 2 - Math.max(0, safeCols - 1) * spacingPx;
  const availableHeight =
    sheet.heightPx - marginPx * 2 - Math.max(0, safeRows - 1) * spacingPx;

  if (availableWidth <= 0 || availableHeight <= 0) {
    return {
      slots: [],
      marginPx,
      spacingPx,
      error: "Margin and spacing are too large for the selected sheet."
    };
  }

  const cellWidth = availableWidth / safeCols;
  const cellHeight = availableHeight / safeRows;

  const slots = [];
  for (let r = 0; r < safeRows; r += 1) {
    for (let c = 0; c < safeCols; c += 1) {
      const x = marginPx + c * (cellWidth + spacingPx);
      const y = marginPx + r * (cellHeight + spacingPx);
      slots.push({ x, y, width: cellWidth, height: cellHeight });
    }
  }

  return {
    slots,
    marginPx,
    spacingPx,
    error: null
  };
};

export const drawGridOnCanvas = ({
  canvas,
  imageItems,
  sheet,
  rows,
  cols,
  spacingMm,
  marginMm,
  borderWidthMm = 0,
  borderColor = "#000000"
}) => {
  if (!canvas || !sheet) {
    return { error: "Canvas or sheet configuration is missing." };
  }

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    return { error: "Could not get canvas rendering context." };
  }

  canvas.width = sheet.widthPx;
  canvas.height = sheet.heightPx;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const layout = generateGridLayout({
    sheet,
    rows,
    cols,
    spacingMm,
    marginMm
  });

  if (layout.error) {
    return layout;
  }

  const imageList = Array.isArray(imageItems) ? imageItems : [];
  const renderSequence = [];
  imageList.forEach((item, index) => {
    const repeatCount = Math.max(0, Number.parseInt(item?.repeatCount ?? 0, 10) || 0);
    for (let i = 0; i < repeatCount; i += 1) {
      renderSequence.push(index);
    }
  });

  const borderWidthPx = Math.max(0, mmToPx(Number(borderWidthMm) || 0));
  layout.slots.forEach((slot, slotIndex) => {
    const seqImageIndex = renderSequence[slotIndex];
    const currentItem = imageList[seqImageIndex];
    if (currentItem?.element) {
      const src = getCropSourceRect(currentItem.element, currentItem.cropRect);
      ctx.drawImage(
        currentItem.element,
        src.sx,
        src.sy,
        src.sWidth,
        src.sHeight,
        slot.x,
        slot.y,
        slot.width,
        slot.height
      );
    }

    if (borderWidthPx > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidthPx;
      ctx.strokeRect(
        slot.x + borderWidthPx / 2,
        slot.y + borderWidthPx / 2,
        Math.max(0, slot.width - borderWidthPx),
        Math.max(0, slot.height - borderWidthPx)
      );
    } else if (!currentItem?.element) {
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 6;
      ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);
    }
  });

  return layout;
};
