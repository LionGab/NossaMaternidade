
import React from 'react';
import { ANGEL_OF_THE_DAY } from '../constants';
import { Heart, MessageCircle, Share2, MoreHorizontal, Users, Star } from 'lucide-react';

export const Community: React.FC = () => {
  
  const COMMUNITY_POSTS = [
    {
      id: 1,
      author: "Juliana Mendes",
      time: "2h atrás",
      content: "Meninas, hoje consegui tomar banho sem chorar ouvindo o bebê. Parece bobo, mas depois de 3 semanas difíceis, senti que recuperei um pedacinho de mim. 🙌",
      likes: 84,
      comments: 15,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
    },
    {
      id: 2,
      author: "Carla Silva",
      time: "4h atrás",
      content: "Alguém mais sente que perdeu a identidade depois do parto? Olho no espelho e não sei quem sou além de 'mãe'. Tô precisando muito conversar sobre isso, sem julgamentos.",
      likes: 142,
      comments: 38,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
    },
    {
      id: 3,
      author: "Fernanda Paiva",
      time: "5h atrás",
      content: "Dica de ouro que funcionou aqui: o chá de camomila (com aval da pediatra!) ajudou muito na cólica do Léo hoje. Ele finalmente dormiu por 3h seguidas. Fica a recomendação!",
      likes: 56,
      comments: 12,
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=faces"
    },
    {
      id: 4,
      author: "Beatriz Costa",
      time: "8h atrás",
      content: "Voltando ao trabalho amanhã e o coração tá apertado. Como vocês lidaram com a separação nos primeiros dias? Aceito conselhos e abraços virtuais.",
      likes: 93,
      comments: 45,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces"
    }
  ];

  return (
    <div className="pb-24 bg-gray-50 dark:bg-nath-dark-bg min-h-screen animate-in fade-in transition-colors duration-300">
      
      {/* Main Header */}
      <div className="bg-white dark:bg-nath-dark-card p-6 pt-10 pb-4 border-b border-gray-100 dark:border-nath-dark-border sticky top-0 z-10 flex flex-col items-center transition-colors shadow-sm">
        <div className="w-40 h-40 rounded-full border-6 border-white dark:border-nath-dark-card shadow-xl overflow-hidden mb-2 relative">
           <img src="https://i.imgur.com/OLdeyD6.jpg" alt="Mães Valentes" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-nath-dark dark:text-white mb-1">MãesValentes</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm font-medium">Um espaço seguro para trocarmos experiências reais.</p>
      </div>

      <div className="p-4 space-y-6">

        {/* Pinned Emotional Post: You Are Not Alone */}
        <div className="bg-white dark:bg-nath-dark-card p-5 rounded-2xl shadow-sm border-l-4 border-nath-pink relative overflow-hidden group">
           <div className="absolute right-0 top-0 w-24 h-24 bg-pink-50 dark:bg-pink-900/10 rounded-full blur-2xl -mr-4 -mt-4"></div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="text-nath-pink fill-nath-pink" />
                <h3 className="font-bold text-nath-dark dark:text-nath-dark-text text-lg">Você não está sozinha</h3>
             </div>
             <p className="text-sm text-gray-600 dark:text-nath-dark-muted leading-relaxed">
               Milhares de mães estão sentindo exatamente o que você sente agora. Respire fundo, estamos juntas nessa jornada.
             </p>
           </div>
        </div>
        
        {/* Angel of the Day Card */}
        <div className="bg-gradient-to-r from-nath-pink to-pink-300 dark:from-pink-900 dark:to-pink-800 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
           <div className="relative z-10 flex items-center gap-4">
             <img src={ANGEL_OF_THE_DAY.avatar} alt="Anjo" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="bg-white text-nath-pink text-[10px] font-bold px-2 py-0.5 rounded-full">ANJO DO DIA</span>
               </div>
               <h4 className="font-bold text-lg">{ANGEL_OF_THE_DAY.name}</h4>
               <p className="text-xs text-white/90 italic">"{ANGEL_OF_THE_DAY.message}"</p>
             </div>
           </div>
        </div>

        {/* Create Post Trigger */}
        <div className="bg-white dark:bg-nath-dark-card p-4 rounded-xl border border-gray-100 dark:border-nath-dark-border flex gap-3 items-center shadow-sm hover:shadow-md transition-all cursor-text">
          <div className="w-10 h-10 bg-gray-200 dark:bg-nath-dark-bg rounded-full flex-shrink-0 overflow-hidden">
             <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full opacity-50" />
          </div>
          <button className="flex-1 text-left text-gray-400 dark:text-nath-dark-muted text-sm bg-gray-50 dark:bg-nath-dark-bg py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
            Compartilhe seu momento, mãe...
          </button>
        </div>

        {/* Feed: Histórias Reais */}
        <div>
          <h3 className="font-bold text-lg text-nath-dark dark:text-nath-dark-text mb-3 ml-1 flex items-center gap-2">
            <Users size={18} className="text-nath-blue" /> Histórias Reais
          </h3>
          <div className="space-y-4">
            {COMMUNITY_POSTS.map(post => (
              <div key={post.id} className="bg-white dark:bg-nath-dark-card p-4 rounded-2xl border border-gray-100 dark:border-nath-dark-border shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-nath-dark-border" />
                    <div>
                      <h4 className="font-bold text-nath-dark dark:text-nath-dark-text text-sm">{post.author}</h4>
                      <span className="text-xs text-gray-400">{post.time}</span>
                    </div>
                  </div>
                  <button className="text-gray-300 hover:text-gray-500 p-1"><MoreHorizontal size={18}/></button>
                </div>
                
                <p className="text-nath-dark dark:text-nath-dark-text text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 pt-3 border-t border-gray-50 dark:border-nath-dark-border">
                  <button className="flex items-center gap-1.5 text-gray-400 dark:text-nath-dark-muted hover:text-nath-pink transition-colors group">
                    <Heart size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-400 dark:text-nath-dark-muted hover:text-nath-blue transition-colors group">
                    <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-400 dark:text-nath-dark-muted hover:text-nath-dark transition-colors ml-auto group">
                    <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
