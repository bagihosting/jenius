
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const gradeLevels = [
  { id: '1', name: 'Kelas 1' },
  { id: '2', name: 'Kelas 2' },
  { id: '3', name: 'Kelas 3' },
  { id: '4', name: 'Kelas 4' },
  { id: '5', name: 'Kelas 5' },
  { id: '6', name: 'Kelas 6' },
];

const semesters = [
    { id: '1', name: 'Semester 1' },
    { id: '2', name: 'Semester 2' },
]

function BelajarSelection() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [grade, setGrade] = useState('');
  const [semester, setSemester] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && isClient && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router, isClient]);


  const handleStartLearning = () => {
    if (user?.schoolType && grade && semester) {
      router.push(`/dashboard?grade=${grade}&semester=${semester}`);
    }
  };

  if (!isClient || loading || !isAuthenticated || !user) {
    return (
        <div className="flex-grow flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </div>
    )
  }

  const schoolName = user.schoolName || 'Sekolah Anda';

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
              Pilih kelas dan semester untuk memulai.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="grade-level" className="text-base">Pilih Kelas</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger id="grade-level" className="w-full text-base h-12">
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
