import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Canvas, Rect, Circle, Textbox, PencilBrush } from "fabric";
import { getFirestore,doc, setDoc, getDoc } from "firebase/firestore";
import {db} from "../firebase";
import { clearCanvas } from "./CanvasTools/clearcanvas";
import { saveCanvas } from "./CanvasTools/saveCanvas";
import { addRectangle,addCircle,addText,usepen } from "./CanvasTools/inputTools";
import { undo, redo } from "./CanvasTools/canvashistory";
const CanvasEditor = () => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isPenActive, setIsPenActive] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Use refs for history management to avoid closure issues
  const historyRef = useRef([]);
  const historyIndexRef = useRef(0);
  const isLoadingRef = useRef(false);
  const isUndoRedoRef = useRef(false);

  // Helper function to update undo/redo button states
  const updateHistoryButtons = useCallback(() => {
    const canUndoNow = historyIndexRef.current > 0;
    const canRedoNow = historyIndexRef.current < historyRef.current.length - 1;
    
    console.log('Updating buttons - Can undo:', canUndoNow, 'Can redo:', canRedoNow);
    console.log('History length:', historyRef.current.length, 'Current index:', historyIndexRef.current);
    
    setCanUndo(canUndoNow);
    setCanRedo(canRedoNow);
  }, []);

  // Helper function to save state - now directly called after actions
  const saveState = useCallback((canvasInstance) => {
    if (!canvasInstance || isUndoRedoRef.current) {
      return;
    }
    
    try {
      const json = JSON.stringify(canvasInstance.toJSON());
      
      // If we're not at the end of history, remove everything after current index
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      }
      
      // Add the new state
      historyRef.current.push(json);
      historyIndexRef.current = historyRef.current.length - 1;
      
      // Limit history size
      if (historyRef.current.length > 50) {
        historyRef.current = historyRef.current.slice(-50);
        historyIndexRef.current = historyRef.current.length - 1;
      }
      
      console.log('State saved. New history length:', historyRef.current.length, 'Index:', historyIndexRef.current);
      
      // Update button states
      updateHistoryButtons();
    } catch (error) {
      console.error("Error saving state:", error);
    }
  }, [updateHistoryButtons]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric canvas
    const c = new Canvas(canvasRef.current, {
      width: 1200,
      height: 700,
      backgroundColor: "#ffffff",
    });

    setCanvas(c);

    // Snap to grid
    // Snap to grid when moving
c.on("object:moving", (e) => {
  const grid = 10;
  const obj = e.target;

  obj.set({
    left: Math.round(obj.left / grid) * grid,
    top: Math.round(obj.top / grid) * grid,
  });

  obj.setCoords(); // keep bounding box updated
}); 




