
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
  
    const authUpdateData: { displayName?: string; photoURL?: string } = {};
    if (userData.name) authUpdateData.displayName = userData.name;
    if (userData.photoUrl) authUpdateData.photoURL = userData.photoUrl;
  
    try {
        const updates: { [key: string]: any } = {};
        
        // This is the robust way to build the update object.
        // It avoids sending `undefined` values to Firebase.
        const dbUpdateData: Partial<User> = { ...userData };
        Object.keys(dbUpdateData).forEach(key => {
            const typedKey = key as keyof User;
            if (dbUpdateData[typedKey] === undefined) {
                delete dbUpdateData[typedKey];
            }
        });

        // If there's anything to update in the DB, add it to the multi-path update.
        if (Object.keys(dbUpdateData).length > 0) {
            updates[`users/${uid}`] = {
                ...(await get(ref(db, `users/${uid}`))).val(), // Get existing data
                ...dbUpdateData // Overwrite with new, valid data
            };
        }

        // Handle Roblox username uniqueness
        if (userData.robloxUsername !== undefined) {
            const oldUsername = user.robloxUsername?.toLowerCase();
            const newUsername = userData.robloxUsername?.toLowerCase();
            
            if (oldUsername !== newUsername) {
                if (oldUsername) {
                    updates[`robloxUsernames/${oldUsername}`] = null;
                }
                if (newUsername) {
                    const newUsernameRef = ref(db, `robloxUsernames/${newUsername}`);
                    const snapshot = await get(newUsernameRef);
                    if (snapshot.exists() && snapshot.val() !== uid) {
                        throw new Error("Username Roblox ini sudah digunakan oleh pengguna lain.");
                    }
                    updates[`robloxUsernames/${newUsername}`] = uid;
                }
            }
        }

        // Only perform update if there are changes
        if (Object.keys(updates).length > 0) {
             await update(ref(db), updates);
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
