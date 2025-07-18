
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { getAuth, onAuthStateChanged, signOut, updatePassword as updateAuthPassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { ref, onValue, update } from 'firebase/database';


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        
        const unsubscribeDb = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const dbUser = snapshot.val();
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || dbUser.name,
              email: firebaseUser.email || dbUser.email,
              photoUrl: firebaseUser.photoURL,
              ...dbUser,
            });
          } else {
            // If user exists in Auth but not in DB (e.g., manual deletion), log them out
            // to prevent inconsistent state.
            signOut(auth);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firebase read failed: " + error.message);
          setLoading(false);
        });
        
        return () => unsubscribeDb();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);


  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    router.push('/login');
    setLoading(false);
  };

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user) throw new Error("User not authenticated");
    
    // Create a new object with only the fields to be updated, excluding sensitive/static fields.
    const updateData: Partial<User> = { ...userData };
    delete updateData.uid;
    delete updateData.email;
    delete updateData.registeredAt;

    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, updateData);
    // The real-time listener will automatically update the local user state
  }, [user]);


  const updatePassword = async (password: string) => {
    const authUser = auth.currentUser;
    if (!authUser) throw new Error("Pengguna tidak ditemukan");
    
    await updateAuthPassword(authUser, password);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout, updateUser, updatePassword, loading }}>
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
