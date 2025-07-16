'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Selamat Datang di Ayah Jenius!</CardTitle>
            <CardDescription className="text-lg pt-2">
              Silakan masuk untuk melanjutkan, atau daftar jika Anda belum memiliki akun.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full h-12 text-lg"
                onClick={() => router.push('/login')}
              >
                <LogIn className="mr-2" />
                Masuk ke Akun
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full h-12 text-lg"
                onClick={() => router.push('/register')}
              >
                <ArrowRight className="mr-2" />
                Daftar Akun Baru
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © 2024 Ayah Jenius. All rights reserved.
      </footer>
    </div>
  );
}
