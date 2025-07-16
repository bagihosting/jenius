'use client';

import Link from 'next/link';
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
import { subjects } from '@/lib/subjects';
import { useState, useCallback } from 'react';
import type { ExamData, Subject } from '@/lib/types';
import { generateExamAction } from '../actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type ExamState = 'idle' | 'loading' | 'success' | 'error';

interface SubjectExam {
  state: ExamState;
  data?: ExamData;
  error?: string;
}

export default function ExamPracticePage() {
  const [examData, setExamData] = useState<Record<string, SubjectExam>>({});

  const fetchExam = useCallback(async (subject: Subject) => {
    // Don't refetch if already loading or successful
    if (examData[subject.id]?.state === 'loading' || examData[subject.id]?.state === 'success') {
      return;
    }

    setExamData(prev => ({
      ...prev,
      [subject.id]: { state: 'loading' }
    }));

    const result = await generateExamAction(subject.content);

    if (result.error) {
      setExamData(prev => ({
        ...prev,
        [subject.id]: { state: 'error', error: result.error }
      }));
    } else if (result.data) {
      setExamData(prev => ({
        ...prev,
        [subject.id]: { state: 'success', data: result.data }
      }));
    }
  }, [examData]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft size={16} />
            Kembali ke halaman utama
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-headline flex items-center gap-3">
                <Edit className="h-8 w-8 text-primary" />
                Latihan Soal Ujian Harian
              </CardTitle>
              <CardDescription>
                Soal-soal ini dibuat baru oleh Ayah Tirta setiap hari! Klik mata pelajaran untuk mulai berlatih.
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
                            <p className="font-semibold text-lg">Ayah Tirta sedang menyiapkan soal harian...</p>
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
                                          <p className="text-muted-foreground mt-1">{q.explanation}</p>
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

// Injecting the style into the head
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = listAlpha;
    document.head.appendChild(styleSheet);
}
