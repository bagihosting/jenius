
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SchoolType, User } from '@/lib/types';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';
import { getFirebase, isFirebaseConfigured } from '@/lib/firebase';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const schoolTypes: { id: SchoolType; name: string }[] = [
  { id: 'SDN', name: 'SD Negeri' },
  { id: 'SDIT', name: 'SD Islam Terpadu' },
  { id: 'MI', name: 'Madrasah Ibtidaiyah (MI)' },
  { id: 'SMP', name: 'SMP (Sekolah Menengah Pertama)' },
  { id: 'MTs', name: 'MTs (Madrasah Tsanawiyah)' },
  { id: 'SMA', name: 'SMA (Sekolah Menengah Atas)' },
  { id: 'MA', name: 'MA (Madrasah Aliyah)' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolType, setSchoolType] = useState<SchoolType | ''>('');
  const [schoolName, setSchoolName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolType || !schoolName) {
        toast({
            title: "Form Belum Lengkap",
            description: "Silakan pilih jenis sekolah dan isi nama sekolah Anda.",
            variant: "destructive",
        });
        return;
    }
    setIsLoading(true);

    if (!isFirebaseConfigured) {
        toast({
            title: "Konfigurasi Tidak Lengkap",
            description: "Kredensial Firebase belum diatur. Silakan periksa file .env Anda.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
        const { auth, db } = getFirebase(); // Get initialized services
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
      
        const userData: Omit<User, 'progress'> & Partial<Pick<User, 'progress'>> = {
            uid: user.uid,
            name,
            username: username.toLowerCase(),
            email,
            schoolType,
            schoolName,
            role: 'user',
            registeredAt: new Date().toISOString(),
            quizCompletions: 0,
            bonusPoints: 0,
        };
      
        await set(ref(db, `users/${user.uid}`), userData);

        toast({
          title: "Pendaftaran Berhasil",
          description: "Akun Anda telah dibuat. Silakan masuk.",
        });
        router.push('/login');

    } catch (error: any) {
        let errorMessage = "Tidak dapat memproses pendaftaran saat ini.";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.";
                break;
            case 'auth/weak-password':
                errorMessage = "Password terlalu lemah. Gunakan minimal 6 karakter.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Format email tidak valid.";
                break;
            case 'auth/operation-not-allowed':
                errorMessage = "Pendaftaran dengan email dan password tidak diaktifkan.";
                break;
            case 'auth/api-key-not-valid':
                errorMessage = "Kunci API Firebase tidak valid. Pastikan file .env Anda sudah benar dan terisi lengkap.";
                break;
            default:
                 console.error("Registration error:", error);
                 errorMessage = `Terjadi kesalahan tak terduga: ${error.message}`;
        }
        
        toast({
            title: "Pendaftaran Gagal",
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
              Kredensial Firebase belum diatur. Silakan isi file <strong>.env</strong> Anda untuk mengaktifkan pendaftaran.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            type="text"
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
         <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Buat username unik"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
            pattern="[a-z0-9_]+"
            title="Username hanya boleh berisi huruf kecil, angka, dan garis bawah (_)."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@contoh.com"
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
            placeholder="Buat password yang kuat (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school-type">Jenis Sekolah</Label>
          <Select value={schoolType} onValueChange={(value) => setSchoolType(value as SchoolType)} required>
            <SelectTrigger id="school-type">
              <SelectValue placeholder="Pilih jenis..." />
            </SelectTrigger>
            <SelectContent>
              {schoolTypes.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="school-name">Nama Sekolah</Label>
          <Input
            id="school-name"
            type="text"
            placeholder="Contoh: SMPN 1 Jakarta"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
           {isLoading ? <Loader2 className="animate-spin" /> : 'Daftar'}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Masuk di sini
          </Link>
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Buat Akun Baru</CardTitle>
            <CardDescription>Bergabunglah dengan Ayah Jenius untuk mulai belajar.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
