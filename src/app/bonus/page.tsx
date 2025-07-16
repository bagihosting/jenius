
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Gift, Info, DatabaseZap } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Grade } from '@/lib/types';

export default function BonusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const grade = searchParams.get('grade') as Grade;
  const semester = searchParams.get('semester');
  const backlink = `/dashboard?grade=${grade}&semester=${semester}`;

  const [robloxUsername, setRobloxUsername] = useState('');
  const [bonusPoints, setBonusPoints] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
        setRobloxUsername(user.robloxUsername || '');
        setBonusPoints(user.bonusPoints || 0);
    }
  }, [user]);

  const handleSaveUsername = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        // This only updates the local state now.
        await updateUser({ robloxUsername: robloxUsername });
        toast({
            title: 'Berhasil!',
            description: 'Username Roblox kamu telah disimpan (secara lokal).',
        });
    } catch(e) {
        toast({
            title: 'Gagal Menyimpan',
            description: 'Terjadi kesalahan saat menyimpan username.',
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (!isClient || loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link href={backlink} className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft size={16} />
            Kembali ke dasbor
          </Link>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-destructive/20 p-4 rounded-full w-fit mb-4">
                <DatabaseZap className="h-12 w-12 text-destructive"/>
              </div>
              <CardTitle className="text-3xl font-headline">Fitur Bonus Dinonaktifkan</CardTitle>
              <CardDescription>Database tidak terhubung, sehingga poin bonus tidak dapat disimpan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="text-center">
                    <Label className="text-muted-foreground">Total Poin Bonus Kamu</Label>
                    <p className="text-5xl font-bold text-muted-foreground">{bonusPoints.toFixed(4)}</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Fungsionalitas Terbatas</AlertTitle>
                    <AlertDescription>
                        Fitur bonus memerlukan koneksi database untuk melacak dan menyimpan poin Anda. Fungsi ini akan dinonaktifkan sampai database terhubung kembali.
                    </AlertDescription>
                </Alert>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
