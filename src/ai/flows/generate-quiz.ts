
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
import type { QuizData, Question } from '@/lib/types';

const GenerateQuizInputSchema = z.object({
  subjectContent: z
    .string()
    .describe('The content of the subject to generate the quiz from.'),
  numberOfQuestions: z
    .number()
    .default(10)
    .describe('The number of questions to generate for the quiz.'),
  schoolType: z.string().describe('The type of school (e.g., SDN, MTs, SMA).'),
  grade: z.string().describe('The grade level (e.g., 1, 8, 11).'),
  semester: z.string().describe('The semester (1 or 2).'),
  dateSeed: z.string().describe('The current date (YYYY-MM-DD) to ensure daily variety.'),
  userEmail: z.string().describe('The email of the user to ensure question uniqueness per user.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuestionSchema = z.object({
    question: z.string().describe("The text of the question."),
    options: z.array(z.string()).min(4).max(4).describe("An array of 4 possible answers, in 'A. ...', 'B. ...' format. Each option must be unique."),
    correctAnswer: z.string().describe("The correct answer to the question. PENTING: Nilai ini HARUS sama persis dengan salah satu string dari array 'options'."),
    imagePrompt: z.string().optional().describe("If the question is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Diagram of a plant cell', 'Map of Indonesia provinces'. Otherwise, this field should be omitted."),
    imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});

const GenerateQuizOutputSchema = z.object({
  quiz: z.array(QuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<QuizData> {
  const result = await generateQuizFlow(input);
  // Ensure the output matches the QuizData type structure.
  // The flow now directly returns an object with a 'quiz' property.
  return result;
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `Anda adalah seorang ahli pembuat kuis untuk siswa sekolah di Indonesia.
Buatlah kuis berdasarkan konteks yang diberikan. Pastikan tingkat kesulitan soal sesuai untuk siswa kelas {{{grade}}} di sekolah jenis {{{schoolType}}} untuk semester {{{semester}}}.
Gunakan string berikut sebagai 'benih' untuk memastikan soal yang Anda buat UNIK dan BERBEDA setiap kali diminta:
- Tanggal: {{{dateSeed}}}
- Email Pengguna: {{{userEmail}}}

PENTING: Untuk setiap pertanyaan, secara cerdas tentukan apakah pertanyaan tersebut akan lebih mudah dipahami dengan bantuan gambar.
- Jika YA, berikan deskripsi singkat dan jelas untuk membuat gambar tersebut di kolom 'imagePrompt'. Contoh: "Ilustrasi rantai makanan di sawah", "Gambar bangun ruang kubus", "Grafik permintaan dan penawaran".
- Jika TIDAK, jangan sertakan kolom 'imagePrompt'.

PENTING: Sesuaikan kompleksitas soal dan bahasa dengan tingkatan kelas:
- Kelas 1-6 (SD/MI): Gunakan bahasa yang sederhana dan pertanyaan yang menguji pemahaman dasar hingga penerapan konsep sederhana.
- Kelas 7-9 (SMP/MTs): Gunakan bahasa yang lebih formal. Pertanyaan boleh menguji pemahaman konsep, analisis sederhana, dan penerapan rumus.
- Kelas 10-12 (SMA/MA): Buat pertanyaan yang menguji analisis mendalam, pemikiran kritis, dan penerapan konsep kompleks.

Setiap pertanyaan harus memiliki:
1.  Teks pertanyaan.
2.  Empat (4) pilihan jawaban, masing-masing diawali dengan huruf (A., B., C., D.). Pastikan setiap pilihan jawaban UNIK dan berbeda satu sama lain.
3.  Satu jawaban yang benar. PENTING: Nilai di kolom 'correctAnswer' HARUS SAMA PERSIS dengan teks salah satu pilihan di kolom 'options'. Tidak boleh ada lebih dari satu jawaban yang benar.

Semua konten harus dalam Bahasa Indonesia.

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
    
    // Process questions to generate images if needed
    if (output.quiz) {
      output.quiz = await Promise.all(output.quiz.map(async (q: Question) => {
        if (q.imagePrompt) {
          try {
            const {media} = await ai.generate({
              model: 'googleai/gemini-2.0-flash-preview-image-generation',
              prompt: `sebuah gambar ilustrasi datar yang mendidik dan sederhana untuk anak-anak: ${q.imagePrompt}`,
              config: { responseModalities: ['TEXT', 'IMAGE'] },
            });
            if (media) {
              q.imageUrl = media.url;
            }
          } catch (e) {
            console.error("Image generation failed for prompt:", q.imagePrompt, e);
            // Don't block the question if image fails
            q.imageUrl = undefined;
          }
        }
        return q;
      }));
    }

    return output;
  }
);
