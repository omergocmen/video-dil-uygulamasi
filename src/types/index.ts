// Level types
export interface Level {
  id: number;
  title: string;
  order_index: number;
}

// Question types
export type QuestionType = 'multiple_choice' | 'fill_in_the_blank';

export interface Question {
  id: number;
  level_id: number;
  question_text: string;
  type: QuestionType;
  options: string[] | null;
  correct_answer: string;
}

// Progress types
export interface Progress {
  user_id: string;
  current_level_id: number;
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Game state types
export interface GameState {
  currentQuestionIndex: number;
  score: number;
  answers: { questionId: number; answer: string; isCorrect: boolean }[];
  isCompleted: boolean;
}