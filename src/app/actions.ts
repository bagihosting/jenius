
'use server';

import { generateQuiz as generateQuizFlow } from '@/ai/flows/generate-quiz';
import { answerHomework as answerHomeworkFlow } from '@/ai/flows/homework-helper-flow';
import { generateDailyExam as generateDailyExamFlow } from '@/ai/flows/generate-exam-flow';
import { academicAssistant as academicAssistantFlow } from '@/ai/flows/academic-assistant-flow';

import type { QuizData, ExamData, GenerateQuizInput, HomeworkHelpInput, HomeworkHelpOutput, GenerateExamInput, AcademicAssistantInput, AcademicAssistantOutput, Question, MultipleChoiceQuestion } from '@/lib/types';


// Helper function to normalize and find the correct answer in options
function findAndNormalizeCorrectAnswer(question: Question | MultipleChoiceQuestion): string {
    if (!question || !question.correctAnswer || !Array.isArray(question.options)) {
        console.warn("Invalid question object passed to findAndNormalizeCorrectAnswer");
        return '';
    }
    const normalize = (str: string) => str.replace(/^[A-D]\.\s*/, '').trim().toLowerCase();

    const normalizedCorrectAnswer = normalize(question.correctAnswer);

    for (const option of question.options) {
        if (normalize(option) === normalizedCorrectAnswer) {
            return option; // Return the full option string
        }
    }
    
    // Fallback if no exact match after normalization, return original but warn
    console.warn("Could not find a matching option for correctAnswer:", question.correctAnswer, "Options:", question.options);
    return question.correctAnswer;
}


export async function generateQuizAction(
  input: GenerateQuizInput
): Promise<{ data?: QuizData; error?: string }> {
  try {
    const quizData = await generateQuizFlow(input);

    if (!quizData || !quizData.quiz || !Array.isArray(quizData.quiz) || quizData.quiz.length === 0) {
      throw new Error('Menerima format kuis yang tidak valid atau kosong dari Ayah Jenius.');
    }
    
    // Clean and validate AI output before sending to client
    quizData.quiz.forEach(q => {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 4) {
            throw new Error('Beberapa soal kuis tidak memiliki 4 pilihan jawaban.');
        }
        if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
            q.correctAnswer = findAndNormalizeCorrectAnswer(q);
        }
    });


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
    examData.multipleChoice.forEach(q => {
        if (!q.options || !Array.isArray(q.options) || q.options.length < 4) {
            throw new Error('Beberapa soal pilihan ganda tidak memiliki 4 pilihan jawaban.');
        }
        if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
            q.correctAnswer = findAndNormalizeCorrectAnswer(q);
        }
    });

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
