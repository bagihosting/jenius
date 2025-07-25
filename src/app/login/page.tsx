
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isFirebaseConfigured || !auth || !db) {
        toast({
            title: "Konfigurasi Tidak Lengkap",
            description: "Aplikasi belum terhubung ke server. Silakan periksa file .env Anda.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      let redirectPath = '/belajar';
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (userData.role === 'mahasiswa') {
            redirectPath = '/mahasiswa/dashboard';
        }
      } else {
        console.warn(`User with UID ${user.uid} is in Auth but not in Firestore.`);
      }
      
      toast({
          title: "Login Berhasil",
          description: `Selamat datang kembali! Mengarahkan ke dasbor...`,
      });
      
      router.push(redirectPath);

    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Terjadi kesalahan saat login.";

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-email':
          errorMessage = "Email tidak ditemukan atau tidak valid.";
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Kombinasi email dan password salah.";
          break;
        default:
          errorMessage = "Terjadi kesalahan tidak terduga. Silakan coba lagi nanti.";
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

  const renderContent = () => {
    if (!isClient) {
      return <div className="flex justify-center items-center h-24"><Loader2 className="animate-spin" /></div>;
    }
    
    if (!isFirebaseConfigured) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Konfigurasi Diperlukan</AlertTitle>
          <AlertDescription>
              Kredensial Firebase belum diatur. Silakan isi file <strong>.env</strong> Anda untuk mengaktifkan login.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
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
            autoCapitalize="none"
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
        <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Masuk'}
        </Button>
      </form>
    );
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
            {renderContent()}
          </CardContent>
          <CardFooter className="justify-center text-sm">
            <p>Belum punya akun? <Link href="/register" className="text-primary hover:underline font-semibold">Daftar di sini</Link></p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
