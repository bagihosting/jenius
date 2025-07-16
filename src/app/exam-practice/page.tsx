
'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getSubjects, isValidSubject } from '@/lib/subjects';
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { ExamData, Subject, SchoolType, Grade, Semester } from '@/lib/types';
import { generateExamAction } from '../actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

type ExamState = 'idle' | 'loading' | 'success' | 'error';

interface SubjectExam {
  state: ExamState;
  data?: ExamData;
  error?: string;
}

const schoolTypeMap: { [key: string]: string } = {
  SDN: 'SD Negeri',
  SDIT: 'SD Islam Terpadu',
  MI: 'Madrasah Ibtidaiyah'
};

function renderMarkdownBold(text: string) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default function ExamPracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const grade = (searchParams.get('grade') as Grade) || '5';
  const semester = (searchParams.get('semester') as Semester) || '1';
  const schoolType = user?.schoolType;
  const userEmail = user?.email;

  const subjects = useMemo(() => {
      if (!schoolType) return [];
      return getSubjects(schoolType, grade, semester);
  }, [schoolType, grade, semester]);

  const [examData, setExamData] = useState<Record<string, SubjectExam>>({});

  const fetchExam = useCallback(async (subject: Subject) => {
    if (examData[subject.id]?.state === 'loading' || examData[subject.id]?.state === 'success' || !schoolType || !userEmail) {
      return;
    }
    
    // Validate if the subject is valid for the current context
    if (!isValidSubject(schoolType, grade, semester, subject.id)) {
        setExamData(prev => ({ ...prev, [subject.id]: { state: 'error', error: 'Mata pelajaran ini tidak tersedia untuk kelas/semester ini.' } }));
        return;
    }

    setExamData(prev => ({ ...prev, [subject.id]: { state: 'loading' } }));

    const dateSeed = new Date().toISOString().split('T')[0];
    const result = await generateExamAction({
      subjectContent: subject.content,
      dateSeed,
      schoolType,
      grade,
      semester,
      userEmail: userEmail,
    });

    if (result.error) {
      setExamData(prev => ({ ...prev, [subject.id]: { state: 'error', error: result.error } }));
    } else if (result.data) {
      setExamData(prev => ({ ...prev, [subject.id]: { state: 'success', data: result.data } }));
    }
  }, [examData, schoolType, grade, semester, userEmail]);

  if (loading || !isAuthenticated || !schoolType) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!grade || !semester) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Parameter Tidak Lengkap</CardTitle>
              <CardDescription>Silakan kembali ke halaman utama untuk memilih sekolah, kelas, dan semester.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2" />
                  Kembali ke Halaman Utama
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const schoolName = schoolTypeMap[schoolType] || 'Sekolah';
  const backLink = `/dashboard?grade=${grade}&semester=${semester}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href={backLink} className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft size={16} />
            Kembali ke dasbor
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-headline flex items-center gap-3">
                <Edit className="h-8 w-8 text-primary" />
                Latihan Soal Ujian Harian
              </CardTitle>
              <CardDescription>
                Untuk {schoolName} Kelas {grade} Semester {semester}. Soal dibuat baru oleh Ayah Jenius setiap hari!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" onValueChange={(value) => {
                if (value) {
                  const subject = subjects.find(s => s.id === value);
                  if (subject) fetchExam(subject);
                }
              }}>
                {subjects.map((subject) => (
                  <AccordionItem value={subject.id} key={subject.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline text-left">
                      {subject.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-8 pl-2 pt-2">
                        {examData[subject.id]?.state === 'loading' && (
                           <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-secondary">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="font-semibold text-lg">Ayah Jenius sedang menyiapkan soal harian...</p>
                            <p className="text-muted-foreground">Mohon tunggu sebentar.</p>
                          </div>
                        )}
                        {examData[subject.id]?.state === 'error' && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Gagal Membuat Soal</AlertTitle>
                            <AlertDescription>
                              {examData[subject.id]?.error}
                            </AlertDescription>
                          </Alert>
                        )}
                        {examData[subject.id]?.state === 'success' && (
                          <>
                            <div>
                              <h3 className="text-md font-bold mb-4 text-primary">I. Soal Pilihan Ganda</h3>
                              <ol className="space-y-6 list-decimal list-inside">
                                {examData[subject.id]?.data?.multipleChoice.map((q, index) => (
                                  <li key={index} className="pl-2 border-l-2 border-primary/50">
                                    <p className="font-semibold mb-2 inline">
                                      {q.question}
                                    </p>
                                    <ul className="space-y-1 text-muted-foreground list-alpha list-inside pl-4 mt-2">
                                      {q.options.map((opt, i) => (
                                        <li key={i}>{opt}</li>
                                      ))}
                                    </ul>
                                    <div className="mt-3 space-y-2">
                                      <Badge variant="secondary">Jawaban Benar: {q.correctAnswer}</Badge>
                                       <div className="p-3 bg-primary/10 rounded-md border border-primary/20 text-sm">
                                          <p className="font-bold flex items-center gap-1.5 text-primary/80"><Sparkles size={14}/> Penjelasan Jenius</p>
                                          <p className="text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: renderMarkdownBold(q.explanation) }}></p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                            <div>
                              <Separator className="my-8" />
                              <h3 className="text-md font-bold mb-4 text-primary">II. Soal Esai</h3>
                              <ol className="space-y-6 list-decimal list-inside">
                                {examData[subject.id]?.data?.essay.map((q, index) => (
                                  <li key={index} className="pl-2 border-l-2 border-primary/50">
                                    <p className="font-semibold mb-2 inline">
                                      {q.question}
                                    </p>
                                    <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert mt-2"
                                      dangerouslySetInnerHTML={{ __html: q.answer.replace(/\n/g, '<br />') }}
                                    >
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Helper CSS in case prose doesn't have it
const listAlpha = `
.list-alpha { 
  list-style-type: lower-alpha;
}
`;

if (typeof window !== 'undefined') {
  let styleSheet = document.querySelector('#list-alpha-style');
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = "list-alpha-style";
    styleSheet.innerText = listAlpha;
    document.head.appendChild(styleSheet);
  }
}
