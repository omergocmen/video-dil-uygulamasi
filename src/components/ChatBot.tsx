'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatBot({ isOpen, onToggle }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Merhaba! Ben LingoAssistant, senin İngilizce öğretmeninim. 🎓\n\nBana İngilizce hakkında her şeyi sorabilirsin:\n• Dil bilgisi kuralları\n• Kelime anlamları\n• Cevaplarını neden yanlış yaptığın\n• Çeviri yardımı\n\nNasıl yardımcı olabilirim?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white text-2xl z-50 animate-glow"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)'
        }}
      >
        {isOpen ? '✕' : '🐼'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-bounce-in"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          {/* Header */}
          <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                🐼
              </div>
              <div>
                <h3 className="font-bold">LingoAssistant</h3>
                <p className="text-sm text-white/80">İngilizce Öğretmeni</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--input-bg)' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'text-white rounded-br-md'
                      : 'shadow-md rounded-bl-md'
                  }`}
                  style={{
                    background: message.role === 'user' 
                      ? 'linear-gradient(135deg, var(--primary), var(--secondary))' 
                      : 'var(--card-bg)',
                    color: message.role === 'user' ? 'white' : 'var(--foreground)'
                  }}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="shadow-md p-3 rounded-2xl rounded-bl-md" style={{ background: 'var(--card-bg)' }}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary)' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{ background: 'var(--primary)' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{ background: 'var(--primary)' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Bir şeyler yazın..."
                className="flex-1 p-3 rounded-xl text-sm transition-all"
                style={{ 
                  border: '1px solid var(--card-border)', 
                  background: 'var(--input-bg)', 
                  color: 'var(--foreground)',
                  outline: 'none'
                }}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="text-white px-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}