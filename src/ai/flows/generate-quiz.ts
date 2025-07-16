'use server';

/**
 * @fileOverview Generates a quiz based on the subject content, grade, and school type.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { QuizData, Semester } from '@/lib/types';

const GenerateQuizInputSchema = z.object({
  subjectContent: z
    .string()
    .describe('The content of the subject to generate the quiz from.'),
  numberOfQuestions: z
    .number()
    .default(5)
    .describe('The number of questions to generate for the quiz.'),
  schoolType: z.string().describe('The type of school (e.g., SDN, MI).'),
  grade: z.string().describe('The grade level (e.g., 1, 5).'),
  semester: z.string().describe('The semester (1 or 2).')
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
  prompt: `Anda adalah seorang ahli pembuat kuis untuk siswa sekolah dasar di Indonesia.
Buatlah kuis berdasarkan konteks yang diberikan. Pastikan tingkat kesulitan soal sesuai untuk siswa kelas {{{grade}}} di sekolah jenis {{{schoolType}}} untuk semester {{{semester}}}.

PENTING: Sesuaikan kompleksitas soal dan bahasa dengan tingkatan kelas:
- Kelas 1-2 (Fase A): Gunakan bahasa yang sangat sederhana dan pertanyaan yang sangat mendasar. Pilihan jawaban harus jelas dan tidak membingungkan.
- Kelas 3-4 (Fase B): Gunakan bahasa yang jelas. Pertanyaan boleh menguji pemahaman konsep dasar, bukan hanya hafalan.
- Kelas 5-6 (Fase C): Buat pertanyaan yang menguji penerapan konsep atau analisis sederhana.

Setiap pertanyaan harus memiliki teks pertanyaan, minimal 3 pilihan jawaban, dan jawaban yang benar. Semua konten harus dalam Bahasa Indonesia.

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
