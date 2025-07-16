
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { getAuth, onAuthStateChanged, signOut, updatePassword as updateAuthPassword, reauthenticateWithPopup, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  const auth = getAuth();

  const handleUser = useCallback(async (firebaseUser: import('firebase/auth').User | null) => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setUser(userData);
        if (userData.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userData.role === 'mahasiswa') {
            router.push('/mahasiswa/dashboard');
        } else {
          router.push('/belajar');
        }
      } else {
        // Handle case where user exists in Auth but not Firestore (e.g., failed registration)
        setUser(null);
      }
    } else {
      setUser(null);
      // router.push('/login'); // This can cause issues with route protection
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
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, userData);
    setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
  };

  const reauthenticate = async () => {
      const authUser = auth.currentUser;
      if (!authUser) throw new Error("Pengguna tidak ditemukan");
      
      // For simplicity, we'll use Google Pop-up for re-authentication.
      // In a real app, you might want to handle different providers.
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(authUser, provider);
  }

  const updatePassword = async (password: string) => {
    const authUser = auth.currentUser;
    if (!authUser) throw new Error("Pengguna tidak ditemukan");
    
    // Note: This requires recent sign-in. If it fails, prompt re-authentication.
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
