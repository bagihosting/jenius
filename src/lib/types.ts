
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

//========= QUIZ TYPES =========//

export const QuestionSchema = z.object({
    question: z.string().describe("The text of the question."),
    options: z.array(z.string()).min(4).max(4).describe("An array of 4 possible answers, in 'A. ...', 'B. ...' format. Each option must be unique."),
    correctAnswer: z.string().describe("The correct answer to the question. PENTING: Nilai ini HARUS sama persis dengan salah satu string dari array 'options'."),
    imagePrompt: z.string().optional().describe("If the question is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Diagram of a plant cell', 'Map of Indonesia provinces'. Otherwise, this field should be omitted."),
    imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});
export type Question = z.infer<typeof QuestionSchema>;


export const GenerateQuizInputSchema = z.object({
  subjectContent: z
    .string()
    .describe('The content of the subject to generate the quiz from.'),
  numberOfQuestions: z
    .number()
    .default(10)
    .describe('The number of questions to generate for the quiz.'),
  schoolType: z.enum(['SDN', 'SDIT', 'MI', 'SMP', 'MTs', 'SMA', 'MA', 'AKADEMI', 'UNIVERSITAS']).describe('The type of school (e.g., SDN, MTs, SMA).'),
  grade: z.enum(['1','2','3','4','5','6','7','8','9','10','11','12']).describe('The grade level (e.g., 1, 8, 11).'),
  semester: z.enum(['1', '2']).describe('The semester (1 or 2).'),
  dateSeed: z.string().describe('The current date (YYYY-MM-DD) to ensure daily variety.'),
  userEmail: z.string().describe('The email of the user to ensure question uniqueness per user.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;


export const GenerateQuizOutputSchema = z.object({
  quiz: z.array(QuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


//========= EXAM TYPES =========//

export const MultipleChoiceQuestionSchema = z.object({
  question: z.string().describe("The text of the multiple-choice question."),
  options: z.array(z.string()).min(4).max(4).describe("An array of 4 possible answers in 'A. ...', 'B. ...' format. Each option must be unique."),
  correctAnswer: z.string().describe("The correct answer to the question, matching one of the options exactly."),
  explanation: z.string().describe("A short and genius-level explanation for the correct answer, using Markdown for bolding important words (e.g., **kata penting**)."),
  imagePrompt: z.string().optional().describe("If the question is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Diagram of the water cycle', 'Map of ancient Indonesian kingdoms'. Otherwise, this field should be omitted."),
  imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});
export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceQuestionSchema>;


export const EssayQuestionSchema = z.object({
    question: z.string().describe("The text of the essay question."),
    answer: z.string().describe("A simple, smart, and genius explanation for the answer. Format: 'Konsep Kunci: [explanation]\\n\\nJawaban Cerdas: [answer]'."),
    imagePrompt: z.string().optional().describe("If the question is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Illustration of tectonic plates moving', 'Chart of government branches'. Otherwise, this field should be omitted."),
    imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});
export type EssayQuestion = z.infer<typeof EssayQuestionSchema>;


export const GenerateExamInputSchema = z.object({
  subjectContent: z.string().describe('The content of the subject to generate the exam from, including semester context.'),
  dateSeed: z.string().describe('The current date (YYYY-MM-DD) to ensure daily variety.'),
  schoolType: z.enum(['SDN', 'SDIT', 'MI', 'SMP', 'MTs', 'SMA', 'MA', 'AKADEMI', 'UNIVERSITAS']).describe('The type of school (e.g., SDN, MTs, SMA).'),
  grade: z.enum(['1','2','3','4','5','6','7','8','9','10','11','12']).describe('The grade level (e.g., 1, 8, 11).'),
  semester: z.enum(['1', '2']).describe('The semester (1 or 2).'),
  userEmail: z.string().describe('The email of the user to ensure question uniqueness per user.'),
});
export type GenerateExamInput = z.infer<typeof GenerateExamInputSchema>;


export const GenerateExamOutputSchema = z.object({
  multipleChoice: z.array(MultipleChoiceQuestionSchema).min(5).max(5).describe('An array of 5 multiple-choice questions.'),
  essay: z.array(EssayQuestionSchema).min(2).max(2).describe('An array of 2 essay questions with detailed answers.'),
});
export type ExamData = z.infer<typeof GenerateExamOutputSchema>;


//========= USER TYPE =========//

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

//========= HOMEWORK HELPER TYPES =========//

export const HomeworkHelpInputSchema = z.object({
  subject: z.string().describe('The school subject for the homework question.'),
  question: z.string().describe('The homework question to be answered.'),
  schoolType: z.enum(['SDN', 'SDIT', 'MI', 'SMP', 'MTs', 'SMA', 'MA', 'AKADEMI', 'UNIVERSITAS']).describe('The type of school (e.g., SDN, MTs, SMA).'),
  grade: z.enum(['1','2','3','4','5','6','7','8','9','10','11','12']).describe('The grade level (e.g., 1, 8, 11).'),
  semester: z.enum(['1', '2']).describe('The semester (1 or 2).'),
});
export type HomeworkHelpInput = z.infer<typeof HomeworkHelpInputSchema>;

export const HomeworkHelpOutputSchema = z.object({
  answer: z.string().describe('The explanation and answer to the homework question.'),
  imagePrompt: z.string().optional().describe("If the answer is best explained with an image, provide a concise, descriptive prompt for an image generation model. E.g., 'Diagram of the water cycle', 'Map of ancient Indonesian kingdoms'. Otherwise, this field should be omitted."),
  imageUrl: z.string().optional().describe("URL of the generated image, if any."),
});
export type HomeworkHelpOutput = z.infer<typeof HomeworkHelpOutputSchema>;


//========= ACADEMIC ASSISTANT TYPES =========//

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


//========= UPGRADE REQUEST TYPE =========//
export interface UpgradeRequest {
  uid: string;
  name: string;
  username: string;
  email: string;
  universityName: string;
  major: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string | object; // Can be ISO string or Firebase ServerValue
}

//========= APP SETTINGS TYPES =========//
export interface UpgradeInfo {
  donationAmount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  instructions?: string;
}

export interface AppSettings {
    upgradeInfo: UpgradeInfo;
}
