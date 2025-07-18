
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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
          title: "Login Berhasil",
          description: `Selamat datang kembali!`,
      });
      
      // The onAuthStateChanged listener in AuthContext will handle the redirect.
      // We push to /belajar as a fallback/default.
      router.push('/belajar');

    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Terjadi kesalahan saat login.";
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-email':
          errorMessage = "Email tidak ditemukan atau tidak valid.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Password salah. Silakan coba lagi.";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Kombinasi email dan password salah.";
          break;
      }
      toast({
          title: "Login Gagal",
          description: errorMessage,
          variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@anda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
