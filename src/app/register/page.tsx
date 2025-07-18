
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { SchoolType } from '@/lib/types';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set, get, child } from 'firebase/database';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured, type Database } from '@/lib/firebase';
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

const checkUsernameUniqueness = async (username: string, db: Database | null): Promise<boolean> => {
  if (!username || !db) return true; // Don't check empty strings or if db is not available
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `usernames/${username.toLowerCase()}`));
  return !snapshot.exists();
};

const registerSchema = (db: Database | null) => z.object({
  name: z.string().min(2, "Nama harus diisi, minimal 2 karakter."),
  username: z.string()
    .min(3, "Username minimal 3 karakter.")
    .regex(/^[a-z0-9_.]+$/, "Username hanya boleh berisi huruf kecil, angka, titik, dan garis bawah."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  schoolType: z.enum(['SDN', 'SDIT', 'MI', 'SMP', 'MTs', 'SMA', 'MA'], {
    required_error: "Jenis sekolah harus dipilih."
  }),
  schoolName: z.string().min(3, "Nama sekolah harus diisi."),
}).refine(async (data) => {
    return await checkUsernameUniqueness(data.username, db);
}, {
    message: "Username ini sudah digunakan. Silakan pilih yang lain.",
    path: ["username"],
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const { firebase } = useAuth();
  
  const form = useForm<z.infer<ReturnType<typeof registerSchema>>>({
    resolver: zodResolver(registerSchema(firebase?.db ?? null)),
    mode: 'onBlur', // Validate on blur to check username
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      schoolName: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegister = async (values: z.infer<ReturnType<typeof registerSchema>>) => {
    if (!firebase) return;
    const { auth, db } = firebase;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: values.name });

      const usernameKey = values.username.toLowerCase();
      const userData = {
        uid: user.uid,
        name: values.name,
        username: usernameKey,
        email: values.email,
        schoolType: values.schoolType,
        schoolName: values.schoolName,
        role: 'user' as const,
        registeredAt: new Date().toISOString(),
        quizCompletions: 0,
        bonusPoints: 0,
      };
      
      await set(ref(db, `users/${user.uid}`), userData);
      await set(ref(db, `usernames/${usernameKey}`), { uid: user.uid });

      toast({
        title: "Pendaftaran Berhasil!",
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
        default:
          console.error("Registration error:", error);
          errorMessage = `Terjadi kesalahan tak terduga: ${error.message}`;
      }
      form.setError("root", { message: errorMessage });
    }
  };

  const { isSubmitting } = form.formState;

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
            Aplikasi belum terhubung ke server. Silakan lengkapi file <strong>.env</strong> untuk mengaktifkan pendaftaran.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
          {form.formState.errors.root && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pendaftaran Gagal</AlertTitle>
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Buat username unik" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@contoh.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Buat password yang kuat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schoolType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Sekolah</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schoolTypes.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Sekolah</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: SMPN 1 Jakarta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting || !isFirebaseConfigured}>
             {isSubmitting ? <Loader2 className="animate-spin" /> : 'Daftar'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Masuk di sini
            </Link>
          </div>
        </form>
      </Form>
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
