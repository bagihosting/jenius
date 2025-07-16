
'use client';

import { useState } from 'react';
import { generateQuizAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BrainCircuit, PartyPopper, RotateCw, CheckCircle2, XCircle } from 'lucide-react';
import type { QuizData, SchoolInfo } from '@/lib/types';
import { Progress } from './ui/progress';
import { useProgress } from '@/hooks/use-progress';
import { Confetti } from './Confetti';
import { useAuth } from '@/context/AuthContext';

type QuizState = 'idle' | 'loading' | 'active' | 'finished';

const ROBUX_PER_QUIZ = 0.01;

interface QuizViewProps {
  subjectId: string;
  subjectContent: string;
  schoolInfo: SchoolInfo;
}

export function QuizView({ subjectId, subjectContent, schoolInfo }: QuizViewProps) {
  const { user } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const { updateSubjectProgress } = useProgress();

  const handleStartQuiz = async () => {
    if (!user?.email) {
      toast({
        title: 'Gagal Memulai Kuis',
        description: 'Tidak dapat mengidentifikasi pengguna. Silakan coba masuk kembali.',
        variant: 'destructive',
      });
      return;
    }

    setQuizState('loading');
    const dateSeed = new Date().toISOString().split('T')[0];
    
    const result = await generateQuizAction({
      subjectContent,
      numberOfQuestions: 5,
      schoolType: schoolInfo.schoolType,
      grade: schoolInfo.grade,
      semester: schoolInfo.semester,
      userEmail: user.email,
      dateSeed: dateSeed,
    });

    if (result.error) {
      toast({
        title: 'Gagal Membuat Kuis',
        description: result.error,
        variant: 'destructive',
      });
      setQuizState('idle');
    } else if (result.data) {
      setQuiz(result.data);
      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(result.data.quiz.length).fill(''));
      setScore(0);
      setQuizState('active');
    }
  };
  
  const handleSelectAnswer = (value: string) => {
    setUserAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = value;
        return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz!.quiz.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        handleSubmitQuiz();
    }
  };

  const updateBonus = () => {
    if (typeof window === 'undefined' || !user) return false;
    const bonusStatus = localStorage.getItem('bonus_feature_status');
    if (bonusStatus !== 'active') return false;

    const bonusKey = `bonus_points_${user.email}`;
    try {
        const currentBonus = parseFloat(localStorage.getItem(bonusKey) || '0');
        const newBonus = currentBonus + ROBUX_PER_QUIZ;
        localStorage.setItem(bonusKey, newBonus.toFixed(4));
        return true;
    } catch(e) {
        console.error("Failed to update bonus points", e);
        return false;
    }
  };

  const handleSubmitQuiz = () => {
    let finalScore = 0;
    quiz?.quiz.forEach((q, index) => {
      if(q.correctAnswer === userAnswers[index]) {
        finalScore++;
      }
    });
    const percentageScore = Math.round((finalScore / quiz!.quiz.length) * 100);
    setScore(percentageScore);
    updateSubjectProgress(subjectId, percentageScore);
    
    if (percentageScore >= 60) {
        const bonusGiven = updateBonus();
        if(bonusGiven) {
            toast({
                title: 'Bonus Didapatkan!',
                description: `Selamat! Kamu mendapatkan ${ROBUX_PER_QUIZ} Poin Bonus karena nilaimu di atas 60!`,
            });
        }
    }

    setQuizState('finished');
  }

  const currentQuestion = quiz?.quiz[currentQuestionIndex];

  if (quizState === 'idle') {
    return (
        <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <BrainCircuit className="text-primary"/>
                    Uji Pemahamanmu!
                </CardTitle>
                <CardDescription>Buat kuis acak dengan Ayah Jenius untuk menguji pengetahuanmu tentang materi ini.</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button onClick={handleStartQuiz}>
                    Mulai Kuis
                </Button>
            </CardFooter>
        </Card>
    );
  }

  if (quizState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-secondary">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="font-semibold text-lg">Ayah Jenius sedang menyiapkan kuis...</p>
        <p className="text-muted-foreground">Mohon tunggu sebentar.</p>
      </div>
    );
  }

  if (quizState === 'active' && currentQuestion) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Kuis: Pertanyaan {currentQuestionIndex + 1}/{quiz!.quiz.length}</CardTitle>
                <Progress value={((currentQuestionIndex + 1) / quiz!.quiz.length) * 100} className="mt-2" />
                <CardDescription className="pt-4 text-lg text-foreground">{currentQuestion.question}</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup value={userAnswers[currentQuestionIndex]} onValueChange={handleSelectAnswer} className="gap-4">
                    {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                           <RadioGroupItem value={option} id={`option-${index}`} />
                           <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">{option}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleNextQuestion} disabled={!userAnswers[currentQuestionIndex]}>
                    {currentQuestionIndex < quiz!.quiz.length - 1 ? 'Lanjut' : 'Selesai & Lihat Hasil'}
                </Button>
            </CardFooter>
        </Card>
    );
  }

  if (quizState === 'finished') {
    return (
        <Card className="text-center relative overflow-hidden">
            {score >= 80 && <Confetti />}
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Kuis Selesai!</CardTitle>
                <div className="flex justify-center my-4">
                    <PartyPopper className="w-16 h-16 text-accent"/>
                </div>
                <CardDescription className="text-lg">Skor Akhir Kamu</CardDescription>
                <p className="text-5xl font-bold text-primary">{score}</p>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Berikut adalah ringkasan jawabanmu:</p>
                 <div className="text-left space-y-4 max-h-60 overflow-y-auto p-2 rounded-md bg-secondary/50">
                    {quiz?.quiz.map((q, index) => (
                        <div key={index} className="border-b pb-2">
                            <p className="font-semibold">{index + 1}. {q.question}</p>
                            <div className="flex items-center gap-2 mt-1">
                                {userAnswers[index] === q.correctAnswer ? (
                                    <CheckCircle2 className="text-green-500 w-4 h-4 shrink-0" />
                                ) : (
                                    <XCircle className="text-red-500 w-4 h-4 shrink-0" />
                                )}
                                <p className={userAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                                    Jawabanmu: {userAnswers[index] || "Tidak dijawab"}
                                </p>
                            </div>
                            {userAnswers[index] !== q.correctAnswer && (
                                <p className="text-sm text-blue-600">Jawaban benar: {q.correctAnswer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={handleStartQuiz}>
                    <RotateCw className="mr-2 h-4 w-4"/>
                    Ulangi Kuis
                </Button>
            </CardFooter>
        </Card>
    );
  }

  return null;
}
