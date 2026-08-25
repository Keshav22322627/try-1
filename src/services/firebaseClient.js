// India Hyundai Power - Firebase Auth & Service Connector

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyAaNbdk72CiX6WS8zvfOI5w42vfgACA9tc",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "india-hyundai-power.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "india-hyundai-power",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "india-hyundai-power.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "342198217084",
  appId: env.VITE_FIREBASE_APP_ID || "1:342198217084:web:5d04e524ffb56ecacc5cf9",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-3L0WMS0Z2H"
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  firebaseUpdatePassword
};
