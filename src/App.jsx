import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CanvasEditor from "./components/CanvasEditor";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home: generate new scene */}
        <Route path="/" element={<Navigate to={`/canvas/${Date.now()}`} />} />
        <Route path="/canvas/:id" element={<CanvasEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
