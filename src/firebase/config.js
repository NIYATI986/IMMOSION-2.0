// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0R1yeB8TbMg-aqEHTXv2puooKOCM4HPY",
  authDomain: "flowtype47.firebaseapp.com",
  projectId: "flowtype47",
  storageBucket: "flowtype47.firebasestorage.app",
  messagingSenderId: "1047770263891",
  appId: "1:1047770263891:web:993590c577c89a123371a6",
  measurementId: "G-FPMVN1TP0W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;