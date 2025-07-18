
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getDatabase, type Database } from "firebase/database";

// Function to safely create the config object only when needed
const getFirebaseConfig = () => {
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

  // We no longer need to check for missing keys here,
  // as Firebase handles it gracefully. This prevents the app from crashing.
  
  return firebaseConfig;
};


// Lazy-initialize Firebase app to ensure config is loaded
// This is the recommended pattern for Next.js
const getFirebaseApp = (): FirebaseApp => {
    if (!getApps().length) {
        const config = getFirebaseConfig();
        return initializeApp(config);
    }
    return getApp();
};

const app: FirebaseApp = getFirebaseApp();
const auth: Auth = getAuth(app);
const db: Database = getDatabase(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
