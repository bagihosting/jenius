
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { User } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
        try {
            const storedUser = localStorage.getItem(`user_${username}`);
            if (!storedUser) {
                 toast({
                    title: "Login Gagal",
                    description: "Username tidak ditemukan. Silakan coba lagi.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }
            
            const userData: User = JSON.parse(storedUser);
            const storedPassword = localStorage.getItem(`pwd_${userData.email}`);

            if (storedPassword === password) {
                toast({
                    title: "Login Berhasil",
                    description: `Selamat datang kembali, ${userData.name}!`,
                });
                login(userData);
                // No need to set isLoading to false here, as the page will redirect.
                // Added return to prevent finally block from executing immediately.
                return; 
            } else {
                 toast({
                    title: "Login Gagal",
                    description: "Password salah. Silakan coba lagi.",
                    variant: "destructive",
                });
            }
        } catch (error) {
             toast({
                title: "Terjadi Kesalahan",
                description: "Tidak dapat memproses login saat ini.",
                variant: "destructive",
            });
            console.error("Login error:", error);
        } finally {
            // This will only run for failed login attempts now.
            if (!localStorage.getItem('user')) {
                setIsLoading(false);
            }
        }
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Masuk ke Akun Anda</CardTitle>
            <CardDescription>Selamat datang kembali! Lanjutkan proses belajar Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username_anda"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Masuk'}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <Link href="/register" className="text-primary hover:underline">
                  Daftar di sini
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
