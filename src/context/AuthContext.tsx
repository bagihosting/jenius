
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, updatePassword as updateAuthPassword, reauthenticateWithPopup, GoogleAuthProvider, EmailAuthProvider, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (authAction: () => Promise<any>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  reauthenticate: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        
        // Set up a real-time listener for user data
        const unsubscribeDb = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const dbUser = snapshot.val();
            setUser({
              ...dbUser,
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || dbUser.name,
              email: firebaseUser.email || dbUser.email,
              photoUrl: firebaseUser.photoURL || dbUser.photoUrl,
            });
          }
          setLoading(false);
        });
        
        // Return a function to clean up the database listener
        return () => unsubscribeDb();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Return a function to clean up the auth listener
    return () => unsubscribe();
  }, [auth]);

  const login = async (authAction: () => Promise<any>) => {
    setLoading(true);
    try {
        await authAction();
    } catch (e) {
        setLoading(false);
        throw e;
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    router.push('/login');
    setLoading(false);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const userRef = ref(db, `users/${user.uid}`);
    const updatedData = { ...user, ...userData };
    await set(userRef, updatedData);
    // The real-time listener will automatically update the local state
  };

  const reauthenticate = async () => {
      const authUser = auth.currentUser;
      if (!authUser) throw new Error("Pengguna tidak ditemukan");
      
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(authUser, provider);
  }

  const updatePassword = async (password: string) => {
    const authUser = auth.currentUser;
    if (!authUser) throw new Error("Pengguna tidak ditemukan");
    
    await updateAuthPassword(authUser, password);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, updatePassword, reauthenticate, loading }}>
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
