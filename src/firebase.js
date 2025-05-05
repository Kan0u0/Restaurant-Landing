// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAlui74vyLIeIiNU7ZzdRBwAhhuRvCrHiw",
  authDomain: "mynotes-1e913.firebaseapp.com",
  projectId: "mynotes-1e913",
  storageBucket: "mynotes-1e913.appspot.com",
  messagingSenderId: "588111501200",
  appId: "1:588111501200:web:10a8932333a075544a8515",
  measurementId: "G-W6B0GWX1VH"
};

// initializeApp must be called before using getAuth / getFirestore
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;