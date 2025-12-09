import React, { useState } from 'react';
import { Zap, Send } from 'lucide-react';

const QUICK_QUESTIONS = [
  'Dicas de amamentação?',
  'Como melhorar o sono do bebê?',
  'Ideias de lanche saudável',
];

export function NathIAScreen() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-full bg-white pb-24">
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center">
        
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 rotate-6 shadow-xl shadow-purple-500/30 flex items-center justify-center relative z-10">
            <Zap size={48} className="text-white fill-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Olá, eu sou a NathIA!
        </h1>
        
        <p className="text-sm text-gray-500 text-center max-w-[280px] leading-relaxed mb-8">
          Sua assistente virtual para dúvidas sobre maternidade, rotina e cuidados. Pergunte o que quiser!
        </p>

        <div className="w-full flex flex-col gap-3">
          {QUICK_QUESTIONS.map((q, i) => (
            <button 
              key={i}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-2xl text-left text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
            >
              ✨ {q}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-white sticky bottom-20">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-3">
          <input 
            type="text"
            placeholder="Digite sua dúvida..."
            className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-gray-900 placeholder:text-gray-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
