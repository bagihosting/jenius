
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut, updatePassword as updateAuthPassword, updateProfile } from 'firebase/auth';
import { getFirebase, isFirebaseConfigured } from '@/lib/firebase';
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
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const { auth, db } = getFirebase();
    if (!auth || !db) {
      setLoading(false);
      return;
    }

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
  }, []);


  const logout = async () => {
    if (!isFirebaseConfigured) return;
    const { auth } = getFirebase();
    if (!auth) return;

    setLoading(true);
    await signOut(auth);
    setUser(null);
    router.push('/login');
    setLoading(false);
  };

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user || !isFirebaseConfigured) throw new Error("User not authenticated or DB not configured");
    
    const updateData: Partial<User> = { ...userData };
    
    delete updateData.uid;
    delete updateData.email;
    delete updateData.registeredAt;

    const { db } = getFirebase();
    if (!db) throw new Error("Database not initialized");

    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, updateData);
  }, [user]);


  const updatePassword = async (password: string) => {
    if(!isFirebaseConfigured) throw new Error("Firebase not configured");
    const { auth } = getFirebase();
    if (!auth) throw new Error("Authentication not initialized");
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
