import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

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
// It does NOT mean the connection is active.
const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app: FirebaseApp;
let auth: Auth;
let db: Database;
let storage: FirebaseStorage;

// Singleton function to initialize and get Firebase services.
// This "lazy" approach ensures Firebase is only initialized when needed,
// and that it only happens once.
function getFirebase() {
    if (!getApps().length) {
        if (!isFirebaseConfigured) {
            throw new Error("Firebase config is missing or incomplete. Please check your .env file.");
        }
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getDatabase(app);
        storage = getStorage(app);
    }
    // For subsequent calls, return the existing instances.
    // getApp() retrieves the default app instance.
    app = getApp(); 
    auth = getAuth(app);
    db = getDatabase(app);
    storage = getStorage(app);

    return { app, auth, db, storage };
}

// Export the getter function and the configuration status flag.
export { getFirebase, isFirebaseConfigured };
