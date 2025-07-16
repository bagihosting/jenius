'use server';

/**
 * @fileOverview Generates daily exam questions based on a subject's content, grade, and school type.
 *
 * - generateDailyExam - A function that handles the exam generation process.
 * - GenerateExamInput - The input type for the generateDailyExam function.
 * - ExamData - The return type for the generateDailyExam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { MultipleChoiceQuestion, EssayQuestion } from '@/lib/types';

const GenerateExamInputSchema = z.object({
  subjectContent: z.string().describe('The content of the subject to generate the exam from, including semester context.'),
  dateSeed: z.string().describe('The current date (YYYY-MM-DD) to ensure daily variety.'),
  schoolType: z.string().describe('The type of school (e.g., SDN, MI).'),
  grade: z.string().describe('The grade level (e.g., 1, 5).'),
  semester: z.string().describe('The semester (1 or 2).')
});
export type GenerateExamInput = z.infer<typeof GenerateExamInputSchema>;

const MultipleChoiceQuestionSchema = z.object({
  question: z.string().describe("The text of the multiple-choice question."),
  options: z.array(z.string()).min(4).max(4).describe("An array of 4 possible answers in 'A. ...', 'B. ...' format."),
  correctAnswer: z.string().describe("The correct answer to the question, matching one of the options exactly."),
  explanation: z.string().describe("A short and genius-level explanation for the correct answer, using Markdown for bolding important words (e.g., **kata penting**)."),
});

const EssayQuestionSchema = z.object({
    question: z.string().describe("The text of the essay question."),
    answer: z.string().describe("A detailed, genius-level explanation for the answer, structured with analysis, steps, and conclusion."),
});

const GenerateExamOutputSchema = z.object({
  multipleChoice: z.array(MultipleChoiceQuestionSchema).describe('An array of around 30 multiple-choice questions.'),
  essay: z.array(EssayQuestionSchema).min(5).max(5).describe('An array of 5 essay questions with detailed answers.'),
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
  prompt: `Anda adalah seorang ahli pembuat soal ujian yang jenius untuk siswa di Indonesia. Anda mengikuti Kurikulum Merdeka.
Buat satu set soal latihan ujian berdasarkan konteks yang diberikan. Pastikan tingkat kesulitan soal sesuai untuk siswa kelas {{{grade}}} di sekolah jenis {{{schoolType}}} untuk semester {{{semester}}}.
Gunakan string tanggal berikut sebagai 'benih' untuk memastikan soal yang Anda buat bervariasi setiap harinya: {{{dateSeed}}}

PENTING: Sesuaikan kompleksitas soal dan bahasa dengan tingkatan kelas:
- Kelas 1-2 (Fase A): Gunakan bahasa yang sangat sederhana dan pertanyaan konkret. Fokus pada pemahaman dasar. Contoh soal harus mudah divisualisasikan.
- Kelas 3-4 (Fase B): Gunakan bahasa yang jelas dan mulai perkenalkan soal yang membutuhkan penalaran sederhana. Jawaban mungkin memerlukan satu atau dua langkah pemikiran.
- Kelas 5-6 (Fase C): Buat soal yang lebih analitis dan membutuhkan pemikiran tingkat tinggi (HOTS). Boleh menyertakan soal cerita atau studi kasus singkat.

Buat sekitar 30 soal pilihan ganda dengan 4 pilihan jawaban (A, B, C, D). Untuk setiap soal pilihan ganda, berikan penjelasan singkat, cerdas, dan mudah dimengerti. Dalam penjelasan, **tebalkan (gunakan Markdown: **kata**) kata-kata kunci atau jawaban yang benar** agar mudah dikenali.
Buat juga 5 soal esai dengan jawaban penjelasan yang cerdas dan mendalam.
Jawaban esai harus mengikuti format: Analisis Masalah, Langkah-langkah Penyelesaian, dan Kesimpulan.
Semua konten harus dalam Bahasa Indonesia, kecuali jika mata pelajarannya adalah Bahasa Inggris atau Bahasa Arab.

Konten Mata Pelajaran (termasuk fokus semester): {{{subjectContent}}}
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
