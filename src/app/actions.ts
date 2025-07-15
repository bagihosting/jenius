'use server';

import { generateQuiz as generateQuizFlow } from '@/ai/flows/generate-quiz';
import type { QuizData } from '@/lib/types';

export async function generateQuizAction(
  subjectContent: string
): Promise<{ data?: QuizData; error?: string }> {
  try {
    const result = await generateQuizFlow({
      subjectContent,
      numberOfQuestions: 5,
    });

    if (!result || !result.quiz) {
      throw new Error('AI failed to generate a quiz.');
    }
    
    // The AI returns a stringified JSON, so we need to parse it.
    const quizData = JSON.parse(result.quiz) as QuizData;

    // Basic validation of the parsed data
    if (!quizData.quiz || !Array.isArray(quizData.quiz)) {
        throw new Error('Received invalid quiz format from AI.');
    }

    return { data: quizData };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while generating the quiz.';
    return {
      error: `Maaf, terjadi kesalahan saat membuat kuis. ${errorMessage}`,
    };
  }
}
