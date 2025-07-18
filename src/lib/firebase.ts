
'use client';

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getDatabase, type Database } from "firebase/database";

let app: FirebaseApp;
let auth: Auth;
let db: Database;
let storage: FirebaseStorage;

function getFirebaseApp() {
  if (!getApps().length) {
    // Membaca variabel lingkungan di dalam fungsi
    // untuk memastikan mereka tersedia saat dipanggil (Lazy Initialization)
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
    
    // Validasi sederhana untuk memastikan config tidak kosong
    if (!firebaseConfig.apiKey) {
      throw new Error('Firebase config is missing API Key. Check your .env.local file.');
    }

    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  return app;
}

function getFirebaseAuth() {
    if (!auth) {
        auth = getAuth(getFirebaseApp());
    }
    return auth;
}

function getFirebaseDb() {
    if (!db) {
        db = getDatabase(getFirebaseApp());
    }
    return db;
}

function getFirebaseStorage() {
    if (!storage) {
        storage = getStorage(getFirebaseApp());
    }
    return storage;
}

// Ekspor fungsi getter untuk memastikan inisialisasi yang aman
export { getFirebaseAuth, getFirebaseDb, getFirebaseStorage, getFirebaseApp };
