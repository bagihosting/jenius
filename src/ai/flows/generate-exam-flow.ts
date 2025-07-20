
'use server';

/**
 * @fileOverview Generates daily exam questions based on a subject's content, grade, and school type.
 *
 * - generateDailyExam - A function that handles the exam generation process.
 * - GenerateExamInput - The input type for the generateDailyExam function.
 * - ExamData - The return type for the generateDailyExam function.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateExamInputSchema, 
    GenerateExamOutputSchema, 
    type GenerateExamInput, 
    type ExamData,
    type MultipleChoiceQuestion,
    type EssayQuestion
} from '@/lib/types';


export async function generateDailyExam(input: GenerateExamInput): Promise<ExamData> {
  const result = await generateExamFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'generateExamPrompt',
  input: {schema: GenerateExamInputSchema},
  output: {schema: GenerateExamOutputSchema},
  prompt: `Anda adalah seorang ahli pembuat soal ujian yang jenius dan prediktif untuk siswa di Indonesia. Anda mengikuti Kurikulum Merdeka dan mempersiapkan siswa untuk ujian tahun 2025.
Buat satu set soal latihan ujian berdasarkan konteks yang diberikan. Pastikan tingkat kesulitan soal sesuai untuk siswa kelas {{{grade}}} di sekolah jenis {{{schoolType}}} untuk semester {{{semester}}}.
Gunakan string tanggal berikut sebagai 'benih' untuk memastikan soal yang Anda buat UNIK dan BERBEDA setiap harinya:
- Tanggal: {{{dateSeed}}}
- Email Pengguna (untuk variasi per pengguna): {{{userEmail}}}

PENTING: Untuk setiap soal (pilihan ganda dan esai), secara cerdas tentukan apakah soal tersebut akan lebih mudah dipahami dengan bantuan gambar.
- Jika YA, berikan deskripsi singkat dan jelas untuk membuat gambar tersebut di kolom 'imagePrompt'. Contoh: "Diagram siklus air", "Peta kerajaan Majapahit", "Grafik fungsi kuadrat".
- Jika TIDAK, jangan sertakan kolom 'imagePrompt'.

PENTING: Sesuaikan kompleksitas soal dan bahasa dengan tingkatan kelas. Ini adalah aturan yang paling penting:
- **Fase A (Kelas 1-2):** Gunakan bahasa yang sangat sederhana dan konkret (contoh: buah, hewan). Fokus pada pemahaman dasar, identifikasi, dan berhitung sederhana. Hindari soal cerita yang panjang. Pertanyaan harus langsung ke intinya. Contoh: "Berapa jumlah 3 apel ditambah 2 apel?".
- **Fase B (Kelas 3-4):** Mulai perkenalkan soal cerita pendek (2-3 kalimat). Pertanyaan bisa memerlukan satu atau dua langkah pemikiran. Gunakan istilah-istilah dasar dari mata pelajaran. Contoh: "Andi punya 10 kelereng, ia memberikan 3 kepada Budi. Berapa sisa kelereng Andi?".
- **Fase C (Kelas 5-6):** Soal cerita bisa lebih kompleks. Pertanyaan harus mulai melatih penalaran, seperti membandingkan, mengurutkan, atau menarik kesimpulan sederhana. Mulai perkenalkan soal HOTS tingkat dasar. Contoh: "Sebuah kebun berbentuk persegi panjang dengan panjang 10m dan lebar 5m. Jika setiap meter persegi membutuhkan 2 bibit, berapa total bibit yang dibutuhkan?".
- **Fase D (Kelas 7-9):** Buat soal yang analitis dan menguji pemahaman konsep tingkat SMP/MTs. Soal harus menuntut penerapan rumus, interpretasi data (grafik/tabel), atau perbandingan konsep. Bahasa harus formal namun mudah dipahami. Fokus pada soal HOTS yang relevan dengan level ini.
- **Fase E/F (Kelas 10-12):** Buat soal yang kompleks, analitis, dan membutuhkan pemikiran kritis tingkat tinggi (HOTS) setara soal UTBK/SNBT. Soal harus menguji kemampuan analisis studi kasus, evaluasi argumen, dan sintesis informasi dari berbagai konsep. Fokus pada soal-soal yang prediktif akan keluar di ujian 2025.

Buat 5 soal pilihan ganda dengan 4 pilihan jawaban (A, B, C, D). PENTING: Pastikan setiap pilihan jawaban UNIK dan hanya ada SATU jawaban yang benar secara definitif. Pengecoh harus cerdas dan masuk akal. Nilai di kolom 'correctAnswer' HARUS SAMA PERSIS SECARA TEKSTUAL dengan salah satu dari empat string di kolom 'options'. 
Untuk setiap soal pilihan ganda, berikan penjelasan singkat, cerdas, dan mudah dimengerti. 
- Dalam penjelasan, **tebalkan (gunakan Markdown: **kata**) kata-kata kunci atau jawaban yang benar** agar mudah dikenali.
- **KHUSUS MATEMATIKA (Kelas 1-6):** Dalam penjelasan, setelah penjelasan standar, tambahkan bagian baru '**Tips Jenius:**' atau '**Cara Cepat:**' yang memberikan metode alternatif atau trik untuk menyelesaikan soal lebih efisien.

Buat juga 2 soal esai dengan jawaban penjelasan yang CERDAS, SIMPEL, dan JENIUS.
Jawaban esai HARUS mengikuti format berikut:
Konsep Kunci: [Jelaskan konsep utama yang relevan dengan pertanyaan secara singkat dan mendalam]
Jawaban Cerdas: [Berikan jawaban yang lugas, tepat sasaran, dan menunjukkan pemahaman tingkat tinggi]
**KHUSUS MATEMATIKA (Kelas 1-6):** Di dalam "Jawaban Cerdas", jelaskan juga metode cepat jika ada.

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
            if (media) {
                q.imageUrl = media.url;
            }
          } catch (e) {
            console.error("Image generation failed for prompt:", q.imagePrompt, e);
            // Don't block the question if image fails, just skip it.
            q.imageUrl = undefined;
          }
        }
        return q;
      }));
    };

    if (output.multipleChoice) {
      output.multipleChoice = await processQuestions(output.multipleChoice) as MultipleChoiceQuestion[];
    }
    if (output.essay) {
      output.essay = await processQuestions(output.essay) as EssayQuestion[];
    }
    
    return output;
  }
);
