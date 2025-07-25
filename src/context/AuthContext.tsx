
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut, updatePassword as updateAuthPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
            const userRef = doc(db, `users`, firebaseUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const dbUser = docSnap.data();
                // --- SYNCHRONIZATION LOGIC ---
                // Prioritize Firebase Auth data for name and photoUrl as the source of truth,
                // then fall back to Firestore data.
                setUser({
                    ...dbUser,
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || dbUser.email || '',
                    name: firebaseUser.displayName || dbUser.name || 'User',
                    photoUrl: firebaseUser.photoURL || dbUser.photoUrl,
                } as User);
            } else {
                 // This case should be rare if registration is safeguarded.
                setUser(null);
                console.warn(`User data not found in DB for UID: ${firebaseUser.uid}. Logging out.`);
                await signOut(auth);
            }
        } catch (error) {
            console.error("Firestore read failed:", error);
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
  
    const authUpdateData: { displayName?: string; photoURL?: string } = {};
    const dbUpdateData: { [key: string]: any } = {};

    // Build update objects, ensuring no undefined values are sent
    if (userData.name !== undefined) {
        authUpdateData.displayName = userData.name;
        dbUpdateData.name = userData.name;
    }
    if (userData.photoUrl !== undefined) {
        authUpdateData.photoURL = userData.photoUrl;
        dbUpdateData.photoUrl = userData.photoUrl;
    }
     if (userData.robloxUsername !== undefined) {
        dbUpdateData.robloxUsername = userData.robloxUsername;
    }
     if (userData.quizCompletions !== undefined) {
        dbUpdateData.quizCompletions = userData.quizCompletions;
    }
     if (userData.bonusPoints !== undefined) {
        dbUpdateData.bonusPoints = userData.bonusPoints;
    }
     if (userData.lastClaimedAt !== undefined) {
        dbUpdateData.lastClaimedAt = userData.lastClaimedAt;
    }
     if (userData.major !== undefined) {
        dbUpdateData.major = userData.major;
    }
     if (userData.grade !== undefined) {
        dbUpdateData.grade = userData.grade;
    }

    try {
        // --- SYNCHRONIZATION LOGIC ---
        // 1. Update Firestore first.
        if (Object.keys(dbUpdateData).length > 0) {
            const userRef = doc(db, 'users', uid);
            // Use setDoc with merge: true to handle both creation and update.
            // This prevents "No document to update" errors if the document doesn't exist yet.
            await setDoc(userRef, dbUpdateData, { merge: true });
        }
        
        // 2. Then, update Firebase Auth profile.
        if (Object.keys(authUpdateData).length > 0) {
            await updateProfile(currentUser, authUpdateData);
        }
        
        // 3. Finally, update local state for immediate UI feedback.
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
