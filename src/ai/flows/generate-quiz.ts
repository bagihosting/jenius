
'use server';

/**
 * @fileOverview Generates a quiz based on the subject content, grade, and school type.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateQuizInputSchema,
  GenerateQuizOutputSchema,
  type GenerateQuizInput,
  type GenerateQuizOutput,
  type Question,
} from '@/lib/types';


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  const result = await generateQuizFlow(input);
  // Ensure the output matches the QuizData type structure.
  // The flow now directly returns an object with a 'quiz' property.
  return result;
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `Anda adalah seorang ahli pembuat kuis yang jenius untuk siswa sekolah di Indonesia.
Buatlah kuis berdasarkan konteks yang diberikan. Pastikan tingkat kesulitan soal sesuai untuk siswa kelas {{{grade}}} di sekolah jenis {{{schoolType}}} untuk semester {{{semester}}}.
Gunakan string berikut sebagai 'benih' untuk memastikan soal yang Anda buat UNIK dan BERBEDA setiap kali diminta:
- Tanggal: {{{dateSeed}}}
- Email Pengguna: {{{userEmail}}}

PENTING: Untuk setiap pertanyaan, secara cerdas tentukan apakah pertanyaan tersebut akan lebih mudah dipahami dengan bantuan gambar.
- Jika YA, berikan deskripsi singkat dan jelas untuk membuat gambar tersebut di kolom 'imagePrompt'. Contoh: "Ilustrasi rantai makanan di sawah", "Gambar bangun ruang kubus", "Grafik permintaan dan penawaran".
- Jika teks pertanyaan secara eksplisit menyebutkan gambar (misal: "Perhatikan gambar berikut", "Gambar di bawah menunjukkan..."), maka Anda WAJIB memberikan deskripsi di 'imagePrompt'.
- Jika TIDAK, jangan sertakan kolom 'imagePrompt'.

PENTING: Sesuaikan kompleksitas soal dan bahasa dengan tingkatan kelas. Ini adalah aturan yang paling penting:
- **Fase A (Kelas 1-2):** Gunakan bahasa yang sangat sederhana dan konkret. Fokus pada pemahaman dasar, identifikasi, dan contoh dari kehidupan sehari-hari. Hindari soal cerita yang panjang. Pertanyaan harus langsung ke intinya. Contoh: "Hewan yang berkaki empat adalah...". Pilihan jawaban juga harus sederhana.
- **Fase B (Kelas 3-4):** Mulai perkenalkan soal cerita pendek (2-3 kalimat). Pertanyaan bisa memerlukan satu atau dua langkah pemikiran. Gunakan istilah-istilah dasar dari mata pelajaran. Contoh: "Ibu membeli 5 apel dan 3 jeruk. Berapa jumlah semua buah yang dibeli Ibu?".
- **Fase C (Kelas 5-6):** Soal cerita bisa lebih kompleks. Pertanyaan harus mulai melatih penalaran, seperti membandingkan, mengurutkan, atau menarik kesimpulan sederhana. Mulai perkenalkan soal HOTS tingkat dasar. Contoh: "Suhu di kota A adalah 25°C dan di kota B adalah -5°C. Berapa selisih suhu kedua kota tersebut?".
- **Fase D (Kelas 7-9):** Buat soal analitis yang menuntut penerapan rumus, interpretasi data (grafik/tabel), atau perbandingan konsep. Gunakan bahasa yang lebih formal. Pertanyaan boleh menguji pemahaman konsep dan analisis sederhana.
- **Fase E/F (Kelas 10-12):** Buat pertanyaan yang kompleks dan analitis, setara soal HOTS UTBK/SNBT. Pertanyaan harus menguji pemikiran kritis, analisis studi kasus, dan sintesis informasi.

Setiap pertanyaan harus memiliki:
1.  Teks pertanyaan yang jelas.
2.  Empat (4) pilihan jawaban, masing-masing diawali dengan huruf (Contoh: "A. Teks jawaban", "B. Teks jawaban", dst.). Pastikan setiap pilihan jawaban UNIK dan berbeda satu sama lain.
3.  Satu jawaban yang benar. ATURAN PALING KRUSIAL: Nilai di kolom 'correctAnswer' HARUS SAMA PERSIS SECARA TEKSTUAL dengan salah satu dari empat string di kolom 'options'. Contoh: Jika options berisi "A. Jakarta", maka correctAnswer harus "A. Jakarta", bukan "Jakarta".

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