document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" || e.key === "Backspace") {
    const activeObj = c.getActiveObject();
    if (!activeObj) return;

    if (activeObj.type === "activeSelection") {
      // Convert activeSelection into individual objects
      const objs = activeObj.getObjects();
      objs.forEach((obj) => c.remove(obj));
    } else {
      // Single object
      c.remove(activeObj);
    }

    c.discardActiveObject();
    c.requestRenderAll();
  }
});

    // Initialize history with empty canvas state
    const initialState = JSON.stringify(c.toJSON());
    historyRef.current = [initialState];
    historyIndexRef.current = 0;
    updateHistoryButtons();

    // Load canvas from Firestore
    const loadCanvas = async () => {
      try {
        isLoadingRef.current = true;
        const docRef = doc(db, "canvases", id);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
          await new Promise((resolve) => {
            c.loadFromJSON(snapshot.data().json, () => {
             
              setTimeout(() => {
                c.requestRenderAll();
              }, 0);
              resolve();
            });
          });
          
          
          // Reset history after loading
          const loadedState = JSON.stringify(c.toJSON());
          historyRef.current = [loadedState];
          historyIndexRef.current = 0;
          updateHistoryButtons();
        }
      } catch (err) {
        console.error("Error loading canvas:", err);
      } finally {
        isLoadingRef.current = false;
      }
    };
    
    loadCanvas();

  
    //save canvas in firstore database
    const saveCanvas = async () => {
      if (isLoadingRef.current) return;

      const canvasId = id;
      const canvasData = c?.toJSON?.();

      if (!canvasId || !canvasData) {
        console.warn("Missing canvas ID or data");
        return;
      }

      try {
        await setDoc(doc(db, "canvases", canvasId), { json: canvasData });
        console.log("Canvas saved:", canvasId);
      } catch (err) {
        console.error("Error saving canvas:", err);
      }
    };

    // Start autosave
    const interval = setInterval(saveCanvas, 2000);

    return () => {
      clearInterval(interval);
      c.dispose();
    };
  }, [id, updateHistoryButtons]);

  // Helper function to disable pen mode
  const disablePenMode = useCallback(() => {
    if (canvas && isPenActive) {
      canvas.isDrawingMode = false;
      setIsPenActive(false);
    }
  }, [canvas, isPenActive]);




  const undoTool =() => {
    if(!canvas) return;
    undo(canvas,disablePenMode,historyIndexRef,historyRef,isUndoRedoRef,updateHistoryButtons);
  }
  const redoTool =() => {
    if(!canvas) return;
    redo(canvas,disablePenMode,historyIndexRef,historyRef,isUndoRedoRef,updateHistoryButtons);
  }
  //all canvas button logic
  const clearCanvastool =() => {
    if(!canvas) return;
    clearCanvas(canvas,disablePenMode,saveState);
  }
  const saveCanvastool =() => {
    if(!canvas) return;
    saveCanvas(canvas,disablePenMode,saveState);
  }
  const addRecttool =() => {
    if(!canvas) return;
    addRectangle(canvas,disablePenMode,saveState);
  }
  const addCircletool =() => {
    if(!canvas) return;
    addCircle(canvas,disablePenMode,saveState);
  }
  const addTexttool =() => {
    if(!canvas) return;
    addText(canvas,disablePenMode,saveState);
  }
  const addpentool=() => {
    if(!canvas) return;
    usepen(canvas,saveState,setIsPenActive,isPenActive);
  } 
  

  const shareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert("Canvas link copied!");
  }, []);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if we're typing in a text field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Add listener for object modifications
  useEffect(() => {
    if (!canvas) return;

    const handleObjectModified = () => {
      if (!isUndoRedoRef.current) {
        setTimeout(() => {
          saveState(canvas);
        }, 50);
      }
    };

    canvas.on('object:modified', handleObjectModified);
    canvas.on('text:changed', handleObjectModified);

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('text:changed', handleObjectModified);
    };
  }, [canvas, saveState]);

  



  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={addRecttool} style={{ marginRight: "5px" }}>
          Add Rectangle
        </button>
        <button onClick={addCircletool} style={{ marginRight: "5px" }}>
          Add Circle
        </button>
        <button onClick={addTexttool} style={{ marginRight: "5px" }}>
          Add Text
        </button>
        <button
          onClick={addpentool}
          style={{
            marginRight: "5px",
            border: isPenActive ? "2px solid #007bff" : "1px solid #ccc",
            background: isPenActive ? "#e6f0ff" : "#fff",
          }}
        >
          {isPenActive ? "Exit Pen" : "Pen Tool"}
        </button>
        <button 
          onClick={undoTool} 
          style={{ 
            marginRight: "5px",
            opacity: canUndo ? 1 : 0.5,
            cursor: canUndo ? 'pointer' : 'not-allowed',
            background: canUndo ? '#fff' : '#f5f5f5'
          }}
          disabled={!canUndo}
        >
          Undo (Ctrl+Z)
        </button>
        <button 
          onClick={redoTool} 
          style={{ 
            marginRight: "5px",
            opacity: canRedo ? 1 : 0.5,
            cursor: canRedo ? 'pointer' : 'not-allowed',
            background: canRedo ? '#fff' : '#f5f5f5'
          }}
          disabled={!canRedo}
        >
          Redo (Ctrl+Y)
        </button>
        <button onClick={clearCanvastool} style={{ marginRight: "5px" }}>
          Clear
        </button>
        <button onClick={shareLink}>Share Canvas</button>
        <button onClick={saveCanvastool}>Save as PNG</button>
        {/* Debug info - remove this in production */}
        <span style={{ marginLeft: "20px", fontSize: "12px", color: "#666" }}>
          History: {historyRef.current.length} states, Index: {historyIndexRef.current}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ 
          border: "1px solid #ccc", 
          width: "1200px", 
          height: "700px",
          display: "block"
        }}
      />
    </div>
  );
};

export default CanvasEditor;