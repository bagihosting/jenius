
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Gift, Info } from 'lucide-react';
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
import { getBadgeInfo } from '@/lib/badgeService';

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
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (isClient && !loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isClient, loading, isAuthenticated, router]);
  
   useEffect(() => {
     if (isClient && user && parseInt(user.grade || '0', 10) > 6) {
        toast({
            title: 'Fitur Tidak Tersedia',
            description: 'Fitur bonus Robux hanya untuk siswa kelas 1-6.',
            variant: 'destructive'
        });
        router.push(backlink);
    }
   }, [isClient, user, backlink, router, toast]);

  useEffect(() => {
    if (user) {
        setRobloxUsername(user.robloxUsername || '');
    }
  }, [user]);

  const handleSaveUsername = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        await updateUser({ robloxUsername: robloxUsername });
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

  if (!isClient || loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const badgeInfo = getBadgeInfo(user);
  const nextBadge = badgeInfo.level < 5 ? getBadgeInfo({ ...user, quizCompletions: badgeInfo.minQuizzes }) : null;
  const progressToNextBadge = nextBadge ? ((user.quizCompletions || 0) / nextBadge.minQuizzes) * 100 : 100;

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
              <CardTitle className="text-3xl font-headline">Kumpulkan Poin, Dapatkan Robux!</CardTitle>
              <CardDescription>Selesaikan kuis untuk mendapatkan Poin Bonus dan tukarkan dengan Robux.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="text-center">
                    <Label>Total Poin Bonus Kamu</Label>
                    <p className="text-5xl font-bold text-primary">{user.bonusPoints?.toFixed(4) || '0.0000'}</p>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Lencana & Bonus Kamu</h3>
                     <div className="text-center p-4 bg-secondary rounded-lg">
                        <p className="text-sm text-muted-foreground">Lencanamu saat ini:</p>
                        <p className="text-2xl font-bold text-accent-foreground">{badgeInfo.name}</p>
                         <p className="text-sm text-muted-foreground mt-2">Bonus per kuis (nilai > 60): <span className="font-bold">{badgeInfo.bonusPerQuiz.toFixed(4)} Poin</span></p>
                    </div>

                    {nextBadge && (
                         <div className="space-y-2">
                            <p className="text-center text-sm text-muted-foreground">
                                Selesaikan {nextBadge.minQuizzes - (user.quizCompletions || 0)} kuis lagi untuk mencapai lencana <span className="font-bold">{nextBadge.name}</span>!
                            </p>
                            <Progress value={progressToNextBadge} />
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <Label htmlFor="roblox-username">Username Roblox</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="roblox-username" 
                            placeholder="Masukkan username Roblox kamu"
                            value={robloxUsername}
                            onChange={(e) => setRobloxUsername(e.target.value)}
                        />
                        <Button onClick={handleSaveUsername} disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Bagaimana Cara Kerjanya?</AlertTitle>
                    <AlertDescription>
                        Kumpulkan poin dan tukarkan dengan Robux. Proses penukaran akan diinformasikan di sini jika poin sudah mencukupi. Pastikan username Roblox kamu sudah benar!
                    </Aler