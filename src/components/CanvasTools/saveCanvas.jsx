
export const saveCanvas = (canvas, disablePenMode, saveState) => {
  if (!canvas) return;
  disablePenMode();

    canvas.renderAll();
  console.log(canvas.toDataURL());
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1,
    multiplier: 2
  });

  // Create a download link
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas.png";
  link.click();
};