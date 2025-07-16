
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updatePassword: (password: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initializeDefaultUsers = () => {
    try {
        const userKeysStr = localStorage.getItem('user_keys');
        let userKeys: string[] = userKeysStr ? JSON.parse(userKeysStr) : [];
        let updated = false;

        // Ensure admin user exists
        if (!localStorage.getItem('user_admin')) {
            const adminUser: User = {
                name: 'Admin Jenius',
                username: 'admin',
                email: 'admin@ayahjenius.com',
                schoolType: 'SDN',
                role: 'admin'
            };
            localStorage.setItem('user_admin', JSON.stringify(adminUser));
            localStorage.setItem('pwd_admin@ayahjenius.com', 'admin123');
            userKeys.push('user_admin');
            updated = true;
        }

        // Ensure default user exists
        if (!localStorage.getItem('user_user')) {
             const defaultUser: User = {
                name: 'Pengguna Jenius',
                username: 'user',
                email: 'user@ayahjenius.com',
                schoolType: 'SDN',
                role: 'user'
            };
            localStorage.setItem('user_user', JSON.stringify(defaultUser));
            localStorage.setItem('pwd_user@ayahjenius.com', 'password123');
            userKeys.push('user_user');
            updated = true;
        }

        if (updated) {
            localStorage.setItem('user_keys', JSON.stringify(Array.from(new Set(userKeys))));
        }
    } catch (error) {
        console.error("Failed to initialize default users in localStorage", error);
    }
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        initializeDefaultUsers();
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem('user');
        } finally {
          setLoading(false);
        }
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    if (userData.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/belajar');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        
        const oldUsername = prevUser.username;
        const newUsername = userData.username || oldUsername;
        
        const newUser = { ...prevUser, ...userData };

        // Update main user session
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Update the specific user entry
        localStorage.setItem(`user_${newUsername}`, JSON.stringify(newUser));

        // If username changed, clean up old entry and update keys
        if (oldUsername !== newUsername) {
            localStorage.removeItem(`user_${oldUsername}`);
            try {
                const userKeysStr = localStorage.getItem('user_keys') || '[]';
                let userKeys: string[] = JSON.parse(userKeysStr);
                userKeys = userKeys.filter(key => key !== `user_${oldUsername}`);
                userKeys.push(`user_${newUsername}`);
                localStorage.setItem('user_keys', JSON.stringify(Array.from(new Set(userKeys))));
            } catch (e) {
                console.error("Failed to update user_keys on username change", e);
            }
        }

        return newUser;
    });
  };

  const updatePassword = (password: string) => {
    if (!user) return;
    try {
        localStorage.setItem(`pwd_${user.email}`, password);
    } catch (e) {
        console.error("Failed to update password in localStorage", e);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, updatePassword, loading }}>
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
