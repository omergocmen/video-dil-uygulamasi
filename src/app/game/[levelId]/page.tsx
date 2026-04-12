'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import { Level, Question, GameState, QuestionType } from '@/types';
import ChatBot from '@/components/ChatBot';

const PANDA_HAPPY = (
  <svg viewBox="0 0 100 100" className="w-20 h-20">
    {/* Kulaklar */}
    <circle cx="22" cy="22" r="14" fill="#1f2937" />
    <circle cx="78" cy="22" r="14" fill="#1f2937" />
    {/* Yüz */}
    <ellipse cx="50" cy="52" rx="40" ry="36" fill="white" stroke="#e5e7eb" strokeWidth="1" />
    {/* Göz çevresi siyah alanlar - kapalı mutlu gözler */}
    <path d="M 22 45 Q 32 38 42 45" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 58 45 Q 68 38 78 45" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Burun */}
    <ellipse cx="50" cy="56" rx="6" ry="4" fill="#1f2937" />
    {/* Geniş gülümseme */}
    <path d="M 38 62 Q 50 74 62 62" stroke="#1f2937" strokeWidth="2.5" fill="#fca5a5" strokeLinecap="round" />
    {/* Yanak pembeliği */}
    <ellipse cx="20" cy="55" rx="7" ry="5" fill="#fca5a5" opacity="0.7" />
    <ellipse cx="80" cy="55" rx="7" ry="5" fill="#fca5a5" opacity="0.7" />
    {/* Yıldızlar */}
    <text x="10" y="20" fontSize="12" fill="#fbbf24">✨</text>
    <text x="82" y="20" fontSize="12" fill="#fbbf24">✨</text>
  </svg>
);

const PANDA_SAD = (
  <svg viewBox="0 0 100 100" className="w-20 h-20">
    {/* Kulaklar */}
    <circle cx="22" cy="22" r="14" fill="#1f2937" />
    <circle cx="78" cy="22" r="14" fill="#1f2937" />
    {/* Yüz */}
    <ellipse cx="50" cy="52" rx="40" ry="36" fill="white" stroke="#e5e7eb" strokeWidth="1" />
    {/* Göz çevresi siyah alanlar */}
    <ellipse cx="32" cy="45" rx="13" ry="11" fill="#1f2937" />
    <ellipse cx="68" cy="45" rx="13" ry="11" fill="#1f2937" />
    {/* Göz beyazları */}
    <ellipse cx="32" cy="46" rx="7" ry="8" fill="white" />
    <ellipse cx="68" cy="46" rx="7" ry="8" fill="white" />
    {/* Göz bebekleri - aşağı bakıyor */}
    <circle cx="32" cy="48" r="4" fill="#1f2937" />
    <circle cx="68" cy="48" r="4" fill="#1f2937" />
    {/* Göz parıltısı */}
    <circle cx="34" cy="46" r="1.5" fill="white" />
    <circle cx="70" cy="46" r="1.5" fill="white" />
    {/* Üzgün kaşlar */}
    <path d="M 24 36 L 40 40" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    <path d="M 76 36 L 60 40" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    {/* Burun */}
    <ellipse cx="50" cy="56" rx="6" ry="4" fill="#1f2937" />
    {/* Üzgün ağız */}
    <path d="M 42 66 Q 50 60 58 66" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Gözyaşı */}
    <ellipse cx="25" cy="52" rx="2" ry="4" fill="#60a5fa" opacity="0.8" />
  </svg>
);

