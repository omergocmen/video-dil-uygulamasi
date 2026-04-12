'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Level, Question } from '@/types';

interface DataContextType {
  levels: Level[];
  questions: Record<number, Question[]>;
  currentLevel: number;
  loading: boolean;
  refreshLevels: () => Promise<void>;
  refreshQuestions: (levelId: number) => Promise<void>;
  setCurrentLevel: (levelId: number) => void;
  isLevelUnlocked: (levelOrder: number) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LEVELS_KEY = 'lingomaster_levels';
const QUESTIONS_KEY = 'lingomaster_questions';
const PROGRESS_KEY = 'current_level_id';

const DEFAULT_LEVELS: Level[] = [
  { id: 1, title: 'Temel Selamlaşmalar', order_index: 1 },
  { id: 2, title: 'Günlük Kelimeler', order_index: 2 },
  { id: 3, title: 'Renkler ve Sayılar', order_index: 3 },
  { id: 4, title: 'Aile Üyeleri', order_index: 4 },
  { id: 5, title: 'Yiyecek ve İçecekler', order_index: 5 },
];

const DEFAULT_QUESTIONS: Question[] = [
  { id: 1, level_id: 1, question_text: 'How do you say "Merhaba" in English?', type: 'multiple_choice', options: ['Hello', 'Goodbye', 'Thanks', 'Sorry'], correct_answer: 'Hello' },
  { id: 2, level_id: 1, question_text: 'What is the English word for "Teşekkürler"?', type: 'multiple_choice', options: ['Please', 'Thank you', 'Sorry', 'Yes'], correct_answer: 'Thank you' },
  { id: 3, level_id: 1, question_text: 'Complete: Good___ (İyi sabahlar)', type: 'fill_in_the_blank', options: null, correct_answer: 'morning' },
  { id: 4, level_id: 1, question_text: '"Güle güle" nasıl söylenir?', type: 'multiple_choice', options: ['Hello', 'Goodbye', 'Good morning', 'Good night'], correct_answer: 'Goodbye' },
  { id: 5, level_id: 1, question_text: 'Complete: How are ___?', type: 'fill_in_the_blank', options: null, correct_answer: 'you' },
  { id: 6, level_id: 2, question_text: 'What is "Elma" in English?', type: 'multiple_choice', options: ['Apple', 'Orange', 'Banana', 'Grape'], correct_answer: 'Apple' },
  { id: 7, level_id: 2, question_text: 'Translate: "Kırmızı"', type: 'fill_in_the_blank', options: null, correct_answer: 'red' },
  { id: 8, level_id: 2, question_text: 'Which one means "Kitap"?', type: 'multiple_choice', options: ['Pen', 'Book', 'Table', 'Chair'], correct_answer: 'Book' },
  { id: 9, level_id: 2, question_text: '"Su" İngilizce ne demek?', type: 'multiple_choice', options: ['Fire', 'Water', 'Air', 'Earth'], correct_answer: 'Water' },
  { id: 10, level_id: 2, question_text: 'Complete: I ___ a student.', type: 'fill_in_the_blank', options: null, correct_answer: 'am' },
  { id: 11, level_id: 3, question_text: 'What color is "Mavi"?', type: 'multiple_choice', options: ['Red', 'Blue', 'Green', 'Yellow'], correct_answer: 'Blue' },
  { id: 12, level_id: 3, question_text: 'Translate the number: "Beş"', type: 'fill_in_the_blank', options: null, correct_answer: 'five' },
  { id: 13, level_id: 3, question_text: '"Yeşil" hangi renk?', type: 'multiple_choice', options: ['Red', 'Blue', 'Green', 'Purple'], correct_answer: 'Green' },
  { id: 14, level_id: 3, question_text: 'How do you say "On" in English?', type: 'multiple_choice', options: ['One', 'Five', 'Ten', 'Twenty'], correct_answer: 'Ten' },
  { id: 15, level_id: 3, question_text: 'Complete: ___ (Üç)', type: 'fill_in_the_blank', options: null, correct_answer: 'three' },
  { id: 16, level_id: 4, question_text: 'What is "Anne" in English?', type: 'multiple_choice', options: ['Father', 'Mother', 'Sister', 'Brother'], correct_answer: 'Mother' },
  { id: 17, level_id: 4, question_text: 'Translate: "Kardeş"', type: 'fill_in_the_blank', options: null, correct_answer: 'sibling' },
  { id: 18, level_id: 4, question_text: '"Baba" nasıl söylenir?', type: 'multiple_choice', options: ['Mother', 'Father', 'Grandfather', 'Uncle'], correct_answer: 'Father' },
  { id: 19, level_id: 4, question_text: 'What is "Dede" in English?', type: 'multiple_choice', options: ['Father', 'Uncle', 'Grandfather', 'Brother'], correct_answer: 'Grandfather' },
  { id: 20, level_id: 4, question_text: 'Complete: My ___ is tall. (Kardeşim)', type: 'fill_in_the_blank', options: null, correct_answer: 'brother' },
  { id: 21, level_id: 5, question_text: 'What is "Ekmek" in English?', type: 'multiple_choice', options: ['Rice', 'Bread', 'Meat', 'Fish'], correct_answer: 'Bread' },
  { id: 22, level_id: 5, question_text: 'Translate: "Çay"', type: 'fill_in_the_blank', options: null, correct_answer: 'tea' },
  { id: 23, level_id: 5, question_text: '"Süt" İngilizce ne demek?', type: 'multiple_choice', options: ['Water', 'Juice', 'Milk', 'Coffee'], correct_answer: 'Milk' },
  { id: 24, level_id: 5, question_text: 'How do you say "Tavuk" in English?', type: 'multiple_choice', options: ['Beef', 'Pork', 'Chicken', 'Fish'], correct_answer: 'Chicken' },
  { id: 25, level_id: 5, question_text: 'Complete: I like ___. (Meyve)', type: 'fill_in_the_blank', options: null, correct_answer: 'fruit' },
];

function initializeData() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(LEVELS_KEY)) {
    localStorage.setItem(LEVELS_KEY, JSON.stringify(DEFAULT_LEVELS));
  }
  // Always ensure default questions exist - merge with existing if any
  const existingQuestions = localStorage.getItem(QUESTIONS_KEY);
  if (!existingQuestions) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(DEFAULT_QUESTIONS));
  } else {
    // Check if we have all default questions
    const parsed = JSON.parse(existingQuestions);
    const hasAllDefaults = DEFAULT_QUESTIONS.every(dq => 
      parsed.some((q: Question) => q.id === dq.id)
    );
    if (!hasAllDefaults) {
      // Merge default questions with existing ones (avoid duplicates)
      const merged = [...DEFAULT_QUESTIONS];
      parsed.forEach((q: Question) => {
        if (!merged.some(mq => mq.id === q.id)) {
          merged.push(q);
        }
      });
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(merged));
    }
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [questions, setQuestions] = useState<Record<number, Question[]>>({});
  const [currentLevel, setCurrentLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  const refreshLevels = useCallback(async () => {
    initializeData();
    const data = localStorage.getItem(LEVELS_KEY);
    const levelsData: Level[] = data ? JSON.parse(data) : DEFAULT_LEVELS;
    setLevels(levelsData.sort((a, b) => a.order_index - b.order_index));
    // Also refresh current level from localStorage
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      setCurrentLevel(parseInt(savedProgress, 10));
    }
  }, []);

  const refreshQuestions = useCallback(async (levelId: number) => {
    initializeData();
    const data = localStorage.getItem(QUESTIONS_KEY);
    const allQuestions: Question[] = data ? JSON.parse(data) : DEFAULT_QUESTIONS;
    const levelQuestions = allQuestions.filter(q => q.level_id === levelId);
    setQuestions(prev => ({ ...prev, [levelId]: levelQuestions }));
  }, []);

  const isLevelUnlocked = useCallback((levelOrder: number) => {
    return levelOrder <= currentLevel;
  }, [currentLevel]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await refreshLevels();
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      setCurrentLevel(savedProgress ? parseInt(savedProgress, 10) : 1);
      setLoading(false);
    }
    loadData();
  }, [refreshLevels]);

  return (
    <DataContext.Provider value={{
      levels,
      questions,
      currentLevel,
      loading,
      refreshLevels,
      refreshQuestions,
      setCurrentLevel: (levelId: number) => {
        setCurrentLevel(levelId);
        localStorage.setItem(PROGRESS_KEY, levelId.toString());
      },
      isLevelUnlocked,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}