
'use client';

import { BookHeart, LogIn, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { ProfileDialog } from './ProfileDialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


export function Header() {
  const { isAuthenticated, user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const dashboardHref = user?.role === 'admin' ? '/admin/dashboard' : '/belajar';

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
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
                {isAuthenticated && user ? (
                    <>
                        <Button asChild>
                            <Link href={dashboardHref}>
                                <LayoutDashboard />
                                Masuk ke Dasbor
                            </Link>
                        </Button>
                        <ProfileDialog>
                            <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                            <Avatar>
                                <AvatarImage src={user.photoUrl} alt={user.name} />
                                <AvatarFallback>
                                <User className="h-5 w-5"/>
                                </AvatarFallback>
                            </Avatar>
                            </Button>
                        </ProfileDialog>
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
