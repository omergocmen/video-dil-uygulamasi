'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Level, Question, QuestionType } from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user, login, register, logout } = useAuth();
  const { levels, questions: allQuestions, loading, refreshLevels, refreshQuestions } = useData();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'levels' | 'questions'>('levels');
  const [newLevelTitle, setNewLevelTitle] = useState('');
  const [newLevelOrder, setNewLevelOrder] = useState(1);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    type: 'multiple_choice' as QuestionType,
    options: ['', '', '', ''],
    correct_answer: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/?auth=required');
    }
  }, [isAuthenticated, mounted, router]);

  useEffect(() => {
    if (isAuthenticated && levels.length > 0 && !selectedLevel) {
      setSelectedLevel(levels[0]);
      setNewLevelOrder(levels.length + 1);
    }
  }, [isAuthenticated, levels]);

  useEffect(() => {
    if (selectedLevel && isAuthenticated) {
      setQuestions(allQuestions[selectedLevel.id] || []);
    }
  }, [selectedLevel, allQuestions, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (login(username, password)) {
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!username.trim() || !email.trim() || !password.trim()) {
      setLoginError('Tüm alanları doldurun!');
      return;
    }

    if (password.length < 6) {
      setLoginError('Şifre en az 6 karakter olmalı!');
      return;
    }

    if (register(username, email, password)) {
      setUsername('');
      setEmail('');
      setPassword('');
    } else {
      setLoginError('Bu kullanıcı adı veya e-posta zaten kayıtlı!');
    }
  };

  const handleCreateLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLevelTitle.trim()) return;

    const newLevel: Level = {
      id: Date.now(),
      title: newLevelTitle.trim(),
      order_index: newLevelOrder,
    };

    const currentLevels = JSON.parse(localStorage.getItem('lingomaster_levels') || '[]');
    localStorage.setItem('lingomaster_levels', JSON.stringify([...currentLevels, newLevel]));
    
    setNewLevelTitle('');
    setNewLevelOrder(levels.length + 2);
    await refreshLevels();
  };

  const handleDeleteLevel = async (id: number) => {
    if (!confirm('Bu bölümü ve içindeki tüm soruları silmek istediğinize emin misiniz?')) return;

    const currentLevels = JSON.parse(localStorage.getItem('lingomaster_levels') || '[]');
    const filtered = currentLevels.filter((l: Level) => l.id !== id);
    localStorage.setItem('lingomaster_levels', JSON.stringify(filtered));

    const allQ = JSON.parse(localStorage.getItem('lingomaster_questions') || '[]');
    const filteredQ = allQ.filter((q: Question) => q.level_id !== id);
    localStorage.setItem('lingomaster_questions', JSON.stringify(filteredQ));

    if (selectedLevel?.id === id) {
      setSelectedLevel(null);
      setQuestions([]);
    }
    await refreshLevels();
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevel || !newQuestion.question_text.trim() || !newQuestion.correct_answer.trim()) return;

    const options = newQuestion.type === 'multiple_choice' 
      ? newQuestion.options.filter(o => o.trim()) 
      : null;

    const newQ: Question = {
      id: Date.now(),
      level_id: selectedLevel.id,
      question_text: newQuestion.question_text.trim(),
      type: newQuestion.type,
      options,
      correct_answer: newQuestion.correct_answer.trim(),
    };

    // Ensure default questions exist in localStorage before appending
    const QUESTIONS_KEY = 'lingomaster_questions';
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

    let allQ = JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]');
    // If localStorage is empty, initialize with default questions
    if (allQ.length === 0) {
      allQ = DEFAULT_QUESTIONS;
    }
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify([...allQ, newQ]));

    setNewQuestion({
      question_text: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
    });
    await refreshQuestions(selectedLevel.id);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;

    const allQ = JSON.parse(localStorage.getItem('lingomaster_questions') || '[]');
    const filtered = allQ.filter((q: Question) => q.id !== id);
    localStorage.setItem('lingomaster_questions', JSON.stringify(filtered));

    if (selectedLevel) {
      await refreshQuestions(selectedLevel.id);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center text-2xl font-bold animate-pulse" style={{ color: 'var(--foreground)' }}>
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Erişim Engellendi
          </h2>
          <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Bu sayfaya erişmek için giriş yapmalısınız.
          </p>
          <Link href="/" className="text-white px-6 py-3 rounded-full font-bold btn-primary">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <header className="card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>⚙️ Admin Paneli</h1>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm font-medium px-3 py-1 rounded-full"
                style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                👤 {user.username}
              </span>
            )}
            <Link
              href="/"
              className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{ 
                background: 'var(--primary)', 
                color: 'white',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
              }}
            >
              ← Ana Sayfaya Dön
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{ 
                background: '#ef4444', 
                color: 'white',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
              }}
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <button
            onClick={() => setActiveTab('levels')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'levels'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ color: activeTab === 'levels' ? 'var(--primary)' : 'var(--muted-foreground)' }}
          >
            📚 Bölümler ({levels.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'questions'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ color: activeTab === 'questions' ? 'var(--primary)' : 'var(--muted-foreground)' }}
          >
            ❓ Sorular ({questions.length})
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'levels' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Yeni Bölüm Ekle</h2>
              <form onSubmit={handleCreateLevel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Bölüm Adı
                  </label>
                  <input
                    type="text"
                    value={newLevelTitle}
                    onChange={(e) => setNewLevelTitle(e.target.value)}
                    placeholder="Örn: Temel Kelimeler"
                    className="w-full p-3 rounded-lg transition-all"
                    style={{ 
                      border: '1px solid var(--card-border)', 
                      background: 'var(--input-bg)', 
                      color: 'var(--foreground)',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Sıra Numarası
                  </label>
                  <input
                    type="number"
                    value={newLevelOrder}
                    onChange={(e) => setNewLevelOrder(parseInt(e.target.value))}
                    min={1}
                    className="w-full p-3 rounded-lg transition-all"
                    style={{ 
                      border: '1px solid var(--card-border)', 
                      background: 'var(--input-bg)', 
                      color: 'var(--foreground)',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white py-3 rounded-lg font-bold transition-all btn-primary"
                >
                  Bölüm Ekle
                </button>
              </form>
            </div>

            <div className="card rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Mevcut Bölümler</h2>
              {levels.length === 0 ? (
                <p className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>Henüz bölüm eklenmemiş</p>
              ) : (
                <div className="space-y-3">
                  {levels.map((level) => (
                    <div
                      key={level.id}
                      className="p-4 rounded-lg border-2 transition-all cursor-pointer"
                      style={{
                        borderColor: selectedLevel?.id === level.id ? 'var(--primary)' : 'var(--card-border)',
                        background: selectedLevel?.id === level.id ? 'var(--input-bg)' : 'transparent'
                      }}
                      onClick={() => {
                        setSelectedLevel(level);
                        setActiveTab('questions');
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>{level.title}</h3>
                          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sıra: {level.order_index}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLevel(level.id);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          style={{ color: 'var(--error)' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Yeni Soru Ekle</h2>
              {!selectedLevel ? (
                <p className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
                  Önce bir bölüm seçin
                </p>
              ) : (
                <form onSubmit={handleCreateQuestion} className="space-y-4">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--input-bg)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                      Seçili Bölüm: {selectedLevel.title}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                      Soru Tipi
                    </label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          type: e.target.value as QuestionType,
                          options: ['', '', '', ''],
                          correct_answer: '',
                        })
                      }
                      className="w-full p-3 rounded-lg transition-all"
                      style={{ 
                        border: '1px solid var(--card-border)', 
                        background: 'var(--input-bg)', 
                        color: 'var(--foreground)',
                        outline: 'none'
                      }}
                    >
                      <option value="multiple_choice">Çoktan Seçmeli</option>
                      <option value="fill_in_the_blank">Boşluk Doldurma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                      Soru Metni
                    </label>
                    <textarea
                      value={newQuestion.question_text}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, question_text: e.target.value })
                      }
                      placeholder="Örn: The cat is ___ the mat."
                      rows={3}
                      className="w-full p-3 rounded-lg transition-all resize-none"
                      style={{ 
                        border: '1px solid var(--card-border)', 
                        background: 'var(--input-bg)', 
                        color: 'var(--foreground)',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  {newQuestion.type === 'multiple_choice' && (
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                        Seçenekler
                      </label>
                      <div className="space-y-2">
                        {newQuestion.options.map((option, index) => (
                          <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Seçenek ${String.fromCharCode(65 + index)}`}
                            className="w-full p-3 rounded-lg transition-all"
                            style={{ 
                              border: '1px solid var(--card-border)', 
                              background: 'var(--input-bg)', 
                              color: 'var(--foreground)',
                              outline: 'none'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                      Doğru Cevap
                    </label>
                    <input
                      type="text"
                      value={newQuestion.correct_answer}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, correct_answer: e.target.value })
                      }
                      placeholder="Doğru cevabı yazın"
                      className="w-full p-3 rounded-lg transition-all"
                      style={{ 
                        border: '1px solid var(--card-border)', 
                        background: 'var(--input-bg)', 
                        color: 'var(--foreground)',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white py-3 rounded-lg font-bold transition-all btn-primary"
                  >
                    Soru Ekle
                  </button>
                </form>
              )}
            </div>

            <div className="card rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                Mevcut Sorular
                {selectedLevel && (
                  <span className="text-sm font-normal ml-2" style={{ color: 'var(--muted-foreground)' }}>
                    ({selectedLevel.title})
                  </span>
                )}
              </h2>
              {!selectedLevel ? (
                <p className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
                  Bir bölüm seçin
                </p>
              ) : questions.length === 0 ? (
                <p className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
                  Bu bölümde henüz soru yok
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-4 rounded-lg border transition-all"
                      style={{ borderColor: 'var(--card-border)' }}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                              #{index + 1}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                question.type === 'multiple_choice'
                                  ? 'bg-blue-100 dark:bg-blue-900'
                                  : 'bg-orange-100 dark:bg-orange-900'
                              }`}
                              style={{
                                color: question.type === 'multiple_choice' ? '#2563ea' : '#ea580c'
                              }}
                            >
                              {question.type === 'multiple_choice'
                                ? 'Çoktan Seçmeli'
                                : 'Boşluk Doldurma'}
                            </span>
                          </div>
                          <p className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                            {question.question_text}
                          </p>
                          {question.options && (
                            <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                              Seçenekler: {question.options.join(', ')}
                            </div>
                          )}
                          <div className="text-sm font-medium" style={{ color: 'var(--success)' }}>
                            ✓ {question.correct_answer}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          style={{ color: 'var(--error)' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}