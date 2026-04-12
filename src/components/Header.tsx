'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';

export interface HeaderProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  showDefaultAuth?: boolean;
}

export default function Header({ leftContent, rightContent, showDefaultAuth = true }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-4 z-50 px-4 transition-all duration-500 w-full animate-slide-in">
      <div className="max-w-6xl mx-auto rounded-3xl transition-all duration-500 overflow-hidden relative"
        style={{
          background: 'var(--card-bg)',
          boxShadow: '0 10px 40px rgba(34, 197, 94, 0.15)',
          border: '1px solid var(--card-border)',
          backdropFilter: 'blur(16px)',
        }}>
        {/* Subtle animated gradient background layer */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-green-300 via-transparent to-emerald-300 animate-pulse" style={{ pointerEvents: 'none' }}></div>
        
        <div className="px-6 py-4 flex justify-between items-center relative z-10">
          
          <div className="flex items-center gap-4">
            {leftContent || (
              <Link href="/">
                <h1 className="text-3xl font-extrabold flex items-center gap-3 cursor-pointer group">
                  <span className="text-4xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    🐼
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300">
                    LingoMaster
                  </span>
                </h1>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {rightContent}
            
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative group overflow-hidden shadow-sm"
              style={{ 
                background: 'var(--input-bg)',
                border: '1px solid var(--card-border)',
              }}
              title={theme === 'light' ? 'Dark mode\'a geç' : 'Light mode\'a geç'}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-xl relative z-10 transition-transform duration-300 group-hover:rotate-12">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </button>

            {showDefaultAuth && (
              isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm"
                    style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
                    👤 {user?.username}
                  </span>
                  <Link
                    href="/admin"
                    className="px-5 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg relative overflow-hidden group"
                    style={{ background: 'var(--primary)', color: 'white' }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
                    <span className="relative z-10">⚙️ Admin</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-5 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg relative overflow-hidden group"
                    style={{ background: '#ef4444', color: 'white' }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
                    <span className="relative z-10">Çıkış</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/?auth=required"
                  className="px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl relative overflow-hidden group border border-transparent hover:border-white/20"
                  style={{ background: 'var(--primary)', color: 'white' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[150%] h-full bg-white/30 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-in-out skew-x-[-20deg]"></div>
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    <span>🔐</span> Giriş Yap
                  </span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}