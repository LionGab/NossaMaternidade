import React, { useState } from 'react';
import { Heart, MessageCircle, Sparkles, Shirt, Play, BookOpen, Activity, ShoppingBag } from 'lucide-react';

const SECTIONS = [
  { id: 1, name: 'Diário', icon: BookOpen, color: 'bg-pink-100 text-pink-600' },
  { id: 2, name: 'Saúde', icon: Activity, color: 'bg-blue-100 text-blue-600' },
  { id: 3, name: 'Dicas', icon: Sparkles, color: 'bg-yellow-100 text-yellow-600' },
  { id: 4, name: 'Enxoval', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
];

export function HomeScreen() {
  return (
    <div className="flex flex-col pb-24 bg-white min-h-full">
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div>
          <h2 className="text-xs font-bold text-gray-400 tracking-wider">BEM-VINDA</h2>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">
            Nossa Maternidade <span className="text-pink-600">.</span>
          </h1>
        </div>
        <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-purple-600">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nath"
            className="w-full h-full rounded-full bg-white border border-white"
            alt="Profile"
          />
        </div>
      </div>

      {/* Sections Grid (Substituted Stories) */}
      <div className="grid grid-cols-4 gap-4 px-5 mb-6">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <button key={section.id} className="flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${section.color}`}>
                <Icon size={24} />
              </div>
              <span className="text-xs font-bold text-gray-600">{section.name}</span>
            </button>
          );
        })}
      </div>

      {/* Banner Arrume-se */}
      <div className="px-5 mb-6">
        <div className="w-full rounded-2xl p-4 bg-gradient-to-br from-purple-600 to-pink-500 flex justify-between items-center shadow-lg shadow-purple-500/20">
          <div>
            <h3 className="text-lg font-bold text-white">Arrume-se Comigo</h3>
            <p className="text-xs text-white/80 mt-1">Veja os looks favoritos da semana</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Shirt size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* Main Feature Card */}
      <div className="mx-5 mb-8 rounded-3xl overflow-hidden bg-white shadow-xl shadow-pink-500/10 border border-gray-100 relative group">
        <div className="h-64 relative bg-gray-100">
          <img 
            src="https://i.imgur.com/x0EOyNE.jpg"
            className="w-full h-full object-cover"
            alt="Parto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={12} className="text-yellow-300 fill-yellow-300" />
            <span className="text-xs font-bold text-white">Viral</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white leading-tight">O Relato do Parto</h3>
            <p className="text-sm text-pink-200 mt-1">Sem dor e com muita emoção ✨</p>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
               <Play size={20} className="text-white ml-1" fill="white" />
            </div>
          </div>
        </div>
        
        <div className="p-4 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Heart size={18} className="text-pink-500 fill-pink-500" />
              <span className="text-xs font-bold text-gray-500">2.4M</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={18} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500">15k</span>
            </div>
          </div>
          <button className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 uppercase tracking-wide">
            Assistir Agora
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <h3 className="px-5 text-xl font-bold text-gray-900 mb-4">Em Destaque</h3>
        <div className="overflow-x-auto no-scrollbar px-5 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[120px] h-[180px] rounded-2xl overflow-hidden relative">
              <img
                src={`https://images.unsplash.com/photo-${i === 1 ? '1595950653106-6c9ebd614d3a' : i === 2 ? '1515488042361-25f06a2e8c12' : '1542038782-5174705a0c93'}?q=80&w=400&fit=crop`}
                className="w-full h-full object-cover"
                alt="Highlight"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span className="text-xs font-bold text-white">Lifestyle</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
