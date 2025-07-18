import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./firebaseConfig";

// This function ensures that we initialize Firebase only once.
// It uses a singleton pattern, which is a best practice in Next.js environments.

let app: FirebaseApp;
let auth: Auth;
let db: Database;
let storage: FirebaseStorage;

if (typeof window !== "undefined" && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  storage = getStorage(app);
} else if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
  db = getDatabase(app);
  storage = getStorage(app);
}

// @ts-ignore
export { app, auth, db, storage };
