import { useEffect, useMemo, useRef, useState } from "react";

const MIN_CROP_SIZE = 0.08;
const DEFAULT_MODAL_CROP = { x: 0.15, y: 0.12, width: 0.7, height: 0.76 };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const clampRect = (rect) => {
  const width = clamp(rect.width, MIN_CROP_SIZE, 1);
  const height = clamp(rect.height, MIN_CROP_SIZE, 1);
  const x = clamp(rect.x, 0, 1 - width);
  const y = clamp(rect.y, 0, 1 - height);
  return { x, y, width, height };
};

const handles = ["nw", "ne", "sw", "se"];

function ImageAdjustModal({ isOpen, imageSrc, cropRect, onClose, onApply }) {
  const viewportRef = useRef(null);
  const [draft, setDraft] = useState(cropRect);
  const [interaction, setInteraction] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const isFullFrame =
        (cropRect?.x ?? 0) <= 0.001 &&
        (cropRect?.y ?? 0) <= 0.001 &&
        (cropRect?.width ?? 1) >= 0.999 &&
        (cropRect?.height ?? 1) >= 0.999;
      setDraft(isFullFrame ? DEFAULT_MODAL_CROP : cropRect);
    }
  }, [isOpen, cropRect]);

  useEffect(() => {
    if (!interaction) {
      return undefined;
    }

    const onPointerMove = (event) => {
      if (!viewportRef.current) {
        return;
      }

      const bounds = viewportRef.current.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      const dx = (event.clientX - interaction.startX) / bounds.width;
      const dy = (event.clientY - interaction.startY) / bounds.height;
      const start = interaction.startRect;

      if (interaction.mode === "move") {
        setDraft(
          clampRect({
            x: start.x + dx,
            y: start.y + dy,
            width: start.width,
            height: start.height
          })
        );
        return;
      }

      let next = { ...start };
      if (interaction.handle === "nw") {
        next = {
          x: start.x + dx,
          y: start.y + dy,
          width: start.width - dx,
          height: start.height - dy
        };
      }
      if (interaction.handle === "ne") {
        next = {
          x: start.x,
          y: start.y + dy,
          width: start.width + dx,
          height: start.height - dy
        };
      }
      if (interaction.handle === "sw") {
        next = {
          x: start.x + dx,
          y: start.y,
          width: start.width - dx,
          height: start.height + dy
        };
      }
      if (interaction.handle === "se") {
        next = {
          x: start.x,
          y: start.y,
          width: start.width + dx,
          height: start.height + dy
        };
      }

      setDraft(clampRect(next));
    };

    const onPointerUp = () => setInteraction(null);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [interaction]);

  const overlayStyle = useMemo(
    () => ({
      left: `${draft.x * 100}%`,
      top: `${draft.y * 100}%`,
      width: `${draft.width * 100}%`,
      height: `${draft.height * 100}%`
    }),
    [draft]
  );

  const maskTopStyle = useMemo(
    () => ({
      left: "0%",
      top: "0%",
      width: "100%",
      height: `${draft.y * 100}%`
    }),
    [draft]
  );

  const maskBottomStyle = useMemo(
    () => ({
      left: "0%",
      top: `${(draft.y + draft.height) * 100}%`,
      width: "100%",
      height: `${(1 - draft.y - draft.height) * 100}%`
    }),
    [draft]
  );

  const maskLeftStyle = useMemo(
    () => ({
      left: "0%",
      top: `${draft.y * 100}%`,
      width: `${draft.x * 100}%`,
      height: `${draft.height * 100}%`
    }),
    [draft]
  );

  const maskRightStyle = useMemo(
    () => ({
      left: `${(draft.x + draft.width) * 100}%`,
      top: `${draft.y * 100}%`,
      width: `${(1 - draft.x - draft.width) * 100}%`,
      height: `${draft.height * 100}%`
    }),
    [draft]
  );

  const startMove = (event) => {
    event.preventDefault();
    setInteraction({
      mode: "move",
      startX: event.clientX,
      startY: event.clientY,
      startRect: draft
    });
  };

  const startResize = (event, handle) => {
    event.preventDefault();
    event.stopPropagation();
    setInteraction({
      mode: "resize",
      handle,
      startX: event.clientX,
      startY: event.clientY,
      startRect: draft
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Adjust Photo Crop</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <p className="mb-3 text-sm text-slate-600">
          Drag the rectangle to move. Drag corner pickers to resize the crop area.
        </p>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div ref={viewportRef} className="relative mx-auto max-h-[65vh] w-fit touch-none overflow-hidden">
            <img src={imageSrc} alt="Adjust crop" className="max-h-[60vh] max-w-full select-none" draggable={false} />

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute bg-slate-950/45" style={maskTopStyle} />
              <div className="absolute bg-slate-950/45" style={maskBottomStyle} />
              <div className="absolute bg-slate-950/45" style={maskLeftStyle} />
              <div className="absolute bg-slate-950/45" style={maskRightStyle} />
            </div>

            <div
              className="absolute cursor-move border-2 border-white ring-1 ring-slate-900/50"
              style={overlayStyle}
              onPointerDown={startMove}
            >
              <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-white/70" />
              <div className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-white/70" />
              {handles.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  aria-label={`Resize crop from ${handle}`}
                  className={`absolute h-4 w-4 rounded-sm border border-white bg-slate-900 ${
                    handle === "nw" ? "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize" : ""
                  } ${handle === "ne" ? "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize" : ""} ${
                    handle === "sw" ? "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize" : ""
                  } ${handle === "se" ? "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize" : ""}`}
                  onPointerDown={(event) => startResize(event, handle)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setDraft(DEFAULT_MODAL_CROP)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApply(clampRect(draft))}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Apply crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageAdjustModal;
