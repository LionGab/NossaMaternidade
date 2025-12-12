import React, { useState } from 'react';
import { Sparkles, Heart, Droplet, MessageCircle, Coffee, Home, Shirt, Activity, Plus, Award, Zap } from 'lucide-react';

const HABITS = [
  { id: 1, name: 'Banho Premium', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 2, name: 'Skincare', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' },
  { id: 3, name: 'Beber água', icon: Droplet, color: 'text-cyan-500', bg: 'bg-cyan-100' },
  { id: 4, name: 'Afirmação', icon: MessageCircle, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { id: 5, name: 'Café da Manhã', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 6, name: 'Cuidar da Casa', icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { id: 7, name: 'Look do Dia', icon: Shirt, color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 8, name: 'Treino', icon: Activity, color: 'text-red-500', bg: 'bg-red-100' },
];

export function HabitsScreen() {
  return (
    <div className="flex flex-col pb-24 bg-gray-50 min-h-full">
      <div className="px-5 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Meus Cuidados</h2>
          <p className="text-xs text-gray-400 mt-1">0 hábitos • 0 completos hoje</p>
        </div>
        <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-1.5 flex items-center gap-1.5 text-xs font-bold shadow-md shadow-pink-500/30 transition-colors">
          <Plus size={14} /> Novo
        </button>
      </div>

      {/* Calendar */}
      <div className="mx-5 mb-6 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <Activity size={14} className="text-blue-600" />
          </div>
          <span className="text-xs font-bold text-gray-700">Esta Semana</span>
        </div>
        
        <div className="flex justify-between gap-2">
          {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((day, i) => (
            <div key={day} className={`flex-1 flex flex-col items-center py-2 rounded-xl ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-50 text-gray-400'}`}>
              <span className="text-[10px] font-bold uppercase">{day}</span>
              <span className={`text-sm font-bold mt-1 ${i === 0 ? 'text-white' : 'text-gray-900'}`}>{7 + i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-blue-500 fill-blue-500" />
          <h3 className="text-lg font-bold text-blue-600">Criar Rápido</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {HABITS.map((habit) => {
            const Icon = habit.icon;
            return (
              <button key={habit.id} className="flex flex-col items-center gap-2">
                <div className={`w-full aspect-square rounded-2xl ${habit.bg} flex items-center justify-center transition-transform active:scale-95 border border-white/50`}>
                  <Icon size={24} className={habit.color} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 text-center leading-3">{habit.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="mx-5 p-6 bg-blue-50 rounded-3xl border border-blue-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
               <Activity size={16} className="text-white" />
             </div>
             <span className="text-lg font-bold text-blue-600">HOJE</span>
          </div>
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">0% completo</span>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full border-8 border-blue-200 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">0</span>
            <span className="text-xs font-bold text-blue-400">de 0</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-white/60 rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-lg font-bold text-amber-500">0</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Sequência</span>
          </div>
          <div className="flex-1 bg-white/60 rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Award size={14} className="text-blue-500 fill-blue-500" />
              <span className="text-lg font-bold text-blue-500">0%</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Sucesso</span>
          </div>
        </div>
      </div>
    </div>
  );
}
