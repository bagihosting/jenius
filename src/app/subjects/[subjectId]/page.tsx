
'use client';

import { notFound, useSearchParams, useParams, useRouter } from 'next/navigation';
import { getSubjectById } from '@/lib/subjects';
import { Header } from '@/components/Header';
import { SubjectDetails } from '@/components/SubjectDetails';
import type { Subject, SchoolType, Grade, Semester } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function SubjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { user, loading, isAuthenticated } = useAuth();

  const grade = searchParams.get('grade') as Grade;
  const semester = searchParams.get('semester') as Semester;
  const subjectId = params.subjectId as string;
  const schoolType = user?.schoolType;
  
  const [subject, setSubject] = useState<Subject | null | undefined>(undefined);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (schoolType && grade && semester) {
      const foundSubject = getSubjectById(schoolType, grade, semester, subjectId);
      setSubject(foundSubject);
    }
  }, [schoolType, grade, semester, subjectId]);


  if (loading || subject === undefined || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </main>
      </div>
    );
  }

  if (!subject) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <SubjectDetails subject={subject} schoolInfo={{ schoolType, grade, semester }} />
      </main>
    </div>
  );
}
