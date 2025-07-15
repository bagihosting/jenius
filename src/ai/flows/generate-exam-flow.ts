'use server';

/**
 * @fileOverview Generates daily exam questions based on a subject's content.
 *
 * - generateDailyExam - A function that handles the exam generation process.
 * - GenerateExamInput - The input type for the generateDailyExam function.
 * - ExamData - The return type for the generateDailyExam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { MultipleChoiceQuestion, EssayQuestion } from '@/lib/types';

const GenerateExamInputSchema = z.object({
  subjectContent: z.string().describe('The content of the subject to generate the exam from.'),
  dateSeed: z.string().describe('The current date (YYYY-MM-DD) to ensure daily variety.'),
});
export type GenerateExamInput = z.infer<typeof GenerateExamInputSchema>;

const MultipleChoiceQuestionSchema = z.object({
  question: z.string().describe("The text of the multiple-choice question."),
  options: z.array(z.string()).min(4).max(4).describe("An array of 4 possible answers in 'A. ...', 'B. ...' format."),
  correctAnswer: z.string().describe("The correct answer to the question, matching one of the options exactly."),
});

const EssayQuestionSchema = z.object({
    question: z.string().describe("The text of the essay question."),
    answer: z.string().describe("A detailed, genius-level explanation for the answer, structured with analysis, steps, and conclusion."),
});

const GenerateExamOutputSchema = z.object({
  multipleChoice: z.array(MultipleChoiceQuestionSchema).min(5).max(5).describe('An array of 5 multiple-choice questions.'),
  essay: z.array(EssayQuestionSchema).min(2).max(2).describe('An array of 2 essay questions with detailed answers.'),
});
export type ExamData = z.infer<typeof GenerateExamOutputSchema>;

export async function generateDailyExam(input: GenerateExamInput): Promise<ExamData> {
  const result = await generateExamFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'generateExamPrompt',
  input: {schema: GenerateExamInputSchema},
  output: {schema: GenerateExamOutputSchema},
  prompt: `Anda adalah seorang ahli pembuat soal ujian untuk siswa kelas 5 SD di Indonesia yang jenius. Anda mengikuti Kurikulum Merdeka.
Buat satu set soal latihan ujian berdasarkan konten mata pelajaran yang diberikan. Pastikan soal relevan dengan kurikulum terbaru.
Gunakan string tanggal berikut sebagai 'benih' untuk memastikan soal yang Anda buat bervariasi setiap harinya: {{{dateSeed}}}

Buat 5 soal pilihan ganda dengan 4 pilihan jawaban (A, B, C, D) dan 2 soal esai dengan jawaban penjelasan yang cerdas dan mendalam.
Jawaban esai harus mengikuti format: Analisis Masalah, Langkah-langkah Penyelesaian, dan Kesimpulan.
Semua konten harus dalam Bahasa Indonesia.

Konten Mata Pelajaran: {{{subjectContent}}}
`,
});

const generateExamFlow = ai.defineFlow(
  {
    name: 'generateExamFlow',
    inputSchema: GenerateExamInputSchema,
    outputSchema: GenerateExamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Ayah Tirta gagal membuat soal ujian harian.");
    }
    return output;
  }
);
