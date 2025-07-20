
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut, updatePassword as updateAuthPassword, updateProfile } from 'firebase/auth';
import { ref, update, get } from 'firebase/database';
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

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!db) {
            setUser(null);
            setLoading(false);
            console.error("Database is not configured.");
            return;
        }

        try {
            const userRef = ref(db, `users/${firebaseUser.uid}`);
            const snapshot = await get(userRef);

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
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || 'Pengguna Baru',
                    username: 'pengguna_baru', // Add required username property
                    role: 'user',
                });
                console.warn(`User data not found in DB for UID: ${firebaseUser.uid}.`);
            }
        } catch (error) {
            console.error("Firebase DB read failed:", error);
            setUser(null); // On error, ensure user is logged out state-wise
        } finally {
            setLoading(false);
        }

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
    if (!user || !db || !auth?.currentUser) {
      throw new Error("User not authenticated or DB not configured");
    }
  
    const { uid } = user;
    const currentUser = auth.currentUser;
  
    // Data for Realtime Database update
    const dbUpdateData: Partial<User> = { ...userData };
    delete dbUpdateData.uid;
    delete dbUpdateData.email;
    delete dbUpdateData.registeredAt;
    delete dbUpdateData.role;
  
    // Data for Firebase Auth profile update
    const authUpdateData: { displayName?: string; photoURL?: string } = {};
    if (userData.name) authUpdateData.displayName = userData.name;
    if (userData.photoUrl) authUpdateData.photoURL = userData.photoUrl;
  
    try {
      // Update DB and Auth Profile concurrently
      const dbRef = ref(db, `users/${uid}`);
      await Promise.all([
        update(dbRef, dbUpdateData),
        Object.keys(authUpdateData).length > 0 ? updateProfile(currentUser, authUpdateData) : Promise.resolve(),
      ]);
  
      // On success, update the local state with the new data
      setUser(prevUser => prevUser ? { ...prevUser, ...dbUpdateData, ...authUpdateData } : null);
  
    } catch (error) {
      console.error("Failed to update user:", error);
      // Re-throw the error so the calling component can handle it (e.g., show a toast)
      throw error;
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
