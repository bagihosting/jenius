
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut, updatePassword as updateAuthPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
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
            const userRef = doc(db, `users`, firebaseUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const dbUser = docSnap.data();
                setUser({
                    ...dbUser,
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || dbUser.email || '',
                    name: firebaseUser.displayName || dbUser.name || 'User',
                    photoUrl: firebaseUser.photoURL || dbUser.photoUrl,
                } as User);
            } else {
                setUser(null);
                console.warn(`User data not found in DB for UID: ${firebaseUser.uid}. Logging out.`);
                await signOut(auth);
            }
        } catch (error) {
            console.error("Firestore read failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }

      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);


  const login = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase not configured");
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will handle setting the user state and loading state.
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
    router.push('/login');
  };

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user || !db || !auth?.currentUser) {
      throw new Error("User not authenticated or DB not configured");
    }
  
    const { uid } = user;
    const currentUser = auth.currentUser;
  
    const authUpdateData: { displayName?: string; photoURL?: string } = {};
    const dbUpdateData: { [key: string]: any } = {};

    if (userData.name !== undefined) {
        authUpdateData.displayName = userData.name;
        dbUpdateData.name = userData.name;
    }
    if (userData.photoUrl !== undefined) {
        authUpdateData.photoURL = userData.photoUrl;
        dbUpdateData.photoUrl = userData.photoUrl;
    }
    
    // Non-auth profile fields
    const otherFields: (keyof User)[] = ['robloxUsername', 'quizCompletions', 'bonusPoints', 'lastClaimedAt', 'major', 'grade', 'schoolName', 'schoolType'];
    otherFields.forEach(field => {
        if (userData[field] !== undefined) {
            dbUpdateData[field] = userData[field];
        }
    });

    try {
        if (Object.keys(dbUpdateData).length > 0) {
            const userRef = doc(db, 'users', uid);
            // Using updateDoc because user document must exist if they are being updated.
            // setDoc with merge is better for "create or update" scenarios.
            await updateDoc(userRef, dbUpdateData);
        }
        
        if (Object.keys(authUpdateData).length > 0) {
            await updateProfile(currentUser, authUpdateData);
        }
        
        setUser(prevUser => {
            if (!prevUser) return null;
            return { ...prevUser, ...userData };
        });
  
    } catch (error) {
      console.error("Failed to update user:", error);
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
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, updateUser, updatePassword }}>
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
