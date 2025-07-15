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
}

export interface EssayQuestion {
  question: string;
  answer: string;
}

export interface ExamData {
  multipleChoice: MultipleChoiceQuestion[];
  essay: EssayQuestion[];
}
