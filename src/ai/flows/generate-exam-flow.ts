
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
  schoolType: z.string().describe('The type of school (e.g., SDN, MTs, SMA).'),
  grade: z.string().describe('The grade level (e.g., 1, 8, 11).'),
  semester: z.string().describe('The semester (1 or 2).'),
  userEmail: z.string().describe('The email of the user to ensure question uniqueness per user.'),
});
export type GenerateExamInput = z.infer<typeof GenerateExamInputSchema>;

const MultipleChoiceQuestionSchema = z.object({
  question: z.string().describe("The text of the multiple-choice question."),
  options: z.array(z.string()).min(4).max(4).describe("An array of 4 possible answers in 'A. ...', 'B. ...' format. Each option must be unique."),
  correctAnswer: z.string().describe("The correct answer to the question, matching one of the options exactly."),
  explanation: z.string().describe("A short and genius-level explanation for the correct answer, using Markdown for bolding important words (e.g., **kata penting**)."),
  imagePrompt: z.string().optional().describe("If the question is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Diagram of the water cycle', 'Map of ancient Indonesian kingdoms'. Otherwise, this field should be omitted."),
  imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});

const EssayQuestionSchema = z.object({
    question: z.string().describe("The text of the essay question."),
    answer: z.string().describe("A simple, smart, and genius explanation for the answer. Format: 'Konsep Kunci: [explanation]\\n\\nJawaban Cerdas: [answer]'."),
    imagePrompt: z.string().optional().describe("If the question is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Illustration of tectonic plates moving', 'Chart of government branches'. Otherwise, this field should be omitted."),
    imageUrl: z.string().optional().describe("URL of the generated image, if any."),
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
  prompt: `Anda adalah seorang ahli pembuat soal ujian yang jenius untuk siswa di Indonesia. Anda mengikuti Kurikulum Merdeka dan mempersiapkan siswa untuk ujian tahun 2025.
Buat satu set soal latihan ujian berdasarkan konteks yang diberikan. Pastikan tingkat kesulitan soal sesuai untuk siswa kelas {{{grade}}} di sekolah jenis {{{schoolType}}} untuk semester {{{semester}}}.
Gunakan string tanggal berikut sebagai 'benih' untuk memastikan soal yang Anda buat UNIK dan BERBEDA setiap harinya:
- Tanggal: {{{dateSeed}}}
- Email Pengguna (untuk variasi per pengguna): {{{userEmail}}}

PENTING: Untuk setiap soal (pilihan ganda dan esai), secara cerdas tentukan apakah soal tersebut akan lebih mudah dipahami dengan bantuan gambar.
- Jika YA, berikan deskripsi singkat dan jelas untuk membuat gambar tersebut di kolom 'imagePrompt'. Contoh: "Diagram siklus air", "Peta kerajaan Majapahit", "Grafik fungsi kuadrat".
- Jika TIDAK, jangan sertakan kolom 'imagePrompt'.

PENTING: Sesuaikan kompleksitas soal dan bahasa dengan tingkatan kelas:
- Kelas 1-3 (Fase A/B): Gunakan bahasa yang sangat sederhana dan pertanyaan konkret. Fokus pada pemahaman dasar.
- Kelas 4-6 (Fase B/C): Gunakan bahasa yang jelas dan mulai perkenalkan soal yang membutuhkan penalaran sederhana. Jawaban mungkin memerlukan satu atau dua langkah pemikiran.
- Kelas 7-9 (Fase D): Buat soal yang analitis dan menguji pemahaman konsep tingkat SMP/MTs. Bahasa harus formal namun mudah dipahami. Fokus pada soal HOTS yang relevan.
- Kelas 10-12 (Fase E/F): Buat soal yang kompleks, analitis, dan membutuhkan pemikiran tingkat tinggi (HOTS) setara SMA/MA. Fokus pada soal-soal yang prediktif akan keluar di ujian 2025 (UTBK, dll). Boleh menyertakan soal cerita atau studi kasus.

Buat 5 soal pilihan ganda dengan 4 pilihan jawaban (A, B, C, D). PENTING: Pastikan setiap pilihan jawaban UNIK dan hanya ada SATU jawaban yang benar secara definitif. Untuk setiap soal pilihan ganda, berikan penjelasan singkat, cerdas, dan mudah dimengerti. Dalam penjelasan, **tebalkan (gunakan Markdown: **kata**) kata-kata kunci atau jawaban yang benar** agar mudah dikenali.

Buat juga 2 soal esai dengan jawaban penjelasan yang CERDAS, SIMPEL, dan JENIUS.
Jawaban esai HARUS mengikuti format berikut:
Konsep Kunci: [Jelaskan konsep utama yang relevan dengan pertanyaan secara singkat dan mendalam]

Jawaban Cerdas: [Berikan jawaban yang lugas, tepat sasaran, dan menunjukkan pemahaman tingkat tinggi]

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
        throw new Error("Ayah Jenius gagal membuat soal ujian harian.");
    }
    
    const processQuestions = async (questions: (MultipleChoiceQuestion | EssayQuestion)[]) => {
      return Promise.all(questions.map(async (q) => {
        if (q.imagePrompt) {
          try {
            const {media} = await ai.generate({
              model: 'googleai/gemini-2.0-flash-preview-image-generation',
              prompt: `sebuah gambar ilustrasi datar yang mendidik dan sederhana untuk anak-anak: ${q.imagePrompt}`,
              config: { responseModalities: ['TEXT', 'IMAGE'] },
            });
            q.imageUrl = media.url;
          } catch (e) {
            console.error("Image generation failed for prompt:", q.imagePrompt, e);
            // Don't block the question if image fails, just skip it.
            q.imageUrl = undefined;
          }
        }
        return q;
      }));
    };

    output.multipleChoice = await processQuestions(output.multipleChoice) as MultipleChoiceQuestion[];
    output.essay = await processQuestions(output.essay) as EssayQuestion[];
    
    return output;
  }
);
