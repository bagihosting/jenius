
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
import { createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { doc, setDoc, getDoc, writeBatch, collection, query, where, getDocs } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SchoolType } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


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
  schoolType: z.enum(['SDN', 'SDIT', 'MI', 'SMP', 'MTs', 'SMA', 'MA'], { required_error: 'Jenis sekolah harus dipilih.' }),
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
    defaultValues: {
        name: '',
        username: '',
        email: '',
        password: '',
        schoolName: '',
    }
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
    
    let createdUser = null;

    try {
      const usernamesRef = collection(db, 'users');
      const q = query(usernamesRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        form.setError("username", { type: "manual", message: "Username ini sudah digunakan. Silakan pilih yang lain." });
        setIsLoading(false);
        return;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createdUser = userCredential.user;

      await updateProfile(createdUser, { displayName: name });
      
      // --- Admin Check Logic ---
      const adminEmails = ['admin@ayahjenius.com', 'rahmantirta99@gmail.com'];
      const isAdmin = adminEmails.includes(email.toLowerCase());
      const userRole = isAdmin ? 'admin' : 'user';

      const userData = {
        name,
        username,
        email: createdUser.email,
        role: userRole,
        schoolType,
        schoolName,
        registeredAt: new Date().toISOString(),
        quizCompletions: 0,
        bonusPoints: 0,
        progress: {},
      };

      const userDocRef = doc(db, 'users', createdUser.uid);
      await setDoc(userDocRef, userData);
      
      toast({
          title: "Pendaftaran Berhasil!",
          description: isAdmin ? "Akun Admin Anda telah dibuat. Mengarahkan ke login..." : "Akun Anda telah dibuat. Mengarahkan ke login...",
      });

      router.push('/login');

    } catch (error: any) {
        console.error("Registration error:", error);
        let errorMessage = "Terjadi kesalahan saat pendaftaran. Silakan coba lagi.";

        // --- SAFEGUARD: Cleanup user if DB write fails ---
        if (createdUser) {
            await deleteUser(createdUser).catch(delErr => {
                console.error("Failed to cleanup created user:", delErr);
                errorMessage += " Terjadi error saat pembersihan, hubungi support.";
            });
        }
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.";
            form.setError("email", { type: "manual", message: errorMessage });
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password terlalu lemah. Gunakan minimal 6 karakter.';
            form.setError("password", { type: "manual", message: errorMessage });
        } else if (error.code === 'permission-denied') {
            errorMessage = 'Akses ditolak. Pastikan aturan keamanan Firestore Anda sudah benar dan coba lagi.'
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
     <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Nama Lengkap Anda" {...field} />
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
                <Input placeholder="pilih_username_unik" {...field} />
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
                <Input type="email" placeholder="email@anda.com" {...field} />
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
                <Input type="password" placeholder="Minimal 6 karakter" {...field} />
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
                                <SelectValue placeholder="Pilih jenis sekolah..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {schoolTypes.map(st => <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>)}
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
                <Input placeholder="Contoh: SDN Merdeka 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Daftar Sekarang'}
        </Button>
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

    