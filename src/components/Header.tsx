'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeProvider';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <header className="transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          🐼 LingoMaster
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:bg-white/20 text-white"
            title={theme === 'light' ? 'Dark mode\'a geç' : 'Light mode\'a geç'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link
            href="/admin"
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            ⚙️ {isAuthenticated ? 'Admin' : 'Giriş Yap'}
          </Link>
        </div>
      </div>
    </header>
  );
}