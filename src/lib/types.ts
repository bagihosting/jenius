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
