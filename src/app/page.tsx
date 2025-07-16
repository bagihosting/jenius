'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

const schoolTypes = [
  { id: 'SDN', name: 'SD Negeri' },
  { id: 'SDIT', name: 'SD Islam Terpadu' },
  { id: 'MI', name: 'Madrasah Ibtidaiyah (MI)' },
];

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

export default function Home() {
  const router = useRouter();
  const [schoolType, setSchoolType] = useState('');
  const [grade, setGrade] = useState('');
  const [semester, setSemester] = useState('');

  const handleStartLearning = () => {
    if (schoolType && grade && semester) {
      router.push(`/belajar?school=${schoolType}&grade=${grade}&semester=${semester}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Selamat Datang di Ayah Jenius!</CardTitle>
            <CardDescription className="text-lg">Platform belajar cerdas untuk siswa SD & MI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="school-type" className="text-base">Pilih Jenis Sekolah</Label>
                <Select value={schoolType} onValueChange={setSchoolType}>
                  <SelectTrigger id="school-type" className="w-full text-base h-12">
                    <SelectValue placeholder="Pilih sekolah..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-base">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                disabled={!schoolType || !grade || !semester}
                onClick={handleStartLearning}
              >
                Mulai Belajar
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © 2024 Ayah Jenius. Dirancang untuk semua siswa cerdas.
      </footer>
    </div>
  );
}
