'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { SubjectCard } from '@/components/SubjectCard';
import { getSubjects } from '@/lib/subjects';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lightbulb, Edit, ArrowLeft } from 'lucide-react';
import type { SchoolType, Grade, Semester } from '@/lib/types';

const schoolTypeMap: { [key: string]: string } = {
  SDN: 'SD Negeri',
  SDIT: 'SD Islam Terpadu',
  MI: 'Madrasah Ibtidaiyah'
};

function BelajarDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const schoolType = searchParams.get('school') as SchoolType;
  const grade = searchParams.get('grade') as Grade;
  const semester = searchParams.get('semester') as Semester;

  if (!schoolType || !grade || !semester || !Object.keys(schoolTypeMap).includes(schoolType) || !['1', '2'].includes(semester)) {
    redirect('/');
  }

  const subjects = getSubjects(schoolType, grade, semester);
  const schoolName = schoolTypeMap[schoolType] || 'Sekolah';

  const prHelperLink = `/pr-helper?school=${schoolType}&grade=${grade}&semester=${semester}`;
  const examPracticeLink = `/exam-practice?school=${schoolType}&grade=${grade}&semester=${semester}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
             <ArrowLeft className="mr-2"/> Kembali ke pemilihan
          </Button>

          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline text-gray-800 dark:text-gray-200">
              Dasbor Belajar
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
              {schoolName} - Kelas {grade} - Semester {semester}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={prHelperLink}>
                <Lightbulb className="mr-2" />
                Bantuan PR Cerdas
              </Link>
            </Button>
             <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href={examPracticeLink}>
                <Edit className="mr-2" />
                Latihan Soal Ujian
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} schoolInfo={{ schoolType, grade, semester }}/>
            ))}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        © 2024 Ayah Jenius. All rights reserved.
      </footer>
    </div>
  );
}

export default function BelajarPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BelajarDashboard />
        </Suspense>
    )
}
