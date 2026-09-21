// Firebase client SDK — initialized lazily for SSR safety.
// 100% path: real config comes from .env.local (see .env.example).
// If env vars are missing, db stays null and the app cleanly falls
// back to localStorage so the game never breaks offline / pre-deploy.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId) && Boolean(firebaseConfig.appId);

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    _db = getFirestore(_app);
  } catch {
    _app = null;
    _db = null;
  }
}

export const app = _app;
export const db = _db;

