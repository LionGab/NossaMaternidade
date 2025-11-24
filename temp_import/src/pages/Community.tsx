
import React, { useState } from 'react';
import { ANGEL_OF_THE_DAY } from '../constants';
import { Heart, MessageCircle, Share2, MoreHorizontal, Pin, Send, BadgeCheck, CornerDownRight, Flame, Shield, Star } from 'lucide-react';
import { triggerHaptic } from '../components/UI';

export const Community: React.FC = () => {
  const [activeTag, setActiveTag] = useState('Top 10');
  
  // Initial data defined outside or inside component
  const INITIAL_POSTS = [
    {
      id: 1,
      author: "Rafaela G.",
      tag: "Maternidade Real",
      time: "4h atrás",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
      content: "Visita que chega sem avisar e ainda critica a bagunça da casa: qual a pena máxima prevista em lei? Minha sogra chegou hoje e perguntou se eu 'não tinha tido tempo' de lavar a louça. 🤡",
      likes: 1892,
      comments: 210,
      likedByMe: false
    },
    {
      id: 2,
      author: "Patrícia L.",
      tag: "Vitória",
      time: "1h atrás",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      content: "Milagre alcançado: consegui tomar um café QUENTE e comer um pão na chapa sentada. Durou 7 minutos, mas foram os melhores 7 minutos da semana. A gente se contenta com pouco né? 😂",
      likes: 1756,
      comments: 84,
      likedByMe: false
    },
    {
      id: 3,
      author: "Juliana Mendes",
      tag: "Corpo",
      time: "6h atrás",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
      content: `Meninas, hoje eu tomei meu primeiro banho sem chorar desde que o bebê nasceu.

Nas últimas 3 semanas, era sempre igual: eu entrava no chuveiro, ouvia o choro lá fora e começava a chorar junto. Coração acelerado, culpa, medo de estar falhando em tudo.

Hoje ele também chorou. Meu peito apertou igual. Mas eu respirei fundo, terminei o banho, me enxuguei com calma e só depois fui pegá-lo no colo.

Parece pouco, mas eu senti que recuperei 5 minutos de mim mesma.

Alguém mais aí colecionando essas “vitórias invisíveis” que ninguém vê, mas que salvam o dia? 🙌`,
      likes: 1645,
      comments: 132,
      likedByMe: false
    },
    {
      id: 4,
      author: "Ana Paula",
      tag: "Culpa",
      time: "2h atrás",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces",
      content: "Dei fórmula hoje pq meu peito estava em carne viva. Chorei dando a mamadeira achando que estava falhando. Mas ver ele dormir saciado pela primeira vez em dias me acalmou. Sou menos mãe por isso?",
      likes: 1580,
      comments: 98,
      likedByMe: false
    }
  ];

  const [posts, setPosts] = useState(INITIAL_POSTS);

  const toggleLike = (id: number) => {
    triggerHaptic();
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        const isLiked = !post.likedByMe;
        return {
          ...post,
          likedByMe: isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const TAGS = ['Top 10', 'Puerpério', 'Sono', 'Relacionamento', 'Corpo', 'Desabafos'];

  // Post Fixado (Static for now, can be moved to state if needed)
  const PINNED_POST = {
    id: 'pinned-1',
    author: "Sofia M.",
    tag: "Desabafo",
    time: "3h atrás",
    avatar: "https://images.unsplash.com/photo-1597223557154-721c35cc3a3e?w=150&h=150&fit=crop&crop=faces",
    content: "Eu só queria que alguém me dissesse que não sou uma mãe ruim por querer fugir. O bebê chora e meu corpo trava. Me tranquei no banheiro hoje por 10 minutos enquanto ele gritava no berço seguro, só pra eu não gritar com ele. Sou um monstro?",
    likes: 2450,
    comments: 312,
    otherComment: {
      author: "Luciana P.",
      content: "Fiz isso ontem, amiga. Coloquei o fone de ouvido pra não ouvir o choro por 5 min e me recompor. Você não é monstro, é humana sobrevivendo!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
    },
    nathReply: {
      content: "Sofia, olha pra mim: VOCÊ NÃO É UM MONSTRO. Você é humana. O que você fez no banheiro se chama 'sobrevivência'. Trancar a porta pra respirar é melhor do que explodir. Eu já fiz isso. Milhares de nós já fizemos. Enxuga esse rosto, você tá fazendo um trabalho incrível num momento impossível. Tô aqui segurando sua mão.",
      time: "Agora mesmo"
    }
  };

  return (
    <div className="pb-24 bg-gray-50 dark:bg-nath-dark-bg min-h-screen animate-in fade-in transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-nath-dark-card px-6 pt-12 pb-4 border-b border-gray-100 dark:border-nath-dark-border sticky top-0 z-20 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-nath-dark dark:text-white">MãesValentes</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Flame size={12} className="text-orange-500" /> Top 10 mais curtidos da semana
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-nath-light-blue dark:bg-nath-dark-bg flex items-center justify-center text-nath-blue">
            <Shield size={20} />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
           {TAGS.map(tag => (
             <button
               key={tag}
               onClick={() => { triggerHaptic(); setActiveTag(tag); }}
               className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                 activeTag === tag 
                  ? 'bg-nath-dark text-white' 
                  : 'bg-gray-100 dark:bg-nath-dark-bg text-gray-500 dark:text-gray-400'
               }`}
             >
               {tag}
             </button>
           ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Create Post Input (Floating Style) */}
        <div className="bg-white dark:bg-nath-dark-card p-3 rounded-2xl border border-gray-200 dark:border-nath-dark-border flex gap-3 items-center shadow-sm mb-2 transition-colors">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces" className="w-10 h-10 rounded-full opacity-80 border border-gray-100 dark:border-nath-dark-border object-cover" alt="User" />
          <input 
            type="text"
            placeholder="Compartilhe seu momento..."
            className="flex-1 bg-transparent py-2 text-sm focus:outline-none text-nath-dark dark:text-white placeholder-gray-400"
          />
          <button className="text-nath-blue p-2">
            <Send size={20} />
          </button>
        </div>
        
        {/* ANJO DO DIA CARD */}
        <div className="bg-gradient-to-r from-nath-pink to-pink-400 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
           <div className="relative z-10 flex items-center gap-4">
             <img src={ANGEL_OF_THE_DAY.avatar} alt="Anjo" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="bg-white text-nath-pink text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Anjo do Dia</span>
               </div>
               <h4 className="font-bold text-lg">{ANGEL_OF_THE_DAY.name}</h4>
               <p className="text-xs text-white/90 italic leading-relaxed">"{ANGEL_OF_THE_DAY.message}"</p>
             </div>
           </div>
        </div>

        {/* PINNED POST */}
        <div className="bg-white dark:bg-nath-dark-card rounded-3xl border-l-4 border-nath-blue shadow-md overflow-hidden relative transition-colors">
           <div className="absolute top-0 right-0 bg-nath-blue/10 dark:bg-blue-900/30 text-nath-blue dark:text-blue-300 px-3 py-1 rounded-bl-xl text-[10px] font-bold flex items-center gap-1 z-10">
             <Pin size={10} fill="currentColor" /> DESTAQUE DA NATH
           </div>

           <div className="p-5 pb-2">
             <div className="flex items-center gap-3 mb-3">
               <img src={PINNED_POST.avatar} className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 dark:ring-nath-dark-border" alt="Author" />
               <div>
                 <h4 className="font-bold text-nath-dark dark:text-nath-dark-text text-sm">{PINNED_POST.author}</h4>
                 <span className="text-xs text-gray-400">{PINNED_POST.time} • {PINNED_POST.tag}</span>
               </div>
             </div>
             <p className="text-nath-dark dark:text-gray-200 text-sm leading-relaxed mb-4 font-medium">
               {PINNED_POST.content}
             </p>
             <div className="flex items-center gap-6 text-gray-400 dark:text-gray-500 text-xs font-bold border-t border-gray-50 dark:border-nath-dark-border pt-3">
                <span className="flex items-center gap-1 text-nath-pink"><Heart size={14} fill="currentColor"/> {PINNED_POST.likes}</span>
                <span className="flex items-center gap-1"><MessageCircle size={14}/> {PINNED_POST.comments}</span>
             </div>
           </div>

           <div className="bg-gray-50 dark:bg-nath-dark-bg/50 p-4 border-t border-gray-100 dark:border-nath-dark-border space-y-4">
              <button className="text-gray-400 text-xs font-medium hover:text-nath-blue dark:hover:text-nath-dark-hero transition-colors flex items-center gap-1">
                Ver todos os {PINNED_POST.comments} comentários
              </button>

              <div className="flex gap-3 opacity-80">
                 <img src={PINNED_POST.otherComment.avatar} className="w-8 h-8 rounded-full object-cover" alt="User" />
                 <div className="bg-white dark:bg-nath-dark-card p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-nath-dark-border">
                    <span className="text-xs font-bold text-nath-dark dark:text-nath-dark-text block mb-0.5">{PINNED_POST.otherComment.author}</span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">{PINNED_POST.otherComment.content}</p>
                 </div>
              </div>

              <div className="flex gap-3 pl-2 relative">
                 <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-900/50 -ml-2 rounded-full"></div>
                 <div className="flex-shrink-0 relative">
                   <img src="https://i.imgur.com/1CWZt2p.jpg" className="w-10 h-10 rounded-full object-cover ring-2 ring-nath-blue" alt="Nath" />
                   <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-nath-dark-bg">
                     <BadgeCheck size={10} fill="currentColor" className="text-white" />
                   </div>
                 </div>
                 <div className="flex-1">
                   <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-2xl rounded-tl-none border border-blue-100 dark:border-nath-dark-border/50">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-bold text-nath-dark dark:text-white">Nathália Valente</span>
                        <BadgeCheck size={12} className="text-blue-500 fill-white dark:fill-transparent" />
                        <span className="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-bold ml-1">Verificada</span>
                      </div>
                      <p className="text-xs text-nath-dark dark:text-gray-200 leading-relaxed italic">
                        "{PINNED_POST.nathReply.content}"
                      </p>
                   </div>
                   <div className="mt-1 flex gap-3 text-[10px] text-gray-400 font-bold ml-2">
                     <button className="text-nath-pink flex items-center gap-1 hover:underline"><Heart size={10} fill="currentColor"/> 892</button>
                     <span>{PINNED_POST.nathReply.time}</span>
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* REGULAR FEED (Interactive) */}
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-nath-dark dark:text-nath-dark-text ml-1 flex items-center gap-2">
               <Star size={18} className="text-nath-blue fill-nath-blue" /> Top 10 Histórias
            </h3>
            
            {posts.map((post, index) => (
              <div key={post.id} className="bg-white dark:bg-nath-dark-card p-5 rounded-3xl border border-gray-100 dark:border-nath-dark-border shadow-sm relative overflow-hidden transition-colors">
                
                <div className="absolute -right-2 -top-4 text-[80px] font-bold text-gray-50 dark:text-nath-dark-bg pointer-events-none z-0 opacity-60">
                  {index + 1}
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-50 dark:ring-nath-dark-border" />
                      <div>
                        <h4 className="font-bold text-nath-dark dark:text-nath-dark-text text-sm">{post.author}</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400">{post.time}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-nath-pink font-medium bg-pink-50 dark:bg-pink-900/20 px-1.5 rounded-md">{post.tag}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-300 hover:text-gray-500 p-1"><MoreHorizontal size={18}/></button>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-nath-dark-border">
                    <div className="flex items-center gap-4">
                      <button 
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition-colors group ${post.likedByMe ? 'text-nath-pink' : 'text-gray-400 dark:text-nath-dark-muted hover:text-nath-pink'}`}
                      >
                          <Heart size={18} className={`transition-transform ${post.likedByMe ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                          <span className="text-xs font-bold">{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-1.5 text-nath-blue dark:text-nath-dark-hero transition-colors group bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                          <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold">{post.comments}</span>
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-nath-dark transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-50 dark:border-nath-dark-border opacity-60">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <CornerDownRight size={12} /> Ver todos os comentários
                      </p>
                  </div>

                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};
