/**
 * Maternidade Mobile App Component (Nathália Valente Edition)
 * 
 * A production-grade mobile interface designed for deployment readiness.
 * Theme: Vibrant & Youthful (Pink, Blue, Purple) - "Tiktok Aesthetic" mixed with Maternal maturity.
 */

import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  User, 
  Bell, 
  Heart, 
  MessageCircle,
  Play,
  ShoppingBag,
  Award,
  Baby,
  Camera,
  Sparkles,
  Zap,
  Instagram,
  Bot,
  Star,
  Droplet,
  Coffee,
  Shirt,
  Activity,
  CheckCircle2,
  Plus,
  Map,
  Smile
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Styles Injection & Theme Config ---
const AppStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    :root {
      --primary-pink: #FFB8D9;
      --primary-blue: #B8D4FF;
      --primary-purple: #D9B8FF;
      --accent-peach: #FFD6A5;
      --accent-mint: #A8E6CF;
    }

    .font-heading {
      font-family: 'Outfit', sans-serif;
    }
    
    .font-body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #FFB8D9 0%, #D9B8FF 100%);
    }

    .bg-gradient-blue {
      background: linear-gradient(135deg, #B8D4FF 0%, #D4E8FF 100%);
    }
    
    .bg-gradient-peach {
      background: linear-gradient(135deg, #FFD6A5 0%, #FFE5C9 100%);
    }
  `}</style>
);

// --- Mock Data ---
const STORIES = [
  { id: 1, name: "Parto Real", img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop", ring: "from-pink-300 to-purple-300" },
  { id: 2, name: "Thales", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop", ring: "from-blue-300 to-cyan-200" },
  { id: 3, name: "NAVA", img: "https://images.unsplash.com/photo-1576435728678-38d01d52e0a3?q=80&w=800&auto=format&fit=crop", ring: "from-pink-300 to-orange-300" },
  { id: 4, name: "Tattoo", img: "https://images.unsplash.com/photo-1560705522-3e69772a837e?q=80&w=800&auto=format&fit=crop", ring: "from-purple-300 to-indigo-300" },
  { id: 5, name: "Viagens", img: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=800&auto=format&fit=crop", ring: "from-green-300 to-emerald-300" },
];

const QUICK_HABITS = [
  { id: 1, name: "Banho Premium", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-100" },
  { id: 2, name: "Skincare", icon: Heart, color: "text-pink-400", bg: "bg-pink-100" },
  { id: 3, name: "Beber água", icon: Droplet, color: "text-cyan-400", bg: "bg-cyan-100" },
  { id: 4, name: "Afirmação", icon: MessageCircle, color: "text-amber-400", bg: "bg-amber-100" },
  { id: 5, name: "Café da Manhã", icon: Coffee, color: "text-orange-400", bg: "bg-orange-100" },
  { id: 6, name: "Cuidar da Casa", icon: Home, color: "text-emerald-400", bg: "bg-emerald-100" },
  { id: 7, name: "Look do Dia", icon: Shirt, color: "text-purple-400", bg: "bg-purple-100" },
  { id: 8, name: "Treino", icon: Activity, color: "text-rose-400", bg: "bg-rose-100" },
];

// --- Components ---

const Header = ({ title }: { title?: string }) => (
  <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-pink-100 transition-all duration-300">
    <div className="flex flex-col justify-center">
      {title ? (
         <h1 className="text-xl font-heading font-extrabold text-gray-800">{title}</h1>
      ) : (
        <div className="h-8 flex items-center">
          <img src="https://i.imgur.com/jzb0IgO.jpg" alt="Nossa Maternidade" className="h-full object-contain" />
        </div>
      )}
    </div>
    <div className="flex items-center gap-2">
      <button className="relative p-2.5 rounded-full hover:bg-pink-100 text-gray-500 hover:text-pink-400 transition-colors group">
        <Bell size={22} strokeWidth={2} />
        <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-pink-300 rounded-full border-2 border-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  </div>
);

const StoryBubble = ({ story }: { story: typeof STORIES[0] }) => (
  <button className="flex flex-col items-center gap-2 min-w-[72px] group">
    <div className={cn(
      "w-[70px] h-[70px] rounded-full p-[3px] bg-gradient-to-tr",
      story.ring
    )}>
      <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
        <img src={story.img} alt={story.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
      </div>
    </div>
    <span className="text-[11px] font-semibold text-gray-700">{story.name}</span>
  </button>
);

const MainCard = () => (
  <div className="mx-6 mb-8 relative group cursor-pointer">
    <div className="absolute inset-0 bg-pink-300 blur-2xl opacity-15 group-hover:opacity-25 transition-opacity rounded-3xl" />
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-pink-200/30 border border-pink-100">
      <div className="h-[500px] relative">
        <video 
          src="https://i.imgur.com/x0EOyNE.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
          <span className="text-xs font-bold text-white flex items-center gap-1">
            <Sparkles size={12} className="text-yellow-300" /> Viral
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white font-heading font-bold text-xl leading-tight mb-2">
            O Relato do Parto <br/>
            <span className="text-pink-200 text-base font-normal">Sem dor e com muita emoção ✨</span>
          </h2>
        </div>
      </div>
      
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Heart size={18} className="text-pink-500 fill-pink-500" />
            <span className="text-xs font-bold">2.4M</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MessageCircle size={18} />
            <span className="text-xs font-bold">15k</span>
          </div>
        </div>
        <button className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 uppercase tracking-wide">
          Assistir Agora
        </button>
      </div>
    </div>
  </div>
);

// --- Tabs Content ---

const HomeTab = () => (
  <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">

    {/* Header Greeting */}
    <div className="px-6 pt-6 pb-4">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-gray-800">
          Olá, <span className="text-pink-400">Nath Lovers!</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1 max-w-[200px] leading-tight">
          Confira as novidades do universo da Nath
        </p>
      </div>
    </div>

    <div className="px-6 mb-6">
       <div className="p-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl text-white shadow-lg shadow-purple-200/30 flex items-center justify-center cursor-pointer">
          <h3 className="font-heading font-bold text-lg text-center">O DIA MAIS FELIZ DA MINHA VIDA 🩵</h3>
       </div>
    </div>

    <MainCard />

    {/* Propósito - África Project */}
    <div className="px-6 mb-8">
      <h3 className="font-heading font-bold text-lg text-gray-800 mb-4">Propósito</h3>
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl overflow-hidden shadow-lg">
        <img 
          src="https://i.imgur.com/placeholder-africa.jpg" 
          className="w-full h-48 object-cover"
          alt="Propósito"
        />
        <div className="p-5">
          <h4 className="font-heading font-bold text-xl text-gray-800 mb-2">
            Resgatando Infâncias na África
          </h4>
          <p className="text-gray-600 text-sm mb-1 font-medium">
            Alfabetização de mais de 200 crianças.
          </p>
          <p className="text-gray-500 text-xs mb-4">
            Parte da renda do app é destinada a este sonho.
          </p>
          <button className="w-full bg-gradient-to-r from-pink-300 to-purple-300 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-shadow duration-300">
            Saiba como ajudar
          </button>
        </div>
      </div>
    </div>

    {/* Últimos Artigos */}
    <div className="px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-bold text-gray-800">Últimos Artigos</h2>
        <button className="text-xs font-bold text-pink-400 hover:text-pink-500">VER TUDO</button>
      </div>
      <div className="space-y-4">
        {/* Article Card 1 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          <img 
            src="https://i.imgur.com/w4rZvGG.jpg" 
            className="w-full h-40 object-cover"
            alt="Artigo"
          />
          <div className="p-4">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wide">DESABAFO</span>
            <h4 className="font-heading font-bold text-base text-gray-800 mt-1">
              Maternidade Real: Meus medos e erros
            </h4>
          </div>
        </div>

        {/* Article Card 2 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          <img 
            src="https://i.imgur.com/placeholder-article2.jpg" 
            className="w-full h-40 object-cover"
            alt="Artigo"
          />
          <div className="p-4">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wide">DESABAFO</span>
            <h4 className="font-heading font-bold text-base text-gray-800 mt-1">
              Maternidade Real: Meus medos e erros
            </h4>
          </div>
        </div>
      </div>
    </div>

    <div className="px-6 mb-8">
      <h2 className="text-xl font-heading font-bold text-gray-800 mb-4">Em Destaque</h2>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {[
          'https://i.imgur.com/2pF5jEl.jpg',
          'https://i.imgur.com/vmM9BVt.jpg',
          'https://i.imgur.com/XfI71Gh.jpg'
        ].map((img, i) => (
          <div key={i} className="min-w-[140px] aspect-[3/4] rounded-2xl bg-gray-100 relative overflow-hidden">
            <img 
               src={img}
               className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <span className="text-white text-xs font-bold">Lifestyle</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CommunityTab = () => (
  <div className="pb-32 pt-4 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-pink-100 rounded-2xl overflow-hidden text-center mb-8 pb-6">
      <div className="h-40 w-full relative mb-4">
          <img src="https://i.imgur.com/oB9ewPG.jpg" className="w-full h-full object-cover" alt="Mães Valente" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-100 to-transparent" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2 relative z-10 -mt-8">Mães Valente</h2>
      <p className="text-gray-600 text-sm mb-6 px-6">
        Um espaço seguro para compartilhar, aprender e crescer juntas nessa jornada da maternidade.
      </p>
      <div className="px-6">
        <button className="bg-pink-300 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-pink-300/30 w-full hover:bg-pink-400 transition-colors">
            Entrar na Comunidade
        </button>
      </div>
    </div>

    <h3 className="font-heading font-bold text-lg text-gray-800 mb-4">Tópicos em Alta</h3>
    <div className="space-y-3">
      {['Pós-parto Real', 'Amamentação', 'Introdução Alimentar', 'Sono do Bebê'].map((topic, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-white border border-pink-100 rounded-xl shadow-sm">
          <span className="font-medium text-gray-700">#{topic}</span>
          <span className="text-xs font-bold text-pink-400 bg-pink-100 px-2 py-1 rounded-full">Top {i+1}</span>
        </div>
      ))}
    </div>
  </div>
);

const NathIATab = () => (
  <div className="pb-32 flex flex-col h-full">
    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gradient-to-tr from-purple-300 to-pink-300 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-purple-200/30 rotate-6">
        <Bot size={48} className="text-white" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">Olá, eu sou a NathIA!</h2>
      <p className="text-gray-500 text-sm max-w-[260px] leading-relaxed">
        Sua assistente virtual para dúvidas sobre maternidade, rotina e cuidados. Pergunte o que quiser!
      </p>
      
      <div className="mt-8 grid grid-cols-1 gap-3 w-full">
        {["Dicas de amamentação?", "Como melhorar o sono do bebê?", "Ideias de lanche saudável"].map((q, i) => (
          <button key={i} className="text-sm text-left p-4 bg-purple-50 rounded-xl text-gray-700 hover:bg-purple-100 hover:text-purple-500 transition-colors">
            ✨ {q}
          </button>
        ))}
      </div>
    </div>
    <div className="p-4 border-t border-pink-100 bg-white sticky bottom-[90px]">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Digite sua dúvida..." 
          className="w-full bg-purple-50 text-gray-800 rounded-full py-4 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <button className="absolute right-2 top-2 p-2 bg-purple-300 rounded-full text-white">
          <Zap size={18} />
        </button>
      </div>
    </div>
  </div>
);

const ContentTab = ({ onNavigate }: { onNavigate: (tab: any) => void }) => (
  <div className="pb-32 pt-4 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-6 rounded-3xl overflow-hidden shadow-lg relative h-48 group">
      <img src="https://i.imgur.com/tNIrNIs.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Mundo da Nath" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
         <h2 className="text-3xl font-heading font-bold text-white">Mundo da Nath</h2>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div 
        onClick={() => onNavigate('vibe')}
        className="col-span-2 bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 rounded-3xl p-1 text-white relative overflow-hidden shadow-lg shadow-orange-900/20 cursor-pointer group"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-5 h-full flex items-center justify-between">
           <div>
              <div className="flex items-center gap-2 mb-1">
                <Camera size={20} className="text-white" />
                <h3 className="text-xl font-bold">Vibe do Dia</h3>
              </div>
              <p className="text-white/90 text-xs">Registre seu momento</p>
           </div>
           <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Play size={20} fill="currentColor" className="text-white" />
           </div>
        </div>
      </div>

      <div className="col-span-2 bg-gradient-primary rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-pink-200/30">
        <div className="relative z-10">
          <ShoppingBag className="mb-4 text-white/80" />
          <h3 className="text-2xl font-bold mb-1">NAVA Beachwear</h3>
          <p className="text-white/80 text-xs mb-4">Nova coleção disponível</p>
          <button className="bg-white text-pink-400 text-xs font-bold py-2 px-4 rounded-full">
            Ver Loja
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="bg-blue-100 rounded-3xl p-5 flex flex-col justify-between h-40 border border-blue-200">
        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-500">
          <Map size={20} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 leading-tight">Projeto África</h4>
          <span className="text-[10px] font-bold text-blue-400 mt-1 block">Saiba mais →</span>
        </div>
      </div>

      <div className="bg-purple-100 rounded-3xl p-5 flex flex-col justify-between h-40 border border-purple-200">
        <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-500">
          <Award size={20} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 leading-tight">Cursos & Mentorias</h4>
          <span className="text-[10px] font-bold text-purple-400 mt-1 block">Acessar →</span>
        </div>
      </div>
    </div>
  </div>
);

const HabitsTab = () => (
  <div className="pb-32 bg-gradient-to-b from-pink-100 via-white to-white min-h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Header Image */}
    <div className="w-full h-64 relative mb-[-40px]">
       <img src="https://i.imgur.com/LF2PX1w.jpg" className="w-full h-full object-cover" alt="Cuidados" />
       <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/90" />
    </div>

    {/* Calendar Strip */}
    <div className="px-6 py-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-heading font-bold text-gray-800">Meus Cuidados</h3>
          <p className="text-xs text-gray-400 mt-1">0 hábitos • 0 completos hoje</p>
        </div>
        <button className="bg-pink-300 text-white text-xs font-bold py-2.5 px-6 rounded-full flex items-center gap-1.5 shadow-lg shadow-pink-300/20 hover:bg-pink-400 hover:scale-105 transition-all">
          <Plus size={16} strokeWidth={3} /> <span className="uppercase tracking-wide">Novo</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 rounded bg-pink-100 text-pink-400">
             <Activity size={14} />
          </div>
          <span className="text-xs font-bold text-gray-700">Esta Semana</span>
        </div>
        <div className="flex justify-between">
          {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((day, i) => (
            <div key={day} className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
              i === 0 ? "bg-blue-300 text-white shadow-lg shadow-blue-300/30" : "text-gray-400 hover:bg-gray-50"
            )}>
              <span className="text-[10px] font-medium uppercase">{day}</span>
              <span className="text-sm font-bold">{7 + i}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-blue-400 fill-blue-400" />
          <h3 className="font-heading font-bold text-lg text-blue-400">Criar Rápido</h3>
        </div>
        <button className="text-xs font-bold text-blue-300 flex items-center gap-1">
          <Plus size={12} /> Personalizado
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {QUICK_HABITS.map((habit) => {
          const Icon = habit.icon;
          return (
            <button key={habit.id} className="flex flex-col items-center gap-2 group">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-white transition-all group-hover:scale-105",
                habit.bg, habit.color
              )}>
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-gray-600 text-center leading-tight px-1 line-clamp-2">
                {habit.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="bg-blue-100 rounded-3xl p-6 relative overflow-hidden mb-6">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-blue-300 rounded-full text-white">
               <Activity size={14} />
             </div>
             <h3 className="font-heading font-bold text-blue-600">HOJE</h3>
          </div>
          <span className="bg-blue-300 text-white text-[10px] font-bold px-2 py-1 rounded-full">0% completo</span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-4 relative z-10">
          <div className="w-32 h-32 rounded-full border-[6px] border-blue-200 flex items-center justify-center relative">
             <div className="text-center">
               <span className="text-3xl font-bold text-blue-400 block">0</span>
               <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">de 0</span>
             </div>
             <div className="absolute top-0 w-3 h-3 bg-blue-300 rounded-full -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg shadow-blue-300/50" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center">
            <span className="text-orange-400 font-bold text-lg flex items-center gap-1"><Zap size={14} fill="currentColor" /> 0</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold">Sequência</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center">
            <span className="text-blue-400 font-bold text-lg flex items-center gap-1"><Award size={14} fill="currentColor" /> 0%</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold">Taxa Sucesso</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Heart size={32} className="text-blue-400 fill-blue-400" />
        </div>
        <h3 className="text-lg font-heading font-bold text-blue-400 mb-2">Comece seus cuidados hoje! ✨</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-4">
          Cada pequeno hábito é um ato de amor com você mesma.
        </p>
        <button className="bg-blue-300 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-300/30 w-full hover:bg-blue-400 transition-colors">
          Criar meu primeiro hábito
        </button>
      </div>

      <div className="bg-gradient-to-br from-teal-400 to-gray-600 rounded-3xl p-6 relative overflow-hidden text-center min-h-[280px] flex flex-col items-center justify-end">
         <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nath&clothing=graphicShirt&clothingColor=pink" 
            className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 drop-shadow-xl"
         />
         <div className="relative z-10 text-white mt-32">
            <h3 className="font-heading font-bold text-xl mb-2">Você está incrível! ✨</h3>
            <p className="text-xs text-white/80 max-w-[200px] mx-auto mb-4">
              Cada pequeno cuidado que você tem com você mesma é um ato de amor.
            </p>
            <div className="flex gap-8 justify-center border-t border-white/20 pt-4">
              <div>
                <span className="block text-2xl font-bold">0</span>
                <span className="text-[9px] uppercase font-bold text-white/70">Completos</span>
              </div>
              <div>
                <span className="block text-2xl font-bold">0</span>
                <span className="text-[9px] uppercase font-bold text-white/70">Dias Seq.</span>
              </div>
            </div>
         </div>
      </div>
    </div>
  </div>
);

const VibeTab = () => (
  <div className="pb-32 bg-[#FFE5ED] min-h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="pt-8 px-6 mb-6">
       <h2 className="text-2xl font-heading font-bold text-gray-800">Vibe do Dia</h2>
       <p className="text-gray-600 text-sm">Registre seu momento maternidade.</p>
    </div>
    
    {/* Photo Frame */}
    <div className="px-6 mb-6">
      <div className="aspect-[4/5] bg-white rounded-3xl shadow-xl shadow-pink-500/10 overflow-hidden relative group">
         <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
         
         {/* Overlay Badge */}
         <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md border border-white/50 px-4 py-2 rounded-full rotate-3">
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Sparkles size={14} className="text-yellow-300" /> Vibe Check
            </span>
         </div>

         {/* Action Overlay */}
         <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between">
            <div className="text-white">
               <p className="font-bold text-lg">Manhã de Sol ☀️</p>
               <p className="text-xs opacity-80">12 de Out, 10:30</p>
            </div>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-pink-500 hover:scale-110 transition-transform">
               <Camera size={24} />
            </button>
         </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center gap-4 px-6 mb-8 overflow-x-auto no-scrollbar">
       <button className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-pink-100 text-sm font-bold text-gray-700">
          <Heart size={18} className="text-pink-400" /> Amei
       </button>
       <button className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-blue-100 text-sm font-bold text-gray-700">
          <MessageCircle size={18} className="text-blue-400" /> Comentar
       </button>
       <button className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-purple-100 text-sm font-bold text-gray-700">
          <Zap size={18} className="text-purple-400" /> Remix
       </button>
    </div>

    {/* History Grid */}
    <div className="px-6">
       <h3 className="font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
         <Activity size={18} /> Histórico de Vibes
       </h3>
       <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="aspect-square rounded-xl bg-white overflow-hidden shadow-sm hover:opacity-80 transition-opacity">
                <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=200&auto=format&fit=crop`} className="w-full h-full object-cover" />
             </div>
          ))}
       </div>
    </div>
  </div>
);

