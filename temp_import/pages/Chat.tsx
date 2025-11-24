
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToNathIA } from '../services/geminiService';
import { INITIAL_CHAT_GREETING } from '../constants';
import { Send, Sparkles, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { triggerHaptic } from '../components/UI';

interface ChatProps {
  onBack: () => void;
  initialMessage?: string;
}

export const Chat: React.FC<ChatProps> = ({ onBack, initialMessage }) => {
  // Load messages from localStorage or use default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nathia_history');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        } catch (error) {
          console.error('Error parsing chat history:', error);
        }
      }
    }
    return [
      {
        id: 'init',
        role: 'model',
        text: INITIAL_CHAT_GREETING,
        timestamp: new Date()
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist messages whenever they change
  useEffect(() => {
    localStorage.setItem('nathia_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle initial prompt from Home
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setLoading(true);

    // Call Gemini Service
    const aiResponseText = await sendMessageToNathIA(textToSend, messages);
    
    const newAiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newAiMsg]);
    setLoading(false);
  };

  const handleClearHistory = () => {
    triggerHaptic();
    // Reset to initial state without confirmation dialog to ensure functionality
    const resetState: ChatMessage[] = [{
      id: Date.now().toString(),
      role: 'model',
      text: INITIAL_CHAT_GREETING,
      timestamp: new Date()
    }];
    setMessages(resetState);
    // Force clear local storage to be safe (useEffect will also overwrite it)
    localStorage.removeItem('nathia_history');
  };

  const quickChips = ["Estou sobrecarregada", "Medo de não ser boa mãe", "Briguei com meu parceiro"];

  // Main Container: h-full to respect parent, pb-[85px] to push Input Area above Fixed Bottom Nav
  return (
    <div className="flex flex-col h-full bg-[#F0F4F8] dark:bg-nath-dark-bg transition-colors duration-300 pb-[85px]">
      {/* Header */}
      <div className="bg-white dark:bg-nath-dark-tab p-4 flex items-center gap-3 border-b border-gray-100 dark:border-nath-dark-border shadow-sm z-10 transition-colors">
        {/* Back Button - Standardized High Contrast */}
        <button 
          onClick={() => { triggerHaptic(); onBack(); }} 
          className="bg-black text-white dark:bg-white dark:text-black p-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm flex-shrink-0"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="relative flex-shrink-0">
           <div className="w-10 h-10 bg-nath-light-blue dark:bg-nath-dark-card rounded-full overflow-hidden border border-white dark:border-nath-dark-border shadow-sm">
             <img src="https://i.imgur.com/RRIaE7t.jpg" alt="MãesValente" className="w-full h-full object-cover" />
           </div>
           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-nath-dark-tab"></div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-nath-blue uppercase tracking-widest block mb-0.5 truncate">Nossa Maternidade</span>
          <h2 className="font-bold text-lg text-nath-dark dark:text-nath-dark-text flex items-center gap-1 transition-colors truncate">
            MãesValente <Sparkles size={12} className="text-nath-blue dark:text-nath-dark-hero" />
          </h2>
        </div>

        {/* Clear History Button */}
        <button 
          onClick={handleClearHistory}
          className="text-gray-400 hover:text-red-500 dark:text-nath-dark-muted dark:hover:text-red-400 p-2 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-nath-dark-card"
          aria-label="Limpar histórico"
          title="Limpar conversa"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages Area */}
      {/* Added pb-8 to ensure content isn't tight against the input area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
        
        {messages.length <= 1 && !loading ? (
           /* Empty State Request */
           <div className="h-full flex flex-col items-center justify-center opacity-100 animate-in fade-in duration-500 -mt-8">
              <div className="w-40 h-40 rounded-full border-6 border-white dark:border-nath-dark-card shadow-xl overflow-hidden mb-4 relative">
                 <img src="https://i.imgur.com/RRIaE7t.jpg" alt="MãesValente" className="w-full h-full object-cover" />
              </div>
              
              <h2 className="text-4xl font-bold text-nath-dark dark:text-white mb-1">MãesValente</h2>
              <p className="text-gray-400 dark:text-nath-dark-muted text-sm font-medium mb-10">Suas conversas</p>
              
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm max-w-[280px] leading-relaxed">
                Você ainda não tem nenhuma conversa.<br/>
                Clique no botão abaixo para começar a conversar com a MãesValente.
              </p>
           </div>
        ) : (
            <>
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap transition-colors ${
                      msg.role === 'user' 
                        ? 'bg-nath-dark-hero text-white rounded-br-none' 
                        : 'bg-white dark:bg-nath-dark-card text-gray-700 dark:text-nath-dark-text rounded-bl-none border border-transparent dark:border-nath-dark-border'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {loading && (
                   <div className="flex justify-start">
                     <div className="bg-white dark:bg-nath-dark-card p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-2 items-center transition-colors border border-transparent dark:border-nath-dark-border">
                       <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                       <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                       <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                     </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
            </>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-nath-dark-tab p-3 border-t border-gray-100 dark:border-nath-dark-border transition-colors">
        {/* Chips - Styled with proper padding and touch targets */}
        {!loading && messages.length < 5 && (
           <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1 px-1">
             {quickChips.map((chip, i) => (
               <button 
                key={i} 
                onClick={() => { triggerHaptic(); setInput(chip); handleSend(chip); }}
                className="whitespace-nowrap flex-shrink-0 bg-nath-light-blue dark:bg-nath-dark-card text-nath-blue dark:text-nath-blue text-xs px-3 py-2 rounded-full border border-nath-blue/20 dark:border-nath-dark-border hover:bg-nath-blue hover:text-white dark:hover:bg-nath-dark-hero dark:hover:text-white transition-colors active:scale-95"
               >
                 {chip}
               </button>
             ))}
           </div>
        )}

        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Conta pra mim o que está pegando..."
            className="flex-1 bg-gray-100 dark:bg-nath-dark-bg dark:text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nath-blue/50 resize-none max-h-24 placeholder-gray-400 dark:placeholder-gray-500 transition-colors border border-transparent dark:border-nath-dark-border"
            rows={1}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-nath-blue hover:bg-blue-500 dark:bg-nath-dark-hero dark:hover:bg-blue-700 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-90 transition-all flex items-center justify-center"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
