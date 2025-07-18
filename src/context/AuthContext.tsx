
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut, updatePassword as updateAuthPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
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
        
        // Listen for changes on the user's data in the database
        const unsubscribeDb = onValue(userRef, (snapshot) => {
          setLoading(true); // Set loading while we process new data
          if (snapshot.exists()) {
            const dbUser = snapshot.val();
            // This is the corrected logic:
            // We create a complete user object by combining data from two sources:
            // 1. The most up-to-date data from the Realtime Database (dbUser).
            // 2. The core auth info from Firebase Auth (firebaseUser).
            // This ensures role, schoolName, bonusPoints etc. from the DB are always present.
            setUser({
              ...dbUser, // Base data from Realtime Database (contains role, schoolName etc.)
              uid: firebaseUser.uid, // Always use UID from auth
              email: firebaseUser.email, // Always use email from auth
              name: firebaseUser.displayName || dbUser.name, // Prefer auth display name if available
              photoUrl: firebaseUser.photoURL || dbUser.photoUrl, // Prefer auth photo URL if available
            });
          } else {
            // This case might happen if user is deleted from DB but not from Auth.
            // Log them out to prevent a broken state.
            signOut(auth);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firebase read failed: " + error.message);
          signOut(auth); // Log out on DB error to be safe
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
    
    const updateData: Partial<User> = { ...userData };
    
    delete updateData.uid;
    delete updateData.email;
    delete updateData.registeredAt;

    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, updateData);
    // Real-time listener will update the local state, so no need to call setUser here.
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
