
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight, Lock } from 'lucide-react';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import type { Grade } from '@/lib/types';

const gradeLevels = [
  { id: '1', name: 'Kelas 1 SD/MI' },
  { id: '2', name: 'Kelas 2 SD/MI' },
  { id: '3', name: 'Kelas 3 SD/MI' },
  { id: '4', name: 'Kelas 4 SD/MI' },
  { id: '5', name: 'Kelas 5 SD/MI' },
  { id: '6', name: 'Kelas 6 SD/MI' },
  { id: '7', name: 'Kelas 7 SMP/MTs' },
  { id: '8', name: 'Kelas 8 SMP/MTs' },
  { id: '9', name: 'Kelas 9 SMP/MTs' },
  { id: '10', name: 'Kelas 10 SMA/MA' },
  { id: '11', name: 'Kelas 11 SMA/MA' },
  { id: '12', name: 'Kelas 12 SMA/MA' },
];

const semesters = [
    { id: '1', name: 'Semester 1' },
    { id: '2', name: 'Semester 2' },
]

function BelajarSelection() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const [grade, setGrade] = useState<Grade | ''>('');
  const [semester, setSemester] = useState('');
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user?.grade) {
        setGrade(user.grade);
    }
  }, [user, loading, router]);


  const handleStartLearning = () => {
    if (!user || !grade || !semester) return;
    
    // Save grade if it's the first time
    if (!user.grade) {
      updateUser({ grade: grade as Grade });
    }

    router.push(`/dashboard?grade=${grade}&semester=${semester}`);
  };

  if (loading || !user) {
    return (
        <div className="flex-grow flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </div>
    )
  }

  const schoolName = user.schoolName || 'Sekolah Anda';
  const isGradeLocked = !!user.grade;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Pilih Kelas & Semester</CardTitle>
            <CardDescription className="text-lg">
              Kamu terdaftar di <span className="font-bold text-primary">{schoolName}</span>.
              <br/>
              {isGradeLocked ? 'Pilih semester untuk memulai.' : 'Pilih kelas dan semester untuk memulai.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="grade-level" className="text-base flex items-center gap-2">
                    Pilih Kelas
                    {isGradeLocked && <span className="text-xs text-muted-foreground">(Kelas terkunci setelah pilihan pertama)</span>}
                </Label>
                <Select value={grade} onValueChange={(val) => setGrade(val as Grade)} disabled={isGradeLocked}>
                  <SelectTrigger id="grade-level" className="w-full text-base h-12">
                    {isGradeLocked && <Lock className="mr-2 h-4 w-4" />}
                    <SelectValue placeholder="Pilih kelas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeLevels.map((g) => (
                      <SelectItem key={g.id} value={g.id} className="text-base">
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="semester" className="text-base">Pilih Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger id="semester" className="w-full text-base h-12">
                    <SelectValue placeholder="Pilih semester..." />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-base">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="lg"
                className="w-full h-12 text-lg"
                disabled={!grade || !semester}
                onClick={handleStartLearning}
              >
                Lanjutkan ke Dasbor
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Ayah Jenius. All rights reserved.
      </footer>
    </div>
  );
}


export default function BelajarPage() {
    return (
        <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary"/></div>}>
            <BelajarSelection />
        </Suspense>
    )
}
