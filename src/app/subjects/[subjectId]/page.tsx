'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { getSubjectById } from '@/lib/subjects';
import { Header } from '@/components/Header';
import { SubjectDetails } from '@/components/SubjectDetails';
import type { Subject, SchoolType, Grade, Semester } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const searchParams = useSearchParams();
  const schoolType = searchParams.get('school') as SchoolType;
  const grade = searchParams.get('grade') as Grade;
  const semester = searchParams.get('semester') as Semester;
  
  const [subject, setSubject] = useState<Subject | null | undefined>(undefined);

  useEffect(() => {
    if (schoolType && grade && semester) {
      const foundSubject = getSubjectById(schoolType, grade, semester, params.subjectId);
      setSubject(foundSubject);
    }
  }, [schoolType, grade, semester, params.subjectId]);


  if (subject === undefined) {
    // Still loading
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 md:p-8">
            <p>Loading...</p>
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
