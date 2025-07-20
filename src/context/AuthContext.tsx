
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut, updatePassword as updateAuthPassword, updateProfile } from 'firebase/auth';
import { ref, onValue, update } from 'firebase/database';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';

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
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, now get their data from Realtime Database.
        if (!db) {
            setUser(null);
            setLoading(false);
            console.error("Database is not configured.");
            return;
        }

        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const unsubscribeDb = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const dbUser = snapshot.val();
            setUser({
              ...dbUser,
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || dbUser.name || 'User',
              photoUrl: firebaseUser.photoURL || dbUser.photoUrl,
            });
          } else {
            // User exists in Auth but not in DB.
            // This can happen during registration race conditions or if DB entry was deleted.
            // We set a minimal user object to keep them logged in.
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Pengguna Baru',
              role: 'user',
            });
            console.warn(`User data not found in DB for UID: ${firebaseUser.uid}.`);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firebase DB read failed:", error);
          setUser(null);
          setLoading(false);
        });

        // Cleanup the database listener when the auth state changes.
        return () => unsubscribeDb();
      } else {
        // User is signed out.
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup the auth listener on component unmount.
    return () => unsubscribeAuth();
  }, [router]);


  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null); // Explicitly set user to null
    router.push('/login');
  };

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user || !db) throw new Error("User not authenticated or DB not configured");
    
    const updateData: Partial<User> = { ...userData };
    
    // Prevent critical fields from being overwritten from client-side updates
    delete updateData.uid;
    delete updateData.email;
    delete updateData.registeredAt;
    delete updateData.role; 

    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, updateData);

    // Also update Firebase Auth profile if name or photoUrl is changed
    if (auth?.currentUser && (userData.name || userData.photoUrl)) {
        await updateProfile(auth.currentUser, {
            displayName: userData.name,
            photoURL: userData.photoUrl,
        });
    }

  }, [user]);


  const updatePassword = async (password: string) => {
    if(!auth) throw new Error("Firebase not configured");
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
