
import { z } from 'genkit';

export type SchoolType = 'SDN' | 'SDIT' | 'MI' | 'SMP' | 'MTs' | 'SMA' | 'MA' | 'AKADEMI' | 'UNIVERSITAS';
export type Grade = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
export type Semester = '1' | '2';

export interface SchoolInfo {
    schoolType: SchoolType;
    grade: Grade;
    semester: Semester;
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  content: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
}

export interface QuizData {
  quiz: Question[];
}

export interface GenerateQuizInput {
  subjectContent: string;
  numberOfQuestions: number;
  schoolType: SchoolType;
  grade: Grade;
  semester: Semester;
  dateSeed: string;
  userEmail: string;
}

export interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageUrl?: string;
}

export interface EssayQuestion {
  question: string;
  answer: string;
  imageUrl?: string;
}

export interface ExamData {
  multipleChoice: MultipleChoiceQuestion[];
  essay: EssayQuestion[];
}

export interface GenerateExamInput {
  subjectContent: string;
  dateSeed: string;
  schoolType: SchoolType;
  grade: Grade;
  semester: Semester;
  userEmail: string;
}

export interface User {
  uid: string;
  name: string;
  username: string;
  email: string;
  schoolType?: SchoolType;
  schoolName?: string;
  role: 'user' | 'admin' | 'mahasiswa';
  grade?: Grade;
  badge?: string;
  photoUrl?: string;
  robloxUsername?: string;
  registeredAt?: string; // ISO string date
  major?: string; // Jurusan untuk mahasiswa
  quizCompletions?: number;
  bonusPoints?: number;
  progress?: { [subjectId: string]: number };
}

export const HomeworkHelpInputSchema = z.object({
  subject: z.string().describe('The school subject for the homework question.'),
  question: z.string().describe('The homework question to be answered.'),
  schoolType: z.string().describe('The type of school (e.g., SDN, MTs, SMA).'),
  grade: z.string().describe('The grade level (e.g., 1, 8, 11).'),
  semester: z.string().describe('The semester (1 or 2).'),
});
export type HomeworkHelpInput = z.infer<typeof HomeworkHelpInputSchema>;

export const HomeworkHelpOutputSchema = z.object({
  answer: z.string().describe('The explanation and answer to the homework question.'),
  imagePrompt: z.string().optional().describe("If the answer is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Diagram of the water cycle', 'Map of ancient Indonesian kingdoms'. Otherwise, this field should be omitted."),
  imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});
export type HomeworkHelpOutput = z.infer<typeof HomeworkHelpOutputSchema>;


export const AcademicAssistantInputSchema = z.object({
  major: z.string().describe('The university major or field of study (e.g., Teknik Informatika, Ekonomi, Hukum, Kedokteran).'),
  topic: z.string().describe('The specific topic or subject matter within the major.'),
  request: z.string().describe('The user\'s specific question or request (e.g., "Jelaskan konsep OOP", "Buatkan ringkasan tentang hukum permintaan dan penawaran", "Apa saja jenis-jenis sel punca?").'),
});
export type AcademicAssistantInput = z.infer<typeof AcademicAssistantInputSchema>;

export const AcademicAssistantOutputSchema = z.object({
  explanation: z.string().describe('A comprehensive, university-level explanation answering the user\'s request. The explanation should be clear, well-structured, and use Markdown for formatting (e.g., headings, bold text, lists).'),
  imagePrompt: z.string().optional().describe("If the explanation would be significantly enhanced by an image, diagram, or chart, provide a concise, descriptive prompt for an image generation model. E.g., 'Diagram of a neural network architecture', 'Supply and demand curve graph', 'Illustration of the Krebs cycle'. Otherwise, this field should be omitted."),
  imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});
export type AcademicAssistantOutput = z.infer<typeof AcademicAssistantOutputSchema>;
