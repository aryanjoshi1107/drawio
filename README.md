# 🖊️ Draw.io

A modern web-based drawing application built with **React**, **Fabric.js**, and **Firebase**.  
It supports:
- Drawing with a **Pen tool**
- Adding **shapes** (rectangles, circles, lines, etc.)
- Managing a **Snap object** for snapping elements to a grid
- **Autosave** to Firebase Firestore every few seconds
- Full **Undo/Redo** history management
- easy canvas sharing
- Easy deployment (e.g., Vercel, Netlify, Firebase Hosting)

---

## 🚀 Live Demo
<div align="center">
  <!-- Replace the URL below with your deployed hosting link -->
  <a href="https://drawio-a622c.web.app" target="_blank">
    👉 **Open the Live App Here**
  </a>
</div>

---

## 📐 Features
### 🖍️ Drawing Tools
- **Pen Tool** – free-hand drawing on the canvas
- **Shape Tools** – add rectangles, circles, lines, polygons, etc.
- **Snap Object** – optional snapping to a grid or guides for precise alignment

### 📜 State Management
- Maintains **undo/redo history** using a stack approach:
  - Saves a snapshot after every change
  - Allows unlimited undo/redo (limited to last 50 actions for performance)
- **Autosave to Firebase Firestore**
  - Every few seconds, the latest canvas snapshot is stored in Firestore
  - Uses `JSON.stringify` to store complex Fabric.js data (avoids nested array issues)
- Canvas is **restored from Firestore** on reload so users never lose their work

---

### 🔗 Canvas Sharing & Collaboration
- Every new canvas gets a **unique Canvas ID** stored in Firestore.
- The app generates a **shareable URL** such as:
- By sharing this link, **other users can open the exact same canvas**.
- **Mutual Collaboration:**  
- All participants who open the same link will load the same canvas data.
- With Firestore’s real-time listeners, any changes (like drawing, adding shapes, or using the pen tool) can be broadcast to all connected users.
- This feature enables **real-time collaborative drawing**, similar to Google Jamboard or draw.io.

> ⚡️ Coming soon: Role-based permissions (e.g., view-only vs. edit) to better manage shared sessions.


### 🔄 Undo/Redo
- Simple buttons or keyboard shortcuts
- History stored as JSON snapshots
- Undo/Redo navigation updates both the canvas and UI buttons

---

## 🛠️ Tech Stack
| Technology     | Purpose                         |
|----------------|---------------------------------|
| React + Vite / CRA | Frontend UI                 |
| Fabric.js      | Canvas rendering & drawing tools|
| Firebase Firestore | Cloud database & autosave  |
| Firebase Emulator | Local testing of Firestore   |
| Snap Object    | Snapping and alignment of shapes|

---
