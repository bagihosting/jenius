
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Gem, CalendarCheck, Clock, PartyPopper } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Grade, Semester } from '@/lib/types';
import { claimDailyBonusAction } from '@/app/actions';
import { Confetti } from '@/components/Confetti';

type ClaimStatus = 'loading' | 'ready' | 'cooldown' | 'claimed';

function formatCountdown(milliseconds: number): string {
    if (milliseconds <= 0) return "00:00:00";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function DailyClaimPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('loading');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [awardedBonus, setAwardedBonus] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  const grade = searchParams.get('grade') as Grade;
  const semester = searchParams.get('semester');
  const backlink = `/dashboard?grade=${grade}&semester=${semester}`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkClaimStatus = useCallback((lastClaimTime?: number | null) => {
    const lastClaimedAt = lastClaimTime;
    if (lastClaimedAt === undefined) return; // Still waiting for user data

    if (!lastClaimedAt) {
      setClaimStatus('ready');
      return;
    }
    
    // 23 hour cooldown
    const nextClaimTime = lastClaimedAt + 23 * 60 * 60 * 1000;
    const now = Date.now();

    if (now >= nextClaimTime) {
      setClaimStatus('ready');
    } else {
      setClaimStatus('cooldown');
      const interval = setInterval(() => {
        const remainingTime = nextClaimTime - Date.now();
        if (remainingTime <= 0) {
          setCountdown("00:00:00");
          setClaimStatus('ready');
          clearInterval(interval);
        } else {
          setCountdown(formatCountdown(remainingTime));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (isClient && !loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, loading, isAuthenticated, router]);


  useEffect(() => {
    if (user) {
      // Pass the timestamp (as a number) to the check function
      const lastClaimTimestamp = user.lastClaimedAt ? new Date(user.lastClaimedAt).getTime() : null;
      checkClaimStatus(lastClaimTimestamp);
    }
  }, [user, checkClaimStatus]);

  const handleClaim = async () => {
    if (!user || claimStatus !== 'ready') return;

    setIsSubmitting(true);
    const result = await claimDailyBonusAction(user.uid);
    setIsSubmitting(false);

    if (result.success && result.bonus) {
      toast({
        title: "Klaim Berhasil!",
        description: `Kamu mendapatkan ${result.bonus.toFixed(4)} poin bonus!`,
      });
      setClaimStatus('claimed');
      setAwardedBonus(result.bonus);
      // Manually update user context to reflect new points and claim time
      // This provides instant UI feedback while waiting for DB to sync
      const updatedBonus = (user.bonusPoints || 0) + result.bonus;
      const updatedClaimTime = new Date().toISOString();
      updateUser({ bonusPoints: updatedBonus, lastClaimedAt: updatedClaimTime });
    } else {
      toast({
        title: "Gagal Mengklaim",
        description: result.error || "Terjadi kesalahan. Coba lagi nanti.",
        variant: "destructive",
      });
      if (result.nextClaim) {
          checkClaimStatus(result.nextClaim); // Re-check status if server provides cooldown info
      }
    }
  };

  if (!isClient || loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (claimStatus) {
      case 'loading':
        return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
      
      case 'claimed':
        return (
          <div className="text-center space-y-4 relative">
             <Confetti />
             <PartyPopper className="w-24 h-24 text-accent mx-auto" />
             <h2 className="text-2xl font-bold">Klaim Berhasil!</h2>
             <p className="text-muted-foreground">Kamu mendapatkan</p>
             <p className="text-5xl font-bold text-primary">{awardedBonus?.toFixed(4)}</p>
             <p className="text-muted-foreground">Poin Bonus!</p>
             <Button onClick={() => checkClaimStatus(Date.now())}>Selesai</Button>
          </div>
        );

      case 'cooldown':
        return (
          <div className="text-center space-y-4">
            <Clock className="w-24 h-24 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-bold">Bonus Harian Berikutnya</h2>
            <p className="text-5xl font-mono font-bold text-primary tabular-nums">
                {countdown}
            </p>
            <p className="text-muted-foreground">Kembalilah lagi setelah waktu habis untuk mengklaim bonus harianmu!</p>
          </div>
        );

      case 'ready':
        return (
          <div className="text-center space-y-4">
            <CalendarCheck className="w-24 h-24 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Bonus Harian Siap Diklaim!</h2>
            <p className="text-muted-foreground">Tekan tombol di bawah untuk mendapatkan poin bonus gratis hari ini.</p>
            <Button size="lg" className="w-full text-lg h-14" onClick={handleClaim} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Klaim Bonus Sekarang"}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link href={backlink} className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft size={16} />
            Kembali ke dasbor
          </Link>
          <Card className="bg-gradient-to-br from-card to-secondary/30">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Gem className="h-12 w-12 text-primary"/>
              </div>
              <CardTitle className="text-3xl font-headline">Bonus Harian</CardTitle>
              <CardDescription>Klaim bonus poin gratis setiap hari untuk mempercepat progresmu!</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[250px]">
                {renderContent()}
            </CardContent>
            <CardFooter>
                 <Alert>
                    <Gem className="h-4 w-4" />
                    <AlertTitle>Bagaimana Cara Kerjanya?</AlertTitle>
                    <AlertDescription>
                        Setiap 23 jam, kamu bisa kembali ke halaman ini untuk mengklaim bonus poin acak. Semakin rajin kamu mengklaim, semakin cepat poin terkumpul!
                    </AlertDescription>
                 </Alert>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
