
import React from 'react';
import { Sun, Moon, Droplets, CheckCircle2, BedDouble, BookHeart, CalendarDays, Sparkles, ArrowRight } from 'lucide-react';

interface HabitsProps {
  onOpenRitual: () => void;
  onOpenDiary: () => void;
}

export const Habits: React.FC<HabitsProps> = ({ onOpenRitual, onOpenDiary }) => {
  return (
    <div className="pb-24 bg-gray-50 dark:bg-nath-dark-bg min-h-screen animate-in fade-in transition-colors duration-300">
      
      {/* Main Feed Header - Replaced with Community style */}
      <div className="bg-white dark:bg-nath-dark-card p-6 pt-10 pb-4 border-b border-gray-100 dark:border-nath-dark-border sticky top-0 z-10 flex flex-col items-center transition-colors">
        <div className="w-40 h-40 rounded-full border-6 border-white dark:border-nath-dark-card shadow-xl overflow-hidden mb-2 relative">
           <img src="https://i.imgur.com/LF2PX1w.jpg" alt="Nathalia Valente fitness" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-nath-dark dark:text-white mb-1">Seus Hábitos</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm font-medium">Gerencie e cultive seu bem-estar.</p>
      </div>

      <div className="p-4 space-y-6">

        {/* Daily Progress Card */}
        <div className="bg-white dark:bg-nath-dark-card p-5 rounded-2xl border border-gray-100 dark:border-nath-dark-border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-nath-dark dark:text-nath-dark-text flex items-center gap-2">
              <CalendarDays size={18} className="text-nath-blue" />
              Hoje
            </h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">33% Concluído</span>
          </div>
          
          <div className="space-y-3">
            <HabitCheck title="Beber 2L de água" icon={<Droplets size={16} />} isChecked={true} />
            <HabitCheck title="Vitaminas" icon={<Sun size={16} />} isChecked={false} />
            <HabitCheck title="Dormir 7h (tentei!)" icon={<Moon size={16} />} isChecked={false} />
          </div>
        </div>

        {/* Emotional Quote */}
        <div className="mb-2 mt-6 px-2">
           <p className="text-nath-blue dark:text-blue-400 font-medium italic text-sm text-center leading-relaxed">
             "Respirar é difícil quando a rotina pesa — vamos juntas?"
           </p>
        </div>

        {/* Main Actions */}
        <h3 className="font-bold text-nath-dark dark:text-nath-dark-text text-sm uppercase tracking-wider ml-1">Ferramentas da Nath</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Ritual Card */}
          <button 
            onClick={onOpenRitual}
            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-nath-dark-card dark:to-nath-dark-card p-5 rounded-2xl text-left border border-orange-200 dark:border-nath-dark-border shadow-sm group relative overflow-hidden"
          >
             <div className="absolute right-0 top-0 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
             <div className="flex justify-between items-start relative z-10">
               <div>
                 <div className="w-10 h-10 bg-white dark:bg-nath-dark-bg rounded-full flex items-center justify-center text-orange-500 mb-3 shadow-sm">
                   <Sparkles size={20} />
                 </div>
                 <h4 className="font-bold text-nath-dark dark:text-nath-dark-text text-lg">Ritual de Abertura</h4>
                 <p className="text-xs text-nath-dark/70 dark:text-nath-dark-muted mt-1 mb-4 max-w-[200px]">Comece ou termine o dia conectada com você mesma.</p>
               </div>
               <div className="bg-white/50 dark:bg-black/20 p-2 rounded-full">
                 <ArrowRight size={20} className="text-orange-500" />
               </div>
             </div>
             <span className="inline-block bg-white dark:bg-nath-dark-bg text-orange-500 text-[10px] font-bold px-3 py-1 rounded-full">3 min</span>
          </button>

          {/* Diary Card */}
          <button 
            onClick={onOpenDiary}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-nath-dark-card dark:to-nath-dark-card p-5 rounded-2xl text-left border border-purple-200 dark:border-nath-dark-border shadow-sm group relative overflow-hidden"
          >
             <div className="absolute right-0 top-0 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl transition-transform group-hover:scale-150"></div>
             <div className="flex justify-between items-start relative z-10">
               <div>
                 <div className="w-10 h-10 bg-white dark:bg-nath-dark-bg rounded-full flex items-center justify-center text-purple-500 mb-3 shadow-sm">
                   <BookHeart size={20} />
                 </div>
                 <h4 className="font-bold text-nath-dark dark:text-nath-dark-text text-lg">Diário Emocional</h4>
                 <p className="text-xs text-nath-dark/70 dark:text-nath-dark-muted mt-1 mb-4 max-w-[200px]">Desabafe com a NathIA e receba acolhimento.</p>
               </div>
               <div className="bg-white/50 dark:bg-black/20 p-2 rounded-full">
                 <ArrowRight size={20} className="text-purple-500" />
               </div>
             </div>
             <span className="inline-block bg-white dark:bg-nath-dark-bg text-purple-500 text-[10px] font-bold px-3 py-1 rounded-full">Livre</span>
          </button>
        </div>

        {/* Sleep Tracker Mini */}
        <div className="bg-white dark:bg-nath-dark-card p-4 rounded-2xl border border-gray-100 dark:border-nath-dark-border flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500">
               <BedDouble size={20} />
             </div>
             <div>
               <h4 className="font-bold text-nath-dark dark:text-nath-dark-text text-sm">Qualidade do Sono</h4>
               <p className="text-xs text-gray-400">Última noite: 5h 20m</p>
             </div>
           </div>
           <button className="text-nath-blue text-xs font-bold">Registrar</button>
        </div>

      </div>
    </div>
  );
};

const HabitCheck = ({ title, icon, isChecked }: { title: string, icon: React.ReactNode, isChecked: boolean }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isChecked ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-gray-50 border-transparent dark:bg-nath-dark-bg'}`}>
    <div className="flex items-center gap-3">
      <div className={`text-gray-400 ${isChecked ? 'text-green-600' : ''}`}>{icon}</div>
      <span className={`text-sm font-medium ${isChecked ? 'text-green-800 dark:text-green-400 line-through' : 'text-nath-dark dark:text-nath-dark-text'}`}>{title}</span>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
      {isChecked && <CheckCircle2 size={14} className="text-white" />}
    </div>
  </div>
);
