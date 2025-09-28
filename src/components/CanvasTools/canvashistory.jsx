 
 import { useCallback} from "react";

 
export const undo = (canvas, disablePenMode,historyIndexRef,historyRef,isUndoRedoRef,updateHistoryButtons) => {
    if (!canvas || historyIndexRef.current <= 0) {
      console.log('Cannot undo. Index:', historyIndexRef.current);
      return;
    }

    disablePenMode();
    isUndoRedoRef.current = true;

    try {
      historyIndexRef.current -= 1;
      updateHistoryButtons(); // Ensure button state updates immediately
      const state = historyRef.current[historyIndexRef.current];

      console.log('Undoing to index:', historyIndexRef.current);

      canvas.loadFromJSON(JSON.parse(state), () => {
        canvas.backgroundColor = "#ffffff";
        setTimeout(() => {
          canvas.requestRenderAll();
        }, 0);
        isUndoRedoRef.current = false;
      });
    } catch (error) {
      console.error("Error during undo:", error);
      isUndoRedoRef.current = false;
    }
  };

 export const redo = (canvas, disablePenMode,historyIndexRef,historyRef,isUndoRedoRef, updateHistoryButtons) => {
    if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) {
      console.log('Cannot redo. Index:', historyIndexRef.current, 'Length:', historyRef.current.length);
      return;
    }

    disablePenMode();
    isUndoRedoRef.current = true;

    try {
      historyIndexRef.current += 1;
      updateHistoryButtons(); // Ensure button state updates immediately
      const state = historyRef.current[historyIndexRef.current];

      console.log('Redoing to index:', historyIndexRef.current);

      canvas.loadFromJSON(JSON.parse(state), () => {
        canvas.backgroundColor = "#ffffff";
        setTimeout(() => {
          canvas.requestRenderAll();
        }, 0);
        isUndoRedoRef.current = false;
      });
    } catch (error) {
      console.error("Error during redo:", error);
      isUndoRedoRef.current = false;
    }
  };