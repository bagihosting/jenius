
'use client';

import { BookHeart, LogIn, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const { isAuthenticated, user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-200 font-headline">
              <BookHeart className="h-8 w-8 text-primary" />
              <span>Ayah Jenius</span>
            </Link>
            <p className="text-sm text-muted-foreground hidden md:block">Platform belajar cerdas untuk siswa SD & MI</p>
          </div>
          <div className="flex items-center gap-2">
            {isClient && !loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <span className="text-sm font-medium hidden sm:flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-muted-foreground"/>
                        {user?.name || 'Pengguna'}
                    </span>
                    <Button variant="outline" asChild>
                        <Link href="/belajar">
                            <LayoutDashboard />
                            Dasbor
                        </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">
                        <LogIn />
                        Masuk
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Daftar</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
