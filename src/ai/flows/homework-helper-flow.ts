
'use server';

/**
 * @fileOverview Provides homework help for elementary school subjects.
 *
 * - answerHomework - A function that handles the homework question answering process.
 */

import { ai } from '@/ai/genkit';
import {
  HomeworkHelpInputSchema,
  HomeworkHelpOutputSchema,
  type HomeworkHelpInput,
  type HomeworkHelpOutput
} from '@/lib/types';


export async function answerHomework(input: HomeworkHelpInput): Promise<HomeworkHelpOutput> {
  return homeworkHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'homeworkHelperPrompt',
  input: { schema: HomeworkHelpInputSchema },
  output: { schema: HomeworkHelpOutputSchema },
  prompt: `Anda adalah seorang guru yang ramah, suportif, dan jenius yang membantu siswa mengerjakan pekerjaan rumah mereka.
Anda akan menjawab pertanyaan untuk siswa kelas {{{grade}}} di sekolah jenis {{{schoolType}}} pada semester {{{semester}}}.
Tujuan Anda adalah menjelaskan konsep dan membimbing mereka menuju jawaban, bukan hanya memberikan jawaban langsung.
Pengguna akan memberikan mata pelajaran dan sebuah pertanyaan.

PENTING: Secara cerdas tentukan apakah penjelasan Anda akan lebih baik dengan bantuan gambar.
- Jika YA, berikan deskripsi singkat dan jelas untuk membuat gambar tersebut di kolom 'imagePrompt'. Contoh: "Diagram siklus air", "Peta kerajaan Majapahit", "Grafik fungsi kuadrat".
- Jika TIDAK, jangan sertakan kolom 'imagePrompt'.

PENTING: Sesuaikan gaya penjelasan dengan tingkatan kelas:
- Kelas 1-6 (SD/MI): Gunakan bahasa yang sederhana, analogi, dan contoh konkret. Pecah penjelasan menjadi langkah-langkah kecil.
- Kelas 7-9 (SMP/MTs): Berikan penjelasan yang terstruktur. Jelaskan konsepnya terlebih dahulu, berikan contoh, dan langkah penyelesaian yang logis.
- Kelas 10-12 (SMA/MA): Berikan penjelasan yang mendalam dan komprehensif. Kaitkan dengan konsep lain yang relevan dan berikan konteks yang lebih luas.

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
                config: { responseModalities: ['TEXT', 'IMAGE'] },
            });
            if (media) {
                output.imageUrl = media.url;
            }
        } catch (e) {
            console.error("Image generation failed for prompt:", output.imagePrompt, e);
            // Don't block the answer if image fails
            output.imageUrl = undefined;
        }
    }

    return output;
  }
);
