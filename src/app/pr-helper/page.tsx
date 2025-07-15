'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { subjects } from '@/lib/subjects';
import { homeworkHelperAction } from '@/app/actions';
import type { HomeworkHelpInput } from '@/ai/flows/homework-helper-flow';

type PrHelperState = 'idle' | 'loading' | 'answered';

export default function PrHelperPage() {
  const [state, setState] = useState<PrHelperState>('idle');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !question) {
      toast({
        title: 'Form Belum Lengkap',
        description: 'Silakan pilih mata pelajaran dan isi pertanyaanmu.',
        variant: 'destructive',
      });
      return;
    }

    setState('loading');
    const input: HomeworkHelpInput = { subject, question };
    const result = await homeworkHelperAction(input);

    if (result.error) {
      toast({
        title: 'Gagal Mendapatkan Jawaban',
        description: result.error,
        variant: 'destructive',
      });
      setState('idle');
    } else if (result.data) {
      setAnswer(result.data.answer);
      setState('answered');
    }
  };

  const handleReset = () => {
    setSubject('');
    setQuestion('');
    setAnswer('');
    setState('idle');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft size={16} />
            Kembali ke halaman utama
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Bantuan PR Cerdas</CardTitle>
              <CardDescription>Punya PR yang sulit? Tanyakan di sini dan biarkan Ayah Tirta membantu menjelaskan!</CardDescription>
            </CardHeader>
            <CardContent>
              {state === 'idle' || state === 'loading' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Pilih Mata Pelajaran</Label>
                    <Select value={subject} onValueChange={setSubject} required>
                      <SelectTrigger id="subject" className="w-full">
                        <SelectValue placeholder="Pilih mapel..." />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s.id} value={s.title}>
                            {s.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question">Tulis Pertanyaanmu</Label>
                    <Textarea
                      id="question"
                      placeholder="Contoh: Apa yang dimaksud dengan rantai makanan?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>
                  <div className="text-right">
                    <Button type="submit" disabled={state === 'loading'}>
                      {state === 'loading' ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" />
                          Tanyakan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Pertanyaanmu:</h3>
                        <div className="p-4 bg-muted rounded-md border">
                            <p className="font-bold text-sm text-muted-foreground">{subject}</p>
                            <p>{question}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Penjelasan dari Ayah Tirta:</h3>
                        <div className="p-4 bg-primary/10 rounded-md border border-primary/20 prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br />') }}
                        />
                    </div>
                  <div className="text-right">
                    <Button onClick={handleReset}>Tanya Lagi</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
