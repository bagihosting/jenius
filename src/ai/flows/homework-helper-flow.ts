
'use server';

/**
 * @fileOverview Provides homework help for elementary school subjects.
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
  schoolType: z.string().describe('The type of school (e.g., SDN, MI).'),
  grade: z.string().describe('The grade level (e.g., 1, 5).'),
  semester: z.string().describe('The semester (1 or 2).'),
});
export type HomeworkHelpInput = z.infer<typeof HomeworkHelpInputSchema>;

const HomeworkHelpOutputSchema = z.object({
  answer: z.string().describe('The explanation and answer to the homework question.'),
  imagePrompt: z.string().optional().describe("If the answer is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Diagram of the water cycle', 'Map of ancient Indonesian kingdoms'. Otherwise, this field should be omitted."),
  imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});
export type HomeworkHelpOutput = z.infer<typeof HomeworkHelpOutputSchema>;

export async function answerHomework(input: HomeworkHelpInput): Promise<HomeworkHelpOutput> {
  return homeworkHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'homeworkHelperPrompt',
  input: { schema: HomeworkHelpInputSchema },
  output: { schema: HomeworkHelpOutputSchema },
  prompt: `Anda adalah seorang guru yang ramah dan suportif yang membantu siswa mengerjakan pekerjaan rumah mereka.
Anda akan menjawab pertanyaan untuk siswa kelas {{{grade}}} di sekolah jenis {{{schoolType}}} pada semester {{{semester}}}.
Tujuan Anda adalah menjelaskan konsep dan membimbing mereka menuju jawaban, bukan hanya memberikan jawaban langsung.
Pengguna akan memberikan mata pelajaran dan sebuah pertanyaan.

PENTING: Secara cerdas tentukan apakah penjelasan Anda akan lebih baik dengan bantuan gambar.
- Jika YA, berikan deskripsi singkat dan jelas untuk membuat gambar tersebut di kolom 'imagePrompt'. Contoh: "Diagram siklus air", "Peta kerajaan Majapahit", "Ilustrasi metamorfosis kupu-kupu".
- Jika TIDAK, jangan sertakan kolom 'imagePrompt'.

PENTING: Sesuaikan gaya penjelasan dengan tingkatan kelas:
- Kelas 1-2 (Fase A): Gunakan bahasa yang sangat sederhana, analogi, dan contoh konkret. Pecah penjelasan menjadi langkah-langkah yang sangat kecil.
- Kelas 3-4 (Fase B): Gunakan bahasa yang jelas dan terstruktur. Jelaskan konsepnya terlebih dahulu, baru berikan contoh dan langkah penyelesaian.
- Kelas 5-6 (Fase C): Berikan penjelasan yang mendalam dan terperinci. Boleh menyertakan konsep terkait atau informasi tambahan untuk memperluas pemahaman.

Pengecualian Bahasa:
- Jika mata pelajaran adalah 'Bahasa Inggris', berikan penjelasan dan jawaban dalam Bahasa Inggris.
- Jika mata pelajaran adalah 'Bahasa Arab', berikan penjelasan dan jawaban dalam Bahasa Arab.
- Untuk semua mata pelajaran lainnya, gunakan Bahasa Indonesia.

Mata Pelajaran: {{{subject}}}
Pertanyaan: {{{question}}}

Uraikan masalahnya, jelaskan konsep-konsep kunci yang relevan dengan tingkat pemahaman siswa, lalu berikan jawaban akhirnya.
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
    if (!output) {
      throw new Error("Ayah Jenius gagal memberikan jawaban.");
    }

    if (output.imagePrompt) {
        try {
            const {media} = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `sebuah gambar ilustrasi datar yang mendidik dan sederhana untuk anak-anak: ${output.imagePrompt}`,
                config: { responseModalities: ['IMAGE'] },
            });
            output.imageUrl = media.url;
        } catch (e) {
            console.error("Image generation failed for prompt:", output.imagePrompt, e);
            // Don't block the answer if image fails
            output.imageUrl = undefined;
        }
    }

    return output;
  }
);
