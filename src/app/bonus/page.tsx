
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Gift, CheckCircle, Info } from 'lucide-react';
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

const ROBUX_PER_QUIZ = 0.01;

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
    
    if (grade) {
        const gradeNum = parseInt(grade, 10);
        if (gradeNum > 6) {
            toast({
                title: "Fitur Tidak Tersedia",
                description: "Bonus Robux hanya tersedia untuk siswa kelas 1-6.",
                variant: "destructive"
            });
            router.push(backlink);
        }
    }

  }, [loading, isAuthenticated, router, grade, backlink, toast]);

  useEffect(() => {
    if (user) {
        setRobloxUsername(user.robloxUsername || '');
        const bonusKey = `bonus_points_${user.email}`;
        const storedBonus = parseFloat(localStorage.getItem(bonusKey) || '0');
        setBonusPoints(storedBonus);
    }
  }, [user]);

  const handleSaveUsername = () => {
    if (!user) return;
    setIsSaving(true);
    try {
        updateUser({ robloxUsername: robloxUsername });
        toast({
            title: 'Berhasil!',
            description: 'Username Roblox kamu telah disimpan.',
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
  
  const quizzesCompleted = Math.floor(bonusPoints / ROBUX_PER_QUIZ);
  const quizzesNeededForNextPoint = 1;
  const progressPercentage = (quizzesCompleted % quizzesNeededForNextPoint) * 100;

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
              <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit mb-4">
                <Gift className="h-12 w-12 text-accent"/>
              </div>
              <CardTitle className="text-3xl font-headline">Bonus Robux</CardTitle>
              <CardDescription>Selesaikan lebih banyak kuis untuk mendapatkan poin dan menukarkannya dengan Robux!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="text-center">
                    <Label className="text-muted-foreground">Total Poin Bonus Kamu</Label>
                    <p className="text-5xl font-bold text-primary">{bonusPoints.toFixed(4)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Setara dengan {quizzesCompleted} kuis selesai</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-center font-semibold">Kemajuan Bonus Berikutnya</h3>
                     <Progress value={progressPercentage} className="h-4"/>
                     <p className="text-center text-sm text-muted-foreground">
                        Selesaikan {quizzesNeededForNextPoint - (quizzesCompleted % quizzesNeededForNextPoint)} kuis lagi untuk mendapatkan {ROBUX_PER_QUIZ} poin berikutnya.
                    </p>
                </div>

                <div className="space-y-4">
                    <Label htmlFor="roblox-username" className="text-lg font-semibold">Username Roblox Kamu</Label>
                    <p className="text-sm text-muted-foreground">
                        Masukkan username Roblox kamu di sini agar admin dapat mengirimkan hadiah Robux.
                    </p>
                    <div className="flex items-center gap-2">
                        <Input
                            id="roblox-username"
                            placeholder="Masukkan username Roblox..."
                            value={robloxUsername}
                            onChange={(e) => setRobloxUsername(e.target.value)}
                        />
                        <Button onClick={handleSaveUsername} disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                            Simpan
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Bagaimana Cara Kerjanya?</AlertTitle>
                    <AlertDescription>
                        Setiap kali kamu menyelesaikan kuis dengan nilai di atas 60, kamu akan mendapatkan 0.01 Poin Bonus. Kumpulkan poin sebanyak-banyaknya! Admin akan memeriksa bonusmu secara berkala untuk mengirimkan Robux.
                    </AlertDescription>
                </Alert>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
