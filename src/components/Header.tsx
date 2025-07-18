
'use client';

import { BookHeart, LogIn, LayoutDashboard, User, Loader2 } from 'lucide-react';
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

  let dashboardHref = '/belajar';
  if (user?.role === 'admin') {
      dashboardHref = '/admin/dashboard';
  } else if (user?.role === 'mahasiswa') {
      dashboardHref = '/mahasiswa/dashboard';
  }


  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-200 font-headline">
              <BookHeart className="h-8 w-8 text-primary" />
              <span>Ayah Jenius</span>
            </Link>
            <p className="text-sm text-muted-foreground hidden md:block">Platform belajar cerdas untuk semua</p>
          </div>
          <div className="flex items-center gap-2">
            {!isClient || loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
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
                    <Button asChild>
                      <Link href="/login">
                        <LogIn className="mr-2"/>
                        Masuk
                      </Link>
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
