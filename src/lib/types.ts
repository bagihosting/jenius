export interface Subject {
  id: string;
  title: string;
  icon: string; // Changed from React.ComponentType to string
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
