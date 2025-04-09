// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore import
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWiEoObqRr0CttTRGaW2QIIhoQzkfmv1A",
  authDomain: "todo-app-ceed1.firebaseapp.com",
  projectId: "todo-app-ceed1",
  storageBucket: "todo-app-ceed1.appspot.com", // ✅ typo fixed (was .app)
  messagingSenderId: "772411502205",
  appId: "1:772411502205:web:0459d5ae60952e6c57cb14",
  measurementId: "G-85BHTF0JZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Export db so you can use it elsewhere
export { db };
