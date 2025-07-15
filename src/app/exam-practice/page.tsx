import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { Header } from '@/components/Header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { examQuestions } from '@/lib/exam-questions';
import { Separator } from '@/components/ui/separator';

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
              <CardDescription>
                Berikut adalah contoh soal ujian untuk membantumu berlatih. Klik mata pelajaran untuk melihat soalnya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {examQuestions.map((subject) => (
                  <AccordionItem value={subject.id} key={subject.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline text-left">
                      {subject.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-8 pl-2 pt-2">
                        {subject.multipleChoice.length > 0 && (
                          <div>
                            <h3 className="text-md font-bold mb-4 text-primary">I. Soal Pilihan Ganda</h3>
                            <ol className="space-y-6 list-decimal list-inside">
                              {subject.multipleChoice.map((q, index) => (
                                <li key={index} className="pl-2 border-l-2 border-primary/50">
                                  <p className="font-semibold mb-2 inline">
                                    {q.question}
                                  </p>
                                  <ul className="space-y-1 text-muted-foreground list-alpha list-inside pl-4 mt-2">
                                    {q.options.map((opt, i) => (
                                      <li key={i}>{opt}</li>
                                    ))}
                                  </ul>
                                  <p className="mt-2 text-sm">
                                    <strong>Jawaban Benar:</strong>{' '}
                                    <span className="text-primary font-bold">{q.correctAnswer}</span>
                                  </p>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                        
                        {subject.essay.length > 0 && (
                           <div>
                             <Separator className="my-8" />
                            <h3 className="text-md font-bold mb-4 text-primary">II. Soal Esai</h3>
                            <ol className="space-y-6 list-decimal list-inside">
                              {subject.essay.map((q, index) => (
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
