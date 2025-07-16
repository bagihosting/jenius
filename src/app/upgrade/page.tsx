
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PartyPopper, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function UpgradePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user?.role === 'mahasiswa') {
        setIsSuccess(true);
    }
  }, [loading, isAuthenticated, router, user]);
  
  const handleUpgrade = () => {
    if (!user) return;
    setIsUpgrading(true);

    setTimeout(() => {
        try {
            updateUser({ role: 'mahasiswa' });
            toast({
                title: 'Upgrade Berhasil!',
                description: 'Selamat, Anda kini memiliki akun Mahasiswa.',
            });
            setIsSuccess(true);
        } catch (e) {
            toast({
                title: 'Upgrade Gagal',
                description: 'Terjadi kesalahan saat melakukan upgrade. Silakan coba lagi.',
                variant: 'destructive',
            });
        } finally {
            setIsUpgrading(false);
        }
    }, 1500); // Simulate payment processing time
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-xl mx-auto">
          <Link href="/belajar" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft size={16} />
            Kembali
          </Link>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  {isSuccess ? <CheckCircle className="h-12 w-12 text-green-500" /> : <PartyPopper className="h-12 w-12 text-primary" />}
              </div>
              <CardTitle className="text-3xl font-headline">{isSuccess ? 'Upgrade Berhasil!' : 'Upgrade ke Akun Mahasiswa'}</CardTitle>
              <CardDescription className="text-lg">
                {isSuccess ? 'Akun Anda telah berhasil di-upgrade.' : 'Buka akses ke fitur-fitur canggih untuk jenjang kuliah.'}
              </CardDescription>
            </CardHeader>
            {isSuccess ? (
                <CardContent className="text-center space-y-4">
                    <p>Selamat datang di tingkat selanjutnya! Anda kini dapat menggunakan Asisten Akademik AI dan fitur-fitur eksklusif lainnya.</p>
                    <Button asChild size="lg">
                        <Link href="/mahasiswa/dashboard">Lanjutkan ke Dasbor Mahasiswa</Link>
                    </Button>
                </CardContent>
            ) : (
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-bold text-xl">Apa yang Anda Dapatkan?</h3>
                        <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                            <li>Akses ke **Asisten Akademik AI** untuk semua jurusan.</li>
                            <li>Bantuan untuk tugas, materi, dan persiapan ujian tingkat universitas.</li>
                            <li>Penjelasan konsep kompleks yang dibuat sederhana dan cerdas.</li>
                            <li>Fitur-fitur baru yang akan datang khusus untuk mahasiswa.</li>
                        </ul>
                    </div>
                    <div className="text-center p-4 bg-secondary rounded-lg">
                        <p className="text-muted-foreground">Donasi Satu Kali untuk Pengembangan</p>
                        <p className="text-4xl font-bold text-primary">Rp 100.000</p>
                    </div>
                </CardContent>
            )}
            {!isSuccess && (
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={handleUpgrade} disabled={isUpgrading}>
                    {isUpgrading ? (
                        <>
                            <Loader2 className="animate-spin mr-2"/> 
                            Memproses Donasi...
                        </>
                    ) : 'Donasi dan Upgrade Sekarang'}
                  </Button>
                </CardFooter>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