// --- Main App & Navigation ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'nathia' | 'vibe' | 'content' | 'habits'>('home');

  return (
    <div className="w-full h-screen bg-white font-body text-gray-900 flex flex-col overflow-hidden max-w-md mx-auto shadow-2xl relative">
      <AppStyles />
      
      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-white scroll-smooth">
        {activeTab === 'home' && (
          <>
            <Header />
            <HomeTab />
          </>
        )}
        {activeTab === 'community' && (
          <>
             <Header title="Comunidade" />
             <CommunityTab />
          </>
        )}
        {activeTab === 'nathia' && (
          <>
            <Header title="NathIA Chat" />
            <NathIATab />
          </>
        )}
        {activeTab === 'vibe' && (
          <VibeTab />
        )}
        {activeTab === 'content' && (
           <>
             <Header title="Mundo da Nath" />
             <ContentTab onNavigate={setActiveTab} />
           </>
        )}
        {activeTab === 'habits' && (
           <HabitsTab />
        )}
      </main>

      {/* Floating Tab Bar - Updated with 6 Icons */}
      <div className="absolute bottom-6 left-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-pink-100 rounded-3xl p-2 shadow-2xl shadow-purple-200/20 flex justify-between items-center px-2 overflow-x-auto no-scrollbar gap-1">
          <TabButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={Home} 
            label="Início" 
          />
          <TabButton 
            active={activeTab === 'community'} 
            onClick={() => setActiveTab('community')} 
            icon={Users} 
            label="MãesValente" 
          />
          <TabButton 
            active={activeTab === 'nathia'} 
            onClick={() => setActiveTab('nathia')} 
            icon={Bot} 
            label="NathIA"
            special 
          />
          <TabButton 
            active={activeTab === 'content'} 
            onClick={() => setActiveTab('content')} 
            icon={Star} 
            label="Mundo da Nath" 
          />
          <TabButton 
            active={activeTab === 'habits'} 
            onClick={() => setActiveTab('habits')} 
            icon={Heart} 
            label="Cuidados" 
          />
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon: Icon, label, special }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center min-w-[3rem] w-12 h-12 rounded-2xl transition-all duration-300 relative shrink-0",
      active ? "text-pink-400 scale-110" : "text-gray-400 hover:text-gray-600",
      special && "text-purple-400"
    )}
  >
    {special && !active && (
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
    )}
    <div className={cn(
      "p-1.5 rounded-xl transition-all",
      active && (special ? "bg-purple-100" : "bg-pink-100")
    )}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className="text-[9px] font-bold mt-0.5">{label}</span>
  </button>
);
