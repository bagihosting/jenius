
'use client';

import Link from 'next/link';
import { ArrowLeft, BookText, Download } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import type { Subject, SchoolInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { QuizView } from '@/components/QuizView';

export function SubjectDetails({ subject, schoolInfo }: { subject: Subject, schoolInfo: SchoolInfo }) {
  const Icon = getIcon(subject.icon);
  const backlink = `/dashboard?grade=${schoolInfo.grade}&semester=${schoolInfo.semester}`;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href={backlink} className="flex items-center gap-2 text-primary hover:underline mb-4">
        <ArrowLeft size={16} />
        Kembali ke dasbor
      </Link>
      <div className="bg-card p-6 md:p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="bg-primary/20 p-3 rounded-full">
            <Icon className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-gray-800 dark:text-gray-200">{subject.title}</h1>
            <p className="text-muted-foreground mt-1">Materi belajar untuk Kelas {schoolInfo.grade} - Semester {schoolInfo.semester}</p>
          </div>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <h2 className="flex items-center gap-2 font-headline"><BookText size={20} />Materi Pelajaran</h2>
          <p>{subject.content}</p>
        </div>
        
        <div className="text-center my-6">
          <Button variant="secondary" disabled>
            <Download className="mr-2 h-4 w-4" />
            Download Materi (Segera Hadir)
          </Button>
        </div>

        <QuizView 
          subjectId={subject.id} 
          subjectContent={subject.content}
          schoolInfo={schoolInfo} 
        />

      </div>
    </div>
  );
}
