'use server';

import { generateQuiz as generateQuizFlow } from '@/ai/flows/generate-quiz';
import { answerHomework as answerHomeworkFlow } from '@/ai/flows/homework-helper-flow';
import type { QuizData } from '@/lib/types';
import type { HomeworkHelpInput, HomeworkHelpOutput } from '@/ai/flows/homework-helper-flow';

export async function generateQuizAction(
  subjectContent: string
): Promise<{ data?: QuizData; error?: string }> {
  try {
    const quizData = await generateQuizFlow({
      subjectContent,
      numberOfQuestions: 5,
    });

    if (!quizData || !quizData.quiz || !Array.isArray(quizData.quiz)) {
      throw new Error('Received invalid quiz format from AI.');
    }

    return { data: quizData };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while generating the quiz.';
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
            throw new Error('AI gagal memberikan jawaban.');
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
