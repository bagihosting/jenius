import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { Header } from '@/components/Header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { examQuestions } from '@/lib/exam-questions';

export default function ExamPracticePage() {
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
                Latihan Soal Ujian
              </CardTitle>
              <p className="text-muted-foreground">
                Berikut adalah contoh soal ujian untuk membantumu berlatih. Klik mata pelajaran untuk melihat soalnya.
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {examQuestions.map((subject) => (
                  <AccordionItem value={subject.id} key={subject.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      {subject.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pl-2 pt-2">
                        {subject.questions.map((q, index) => (
                          <div key={index} className="border-l-2 border-primary/50 pl-4">
                            <p className="font-semibold mb-2">
                              {index + 1}. {q.question}
                            </p>
                            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                              {q.options.map((opt, i) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                            <p className="mt-2 text-sm">
                              <strong>Jawaban Benar:</strong>{' '}
                              <span className="text-primary font-bold">{q.correctAnswer}</span>
                            </p>
                          </div>
                        ))}
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
