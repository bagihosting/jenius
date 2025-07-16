
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Send, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getSubjects } from '@/lib/subjects';
import { homeworkHelperAction } from '@/app/actions';
import type { HomeworkHelpInput, HomeworkHelpOutput } from '@/ai/flows/homework-helper-flow';
import type { SchoolType, Grade, Semester } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

type PrHelperState = 'idle' | 'loading' | 'answered';

export default function PrHelperPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();

  const grade = (searchParams.get('grade') as Grade) || '5';
  const semester = (searchParams.get('semester') as Semester) || '1';
  const schoolType = user?.schoolType;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const subjects = useMemo(() => {
    if (!schoolType || !grade || !semester) return [];
    return getSubjects(schoolType, grade, semester);
  }, [schoolType, grade, semester]);

  const [state, setState] = useState<PrHelperState>('idle');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<HomeworkHelpOutput | null>(null);
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
    if (!schoolType) return;

    setState('loading');
    const input: HomeworkHelpInput = { subject, question, schoolType, grade, semester };
    const response = await homeworkHelperAction(input);

    if (response.error) {
      toast({
        title: 'Gagal Mendapatkan Jawaban',
        description: response.error,
        variant: 'destructive',
      });
      setState('idle');
    } else if (response.data) {
      setResult(response.data);
      setState('answered');
    }
  };

  const handleReset = () => {
    setSubject('');
    setQuestion('');
    setResult(null);
    setState('idle');
  };
  
  const backlink = `/dashboard?grade=${grade}&semester=${semester}`;

  if (!isClient || loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link href={backlink} className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft size={16} />
            Kembali ke dasbor
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Bantuan PR Cerdas</CardTitle>
              <CardDescription>Punya PR yang sulit? Tanyakan di sini dan biarkan Ayah Jenius membantu menjelaskan!</CardDescription>
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
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Penjelasan dari Ayah Jenius:</h3>
                         {result?.imageUrl && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                <Image
                                    src={result.imageUrl}
                                    alt="Ilustrasi untuk jawaban PR"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                        )}
                        <div className="p-4 bg-primary/10 rounded-md border border-primary/20 prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: result?.answer.replace(/\n/g, '<br />') || '' }}
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
