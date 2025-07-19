
'use server';

/**
 * @fileOverview Provides academic assistance for university-level subjects.
 *
 * - academicAssistant - A function that handles academic queries.
 */

import { ai } from '@/ai/genkit';
import {
  AcademicAssistantInputSchema,
  AcademicAssistantOutputSchema,
  type AcademicAssistantInput,
  type AcademicAssistantOutput,
} from '@/lib/types';


export async function academicAssistant(input: AcademicAssistantInput): Promise<AcademicAssistantOutput> {
  return academicAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'academicAssistantPrompt',
  input: { schema: AcademicAssistantInputSchema },
  output: { schema: AcademicAssistantOutputSchema },
  prompt: `Anda adalah seorang asisten akademik AI yang sangat cerdas, setara dengan seorang profesor atau pakar di bidangnya. Anda mampu menjelaskan konsep-konsep kompleks dengan cara yang jelas, terstruktur, dan mudah dipahami untuk mahasiswa.

Anda akan menerima Jurusan, Topik, dan Permintaan spesifik dari pengguna. Tugas Anda adalah memberikan penjelasan yang komprehensif dan akurat.

PENTING:
- **Level Penjelasan**: Sesuaikan kedalaman dan kompleksitas penjelasan dengan tingkat universitas (D3/S1). Gunakan terminologi yang tepat, tetapi jelaskan istilah-istilah kunci jika diperlukan.
- **Struktur Jawaban**: Gunakan Markdown secara ekstensif untuk membuat jawaban yang terstruktur dan mudah dibaca. Gunakan heading (#, ##), bold (**teks**), italic (*teks*), dan daftar (bullet/numbered) untuk mengorganisir informasi.
- **Pembuatan Gambar Cerdas**: Evaluasi permintaan pengguna. Jika sebuah diagram, grafik, atau ilustrasi visual dapat secara signifikan membantu pemahaman, berikan deskripsi yang jelas dan efektif di kolom 'imagePrompt'. Jika tidak, jangan sertakan kolom ini.

Jurusan/Bidang Studi: {{{major}}}
Topik Spesifik: {{{topic}}}
Permintaan Pengguna: {{{request}}}

Berikan penjelasan yang mendalam dan jenius sesuai permintaan pengguna.
`,
});

const academicAssistantFlow = ai.defineFlow(
  {
    name: 'academicAssistantFlow',
    inputSchema: AcademicAssistantInputSchema,
    outputSchema: AcademicAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Asisten Akademik gagal memberikan jawaban.");
    }

    if (output.imagePrompt) {
        try {
            const {media} = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `Sebuah diagram atau ilustrasi teknis dan mendidik untuk tingkat mahasiswa: ${output.imagePrompt}`,
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
