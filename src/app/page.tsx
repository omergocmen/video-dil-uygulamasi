'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import Header from '@/components/Header';

const PANDA_SVG = (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    <circle cx="22" cy="22" r="14" fill="#1f2937" />
    <circle cx="78" cy="22" r="14" fill="#1f2937" />
    <ellipse cx="50" cy="52" rx="40" ry="36" fill="white" stroke="#e5e7eb" strokeWidth="1" />
    <ellipse cx="32" cy="45" rx="13" ry="11" fill="#1f2937" />
    <ellipse cx="68" cy="45" rx="13" ry="11" fill="#1f2937" />
    <ellipse cx="32" cy="44" rx="7" ry="8" fill="white" />
    <ellipse cx="68" cy="44" rx="7" ry="8" fill="white" />
    <circle cx="33" cy="44" r="4" fill="#1f2937" />
    <circle cx="69" cy="44" r="4" fill="#1f2937" />
    <circle cx="35" cy="42" r="1.5" fill="white" />
    <circle cx="71" cy="42" r="1.5" fill="white" />
    <ellipse cx="50" cy="56" rx="6" ry="4" fill="#1f2937" />
    <path d="M 44 62 Q 50 68 56 62" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="22" cy="55" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />
    <ellipse cx="78" cy="55" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />
  </svg>
);

const PANDA_HAPPY_SVG = (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    <circle cx="22" cy="22" r="14" fill="#1f2937" />
    <circle cx="78" cy="22" r="14" fill="#1f2937" />
    <ellipse cx="50" cy="52" rx="40" ry="36" fill="white" stroke="#e5e7eb" strokeWidth="1" />
    <path d="M 22 45 Q 32 38 42 45" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M 58 45 Q 68 38 78 45" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
    <ellipse cx="50" cy="56" rx="6" ry="4" fill="#1f2937" />
    <path d="M 38 62 Q 50 74 62 62" stroke="#1f2937" strokeWidth="2.5" fill="#fca5a5" strokeLinecap="round" />
    <ellipse cx="20" cy="55" rx="7" ry="5" fill="#fca5a5" opacity="0.7" />
    <ellipse cx="80" cy="55" rx="7" ry="5" fill="#fca5a5" opacity="0.7" />
    <text x="10" y="20" fontSize="12" fill="#fbbf24">✨</text>
    <text x="82" y="20" fontSize="12" fill="#fbbf24">✨</text>
  </svg>
);

const PANDA_SAD_SVG = (
  <svg viewBox="0 0 100 100" className="w-16 h-16">
    <circle cx="22" cy="22" r="14" fill="#1f2937" />
    <circle cx="78" cy="22" r="14" fill="#1f2937" />
    <ellipse cx="50" cy="52" rx="40" ry="36" fill="white" stroke="#e5e7eb" strokeWidth="1" />
    <ellipse cx="32" cy="45" rx="13" ry="11" fill="#1f2937" />
    <ellipse cx="68" cy="45" rx="13" ry="11" fill="#1f2937" />
    <ellipse cx="32" cy="46" rx="7" ry="8" fill="white" />
    <ellipse cx="68" cy="46" rx="7" ry="8" fill="white" />
    <circle cx="32" cy="48" r="4" fill="#1f2937" />
    <circle cx="68" cy="48" r="4" fill="#1f2937" />
    <circle cx="34" cy="46" r="1.5" fill="white" />
    <circle cx="70" cy="46" r="1.5" fill="white" />
    <path d="M 24 36 L 40 40" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    <path d="M 76 36 L 60 40" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="50" cy="56" rx="6" ry="4" fill="#1f2937" />
    <path d="M 42 66 Q 50 60 58 66" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="25" cy="52" rx="2" ry="4" fill="#60a5fa" opacity="0.8" />
  </svg>
);

