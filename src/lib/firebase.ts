
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

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
export const isFirebaseConfigured = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('GANTI_DENGAN');

// Initialize Firebase App
let app: FirebaseApp;
if (isFirebaseConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

// Export initialized services, or null if not configured
// This provides a single point of access for all firebase services.
export const auth: Auth | null = isFirebaseConfigured ? getAuth(app!) : null;
export const db: Database | null = isFirebaseConfigured ? getDatabase(app!) : null;
export const storage: FirebaseStorage | null = isFirebaseConfigured ? getStorage(app!) : null;
