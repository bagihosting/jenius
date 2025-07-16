'use server';

import { generateQuiz as generateQuizFlow } from '@/ai/flows/generate-quiz';
import { answerHomework as answerHomeworkFlow } from '@/ai/flows/homework-helper-flow';
import { generateDailyExam as generateDailyExamFlow } from '@/ai/flows/generate-exam-flow';
import type { QuizData, ExamData, SchoolInfo } from '@/lib/types';
import type { HomeworkHelpInput, HomeworkHelpOutput } from '@/ai/flows/homework-helper-flow';
import type { GenerateQuizInput } from '@/ai/flows/generate-quiz';
import type { GenerateExamInput } from '@/ai/flows/generate-exam-flow';

export async function generateQuizAction(
  input: GenerateQuizInput
): Promise<{ data?: QuizData; error?: string }> {
  try {
    const quizData = await generateQuizFlow(input);

    if (!quizData || !quizData.quiz || !Array.isArray(quizData.quiz)) {
      throw new Error('Menerima format kuis yang tidak valid dari Ayah Tirta.');
    }

    return { data: quizData };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal saat membuat kuis.';
    return {
      error: `Maaf, terjadi kesalahan saat membuat kuis. Silakan coba lagi.`,
    };
  }
}

export async function homeworkHelperAction(
  input: HomeworkHelpInput
): Promise<{ data?: HomeworkHelpOutput; error?: string }> {
    try {
        const result = await answerHomeworkFlow(input);
        if (!result || !result.answer) {
            throw new Error('Ayah Tirta gagal memberikan jawaban.');
        }
        return { data: result };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal saat meminta bantuan PR.';
        return {
            error: `Maaf, terjadi kesalahan saat memproses permintaanmu. ${errorMessage}`,
        };
    }
}

export async function generateExamAction(
  input: GenerateExamInput
): Promise<{ data?: ExamData; error?: string }> {
  try {
    const examData = await generateDailyExamFlow(input);

    if (!examData || !examData.multipleChoice || !examData.essay) {
      throw new Error('Menerima format soal ujian yang tidak valid dari Ayah Tirta.');
    }

    return { data: examData };
  } catch (e) {
    console.error(e);
    return {
      error: `Maaf, Ayah Tirta sedang kesulitan membuat soal ujian harian. Silakan coba beberapa saat lagi.`,
    };
  }
}
