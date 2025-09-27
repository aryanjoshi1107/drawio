import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPoadhdz1PBUUcklKzdeWakMAXe7-kcT8",
  authDomain: "drawio-a622c.firebaseapp.com",
  projectId: "drawio-a622c",
  storageBucket: "drawio-a622c.firebasestorage.app",
  messagingSenderId: "672367405753",
  appId: "1:672367405753:web:7212281b2e1416ecb14968",
  measurementId: "G-PHBQL6G497"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { doc, setDoc, getDoc };
