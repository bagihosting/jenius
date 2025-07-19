
'use client';

import { notFound, useSearchParams, useParams, useRouter } from 'next/navigation';
import { getSubjectById } from '@/lib/subjects';
import { Header } from '@/components/Header';
import { SubjectDetails } from '@/components/SubjectDetails';
import type { Grade, Semester } from '@/lib/types';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function SubjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const grade = searchParams.get('grade') as Grade | null;
  const semester = searchParams.get('semester') as Semester | null;
  const subjectId = params.subjectId as string;
  const schoolType = user?.schoolType;
  
  const subject = useMemo(() => {
    if (schoolType && grade && semester && subjectId) {
      return getSubjectById(schoolType, grade, semester, subjectId);
    }
    return null;
  }, [schoolType, grade, semester, subjectId]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </main>
      </div>
    );
  }
  
  // This check is crucial. It ensures all required data is present before rendering.
  // It also handles the case where the subject might not be found.
  if (!schoolType || !grade || !semester || !subject) {
    return notFound();
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
