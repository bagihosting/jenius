
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;
let storage: FirebaseStorage | null = null;
let isFirebaseConfigured = false;

// This code only runs on the client-side, ensuring `process.env` is available.
if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  };

  // Check if any of the essential config values are missing or are still placeholders.
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('GANTI_DENGAN')) {
    isFirebaseConfigured = true;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getDatabase(app);
    storage = getStorage(app);
  }
}

export { app, auth, db, storage, isFirebaseConfigured };
