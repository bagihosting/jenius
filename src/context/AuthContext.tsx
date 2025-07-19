
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut, updatePassword as updateAuthPassword, updateProfile } from 'firebase/auth';
import { ref, onValue, update } from 'firebase/database';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loading: boolean;
  // We no longer need to expose firebase services as they are directly imported.
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
        if (!db) {
            setLoading(false);
            return;
        }
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
    if (!auth) return;
    setLoading(true);
    await signOut(auth);
    setUser(null);
    router.push('/login');
    setLoading(false);
  };

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user || !db) throw new Error("User not authenticated or DB not configured");
    
    const updateData: Partial<User> = { ...userData };
    
    // These fields should not be updated directly from the client profile update
    delete updateData.uid;
    delete updateData.email;
    delete updateData.registeredAt;
    delete updateData.role; // Prevent role escalation

    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, updateData);

     // Also update the auth profile if name or photoUrl changed
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
