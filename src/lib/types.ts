export type SchoolType = 'SDN' | 'SDIT' | 'MI';
export type Grade = '1' | '2' | '3' | '4' | '5' | '6';

export interface SchoolInfo {
    schoolType: SchoolType;
    grade: Grade;
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
}

export interface QuizData {
  quiz: Question[];
}

export interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface EssayQuestion {
  question: string;
  answer: string;
}

export interface ExamData {
  multipleChoice: MultipleChoiceQuestion[];
  essay: EssayQuestion[];
}
