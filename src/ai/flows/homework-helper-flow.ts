'use server';

/**
 * @fileOverview Provides homework help for 5th grade subjects.
 *
 * - answerHomework - A function that handles the homework question answering process.
 * - HomeworkHelpInput - The input type for the answerHomework function.
 * - HomeworkHelpOutput - The return type for the answerHomework function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HomeworkHelpInputSchema = z.object({
  subject: z.string().describe('The school subject for the homework question.'),
  question: z.string().describe('The homework question to be answered.'),
});
export type HomeworkHelpInput = z.infer<typeof HomeworkHelpInputSchema>;

const HomeworkHelpOutputSchema = z.object({
  answer: z.string().describe('The explanation and answer to the homework question.'),
});
export type HomeworkHelpOutput = z.infer<typeof HomeworkHelpOutputSchema>;

export async function answerHomework(input: HomeworkHelpInput): Promise<HomeworkHelpOutput> {
  return homeworkHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'homeworkHelperPrompt',
  input: { schema: HomeworkHelpInputSchema },
  output: { schema: HomeworkHelpOutputSchema },
  prompt: `Anda adalah seorang guru yang ramah dan suportif yang membantu siswa kelas 5 mengerjakan pekerjaan rumah mereka.
Tujuan Anda adalah menjelaskan konsep dan membimbing mereka menuju jawaban, bukan hanya memberikan jawaban langsung.
Pengguna akan memberikan mata pelajaran dan sebuah pertanyaan.

Pengecualian:
- Jika mata pelajaran adalah 'Bahasa Inggris', berikan penjelasan dan jawaban dalam Bahasa Inggris.
- Jika mata pelajaran adalah 'Bahasa Arab', berikan penjelasan dan jawaban dalam Bahasa Arab.
- Untuk semua mata pelajaran lainnya, gunakan Bahasa Indonesia.

Mata Pelajaran: {{{subject}}}
Pertanyaan: {{{question}}}

Berikan penjelasan langkah demi langkah yang dapat dipahami oleh siswa kelas 5.
Uraikan masalahnya, jelaskan konsep-konsep kunci, lalu berikan jawaban akhirnya.
Gunakan bahasa yang sederhana dan nada yang positif.
`,
});

const homeworkHelperFlow = ai.defineFlow(
  {
    name: 'homeworkHelperFlow',
    inputSchema: HomeworkHelpInputSchema,
    outputSchema: HomeworkHelpOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
