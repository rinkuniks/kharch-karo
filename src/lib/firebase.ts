// Firebase client SDK — initialized lazily for SSR safety
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDopamine-aaf25-placeholder", // public config, safe in client
  authDomain: "dopamine-aaf25.firebaseapp.com",
  projectId: "dopamine-aaf25",
  storageBucket: "dopamine-aaf25.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
