import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Database } from "firebase/database";
import type { FirebaseStorage } from "firebase/storage";

// Structure for the config, ensuring all keys are present.
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

// This flag indicates if the configuration values themselves are present.
// It does NOT mean the connection is active. It's safe to be read on server or client.
const isFirebaseConfigured = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('GANTI_DENGAN');

// Note: The initialization logic is now centralized in AuthContext.
// This file only exports the configuration check flag and types.

export { isFirebaseConfigured };
export type { FirebaseApp, Auth, Database, FirebaseStorage };
