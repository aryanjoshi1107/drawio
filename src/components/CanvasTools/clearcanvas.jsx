// CanvasTools/clearCanvas.js
export const clearCanvas = (canvas, disablePenMode, saveState) => {
  if (!canvas) return;
  disablePenMode();
  canvas.clear();
  canvas.backgroundColor = "#ffffff";
  canvas.renderAll();

  // Save state after clearing
  setTimeout(() => {
    saveState(canvas);
  }, 50);
};
