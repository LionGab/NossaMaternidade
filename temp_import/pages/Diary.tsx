
import React, { useState } from 'react';
import { ArrowLeft, Send, Sparkles, Calendar, Layout, BookHeart, Save, Shield } from 'lucide-react';
import { analyzeDiaryEntry } from '../services/geminiService';

interface DiaryProps {
  onBack: () => void;
}

export const Diary: React.FC<DiaryProps> = ({ onBack }) => {
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setIsAnalyzing(true);
    
    // Call Gemini
    const aiResponse = await analyzeDiaryEntry(entry);
    
    setIsAnalyzing(false);
    setResponse(aiResponse);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-nath-dark-bg flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white dark:bg-nath-dark-card border-b border-gray-100 dark:border-nath-dark-border shadow-sm transition-colors z-10">
        <button 
          onClick={onBack} 
          className="bg-black text-white dark:bg-white dark:text-black p-2 rounded-full shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex-shrink-0"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-nath-blue uppercase tracking-widest">Nossa Maternidade</span>
          <span className="text-sm font-bold text-nath-dark dark:text-nath-dark-text flex items-center gap-1">
            Diário <Sparkles size={10} className="text-nath-blue dark:text-nath-dark-hero" /> MãesValente
          </span>
        </div>
        
        {/* Spacer for alignment */}
        <div className="w-9" /> 
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {!response ? (
          // Input State
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <label className="block text-nath-dark dark:text-white font-bold text-lg mb-4">
              Como você está se sentindo?
            </label>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Desabafa aqui, como se estivesse falando com uma amiga... Não vou julgar, só te escutar."
              className="w-full h-64 p-4 rounded-2xl bg-white dark:bg-nath-dark-card border border-gray-200 dark:border-nath-dark-border text-nath-dark dark:text-nath-dark-text placeholder-gray-400 focus:ring-2 focus:ring-nath-blue/20 focus:border-nath-blue resize-none shadow-sm text-base leading-relaxed transition-colors"
            />
            <div className="mt-2 flex justify-end text-xs text-gray-400">
              <span className="flex items-center gap-1"><ShieldIcon size={12}/> Ambiente seguro e privado</span>
            </div>
          </div>
        ) : (
          // Response State
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             {/* Original Entry (Collapsed or Preview) */}
             <div className="bg-white dark:bg-nath-dark-card p-4 rounded-xl border border-gray-100 dark:border-nath-dark-border mb-6 opacity-70 transition-colors">
               <p className="text-sm text-gray-500 italic line-clamp-3">"{entry}"</p>
             </div>

             {/* NathIA Response */}
             <div className="flex gap-4 mb-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                  <img src="https://i.imgur.com/RRIaE7t.jpg" alt="NathIA" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 bg-nath-light-blue dark:bg-nath-dark-card p-5 rounded-2xl rounded-tl-none text-nath-dark dark:text-nath-dark-text leading-relaxed shadow-sm relative transition-colors">
                  <Sparkles size={16} className="absolute top-4 right-4 text-nath-blue dark:text-nath-dark-hero" />
                  {response}
                </div>
             </div>

             {/* Action Buttons */}
             <h3 className="font-bold text-gray-500 dark:text-nath-dark-muted text-sm uppercase tracking-wider mb-4 ml-1">Como posso te ajudar agora?</h3>
             <div className="space-y-3">
               <ActionBtn icon={<Layout size={20} />} title="Organizar meu dia de amanhã" subtitle="Criar checklist leve" />
               <ActionBtn icon={<Calendar size={20} />} title="Criar rotina para a semana" subtitle="Planejamento suave" />
               <ActionBtn icon={<BookHeart size={20} />} title="Guardar no meu Refúgio" subtitle="Salvar como memória" />
             </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      {!response && (
        <div className="p-6 bg-white dark:bg-nath-dark-card border-t border-gray-100 dark:border-nath-dark-border transition-colors">
          <button 
            onClick={handleSubmit}
            disabled={!entry.trim() || isAnalyzing}
            className="w-full bg-nath-dark hover:bg-nath-dark/90 dark:bg-nath-dark-hero dark:hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-nath-blue/20 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95"
          >
            {isAnalyzing ? (
              <>Analisando com carinho...</>
            ) : (
              <>Enviar para MãesValente <Send size={18} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const ActionBtn = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
  <button className="w-full bg-white dark:bg-nath-dark-card p-4 rounded-xl border border-gray-200 dark:border-nath-dark-border flex items-center gap-4 hover:border-nath-blue hover:shadow-md transition-all text-left group">
    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-nath-dark-bg flex items-center justify-center text-nath-dark dark:text-gray-300 group-hover:bg-nath-light-blue group-hover:text-nath-blue transition-colors">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-nath-dark dark:text-nath-dark-text">{title}</h4>
      <p className="text-xs text-gray-400 dark:text-nath-dark-muted">{subtitle}</p>
    </div>
  </button>
);

const ShieldIcon = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);