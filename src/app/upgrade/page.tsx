
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PartyPopper, CheckCircle, Banknote, Clock, Send } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { ref, onValue, get } from 'firebase/database';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitUpgradeRequestAction } from '@/app/actions';
import { type UpgradeRequest, type UpgradeInfo } from '@/lib/types';


export default function UpgradePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [upgradeStatus, setUpgradeStatus] = useState<'not_submitted' | 'pending' | 'approved'>('not_submitted');
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeInfo | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  
  const [universityName, setUniversityName] = useState('');
  const [major, setMajor] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  // Fetch upgrade info from database
  useEffect(() => {
    if (db) {
        const infoRef = ref(db, 'appSettings/upgradeInfo');
        get(infoRef).then((snapshot) => {
            if (snapshot.exists()) {
                setUpgradeInfo(snapshot.val());
            }
        }).catch((error) => {
            console.error("Failed to fetch upgrade info:", error);
            toast({ title: 'Gagal memuat info', variant: 'destructive' });
        }).finally(() => {
            setIsLoadingInfo(false);
        });
    } else {
        setIsLoadingInfo(false);
    }
  }, [toast]);

  // Check user's upgrade status
  useEffect(() => {
    if (user?.role === 'mahasiswa') {
      setUpgradeStatus('approved');
    } else if (user && db) {
      const requestRef = ref(db, `upgradeRequests/${user.uid}`);
      const unsubscribe = onValue(requestRef, (snapshot) => {
        if (snapshot.exists()) {
          const request: UpgradeRequest = snapshot.val();
          if (request.status === 'pending') {
            setUpgradeStatus('pending');
          }
        }
      });
      return () => unsubscribe();
    }
  }, [user, db]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!universityName || !major) {
        toast({
            title: 'Form Tidak Lengkap',
            description: 'Harap isi nama universitas dan jurusan.',
            variant: 'destructive',
        });
        return;
    }

    setIsSubmitting(true);
    const result = await submitUpgradeRequestAction(user, { universityName, major });
    
    if (result.success) {
        toast({
            title: 'Pengajuan Terkirim!',
            description: 'Pengajuan Anda sedang ditinjau oleh admin.',
        });
        setUpgradeStatus('pending');
    } else {
        toast({
            title: 'Gagal Mengirim Pengajuan',
            description: result.error,
            variant: 'destructive',
        });
    }

    setIsSubmitting(false);
  };
  
  if (!isClient || loading || !isAuthenticated || isLoadingInfo) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const renderContent = () => {
    switch (upgradeStatus) {
        case 'approved':
            return (
                <CardContent className="text-center space-y-4">
                    <p>Selamat! Akun Anda sudah berstatus Mahasiswa. Anda kini dapat menggunakan fitur Asisten Akademik AI.</p>
                    <Button asChild size="lg">
                        <Link href="/mahasiswa/dashboard">Lanjutkan ke Dasbor Mahasiswa</Link>
                    </Button>
                </CardContent>
            );
        case 'pending':
            return (
                 <CardContent className="text-center space-y-4">
                    <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
                    <h3 className="text-xl font-bold">Pengajuan Sedang Ditinjau</h3>
                    <p className="text-muted-foreground">Terima kasih! Pengajuan upgrade Anda telah kami terima dan akan segera diperiksa oleh admin setelah donasi dikonfirmasi. Anda akan diarahkan ke dasbor mahasiswa setelah disetujui.</p>
                </CardContent>
            )
        default: // 'not_submitted'
            return (
                <>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-bold text-xl">Apa yang Anda Dapatkan?</h3>
                            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                                <li>Akses ke **Asisten Akademik AI** untuk semua jurusan.</li>
                                <li>Bantuan untuk tugas, materi, dan persiapan ujian tingkat universitas.</li>
                                <li>Fitur-fitur baru yang akan datang khusus untuk mahasiswa.</li>
                            </ul>
                        </div>
                        <Alert>
                            <Banknote className="h-4 w-4" />
                            <AlertTitle>Instruksi Donasi</AlertTitle>
                            <AlertDescription>
                                {upgradeInfo ? (
                                    <>
                                        <p>Silakan lakukan donasi satu kali sebesar **Rp {upgradeInfo.donationAmount.toLocaleString('id-ID')}** untuk mendukung pengembangan Ayah Jenius ke rekening berikut:</p>
                                        <p className="font-mono font-bold text-base my-2 text-primary">{upgradeInfo.bankName}: {upgradeInfo.accountNumber} (a.n. {upgradeInfo.accountName})</p>
                                        <p>{upgradeInfo.instructions}</p>
                                    </>
                                ) : (
                                    <p>Informasi donasi sedang tidak tersedia. Silakan coba lagi nanti.</p>
                                )}
                            </AlertDescription>
                        </Alert>
                         <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="universityName">Nama Universitas</Label>
                                <Input id="universityName" value={universityName} onChange={(e) => setUniversityName(e.target.value)} placeholder="Contoh: Universitas Gadjah Mada" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="major">Jurusan</Label>
                                <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Contoh: Teknik Informatika" />
                            </div>
                         </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" size="lg" onClick={handleSubmit} disabled={isSubmitting || !upgradeInfo}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin mr-2"/> 
                                Mengirim...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2" />
                                Kirim Pengajuan Upgrade
                            </>
                        )}
                      </Button>
                    </CardFooter>
                </>
            )
    }
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
                  {upgradeStatus === 'approved' ? <CheckCircle className="h-12 w-12 text-green-500" /> : <PartyPopper className="h-12 w-12 text-primary" />}
              </div>
              <CardTitle className="text-3xl font-headline">{upgradeStatus === 'approved' ? 'Akun Anda Sudah Mahasiswa!' : 'Upgrade ke Akun Mahasiswa'}</CardTitle>
              <CardDescription className="text-lg">
                {upgradeStatus === 'approved' ? 'Anda sudah dapat menggunakan fitur Asisten Akademik AI.' : 'Buka akses ke fitur canggih untuk jenjang kuliah dengan berdonasi.'}
              </CardDescription>
            </CardHeader>
            {renderContent()}
          </Card>
        </div>
      </main>
    </div>
  );
}