const PANDA_NORMAL = (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    {/* Kulaklar */}
    <circle cx="22" cy="22" r="14" fill="#1f2937" />
    <circle cx="78" cy="22" r="14" fill="#1f2937" />
    {/* Yüz */}
    <ellipse cx="50" cy="52" rx="40" ry="36" fill="white" stroke="#e5e7eb" strokeWidth="1" />
    {/* Göz çevresi siyah alanlar */}
    <ellipse cx="32" cy="45" rx="13" ry="11" fill="#1f2937" />
    <ellipse cx="68" cy="45" rx="13" ry="11" fill="#1f2937" />
    {/* Göz beyazları */}
    <ellipse cx="32" cy="44" rx="7" ry="8" fill="white" />
    <ellipse cx="68" cy="44" rx="7" ry="8" fill="white" />
    {/* Göz bebekleri */}
    <circle cx="33" cy="44" r="4" fill="#1f2937" />
    <circle cx="69" cy="44" r="4" fill="#1f2937" />
    {/* Göz parıltısı */}
    <circle cx="35" cy="42" r="1.5" fill="white" />
    <circle cx="71" cy="42" r="1.5" fill="white" />
    {/* Burun */}
    <ellipse cx="50" cy="56" rx="6" ry="4" fill="#1f2937" />
    {/* Ağız */}
    <path d="M 44 62 Q 50 68 56 62" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Yanak pembeliği */}
    <ellipse cx="22" cy="55" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />
    <ellipse cx="78" cy="55" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />
  </svg>
);

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const levelId = parseInt(params.levelId as string);

  const { questions: allQuestions, currentLevel, loading, refreshQuestions, setCurrentLevel, isLevelUnlocked } = useData();
  
  const [mounted, setMounted] = useState(false);
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isCompleted: false,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [fillAnswer, setFillAnswer] = useState('');
  const [pandaMood, setPandaMood] = useState<'normal' | 'happy' | 'sad'>('normal');
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'enter' | 'exit'>('enter');
  const hasAutoAdvanced = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (levelId && !isNaN(levelId)) {
      refreshQuestions(levelId);
    }
  }, [levelId]);

  useEffect(() => {
    if (allQuestions[levelId] && allQuestions[levelId].length > 0) {
      const levelQuestions = allQuestions[levelId];
      setQuestions(levelQuestions);
      // Reset game state when questions are loaded
      setGameState({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        isCompleted: false,
      });
      setSelectedAnswer(null);
      setShowResult(false);
      setFillAnswer('');
    }
  }, [allQuestions[levelId]]);

  useEffect(() => {
    if (mounted && questions.length > 0) {
      setDirection('enter');
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [gameState.currentQuestionIndex, mounted]);

  const currentQuestion = questions[gameState.currentQuestionIndex];
  const progress = questions.length > 0 ? ((gameState.currentQuestionIndex) / questions.length) * 100 : 0;

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = useCallback(() => {
    if (gameState.isCompleted) return;
    
    setDirection('exit');
    setIsAnimating(true);
    setTimeout(() => {
      if (gameState.currentQuestionIndex < questions.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        }));
        setSelectedAnswer(null);
        setShowResult(false);
        setFillAnswer('');
        setDirection('enter');
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
      } else {
        // Last question - calculate final score including current answer
        const finalScore = gameState.score;
        const passed = finalScore >= Math.ceil(questions.length * 0.7);

        if (passed) {
          setCurrentLevel(levelId + 1);
        }

        setGameState(prev => ({
          ...prev,
          isCompleted: true,
        }));
      }
    }, 300);
  }, [gameState.currentQuestionIndex, gameState.isCompleted, gameState.score, questions.length, levelId, setCurrentLevel]);

  const handleSubmitAnswer = () => {
    if (!currentQuestion || showResult) return;

    const answer = currentQuestion.type === 'fill_in_the_blank' ? fillAnswer : selectedAnswer;
    if (!answer) return;

    const isCorrect = answer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim();

    setPandaMood(isCorrect ? 'happy' : 'sad');
    setTimeout(() => setPandaMood('normal'), 1500);

    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [
        ...prev.answers,
        {
          questionId: currentQuestion.id,
          answer,
          isCorrect,
        },
      ],
    }));

    setShowResult(true);
  };

  // Auto-advance after showing result
  useEffect(() => {
    if (showResult && !gameState.isCompleted && !hasAutoAdvanced.current) {
      hasAutoAdvanced.current = true;
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showResult, gameState.isCompleted, handleNextQuestion]);

  // Reset auto-advance flag when moving to new question
  useEffect(() => {
    if (!showResult) {
      hasAutoAdvanced.current = false;
    }
  }, [showResult]);

  if (!mounted || loading || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ background: 'var(--background)' }}>
        <div className="text-2xl font-bold animate-pulse" style={{ color: 'var(--foreground)' }}>
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (gameState.isCompleted) {
    const passed = gameState.score >= Math.ceil(questions.length * 0.7);
    const percentage = Math.round((gameState.score / questions.length) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
        <div className="card rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce-in">
          <div className="text-6xl mb-4">
            {passed ? '🎉' : '💪'}
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {passed ? 'Tebrikler!' : 'Tekrar Dene!'}
          </h2>
          <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
            {level?.title} bölümünü {passed ? 'tamamladın' : 'tamamlayamadın'}!
          </p>
          
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--input-bg)' }}>
            <div className="text-5xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
              {percentage}%
            </div>
            <p style={{ color: 'var(--muted-foreground)' }}>
              {gameState.score} / {questions.length} doğru
            </p>
          </div>

          <div className="space-y-3">
            {passed && (
              <Link
                href="/"
                className="block w-full text-white py-3 rounded-full font-bold transition-all btn-primary"
              >
                Sonraki Bölüme Geç →
              </Link>
            )}
            <button
              onClick={() => {
                setGameState({
                  currentQuestionIndex: 0,
                  score: 0,
                  answers: [],
                  isCompleted: false,
                });
                setSelectedAnswer(null);
                setShowResult(false);
                setFillAnswer('');
              }}
              className="w-full py-3 rounded-full font-bold transition-all"
              style={{ background: 'var(--input-bg)', color: 'var(--foreground)' }}
            >
              Tekrar Dene
            </button>
            <Link
              href="/"
              className="block w-full py-3 rounded-full font-bold transition-all"
              style={{ background: 'var(--card-border)', color: 'var(--foreground)' }}
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>

        <ChatBot isOpen={showChat} onToggle={() => setShowChat(!showChat)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
      <header className="transition-all duration-300"
        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-white hover:text-white/80 transition-colors">
            ← Geri
          </Link>
          <div className="flex items-center gap-2">
            <span className={pandaMood === 'happy' ? 'animate-panda-happy' : pandaMood === 'sad' ? 'animate-panda-sad' : ''}>
              {pandaMood === 'happy' ? PANDA_HAPPY : pandaMood === 'sad' ? PANDA_SAD : PANDA_NORMAL}
            </span>
            <h1 className="text-xl font-bold text-white">{level?.title || `Bölüm ${levelId}`}</h1>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            🤖 AI Tutor
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="rounded-full h-4 overflow-hidden bg-white/20">
          <div
            className="bg-white h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-white/80 text-sm mt-2">
          <span>Soru {gameState.currentQuestionIndex + 1}/{questions.length}</span>
          <span>Skor: {gameState.score}</span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {currentQuestion && (
          <div className={`card rounded-3xl shadow-2xl p-8 ${isAnimating ? (direction === 'enter' ? 'animate-slide-in' : 'animate-slide-out') : ''}`}>
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.type === 'multiple_choice'
                  ? 'bg-blue-100'
                  : 'bg-orange-100'
              }`} style={{
                color: currentQuestion.type === 'multiple_choice' ? '#2563eb' : '#ea580c',
                backgroundColor: currentQuestion.type === 'multiple_choice' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(234, 88, 12, 0.1)'
              }}>
                {currentQuestion.type === 'multiple_choice' ? '📝 Çoktan Seçmeli' : '✏️ Boşluk Doldurma'}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
              {currentQuestion.question_text}
            </h2>

            {currentQuestion.type === 'multiple_choice' ? (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correct_answer;
                  let buttonClass = 'w-full p-4 rounded-xl border-2 text-left font-medium transition-all ';

                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += 'border-green-500 text-green-700';
                      buttonClass += ' bg-green-50';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += 'border-red-500 text-red-700';
                      buttonClass += ' bg-red-50';
                    } else {
                      buttonClass += 'border-gray-200 text-gray-400';
                      buttonClass += ' bg-gray-50';
                    }
                  } else if (isSelected) {
                    buttonClass += 'border-purple-500 text-purple-700';
                    buttonClass += ' bg-purple-50';
                  } else {
                    buttonClass += 'border-gray-200 hover:border-purple-300 hover:bg-gray-50';
                    buttonClass += ' text-gray-700';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <span className="inline-block w-8 h-8 rounded-full text-center leading-8 mr-3 font-bold" style={{ background: 'var(--input-bg)' }}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                      {showResult && isCorrect && <span className="ml-2">✓</span>}
                      {showResult && isSelected && !isCorrect && <span className="ml-2">✗</span>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={fillAnswer}
                  onChange={(e) => setFillAnswer(e.target.value)}
                  disabled={showResult}
                  placeholder="Cevabınızı yazın..."
                  className={`w-full p-4 rounded-xl border-2 text-lg font-medium transition-all ${
                    showResult
                      ? fillAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim()
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-purple-500 focus:outline-none'
                  }`}
                  style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}
                />
                {showResult && (
                  <p className={`mt-2 font-medium ${
                    fillAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim()
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {fillAnswer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim()
                      ? '✓ Doğru!'
                      : `✗ Yanlış! Doğru cevap: ${currentQuestion.correct_answer}`}
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={
                    currentQuestion.type === 'multiple_choice'
                      ? !selectedAnswer
                      : !fillAnswer.trim()
                  }
                  className="flex-1 text-white py-4 rounded-xl font-bold text-lg transition-all btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Kontrol Et
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 text-white py-4 rounded-xl font-bold text-lg transition-all btn-primary"
                >
                  {gameState.currentQuestionIndex < questions.length - 1 ? 'Sonraki Soru →' : 'Sonuçları Gör'}
                </button>
              )}
            </div>

            {showResult && (
              <div className={`mt-6 p-4 rounded-xl ${
                gameState.answers[gameState.answers.length - 1]?.isCorrect
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                <p className="font-medium">
                  {gameState.answers[gameState.answers.length - 1]?.isCorrect
                    ? '🎉 Harika! Doğru cevap!'
                    : '😔 Yanlış cevap. AI Tutor\'dan yardım alabilirsin!'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <ChatBot isOpen={showChat} onToggle={() => setShowChat(!showChat)} />
    </div>
  );
}