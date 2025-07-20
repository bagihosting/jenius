
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SchoolType } from '@/lib/types';

const schoolTypes: { id: SchoolType; name: string }[] = [
  { id: 'SDN', name: 'SD Negeri' },
  { id: 'SDIT', name: 'SD Islam Terpadu' },
  { id: 'MI', name: 'Madrasah Ibtidaiyah (MI)' },
  { id: 'SMP', name: 'SMP (Sekolah Menengah Pertama)' },
  { id: 'MTs', name: 'MTs (Madrasah Tsanawiyah)' },
  { id: 'SMA', name: 'SMA (Sekolah Menengah Atas)' },
  { id: 'MA', name: 'MA (Madrasah Aliyah)' },
];

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus memiliki setidaknya 2 karakter.' }),
  username: z.string().min(3, { message: 'Username harus memiliki setidaknya 3 karakter.' })
    .regex(/^[a-z0-9_]+$/, 'Username hanya boleh berisi huruf kecil, angka, dan garis bawah (_).'),
  email: z.string().email({ message: 'Email tidak valid.' }),
  password: z.string().min(6, { message: 'Password harus memiliki setidaknya 6 karakter.' }),
  schoolType: z.enum(['SDN', 'SDIT', 'MI', 'SMP', 'MTs', 'SMA', 'MA']),
  schoolName: z.string().min(3, { message: 'Nama sekolah harus diisi.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);

    if (!isFirebaseConfigured || !auth || !db) {
       toast({ title: "Layanan tidak tersedia", description: "Tidak dapat terhubung ke server pendaftaran.", variant: "destructive" });
       setIsLoading(false);
       return;
    }
    
    const { name, username, email, password, schoolType, schoolName } = data;
    const usernameKey = username.toLowerCase();

    try {
      // Langkah 1: Periksa ketersediaan username di Realtime Database
      const usernameRef = child(ref(db), `usernames/${usernameKey}`);
      const usernameSnapshot = await get(usernameRef);
      if (usernameSnapshot.exists()) {
        form.setError("username", { type: "manual", message: "Username ini sudah digunakan. Silakan pilih yang lain." });
        setIsLoading(false);
        return;
      }
      
      // Langkah 2: Buat pengguna di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Langkah 3: Perbarui profil di Firebase Auth
      await updateProfile(user, { displayName: name });
      
      // Langkah 4: Siapkan dan simpan data ke Realtime Database
      const isAdmin = email.toLowerCase() === 'admin@ayahjenius.com';
      const userRole = isAdmin ? 'admin' : 'user';

      const userData = {
        uid: user.uid,
        name,
        username,
        email: user.email,
        role: userRole,
        schoolType,
        schoolName,
        registeredAt: new Date().toISOString(),
        quizCompletions: 0,
        bonusPoints: 0,
        progress: {},
      };

      // Simpan data pengguna dan username secara bersamaan
      await set(ref(db, `users/${user.uid}`), userData);
      await set(ref(db, `usernames/${usernameKey}`), { uid: user.uid });

      toast({
          title: "Pendaftaran Berhasil!",
          description: isAdmin ? "Akun Admin Anda telah dibuat. Silakan masuk." : "Akun Anda telah dibuat. Silakan masuk.",
      });

      router.push('/login');

    } catch (error: any) {
        console.error("Registration error:", error);
        let errorMessage = "Terjadi kesalahan saat pendaftaran.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.";
            form.setError("email", { type: "manual", message: errorMessage });
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password terlalu lemah. Gunakan minimal 6 karakter.';
            form.setError("password", { type: "manual", message: errorMessage });
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
      return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8" /></div>;
    }

    if (!isFirebaseConfigured) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fitur Dinonaktifkan</AlertTitle>
          <AlertDescription>
            Pendaftaran tidak tersedia karena aplikasi belum terhubung ke server.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input id="name" placeholder="Nama Lengkap Anda" {...form.register('name')} />
          {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="pilih_username_unik" {...form.register('username')} />
          {form.formState.errors.username && <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@anda.com" {...form.register('email')} />
          {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Minimal 6 karakter" {...form.register('password')} />
          {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
        </div>
         <div className="space-y-2">
          <Label htmlFor="schoolType">Jenis Sekolah</Label>
          <Select onValueChange={(value) => form.setValue('schoolType', value as any)}>
              <SelectTrigger id="schoolType">
                <SelectValue placeholder="Pilih jenis sekolah..." />
              </SelectTrigger>
            <SelectContent>
              {schoolTypes.map(st => <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {form.formState.errors.schoolType && <p className="text-sm text-destructive">{form.formState.errors.schoolType.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="schoolName">Nama Sekolah</Label>
          <Input id="schoolName" placeholder="Contoh: SDN Merdeka 5" {...form.register('schoolName')} />
          {form.formState.errors.schoolName && <p className="text-sm text-destructive">{form.formState.errors.schoolName.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Daftar Sekarang'}
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
            <CardTitle className="text-3xl font-headline">Buat Akun Baru</CardTitle>
            <CardDescription>Daftar gratis untuk mulai belajar dengan Ayah Jenius.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
          <CardFooter className="justify-center text-sm">
            <p>Sudah punya akun? <Link href="/login" className="text-primary hover:underline font-semibold">Masuk di sini</Link></p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

    