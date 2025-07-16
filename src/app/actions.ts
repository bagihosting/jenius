'use server';

import { generateQuiz as generateQuizFlow } from '@/ai/flows/generate-quiz';
import { answerHomework as answerHomeworkFlow } from '@/ai/flows/homework-helper-flow';
import { generateDailyExam as generateDailyExamFlow } from '@/ai/flows/generate-exam-flow';
import { findSchools as findSchoolsFlow } from '@/ai/flows/find-schools-flow';
import type { QuizData, ExamData } from '@/lib/types';
import type { HomeworkHelpInput, HomeworkHelpOutput } from '@/ai/flows/homework-helper-flow';
import type { GenerateQuizInput } from '@/ai/flows/generate-quiz';
import type { GenerateExamInput } from '@/ai/flows/generate-exam-flow';
import type { FindSchoolsInput, FindSchoolsOutput } from '@/ai/flows/find-schools-flow';

export async function generateQuizAction(
  input: GenerateQuizInput
): Promise<{ data?: QuizData; error?: string }> {
  try {
    const quizData = await generateQuizFlow(input);

    if (!quizData || !quizData.quiz || !Array.isArray(quizData.quiz)) {
      throw new Error('Menerima format kuis yang tidak valid dari Ayah Jenius.');
    }

    return { data: quizData };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
    return {
      error: `Maaf, Ayah Jenius gagal membuat kuis. Silakan coba lagi. (${errorMessage})`,
    };
  }
}

export async function homeworkHelperAction(
  input: HomeworkHelpInput
): Promise<{ data?: HomeworkHelpOutput; error?: string }> {
    try {
        const result = await answerHomeworkFlow(input);
        if (!result || !result.answer) {
            throw new Error('Ayah Jenius gagal memberikan jawaban.');
        }
        return { data: result };
    } catch (e) {
        console.error(e);
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

    if (!examData || !examData.multipleChoice || !examData.essay) {
      throw new Error('Menerima format soal ujian yang tidak valid dari Ayah Jenius.');
    }

    return { data: examData };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
    return {
      error: `Maaf, Ayah Jenius sedang kesulitan membuat soal ujian harian. Silakan coba lagi. (${errorMessage})`,
    };
  }
}

export async function findSchoolsAction(
  input: FindSchoolsInput
): Promise<{ data?: FindSchoolsOutput; error?: string }> {
  try {
    const result = await findSchoolsFlow(input);
    if (!result || !result.schools) {
        throw new Error('Gagal menemukan sekolah.');
    }
    return { data: result };
  } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan tidak dikenal.';
      return {
          error: `Maaf, terjadi kesalahan saat mencari sekolah: ${errorMessage}`,
      };
  }
}
