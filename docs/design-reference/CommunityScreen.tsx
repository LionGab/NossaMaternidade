import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

const TRENDING = [
  { id: 1, topic: 'Pós-parto Real', rank: 1 },
  { id: 2, topic: 'Amamentação', rank: 2 },
  { id: 3, topic: 'Introdução Alimentar', rank: 3 },
  { id: 4, topic: 'Sono do Bebê', rank: 4 },
];

export function CommunityScreen() {
  return (
    <div className="flex flex-col pb-24 bg-white min-h-full">
      {/* Welcome */}
      <div className="mx-5 my-6 bg-red-50 rounded-3xl border border-red-100 p-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden mb-4 bg-white">
          <img src="https://i.imgur.com/oB9ewPG.jpg" className="w-full h-full object-cover" alt="Community" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comunidade NathIA</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Um espaço seguro para compartilhar, aprender e crescer juntas nessa jornada da maternidade.
        </p>
        <button className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg shadow-pink-500/20 transition-all active:scale-95">
          Entrar na Comunidade
        </button>
      </div>

      {/* Trending */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-gray-900" />
          <h3 className="text-lg font-bold text-gray-900">Tópicos em Alta</h3>
        </div>
        
        <div className="flex flex-col gap-2">
          {TRENDING.map((item) => (
            <div key={item.id} className="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors">
              <span className="font-medium text-gray-700">#{item.topic}</span>
              <span className="bg-red-100 text-pink-600 text-xs font-bold px-2 py-1 rounded-full">Top {item.rank}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-pink-500">
            <Users size={20} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Estatísticas</h3>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between pb-4 border-b border-gray-100">
             <span className="text-sm text-gray-600">Membros Ativos</span>
             <span className="font-bold text-pink-500">12.5k+</span>
          </div>
          <div className="flex justify-between pb-4 border-b border-gray-100">
             <span className="text-sm text-gray-600">Posts Compartilhados</span>
             <span className="font-bold text-pink-500">45.2k+</span>
          </div>
          <div className="flex justify-between">
             <span className="text-sm text-gray-600">Interações Diárias</span>
             <span className="font-bold text-pink-500">8.7k+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
