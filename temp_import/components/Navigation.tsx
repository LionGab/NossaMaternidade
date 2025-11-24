
import React from 'react';
import { Home, MessageCircleHeart, PlayCircle, Users, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from './UI';

interface NavigationProps {
  activeTab: 'home' | 'community' | 'chat' | 'content' | 'habits';
  onTabChange: (tab: 'home' | 'community' | 'chat' | 'content' | 'habits') => void;
}

export const BottomNavigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  
  const handleTabClick = (tab: 'home' | 'community' | 'chat' | 'content' | 'habits') => {
    triggerHaptic();
    onTabChange(tab);
  };

  const getTabClass = (isActive: boolean) => 
    `flex flex-col items-center gap-1 transition-all duration-300 p-1 select-none focus:outline-none ${
      isActive 
        ? 'text-nath-blue dark:text-nath-dark-hero scale-110 drop-shadow-sm' 
        : 'text-gray-400 dark:text-nath-dark-muted hover:text-gray-600 dark:hover:text-nath-dark-text active:scale-95'
    }`;

  return (
    <nav 
      className="fixed bottom-0 w-full max-w-[480px] bg-white dark:bg-nath-dark-tab border-t border-gray-100 dark:border-nath-dark-border px-4 py-3 flex justify-between items-end z-50 safe-area-pb transition-colors duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none"
      role="tablist"
      aria-label="Navegação principal"
    >
      
      <button 
        role="tab"
        aria-selected={activeTab === 'home'}
        aria-label="Início"
        onClick={() => handleTabClick('home')} 
        className={getTabClass(activeTab === 'home')}
      >
        <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-medium transition-opacity duration-300">Home</span>
      </button>

      <button 
        role="tab"
        aria-selected={activeTab === 'community'}
        aria-label="MãesValentes"
        onClick={() => handleTabClick('community')} 
        className={getTabClass(activeTab === 'community')}
      >
        <Users size={24} strokeWidth={activeTab === 'community' ? 2.5 : 2} />
        <span className="text-[10px] font-medium transition-opacity duration-300">MãesValentes</span>
      </button>

      <button 
        role="tab"
        aria-selected={activeTab === 'chat'}
        aria-label="Mães Valente Chat"
        onClick={() => handleTabClick('chat')} 
        className={`${getTabClass(activeTab === 'chat')} -mt-6`}
      >
        <div className={`p-3 rounded-full transition-all duration-300 ${
          activeTab === 'chat' 
            ? 'bg-nath-blue text-white shadow-lg shadow-nath-blue/40 scale-110 rotate-3' 
            : 'bg-gray-100 dark:bg-nath-dark-card text-nath-blue dark:text-nath-dark-hero border border-white dark:border-nath-dark-border'
        }`}>
          <MessageCircleHeart size={28} strokeWidth={2.5} className={activeTab === 'chat' ? 'animate-pulse-slow' : ''} />
        </div>
        <span className="text-[10px] font-bold mt-0.5">MãesValente</span>
      </button>

      <button 
        role="tab"
        aria-selected={activeTab === 'content'}
        aria-label="Mundo Nath"
        onClick={() => handleTabClick('content')} 
        className={getTabClass(activeTab === 'content')}
      >
        <PlayCircle size={24} strokeWidth={activeTab === 'content' ? 2.5 : 2} />
        <span className="text-[10px] font-medium transition-opacity duration-300">Mundo Nath</span>
      </button>

      <button 
        role="tab"
        aria-selected={activeTab === 'habits'}
        aria-label="Hábitos"
        onClick={() => handleTabClick('habits')} 
        className={getTabClass(activeTab === 'habits')}
      >
        <CheckCircle2 size={24} strokeWidth={activeTab === 'habits' ? 2.5 : 2} />
        <span className="text-[10px] font-medium transition-opacity duration-300">Hábitos</span>
      </button>

    </nav>
  );
};
