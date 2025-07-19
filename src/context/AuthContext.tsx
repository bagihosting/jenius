
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut, updatePassword as updateAuthPassword, getAuth, updateProfile } from 'firebase/auth';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getStorage } from "firebase/storage";
import { isFirebaseConfigured, type FirebaseApp, type Auth, type Database, type FirebaseStorage } from '@/lib/firebase';

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Database;
  storage: FirebaseStorage;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loading: boolean;
  firebase: FirebaseServices | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isFirebaseConfigured && !firebase) {
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

        const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
        const auth = getAuth(app);
        const db = getDatabase(app);
        const storage = getStorage(app);
        setFirebase({ app, auth, db, storage });

    } else if (!isFirebaseConfigured) {
        setLoading(false);
    }
  }, [firebase]);


  useEffect(() => {
    if (!firebase) {
      if (!isFirebaseConfigured) setLoading(false);
      return;
    }

    const { auth, db } = firebase;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        
        const unsubscribeDb = onValue(userRef, (snapshot) => {
          setLoading(true); 
          if (snapshot.exists()) {
            const dbUser = snapshot.val();
            setUser({
              ...dbUser, 
              uid: firebaseUser.uid, 
              email: firebaseUser.email, 
              name: firebaseUser.displayName || dbUser.name,
              photoUrl: firebaseUser.photoURL || dbUser.photoUrl, 
            });
          } else {
             // This can happen if a user exists in Auth but not in DB (e.g., deleted from DB manually)
             // Signing them out is a safe way to handle this inconsistency.
             signOut(auth);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firebase read failed: " + error.message);
          signOut(auth); 
          setLoading(false);
        });
        
        return () => unsubscribeDb();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [firebase]);


  const logout = async () => {
    if (!firebase) return;
    const { auth } = firebase;

    setLoading(true);
    await signOut(auth);
    setUser(null);
    router.push('/login');
    setLoading(false);
  };

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user || !firebase) throw new Error("User not authenticated or DB not configured");
    
    const updateData: Partial<User> = { ...userData };
    
    delete updateData.uid;
    delete updateData.email;
    delete updateData.registeredAt;

    const { db } = firebase;
    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, updateData);
  }, [user, firebase]);


  const updatePassword = async (password: string) => {
    if(!firebase) throw new Error("Firebase not configured");
    const { auth } = firebase;
    const authUser = auth.currentUser;
    if (!authUser) throw new Error("Pengguna tidak ditemukan");
    
    await updateAuthPassword(authUser, password);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout, updateUser, updatePassword, loading, firebase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
