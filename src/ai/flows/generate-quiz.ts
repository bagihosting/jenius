'use server';

/**
 * @fileOverview Generates a quiz based on the subject content.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { QuizData } from '@/lib/types';

const GenerateQuizInputSchema = z.object({
  subjectContent: z
    .string()
    .describe('The content of the subject to generate the quiz from.'),
  numberOfQuestions: z
    .number()
    .default(5)
    .describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuestionSchema = z.object({
    question: z.string().describe("The text of the question."),
    options: z.array(z.string()).min(3).describe("An array of possible answers."),
    correctAnswer: z.string().describe("The correct answer to the question."),
});

const GenerateQuizOutputSchema = z.object({
  quiz: z.array(QuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<QuizData> {
  const result = await generateQuizFlow(input);
  return { quiz: result.quiz };
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `Anda adalah seorang ahli pembuat kuis untuk siswa sekolah dasar. Buatlah kuis berdasarkan konten mata pelajaran yang diberikan. Setiap pertanyaan harus memiliki teks pertanyaan, minimal 3 pilihan jawaban, dan jawaban yang benar. Semua konten harus dalam Bahasa Indonesia.

Konten Mata Pelajaran: {{{subjectContent}}}
Jumlah Pertanyaan: {{{numberOfQuestions}}}
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Ayah Tirta gagal membuat konten kuis.");
    }
    return output;
  }
);
