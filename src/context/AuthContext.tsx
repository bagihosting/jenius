
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
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initializeDefaultUsers = () => {
    try {
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
    // This now runs for every user on app load, ensuring defaults are set.
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
        const newUser = { ...prevUser, ...userData };
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem(`user_${newUser.username}`, JSON.stringify(newUser));
        return newUser;
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, loading }}>
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
