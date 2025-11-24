
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_POSTS, MOCK_SEASON } from '../constants';
import { Post, Episode } from '../types';
import { PlayCircle, Mic, FileText, Video, ExternalLink, Lock, CheckCircle, Sparkles, Search, X, Loader2, Share2, ChevronLeft, ChevronRight, Heart, MessageCircle } from 'lucide-react';
import { triggerHaptic } from '../components/UI';

interface FeedProps {
  // Removed onBack as this is now a main tab
}

export const Feed: React.FC<FeedProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Season Logic
  const [episodes, setEpisodes] = useState<Episode[]>(MOCK_SEASON.episodes);
  const completedCount = episodes.filter(e => e.isCompleted).length;

  // Full Screen Viewer Logic
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  
  // Simulate Data Fetching
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleEpisode = (id: string) => {
    const episode = episodes.find(e => e.id === id);
    if (episode?.isLocked) {
      triggerHaptic();
      // Optional: Show toast "Episode locked"
      return;
    }

    triggerHaptic();
    setEpisodes(prev => prev.map(ep => 
      ep.id === id ? { ...ep, isCompleted: !ep.isCompleted } : ep
    ));
  };

  const getBadgeColor = (type: Post['type']) => {
    switch(type) {
      case 'Reels': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-200';
      case 'Vídeo': return 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-200';
      case 'Áudio': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-200';
      default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200';
    }
  };

  const handleShare = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    triggerHaptic();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Olha esse conteúdo do Nossa Maternidade: ${post.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Compartilhar: ${post.title}`);
    }
  };

  const handleClearSearch = () => {
    triggerHaptic();
    setSearchQuery('');
  };

  // Filter logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Todos' || post.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filters = ['Todos', 'Vídeo', 'Áudio', 'Reels', 'Texto'];

  // Viewer Logic
  const openViewer = (post: Post) => {
    triggerHaptic();
    const index = filteredPosts.findIndex(p => p.id === post.id);
    setSelectedPostIndex(index);
  };

  const closeViewer = () => setSelectedPostIndex(null);

  const nextPost = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPostIndex !== null && selectedPostIndex < filteredPosts.length - 1) {
      setSelectedPostIndex(selectedPostIndex + 1);
    }
  };

  const prevPost = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPostIndex !== null && selectedPostIndex > 0) {
      setSelectedPostIndex(selectedPostIndex - 1);
    }
  };

  // Swipe Handlers
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextPost();
    if (isRightSwipe) prevPost();

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="pb-24 bg-gray-50 dark:bg-nath-dark-bg min-h-screen animate-in fade-in transition-colors duration-300">
      
      {/* Main Feed Header */}
      <div className="bg-white dark:bg-nath-dark-card p-6 pt-10 pb-4 border-b border-gray-100 dark:border-nath-dark-border sticky top-0 z-10 flex flex-col items-center transition-colors shadow-sm">
        <div className="w-40 h-40 rounded-full border-6 border-white dark:border-nath-dark-card shadow-xl overflow-hidden mb-2 relative">
           <img src="https://i.imgur.com/1CWZt2p.jpg" alt="Mundo Nath" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-3xl font-bold text-nath-dark dark:text-white mb-1">Mundo Nath</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm font-medium mb-4">Séries, bastidores e dicas da Nathália.</p>
      
        {/* Search Bar */}
        <div className="w-full max-w-sm relative mb-3">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar conteúdos..."
            className="w-full pl-11 pr-10 py-3 bg-gray-100 dark:bg-nath-dark-bg border-transparent focus:bg-white dark:focus:bg-nath-dark-card border focus:border-nath-blue rounded-xl text-sm transition-all outline-none text-nath-dark dark:text-nath-dark-text placeholder-gray-400"
          />
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-nath-dark dark:hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="w-full flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => { triggerHaptic(); setActiveFilter(filter); }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-nath-blue text-white shadow-md'
                  : 'bg-gray-100 dark:bg-nath-dark-bg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-8 relative z-0">
        
        {/* SEASON 1 - Retention Feature (Only show if not searching) */}
        {!searchQuery && activeFilter === 'Todos' && (
          <section>
             <div className="flex justify-between items-end mb-3 px-1">
               <div>
                 <h3 className="text-nath-dark dark:text-nath-dark-text font-bold">Série Original</h3>
                 <p className="text-xs text-gray-500 dark:text-nath-dark-muted">{MOCK_SEASON.title}</p>
               </div>
               <span className="text-xs font-bold text-nath-blue bg-nath-light-blue dark:bg-nath-dark-card dark:text-nath-blue px-2 py-1 rounded-lg">
                 {completedCount}/{episodes.length} assistidos
               </span>
             </div>

             <div className="bg-white dark:bg-nath-dark-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-nath-dark-border transition-colors">
                <div className="space-y-4">
                  {episodes.map((ep, index) => (
                    <button 
                      key={ep.id} 
                      className={`flex items-center gap-3 w-full text-left transition-opacity ${ep.isLocked ? 'opacity-50' : 'active:opacity-70'}`}
                      onClick={() => toggleEpisode(ep.id)}
                    >
                      {ep.isCompleted ? (
                         <CheckCircle size={22} className="text-green-500 flex-shrink-0 fill-green-100 dark:fill-green-900" />
                      ) : ep.isLocked ? (
                         <Lock size={22} className="text-gray-300 flex-shrink-0" />
                      ) : (
                         <div className="relative">
                           <PlayCircle size={22} className="text-nath-blue fill-nath-light-blue dark:fill-transparent flex-shrink-0" />
                           <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                         </div>
                      )}
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium line-clamp-1 ${ep.isCompleted ? 'text-gray-400 line-through' : 'text-nath-dark dark:text-nath-dark-text'}`}>
                          {index + 1}. {ep.title}
                        </h4>
                        <span className="text-[10px] text-gray-400">{ep.duration}</span>
                      </div>
                      {!ep.isLocked && !ep.isCompleted && (
                        <span className="text-[10px] font-bold bg-nath-dark dark:bg-nath-dark-pause text-white px-2 py-1 rounded animate-pulse-slow">
                          PLAY
                        </span>
                      )}
                    </button>
                  ))}
                </div>
             </div>
          </section>
        )}

        {/* General Feed / Search Results */}
        <section>
          <h3 className="font-bold text-lg text-nath-dark dark:text-nath-dark-text mb-3 ml-1 flex items-center gap-2">
            <Sparkles size={18} className="text-nath-blue" /> 
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Conteúdos'}
          </h3>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="text-nath-blue animate-spin" />
              <p className="text-xs text-gray-400 animate-pulse">Carregando novidades...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-10 opacity-60">
              <p className="text-nath-dark dark:text-nath-dark-text font-medium">Nenhum conteúdo encontrado.</p>
              <p className="text-xs text-gray-500">Tente buscar por outro termo.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => openViewer(post)}
                  className="bg-white dark:bg-nath-dark-card rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-nath-dark-border active:scale-[0.99] transition-all cursor-pointer group relative"
                >
                  <div className="relative h-48 bg-gray-200 dark:bg-nath-dark-bg">
                    <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                       <div className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full shadow-lg">
                         <ExternalLink size={24} className="text-white" />
                       </div>
                    </div>

                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getBadgeColor(post.type)}`}>
                      {post.type}
                    </div>

                    <button 
                      onClick={(e) => handleShare(e, post)}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-nath-dark transition-colors"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-nath-dark dark:text-nath-dark-text text-lg mb-2 leading-tight transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-gray-400 dark:text-nath-dark-muted font-medium">Postado recentemente</span>
                       <button className="text-nath-blue dark:text-nath-dark-hero text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                         Ver agora <ChevronRight size={14} />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Full Screen Viewer Modal */}
      {selectedPostIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-300">
          
          {/* Viewer Header */}
          <div className="flex justify-between items-center p-4 text-white">
            <button onClick={closeViewer} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
            <span className="text-sm font-bold opacity-80">
              {selectedPostIndex + 1} / {filteredPosts.length}
            </span>
            <button onClick={(e) => handleShare(e, filteredPosts[selectedPostIndex])} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Share2 size={24} />
            </button>
          </div>

          {/* Main Content Area - Swipeable */}
          <div 
            className="flex-1 flex flex-col justify-center items-center relative p-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
             {/* Desktop Nav Buttons */}
             <button 
               onClick={prevPost}
               className={`absolute left-2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors hidden md:block ${selectedPostIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
               disabled={selectedPostIndex === 0}
             >
               <ChevronLeft size={32} className="text-white" />
             </button>
             
             <button 
               onClick={nextPost}
               className={`absolute right-2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors hidden md:block ${selectedPostIndex === filteredPosts.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
               disabled={selectedPostIndex === filteredPosts.length - 1}
             >
               <ChevronRight size={32} className="text-white" />
             </button>

             {/* Content */}
             <div className="w-full max-w-md bg-white dark:bg-nath-dark-card rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="aspect-square relative bg-black">
                   <img 
                     src={filteredPosts[selectedPostIndex].thumbnailUrl} 
                     alt={filteredPosts[selectedPostIndex].title} 
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                        {activeFilter === 'Áudio' ? <Mic size={32} className="text-white" /> : <PlayCircle size={32} className="text-white fill-white/20" />}
                      </div>
                   </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getBadgeColor(filteredPosts[selectedPostIndex].type)}`}>
                      {filteredPosts[selectedPostIndex].type}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-nath-dark dark:text-nath-dark-text mb-2">
                    {filteredPosts[selectedPostIndex].title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Toque no botão abaixo para acessar o conteúdo completo.
                  </p>
                  <div className="flex gap-3">
                     <button className="flex-1 bg-nath-blue hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                       Abrir conteúdo <ExternalLink size={16} />
                     </button>
                     <button className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                       <Heart size={20} />
                     </button>
                  </div>
                </div>
             </div>

             {/* Mobile Swipe Hint */}
             <div className="absolute bottom-8 text-white/40 text-xs font-medium animate-pulse md:hidden">
               Deslize para navegar
             </div>
          </div>

        </div>
      )}
    </div>
  );
};
