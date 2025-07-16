
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PartyPopper, CheckCircle, MessageSquare } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function UpgradePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user?.role === 'mahasiswa') {
        setIsSuccess(true);
    }
  }, [loading, isAuthenticated, router, user]);
  
  const handleUpgradeRequest = () => {
    if (!user) return;
    setIsSubmitting(true);

    const adminPhoneNumber = '6285156125329';
    const message = encodeURIComponent(
        `Halo Admin Ayah Jenius,\n\nSaya ingin mengajukan permintaan upgrade akun ke Mahasiswa.\n\nNama: ${user.name}\nEmail: ${user.email}\nUsername: ${user.username}\n\nMohon informasinya untuk proses donasi. Terima kasih!`
    );
    
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${message}`;

    // Redirect to WhatsApp
    window.location.href = whatsappUrl;
    
    toast({
        title: 'Mengarahkan ke WhatsApp',
        description: 'Anda akan diarahkan ke WhatsApp untuk mengirim permintaan upgrade kepada admin.',
    });

    // We don't need to set isSubmitting to false, as the user is leaving the page.
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
              <CardTitle className="text-3xl font-headline">{isSuccess ? 'Akun Anda Sudah Mahasiswa!' : 'Upgrade ke Akun Mahasiswa'}</CardTitle>
              <CardDescription className="text-lg">
                {isSuccess ? 'Anda sudah dapat menggunakan fitur Asisten Akademik AI.' : 'Buka akses ke fitur canggih untuk jenjang kuliah dengan berdonasi.'}
              </CardDescription>
            </CardHeader>
            {isSuccess ? (
                <CardContent className="text-center space-y-4">
                    <p>Selamat datang di tingkat selanjutnya! Lanjutkan ke dasbor untuk mulai menggunakan fitur eksklusif Anda.</p>
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
                  <Button className="w-full" size="lg" onClick={handleUpgradeRequest} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin mr-2"/> 
                            Mempersiapkan...
                        </>
                    ) : (
                        <>
                            <MessageSquare className="mr-2" />
                            Ajukan Upgrade via WhatsApp
                        </>
                    )}
                  </Button>
                </CardFooter>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
