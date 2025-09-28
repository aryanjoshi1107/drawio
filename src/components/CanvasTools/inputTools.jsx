
import { Rect, Circle, Textbox, PencilBrush } from "fabric";


 export const addRectangle = (canvas, disablePenMode, saveState) => {
  if (!canvas) return;
    disablePenMode();
    
    const rect = new Rect({
      width: 100,
      height: 100,
      fill: "transparent", // no fill
      stroke: "black",       // border color
      strokeWidth: 3,       // border thickness
      left: 50,
      top: 50,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    
    // Explicitly save state after adding
    setTimeout(() => {
      saveState(canvas);
    }, 50);
};



 export const addCircle= (canvas, disablePenMode, saveState) => {
  if (!canvas) return;
    disablePenMode();
    
   const circle = new Circle({
      radius: 50,
      fill: "transparent", // no fill
      stroke: "black",       // border color
      strokeWidth: 3,       // border thickness
      left: 150,
      top: 150,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    
    // Explicitly save state after adding
    setTimeout(() => {
      saveState(canvas);
    }, 50);
};

export const addText= (canvas, disablePenMode, saveState) => {
  if (!canvas) return;
    disablePenMode();
    
    const text = new Textbox("Hello", {
      left: 200,
      top: 200,
      fontSize: 24,
      fill: "black",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    
    // Explicitly save state after adding
    setTimeout(() => {
      saveState(canvas);
    }, 50);
};









export const usepen = (canvas,saveState,setIsPenActive,isPenActive) => {
    if (!canvas) return;
    
    if (!isPenActive) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = "black";
      canvas.freeDrawingBrush.width = 2;
      setIsPenActive(true);
      
      // Add listener for when path is created
      const pathCreatedHandler = () => {
        setTimeout(() => {
          saveState(canvas);
        }, 50);
      };
      
      canvas.on('path:created', pathCreatedHandler);
      
      // Store handler to remove later
      canvas.__pathCreatedHandler = pathCreatedHandler;
    } else {
      canvas.isDrawingMode = false;
      setIsPenActive(false);
      
      // Remove the path created handler
      if (canvas.__pathCreatedHandler) {
        canvas.off('path:created', canvas.__pathCreatedHandler);
        delete canvas.__pathCreatedHandler;
      }
    }
  };


 