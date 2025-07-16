
export type SchoolType = 'SDN' | 'SDIT' | 'MI' | 'SMP' | 'MTs' | 'SMA' | 'MA';
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

export interface User {
  name: string;
  username: string;
  email: string;
  schoolType: SchoolType;
  schoolName?: string;
  role: 'user' | 'admin';
  grade?: Grade;
  badge?: string;
  photoUrl?: string;
  password?: string;
  robloxUsername?: string;
  registeredAt?: string; // ISO string date
}