function HomeContent() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, login, register, logout } = useAuth();
  const { levels, currentLevel, loading, refreshLevels, isLevelUnlocked } = useData();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [pandaState, setPandaState] = useState<'normal' | 'happy' | 'sad'>('normal');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    setMounted(true);
    refreshLevels();
    if (searchParams.get('auth') === 'required') {
      setShowLoginModal(true);
    }
  }, [searchParams, refreshLevels]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshLevels();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshLevels]);

  useEffect(() => {
    if (!loading && levels.length > 0) {
      setPandaState('happy');
      setTimeout(() => setPandaState('normal'), 1500);
    }
  }, [levels.length, loading]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (login(username, password)) {
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setPandaState('happy');
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setPandaState('normal');
        setShowSuccessAnimation(false);
      }, 2000);
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı!');
      setPandaState('sad');
      setTimeout(() => setPandaState('normal'), 1500);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!username.trim() || !email.trim() || !password.trim()) {
      setLoginError('Tüm alanları doldurun!');
      setPandaState('sad');
      setTimeout(() => setPandaState('normal'), 1500);
      return;
    }

    if (password.length < 6) {
      setLoginError('Şifre en az 6 karakter olmalı!');
      setPandaState('sad');
      setTimeout(() => setPandaState('normal'), 1500);
      return;
    }

    if (register(username, email, password)) {
      setShowLoginModal(false);
      setUsername('');
      setEmail('');
      setPassword('');
      setPandaState('happy');
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setPandaState('normal');
        setShowSuccessAnimation(false);
      }, 2000);
    } else {
      setLoginError('Bu kullanıcı adı veya e-posta zaten kayıtlı!');
      setPandaState('sad');
      setTimeout(() => setPandaState('normal'), 1500);
    }
  };

  const getPandaSvg = () => {
    switch (pandaState) {
      case 'happy': return PANDA_HAPPY_SVG;
      case 'sad': return PANDA_SAD_SVG;
      default: return PANDA_SVG;
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-bounce mb-4">
            {PANDA_SVG}
          </div>
          <div className="text-2xl font-bold animate-pulse" style={{ color: 'var(--foreground)' }}>
            Yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-500"
      style={{ background: 'var(--background)' }}>
      
      {showSuccessAnimation && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="animate-success-burst">
            <div className="text-8xl">🎉</div>
          </div>
        </div>
      )}
      
      <Header
        leftContent={
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-16 h-16 transition-transform duration-300 ${pandaState === 'happy' ? 'animate-panda-happy' : pandaState === 'sad' ? 'animate-panda-sad' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
              {getPandaSvg()}
            </div>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300 hidden md:block">
              LingoMaster
            </span>
          </Link>
        }
        showDefaultAuth={isAuthenticated}
        rightContent={
          !isAuthenticated && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl relative overflow-hidden group border border-transparent hover:border-white/20"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[150%] h-full bg-white/30 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-in-out skew-x-[-20deg]"></div>
              </div>
              <span className="relative z-10 flex items-center gap-2">
                <span>🔐</span> Giriş Yap
              </span>
            </button>
          ) || undefined
        }
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 animate-fade-in" style={{ color: 'var(--foreground)' }}>
            İngilizce Öğrenmeye Başla! 🚀
          </h2>
          <p className="text-xl animate-slide-in" style={{ color: 'var(--muted-foreground)' }}>
            Bölümleri sırayla tamamla, seviyeni yükselt!
          </p>
          <div className="mt-6 inline-block rounded-full px-8 py-4 animate-bounce-in"
            style={{ 
              background: 'var(--primary)', 
              color: 'white',
              boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)'
            }}>
            <span className="font-bold text-lg">
              📊 Mevcut Seviye: {currentLevel}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((level, index) => {
            const unlocked = isLevelUnlocked(level.order_index);
            const completed = level.order_index < currentLevel;
            
            return (
              <Link
                key={level.id}
                href={unlocked ? `/game/${level.id}` : '#'}
                className={`relative p-6 rounded-2xl transition-all duration-500 transform card animate-slide-in group ${
                  unlocked
                    ? 'hover:scale-105 hover:-translate-y-2 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed grayscale'
                }`}
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                  boxShadow: unlocked ? '0 10px 40px rgba(34, 197, 94, 0.2)' : 'none'
                }}
              >
                <div className="absolute -top-3 -right-3">
                  {!unlocked && (
                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg animate-pulse"
                      style={{ background: 'var(--muted)', color: 'white' }}>
                      🔒
                    </span>
                  )}
                  {completed && (
                    <span className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg animate-bounce"
                      style={{ background: 'var(--success)', color: 'white' }}>
                      ✓
                    </span>
                  )}
                </div>

                <div className={`text-center ${!unlocked ? 'opacity-50' : ''}`}>
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {completed ? '🏆' : unlocked ? '📖' : '🔒'}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                    {level.title}
                  </h3>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Bölüm {level.order_index}
                  </p>
                  {unlocked && !completed && (
                    <button className="mt-4 px-6 py-2 rounded-full font-bold transition-all duration-300 hover:scale-110"
                      style={{ 
                        background: 'var(--primary)', 
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                      }}>
                      Başla →
                    </button>
                  )}
                  {completed && (
                    <span className="mt-4 inline-block font-bold" style={{ color: 'var(--success)' }}>
                      Tamamlandı ✓
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {levels.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce">📚</div>
            <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Henüz Bölüm Eklenmemiş
            </h3>
            <p className="text-lg mb-8" style={{ color: 'var(--muted-foreground)' }}>
              Admin panelinden yeni bölümler ve sorular ekleyebilirsiniz.
            </p>
            <Link
              href="/admin"
              className="inline-block px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
              style={{ 
                background: 'var(--primary)', 
                color: 'white',
                boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)'
              }}
            >
              Admin Paneline Git →
            </Link>
          </div>
        )}
      </main>

      <footer className="text-center py-8" style={{ borderTop: '1px solid var(--card-border)' }}>
        <p className="font-medium" style={{ color: 'var(--muted-foreground)' }}>
          🐼 LingoMaster - İngilizce Öğrenmenin Eğlenceli Yolu
        </p>
      </footer>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="card rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-bounce-in"
            style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.3)' }}>
            <div className="text-center mb-8">
              <div className="text-7xl mb-4 animate-bounce">
                {pandaState === 'happy' ? '🐼✨' : pandaState === 'sad' ? '🐼😢' : '🐼'}
              </div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
              </h2>
              <p className="mt-2 text-lg" style={{ color: 'var(--muted-foreground)' }}>
                {isLoginMode ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
              </p>
            </div>
            <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-5">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı Adı"
                className="w-full p-4 rounded-xl transition-all duration-300 text-lg"
                style={{ 
                  border: '2px solid var(--card-border)', 
                  background: 'var(--input-bg)', 
                  color: 'var(--foreground)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                autoFocus
              />
              {!isLoginMode && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta"
                  className="w-full p-4 rounded-xl transition-all duration-300 text-lg"
                  style={{ 
                    border: '2px solid var(--card-border)', 
                    background: 'var(--input-bg)', 
                    color: 'var(--foreground)',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
                />
              )}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className="w-full p-4 rounded-xl transition-all duration-300 text-lg"
                style={{ 
                  border: '2px solid var(--card-border)', 
                  background: 'var(--input-bg)', 
                  color: 'var(--foreground)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
              />
              {loginError && (
                <p className="text-red-500 text-sm font-bold animate-shake">{loginError}</p>
              )}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setLoginError('');
                  }}
                  className="flex-1 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-lg"
                  style={{ 
                    background: 'var(--input-bg)', 
                    color: 'var(--foreground)',
                    border: '2px solid var(--card-border)'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-lg"
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setLoginError('');
                  }}
                  className="text-sm font-bold transition-colors duration-300 hover:underline"
                  style={{ color: 'var(--primary)' }}
                >
                  {isLoginMode ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-300"
      style={{ background: 'var(--background)' }}>
      <div className="text-center">
        <div className="animate-bounce mb-4">
          {PANDA_SVG}
        </div>
        <div className="text-2xl font-bold animate-pulse" style={{ color: 'var(--foreground)' }}>
          Yükleniyor...
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}