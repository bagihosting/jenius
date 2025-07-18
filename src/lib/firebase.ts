
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// This file implements the "Golden Pattern" for Firebase in Next.js.
// It ensures that Firebase is initialized only ONCE, preventing configuration issues.

let app: FirebaseApp;
let auth: Auth;
let db: Database;
let storage: FirebaseStorage;

// This configuration is now built on the client, guaranteeing process.env variables are available.
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

// Check if we are on the client-side before doing anything.
if (typeof window !== "undefined") {
  // Check if any of the essential config values are missing or are still placeholders.
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('GANTI_DENGAN')) {
    console.error(
      '************************************************************************\n' +
      '*** FIREBASE CONFIG IS MISSING OR INCOMPLETE!                      ***\n' +
      '*** Please fill in your Firebase project credentials in the .env file. ***\n' +
      '************************************************************************'
    );
  }

  // If no Firebase app has been initialized yet, initialize one.
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    // If an app is already initialized, use the existing one.
    app = getApp();
  }

  // Get the auth, db, and storage services from the initialized app.
  // This ensures we always use the same instances across the application.
  auth = getAuth(app);
  db = getDatabase(app);
  storage = getStorage(app);
}

// Export the initialized services.
// On the server-side, these will be undefined, but they will be correctly
// populated on the client-side where they are used.
export { app, auth, db, storage };
