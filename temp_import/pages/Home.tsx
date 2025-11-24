
import React, { useState } from 'react';
import { UserProfile, Post } from '../types';
import { MOCK_POSTS } from '../constants';
import { Sparkles, PlayCircle, FileText, Mic, Video, ChevronRight, Sun, Moon, Wind, BedDouble, MessageCircleHeart, ArrowRight, Heart, Flame } from 'lucide-react';

interface HomeProps {
  user: UserProfile;
  onNavigateToChat: (initialMessage?: string) => void;
  onNavigateToFeed: () => void;
  onNavigateToRitual: () => void;
  onNavigateToDiary: () => void;
  onLogout: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Home: React.FC<HomeProps> = ({ user, onNavigateToChat, onNavigateToFeed, onNavigateToRitual, onNavigateToDiary, onLogout, toggleTheme, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [loadingWaitlist, setLoadingWaitlist] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoadingWaitlist(true);
    // Mock Supabase call
    setTimeout(() => {
      setLoadingWaitlist(false);
      setWaitlistSuccess(true);
    }, 1500);
  };

  const getIconForType = (type: Post['type']) => {
    switch(type) {
      case 'Reels': return <Video size={14} />;
      case 'Áudio': return <Mic size={14} />;
      case 'Vídeo': return <PlayCircle size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className="pb-24 animate-in fade-in">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white/80 dark:bg-nath-dark-card/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-50 dark:border-nath-dark-border transition-colors shadow-sm dark:shadow-none">
        <div className="animate-in slide-in-from-left-2 duration-500">
          <h1 className="text-xl font-bold text-nath-dark dark:text-nath-dark-text leading-tight">
            Oi, mãe.
          </h1>
          <p className="text-sm font-medium text-nath-blue dark:text-blue-400 flex items-center gap-1.5 animate-pulse-slow">
            Tô aqui com você. <Heart size={12} className="fill-current" />
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-nath-dark-bg text-nath-dark dark:text-nath-dark-sec flex items-center justify-center border border-gray-200 dark:border-nath-dark-border transition-colors active:scale-95"
            aria-label="Alternar tema"
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>

          <button 
            onClick={onLogout}
            className="w-12 h-12 bg-nath-light-blue dark:bg-nath-dark-border rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-nath-dark-border shadow-sm active:scale-95 transition-transform"
            aria-label="Sair / Logout"
          >
            <img src="https://i.imgur.com/8CpKlpW.jpg" alt="Nath" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-8">
        
        {/* SECTION: HOJE EU TÔ COM VOCÊ */}
        <div>
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-nath-dark dark:text-nath-dark-text font-bold flex items-center gap-2">
              Hoje eu tô com você
            </h3>
            <span className="bg-gradient-to-r from-nath-blue to-[#8cbcf0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Wind size={10} /> 30s para você
            </span>
          </div>
          
          {/* 1. IMAGE CARD: Emotional Mirror (Maternidade Real) */}
          <button 
            onClick={onNavigateToDiary}
            className="w-full h-[180px] rounded-[22px] overflow-hidden mb-4 shadow-lg shadow-nath-blue/10 relative group isolate active:scale-[0.98] transition-all text-left"
          >
              <img
                src="https://i.imgur.com/w4rZvGG.jpg"
                alt="Como você dormiu hoje?"
                className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
              />
              
              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                {/* Top Row */}
                <div className="flex justify-between items-start">
                   <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-sm">
                     <Moon size={18} fill="currentColor" className="opacity-90" />
                   </div>
                   <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                     Maternidade Real
                   </span>
                </div>

                {/* Bottom Text */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-0.5 leading-tight drop-shadow-md">
                    Como você dormiu hoje?
                  </h2>
                  <p className="text-blue-100 text-xs font-medium opacity-90 flex items-center gap-1">
                    Toque para registrar <ChevronRight size={14} />
                  </p>
                </div>
              </div>
          </button>

          {/* 2. BLUE CARD (Anxiety) */}
          <div className="bg-gradient-to-b from-[#6DA9E4] to-[#3C6AD6] dark:from-nath-dark-hero dark:to-nath-dark-hero-soft rounded-[22px] p-6 text-white shadow-xl shadow-nath-blue/20 dark:shadow-none relative overflow-hidden transition-all mb-4">
            {/* Decorative bg element */}
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                 <div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 text-white animate-pulse-slow">
                      <Wind size={20} />
                    </div>
                    
                    <h2 className="text-lg font-bold mb-1 leading-tight">
                      Percebi que você tá mais ansiosa.
                    </h2>
                    <p className="text-blue-50 text-sm opacity-90 leading-relaxed max-w-[260px]">
                      Quer respirar 1 minuto comigo pra desacelerar?
                    </p>
                 </div>
              </div>
              
              <button 
                onClick={onNavigateToRitual}
                className="mt-4 bg-white text-nath-blue dark:text-nath-dark-hero font-bold px-5 py-3 rounded-xl shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2 text-xs w-fit"
              >
                Começar agora <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            
            {/* 3. SECONDARY GRID (Quick Actions) */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Action A: Diary/Sleep */}
              <button 
                onClick={onNavigateToDiary}
                className="bg-white dark:bg-nath-dark-card border border-gray-100 dark:border-nath-dark-border p-4 rounded-2xl text-left shadow-sm hover:shadow-md hover:border-nath-blue/30 dark:hover:border-nath-blue/30 transition-all active:scale-[0.98] group"
              >
                <div className="w-8 h-8 bg-orange-50 dark:bg-nath-dark-sleep rounded-full flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 transition-transform">
                  <BedDouble size={16} strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-nath-dark dark:text-nath-dark-text text-sm leading-tight mb-0.5">Como dormiu?</h4>
                <span className="text-[10px] text-gray-400 dark:text-nath-dark-muted font-medium">Registrar • 2 min</span>
              </button>

              {/* Action B: MãesValente Chat */}
              <button 
                onClick={() => onNavigateToChat()}
                className="bg-white dark:bg-nath-dark-card border border-gray-100 dark:border-nath-dark-border p-4 rounded-2xl text-left shadow-sm hover:shadow-md hover:border-nath-blue/30 dark:hover:border-nath-blue/30 transition-all active:scale-[0.98] group"
              >
                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                  <MessageCircleHeart size={16} strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-nath-dark dark:text-nath-dark-text text-sm leading-tight mb-0.5">Conversar</h4>
                <span className="text-[10px] text-gray-400 dark:text-nath-dark-muted font-medium">Desabafar • 5 min</span>
              </button>

            </div>

          </div>
        </div>

        {/* SECTION: MUNDO NATH */}
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-nath-dark dark:text-nath-dark-text font-bold transition-colors">Mundo Nath</h3>
            <button onClick={onNavigateToFeed} className="text-nath-blue dark:text-nath-dark-hero text-xs font-bold flex items-center gap-1 transition-colors hover:underline">
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>
          
          {/* Horizontal Scroll Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
            {MOCK_POSTS.map((post) => (
              <div 
                key={post.id} 
                onClick={onNavigateToFeed}
                className="snap-center flex-shrink-0 w-[200px] bg-white dark:bg-nath-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-50 dark:border-nath-dark-border active:scale-[0.98] transition-transform cursor-pointer flex flex-col relative group"
              >
                <div className="h-28 bg-gray-200 dark:bg-nath-dark-bg relative overflow-hidden">
                   <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
                     <span className="text-nath-dark dark:text-white text-[10px] font-bold uppercase">{getIconForType(post.type)}</span>
                   </div>
                   
                   {/* Badge Nath Heart */}
                   <div className="absolute bottom-2 right-2 bg-nath-pink/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm backdrop-blur-sm">
                      Nath <Heart size={8} className="fill-current" />
                   </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className="text-nath-dark dark:text-nath-dark-text text-sm font-bold leading-snug line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  <span className="mt-auto text-[10px] text-gray-400 dark:text-nath-dark-muted font-medium group-hover:text-nath-blue transition-colors">
                    Toque para ver
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist Capture */}
        <div className="bg-nath-warm dark:bg-nath-dark-card border-2 border-nath-light-blue dark:border-nath-dark-border border-dashed rounded-2xl p-6 text-center mt-4 transition-colors relative overflow-hidden">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-3">
             <Flame size={20} className="animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-nath-dark dark:text-nath-dark-text mb-2 transition-colors">O app completo vem aí!</h3>
          <p className="text-sm text-gray-500 dark:text-nath-dark-muted mb-4 transition-colors max-w-[260px] mx-auto">
            Quer ser avisada quando lançarmos todas as novidades que preparamos com carinho?
          </p>
          
          {waitlistSuccess ? (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in zoom-in">
              <Heart size={16} className="fill-current" /> Obrigada, mãe!
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-nath-dark-border bg-white dark:bg-nath-dark-bg text-nath-dark dark:text-nath-dark-text focus:outline-none focus:border-nath-blue focus:ring-2 focus:ring-nath-blue/20 text-sm transition-colors placeholder-gray-400"
              />
              <button 
                type="submit"
                disabled={loadingWaitlist}
                className="w-full bg-nath-dark dark:bg-nath-dark-pause hover:bg-nath-dark/90 dark:hover:bg-opacity-80 text-white font-bold py-4 rounded-xl text-sm disabled:opacity-70 transition-colors shadow-lg dark:shadow-none"
              >
                {loadingWaitlist ? 'Enviando...' : 'Entrar na lista de espera'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
