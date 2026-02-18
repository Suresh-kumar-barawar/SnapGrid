import { jsPDF } from "jspdf";

const triggerDownload = (href, filename) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getFileBaseName = ({ sheetId, rows, cols }) =>
  `snapgrid-${sheetId}-${rows}x${cols}`;

export const downloadCanvasImage = (canvas, filename, format = "png") => {
  if (!canvas) {
    throw new Error("Canvas is not available for export.");
  }

  const mime = format === "jpg" ? "image/jpeg" : "image/png";
  const quality = format === "jpg" ? 0.98 : undefined;
  const dataUrl = canvas.toDataURL(mime, quality);
  triggerDownload(dataUrl, `${filename}.${format}`);
};

export const downloadCanvasPdf = (canvas, filename, sheet) => {
  if (!canvas) {
    throw new Error("Canvas is not available for PDF export.");
  }

  const orientation = sheet.widthMm > sheet.heightMm ? "landscape" : "portrait";
  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: [sheet.widthMm, sheet.heightMm],
    compress: true
  });

  const imgData = canvas.toDataURL("image/jpeg", 1);
  pdf.addImage(imgData, "JPEG", 0, 0, sheet.widthMm, sheet.heightMm, undefined, "FAST");
  pdf.save(`${filename}.pdf`);
};
