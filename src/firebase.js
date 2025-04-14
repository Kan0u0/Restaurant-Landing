// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyApiHj0yo6gMVtwsTkROx3NEudx2fYwOso',
  authDomain: 'taskmanager-3072b.firebaseapp.com',
  projectId: 'taskmanager-3072b',
  storageBucket: 'taskmanager-3072b.firebasestorage.app',
  messagingSenderId: '776594679746',
  appId: '1:776594679746:web:6c9b443ad49faea217d85b',
  measurementId: 'G-YHPNZL7QMN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Export the necessary Firebase services
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
};
