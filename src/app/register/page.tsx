
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SchoolType } from '@/lib/types';

const schoolTypes: { id: SchoolType; name: string }[] = [
  { id: 'SDN', name: 'SD Negeri' },
  { id: 'SDIT', name: 'SD Islam Terpadu' },
  { id: 'MI', name: 'Madrasah Ibtidaiyah (MI)' },
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

  const handleRegister = (e: React.FormEvent) => {
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

    setTimeout(() => {
      try {
        if (localStorage.getItem(`user_${username}`)) {
          toast({
            title: "Pendaftaran Gagal",
            description: "Username ini sudah terdaftar. Silakan gunakan username lain.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('user_')) {
                const userData = JSON.parse(localStorage.getItem(key) || '{}');
                if (userData.email === email) {
                    toast({
                        title: "Pendaftaran Gagal",
                        description: "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }
            }
        }

        const newUser = { name, username, email, schoolType, schoolName, role: 'user' as 'user' };
        localStorage.setItem(`user_${username}`, JSON.stringify(newUser));
        localStorage.setItem(`pwd_${email}`, password);

        console.log('Registering user:', newUser);
        toast({
            title: "Pendaftaran Berhasil",
            description: "Akun Anda telah dibuat. Silakan masuk.",
        });
        router.push('/login');
      } catch (error) {
        toast({
            title: "Terjadi Kesalahan",
            description: "Tidak dapat memproses pendaftaran saat ini.",
            variant: "destructive",
        });
        console.error("Registration error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
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
                  placeholder="Buat password yang kuat"
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
                  placeholder="Contoh: SDN 1 Tangerang"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? <Loader2 className="animate-spin" /> : 'Daftar'}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Masuk di sini
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
