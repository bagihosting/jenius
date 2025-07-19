
'use client';

import { notFound, useSearchParams, useParams, useRouter } from 'next/navigation';
import { getSubjectById } from '@/lib/subjects';
import { Header } from '@/components/Header';
import { SubjectDetails } from '@/components/SubjectDetails';
import type { Subject, SchoolType, Grade, Semester } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
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

  const grade = searchParams.get('grade') as Grade;
  const semester = searchParams.get('semester') as Semester;
  const subjectId = params.subjectId as string;
  
  const subject = useMemo(() => {
    if (user?.schoolType && grade && semester && subjectId) {
      return getSubjectById(user.schoolType, grade, semester, subjectId);
    }
    return null;
  }, [user?.schoolType, grade, semester, subjectId]);

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
  if (!user.schoolType || !grade || !semester || !subject) {
    // You could show a "Not Found" or redirect. For now, a loader is fine
    // as the state will resolve shortly. A notFound() call might be too abrupt.
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <SubjectDetails subject={subject} schoolInfo={{ schoolType: user.schoolType, grade, semester }} />
      </main>
    </div>
  );
}
