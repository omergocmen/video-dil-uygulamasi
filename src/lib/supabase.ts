import { Level, Question } from '@/types';

// Default levels and questions for demo
const DEFAULT_LEVELS: Level[] = [
  { id: 1, title: 'Temel Selamlaşmalar', order_index: 1 },
  { id: 2, title: 'Günlük Kelimeler', order_index: 2 },
  { id: 3, title: 'Renkler ve Sayılar', order_index: 3 },
  { id: 4, title: 'Aile Üyeleri', order_index: 4 },
  { id: 5, title: 'Yiyecek ve İçecekler', order_index: 5 },
];

const DEFAULT_QUESTIONS: Question[] = [
  // Level 1: Temel Selamlaşmalar
  { id: 1, level_id: 1, question_text: 'How do you say "Merhaba" in English?', type: 'multiple_choice', options: ['Hello', 'Goodbye', 'Thanks', 'Sorry'], correct_answer: 'Hello' },
  { id: 2, level_id: 1, question_text: 'What is the English word for "Teşekkürler"?', type: 'multiple_choice', options: ['Please', 'Thank you', 'Sorry', 'Yes'], correct_answer: 'Thank you' },
  { id: 3, level_id: 1, question_text: 'Complete: Good___ (İyi sabahlar)', type: 'fill_in_the_blank', options: null, correct_answer: 'morning' },
  { id: 4, level_id: 1, question_text: '"Güle güle" nasıl söylenir?', type: 'multiple_choice', options: ['Hello', 'Goodbye', 'Good morning', 'Good night'], correct_answer: 'Goodbye' },
  { id: 5, level_id: 1, question_text: 'Complete: How are ___?', type: 'fill_in_the_blank', options: null, correct_answer: 'you' },

  // Level 2: Günlük Kelimeler
  { id: 6, level_id: 2, question_text: 'What is "Elma" in English?', type: 'multiple_choice', options: ['Apple', 'Orange', 'Banana', 'Grape'], correct_answer: 'Apple' },
  { id: 7, level_id: 2, question_text: 'Translate: "Kırmızı"', type: 'fill_in_the_blank', options: null, correct_answer: 'red' },
  { id: 8, level_id: 2, question_text: 'Which one means "Kitap"?', type: 'multiple_choice', options: ['Pen', 'Book', 'Table', 'Chair'], correct_answer: 'Book' },
  { id: 9, level_id: 2, question_text: '"Su" İngilizce ne demek?', type: 'multiple_choice', options: ['Fire', 'Water', 'Air', 'Earth'], correct_answer: 'Water' },
  { id: 10, level_id: 2, question_text: 'Complete: I ___ a student.', type: 'fill_in_the_blank', options: null, correct_answer: 'am' },

  // Level 3: Renkler ve Sayılar
  { id: 11, level_id: 3, question_text: 'What color is "Mavi"?', type: 'multiple_choice', options: ['Red', 'Blue', 'Green', 'Yellow'], correct_answer: 'Blue' },
  { id: 12, level_id: 3, question_text: 'Translate the number: "Beş"', type: 'fill_in_the_blank', options: null, correct_answer: 'five' },
  { id: 13, level_id: 3, question_text: '"Yeşil" hangi renk?', type: 'multiple_choice', options: ['Red', 'Blue', 'Green', 'Purple'], correct_answer: 'Green' },
  { id: 14, level_id: 3, question_text: 'How do you say "On" in English?', type: 'multiple_choice', options: ['One', 'Five', 'Ten', 'Twenty'], correct_answer: 'Ten' },
  { id: 15, level_id: 3, question_text: 'Complete: ___ (Üç)', type: 'fill_in_the_blank', options: null, correct_answer: 'three' },

  // Level 4: Aile Üyeleri
  { id: 16, level_id: 4, question_text: 'What is "Anne" in English?', type: 'multiple_choice', options: ['Father', 'Mother', 'Sister', 'Brother'], correct_answer: 'Mother' },
  { id: 17, level_id: 4, question_text: 'Translate: "Kardeş"', type: 'fill_in_the_blank', options: null, correct_answer: 'sibling' },
  { id: 18, level_id: 4, question_text: '"Baba" nasıl söylenir?', type: 'multiple_choice', options: ['Mother', 'Father', 'Grandfather', 'Uncle'], correct_answer: 'Father' },
  { id: 19, level_id: 4, question_text: 'What is "Dede" in English?', type: 'multiple_choice', options: ['Father', 'Uncle', 'Grandfather', 'Brother'], correct_answer: 'Grandfather' },
  { id: 20, level_id: 4, question_text: 'Complete: My ___ is tall. (Kardeşim)', type: 'fill_in_the_blank', options: null, correct_answer: 'brother' },

  // Level 5: Yiyecek ve İçecekler
  { id: 21, level_id: 5, question_text: 'What is "Ekmek" in English?', type: 'multiple_choice', options: ['Rice', 'Bread', 'Meat', 'Fish'], correct_answer: 'Bread' },
  { id: 22, level_id: 5, question_text: 'Translate: "Çay"', type: 'fill_in_the_blank', options: null, correct_answer: 'tea' },
  { id: 23, level_id: 5, question_text: '"Süt" İngilizce ne demek?', type: 'multiple_choice', options: ['Water', 'Juice', 'Milk', 'Coffee'], correct_answer: 'Milk' },
  { id: 24, level_id: 5, question_text: 'How do you say "Tavuk" in English?', type: 'multiple_choice', options: ['Beef', 'Pork', 'Chicken', 'Fish'], correct_answer: 'Chicken' },
  { id: 25, level_id: 5, question_text: 'Complete: I like ___. (Meyve)', type: 'fill_in_the_blank', options: null, correct_answer: 'fruit' },
];

