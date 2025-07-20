
'use server';

import { generateQuiz as generateQuizFlow } from '@/ai/flows/generate-quiz';
import { answerHomework as answerHomeworkFlow } from '@/ai/flows/homework-helper-flow';
import { generateDailyExam as generateDailyExamFlow } from '@/ai/flows/generate-exam-flow';
import { academicAssistant as academicAssistantFlow } from '@/ai/flows/academic-assistant-flow';

import { type GenerateQuizOutput, type ExamData, type GenerateQuizInput, type HomeworkHelpInput, type HomeworkHelpOutput, type GenerateExamInput, type AcademicAssistantInput, type AcademicAssistantOutput, type Question, type MultipleChoiceQuestion } from '@/lib/types';

// Helper function to remove prefixes (A., B., etc.) and normalize string for comparison
const normalize = (str: string): string => {
    if (typeof str !== 'string') return '';
    return str.replace(/^[A-D]\.\s*/, '').trim().toLowerCase();
};

export async function generateQuizAction(
  input: GenerateQuizInput
): Promise<{ data?: GenerateQuizOutput; error?: string }> {
  try {
    const quizData = await generateQuizFlow(input);

    if (!quizData || !quizData.quiz || !Array.isArray(quizData.quiz) || quizData.quiz.length === 0) {
      throw new Error('Menerima format kuis yang tidak valid atau kosong dari Ayah Jenius.');
    }
    
    //--- VALIDASI DAN KOREKSI HASIL AI ---//
    const validatedQuiz = quizData.quiz.map(q => {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 4) {
            console.error('Soal tidak valid: Pilihan jawaban kurang dari 4.', q);
            return null; // Tandai soal sebagai tidak valid
        }
        if (!q.correctAnswer) {
            console.error('Soal tidak valid: Tidak ada jawaban benar.', q);
            return null;
        }

        const normalizedCorrectAnswerFromAI = normalize(q.correctAnswer);
        
        // Cari opsi yang cocok setelah dinormalisasi
        const matchingOption = q.options.find(opt => normalize(opt) === normalizedCorrectAnswerFromAI);

        if (matchingOption) {
            // Koreksi `correctAnswer` agar sama persis dengan opsi yang ada
            q.correctAnswer = matchingOption;
            return q;
        } else {
            // Jika tidak ada opsi yang cocok sama sekali, soal ini cacat.
            console.error('Soal tidak valid: Jawaban benar tidak ditemukan di dalam pilihan.', q);
            return null;
        }
    }).filter((q): q is Question => q !== null); // Hapus semua soal yang tidak valid

    // Jika setelah validasi, tidak ada soal yang tersisa atau jumlahnya berkurang, tolak seluruh kuis.
    if (validatedQuiz.length !== quizData.quiz.length) {
        throw new Error('Ayah Jenius membuat beberapa soal yang tidak akurat. Silakan coba buat kuis lagi untuk mendapatkan hasil yang lebih baik.');
    }
    
    quizData.quiz = validatedQuiz;
    //--- AKHIR VALIDASI ---//

    return { data: quizData };
  } catch (e) {
    console.error("generateQuizAction failed:", e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
    return {
      error: `Maaf, Ayah Jenius gagal membuat kuis saat ini. Coba lagi nanti. (Detail: ${errorMessage})`,
    };
  }
}

export async function homeworkHelperAction(
  input: HomeworkHelpInput
): Promise<{ data?: HomeworkHelpOutput; error?: string }> {
    try {
        const result = await answerHomeworkFlow(input);
        if (!result || !result.answer) {
            throw new Error('Ayah Jenius gagal memberikan jawaban atau format jawaban tidak valid.');
        }
        return { data: result };
    } catch (e) {
        console.error("homeworkHelperAction failed:", e);
        const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal saat meminta bantuan PR.';
        return {
            error: `Maaf, terjadi kesalahan saat memproses permintaanmu: ${errorMessage}`,
        };
    }
}

export async function generateExamAction(
  input: GenerateExamInput
): Promise<{ data?: ExamData; error?: string }> {
  try {
    const examData = await generateDailyExamFlow(input);

    if (!examData || !examData.multipleChoice || !examData.essay || examData.multipleChoice.length < 5 || examData.essay.length < 2) {
      throw new Error('Menerima format soal ujian yang tidak valid atau tidak lengkap dari Ayah Jenius.');
    }
    
    // Clean and validate multiple choice answers
    const validatedMultipleChoice = examData.multipleChoice.map(q => {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 4) {
            console.error('Soal PG tidak valid: Pilihan jawaban kurang dari 4.', q);
            return null;
        }
        
        const matchingOption = q.options.find(opt => normalize(opt) === normalize(q.correctAnswer));

        if (matchingOption) {
            q.correctAnswer = matchingOption; // Koreksi jawaban agar sama persis
            return q;
        } else {
            console.error('Soal PG tidak valid: Jawaban benar tidak ada di pilihan.', q);
            return null; // Tandai sebagai tidak valid
        }
    }).filter((q): q is MultipleChoiceQuestion => q !== null);

    if (validatedMultipleChoice.length !== examData.multipleChoice.length) {
         throw new Error('Ayah Jenius membuat beberapa soal pilihan ganda yang tidak akurat. Coba lagi untuk hasil yang lebih baik.');
    }
    
    examData.multipleChoice = validatedMultipleChoice;

    return { data: examData };
  } catch (e) {
    console.error("generateExamAction failed:", e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
    return {
      error: `Maaf, Ayah Jenius sedang kesulitan membuat soal ujian harian. Silakan coba lagi nanti. (Detail: ${errorMessage})`,
    };
  }
}

export async function academicAssistantAction(
    input: AcademicAssistantInput
): Promise<{ data?: AcademicAssistantOutput; error?: string }> {
    try {
        const result = await academicAssistantFlow(input);
        if (!result || !result.explanation) {
            throw new Error('Asisten Akademik gagal memberikan jawaban atau format jawaban tidak valid.');
        }
        return { data: result };
    } catch (e) {
        console.error("academicAssistantAction failed:", e);
        const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal saat meminta bantuan akademik.';
        return {
            error: `Maaf, terjadi kesalahan saat memproses permintaan Anda: ${errorMessage}`,
        };
    }
}
