import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./firebaseConfig";

// This function ensures that we initialize Firebase only once.
// It uses a singleton pattern, which is a best practice in Next.js environments.
function initializeFirebase() {
  if (getApps().length > 0) {
    return getApp();
  }

  // Check for missing configuration keys to provide a clear error message.
  for (const key in firebaseConfig) {
    if (firebaseConfig[key as keyof typeof firebaseConfig] === undefined) {
      throw new Error(`Firebase config is missing or incomplete. Missing key: ${key}. Check your .env file.`);
    }
  }

  return initializeApp(firebaseConfig);
}

// Initialize the app once and export the initialized services.
// All other parts of the application will import these instances,
// ensuring they all use the same, correctly configured Firebase connection.
const app: FirebaseApp = initializeFirebase();
const auth: Auth = getAuth(app);
const db: Database = getDatabase(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