// Storage keys
const LEVELS_KEY = 'lingomaster_levels';
const QUESTIONS_KEY = 'lingomaster_questions';
const PROGRESS_KEY = 'current_level_id';

// Initialize data
function initializeData() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(LEVELS_KEY)) {
    localStorage.setItem(LEVELS_KEY, JSON.stringify(DEFAULT_LEVELS));
  }
  if (!localStorage.getItem(QUESTIONS_KEY)) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(DEFAULT_QUESTIONS));
  }
}

// Level functions
export async function getLevels(): Promise<Level[]> {
  initializeData();
  const data = localStorage.getItem(LEVELS_KEY);
  const levels: Level[] = data ? JSON.parse(data) : DEFAULT_LEVELS;
  return levels.sort((a, b) => a.order_index - b.order_index);
}

export async function getLevelById(id: number): Promise<Level | null> {
  const levels = await getLevels();
  return levels.find(l => l.id === id) || null;
}

export async function createLevel(title: string, order_index: number): Promise<Level> {
  const levels = await getLevels();
  const newId = Math.max(...levels.map(l => l.id), 0) + 1;
  const newLevel: Level = { id: newId, title, order_index };
  levels.push(newLevel);
  localStorage.setItem(LEVELS_KEY, JSON.stringify(levels));
  return newLevel;
}

export async function deleteLevel(id: number): Promise<void> {
  const levels = await getLevels();
  const filtered = levels.filter(l => l.id !== id);
  localStorage.setItem(LEVELS_KEY, JSON.stringify(filtered));
  
  // Also delete related questions
  const questions = await getQuestionsByLevelId(id);
  for (const q of questions) {
    await deleteQuestion(q.id);
  }
}

// Question functions
export async function getQuestionsByLevelId(levelId: number): Promise<Question[]> {
  initializeData();
  const data = localStorage.getItem(QUESTIONS_KEY);
  const questions: Question[] = data ? JSON.parse(data) : DEFAULT_QUESTIONS;
  return questions.filter(q => q.level_id === levelId);
}

export async function createQuestion(
  level_id: number,
  question_text: string,
  type: 'multiple_choice' | 'fill_in_the_blank',
  options: string[] | null,
  correct_answer: string
): Promise<Question> {
  const data = localStorage.getItem(QUESTIONS_KEY);
  const questions: Question[] = data ? JSON.parse(data) : [];
  const newId = Math.max(...questions.map(q => q.id), 0) + 1;
  const newQuestion: Question = { id: newId, level_id, question_text, type, options, correct_answer };
  questions.push(newQuestion);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  return newQuestion;
}

export async function deleteQuestion(id: number): Promise<void> {
  const data = localStorage.getItem(QUESTIONS_KEY);
  const questions: Question[] = data ? JSON.parse(data) : [];
  const filtered = questions.filter(q => q.id !== id);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filtered));
}

// Progress functions
export function getProgress(): number {
  if (typeof window === 'undefined') return 1;
  const saved = localStorage.getItem(PROGRESS_KEY);
  return saved ? parseInt(saved, 10) : 1;
}

export function setProgress(levelId: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, levelId.toString());
}

export function isLevelUnlocked(levelOrder: number): boolean {
  const currentLevel = getProgress();
  return levelOrder <= currentLevel;
}
