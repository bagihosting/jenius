
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
  return initializeApp(firebaseConfig);
}

const app: FirebaseApp = initializeFirebase();

// CORRECTLY INITIALIZE AND EXPORT THE SERVICES
const auth: Auth = getAuth(app);
const db: Database = getDatabase(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
