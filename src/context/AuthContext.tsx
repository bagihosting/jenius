
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, updatePassword as updateAuthPassword, reauthenticateWithPopup, GoogleAuthProvider, EmailAuthProvider, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

// Firebase configuration, moved here to ensure it's available for initialization
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app if it hasn't been already
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
  const auth = getAuth(app); // Get auth instance from the initialized app

  const handleUser = useCallback(async (firebaseUser: import('firebase/auth').User | null) => {
    if (firebaseUser) {
      // Since Firestore is removed, create a mock user from auth data.
      // This part needs to be robust. We'll use localStorage as a temporary substitute.
      const localDataStr = localStorage.getItem(`user_${firebaseUser.uid}`);
      const localData = localDataStr ? JSON.parse(localDataStr) : {};

      const mockUser: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Pengguna Baru',
          email: firebaseUser.email || '',
          username: localData.username || firebaseUser.email?.split('@')[0] || 'pengguna',
          role: localData.role || 'user',
          schoolType: localData.schoolType,
          schoolName: localData.schoolName,
          grade: localData.grade,
          photoUrl: firebaseUser.photoURL || '',
          robloxUsername: localData.robloxUsername,
          major: localData.major,
          quizCompletions: localData.quizCompletions || 0,
          bonusPoints: localData.bonusPoints || 0,
          progress: localData.progress || {},
      };
      setUser(mockUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [auth, handleUser]);

  const login = async (authAction: () => Promise<any>) => {
    setLoading(true);
    try {
        await authAction();
        // onAuthStateChanged will handle the rest
    } catch (e) {
        setLoading(false);
        throw e; // re-throw to be caught by the login page
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
    
    // Update Firebase Auth profile for name and photoUrl
    const authUser = getAuth().currentUser;
    if (authUser) {
        await updateProfile(authUser, {
            displayName: userData.name,
            photoURL: userData.photoUrl,
        });
    }

    // This function is now a placeholder as there's no database to update.
    // We will use localStorage as a substitute for persistence.
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem(`user_${user.uid}`, JSON.stringify(updatedUser));
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
