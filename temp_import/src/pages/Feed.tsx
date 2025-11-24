
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_POSTS, MOCK_SEASON } from '../constants';
import { Post, Episode } from '../types';
import { PlayCircle, Mic, FileText, Video, ExternalLink, Lock, CheckCircle, Sparkles, Search, X, Loader2, Share2, ChevronLeft, ChevronRight, Heart, MessageCircle, Pause, Image as ImageIcon, Flame, Play } from 'lucide-react';
import { triggerHaptic } from '../components/UI';

interface FeedProps {
  // Removed onBack as this is now a main tab
}

// --- SUB-COMPONENT: AUDIO PLAYER ---
const AudioPlayerCard: React.FC<{
  post: Post;
  isPlaying: boolean;
  onToggle: () => void;
  onShare: (e: React.MouseEvent) => void;
}> = ({ post, isPlaying, onToggle, onShare }) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  
  // Helper to parse "MM:SS" to seconds
  const totalSeconds = React.useMemo(() => {
    if (!post.duration) return 300;
    const parts = post.duration.split(':').map(Number);
    return parts.length === 2 ? parts[0] * 60 + parts[1] : 300;
  }, [post.duration]);

  // Simulation of playback progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            onToggle(); // Stop when finished
            return 0;
          }
          // Advance based on total duration (100ms tick)
          // 100% / (totalSeconds * 10) = percent per 100ms
          const step = 100 / (totalSeconds * 10); 
          return Math.min(prev + step, 100);
        });
      }, 100); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, onToggle, totalSeconds]);

  // Format current time
  useEffect(() => {
    const currentSecs = Math.floor((progress / 100) * totalSeconds);
    const mins = Math.floor(currentSecs / 60);
    const secs = currentSecs % 60;
    setCurrentTime(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
  }, [progress, totalSeconds]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
  };

  return (
    <div className="bg-white dark:bg-nath-dark-card rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-nath-dark-border p-5 flex flex-col gap-4">
      {/* Top Row: Thumbnail & Info */}
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-md ring-2 ring-amber-50 dark:ring-nath-dark-border">
          <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-amber-600 shadow-sm">
              <Mic size={16} />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md">
              Áudio
            </span>
            <button onClick={onShare} className="text-gray-400 hover:text-nath-dark transition-colors">
              <Share2 size={16} />
            </button>
          </div>
          
          <h3 className="font-bold text-nath-dark dark:text-nath-dark-text text-base leading-tight mb-1 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {post.description}
          </p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="bg-amber-50 dark:bg-nath-dark-bg rounded-2xl p-3 flex items-center gap-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex-shrink-0"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>

        <div className="flex-1 flex flex-col justify-center gap-1">
          <div className="flex justify-between text-[10px] font-medium text-amber-700 dark:text-amber-400 px-0.5">
             <span>{currentTime}</span>
             <span>{post.duration || "05:00"}</span>
          </div>
          
          {/* Scrubber Container */}
          <div className="relative w-full h-5 flex items-center group">
             {/* Background Track */}
             <div className="absolute w-full h-1.5 bg-amber-200/50 dark:bg-gray-700 rounded-full overflow-hidden">
                {/* Filled Track */}
                <div 
                   className="h-full bg-amber-500 rounded-full transition-all duration-75 ease-linear"
                   style={{ width: `${progress}%` }} 
                />
             </div>
             
             {/* Thumb (Visual only) */}
             <div 
                className="absolute w-3.5 h-3.5 bg-amber-600 rounded-full shadow-md border-2 border-white dark:border-nath-dark-bg transition-transform duration-75 ease-out pointer-events-none"
                style={{ left: `calc(${progress}% - 7px)` }}
             />

             {/* Interactive Input */}
             <input 
                type="range" 
                min="0" 
                max="100" 
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Seek"
             />
          </div>
        </div>
      </div>
    </div>
  );
};


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
  
  // Audio Playback Mock Logic
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Simulate Data Fetching
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleEpisode = (id: string) => {
    const episode = episodes.find(e => e.id === id);
    if (episode?.isLocked) {
      triggerHaptic();
      return;
    }
    triggerHaptic();
    setEpisodes(prev => prev.map(ep => 
      ep.id === id ? { ...ep, isCompleted: !ep.isCompleted } : ep
    ));
  };

  const toggleAudio = (id: string) => {
    triggerHaptic();
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  const getBadgeColor = (type: Post['type']) => {
    switch(type) {
      case 'Reels': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'Vídeo': return 'bg-red-500 text-white';
      case 'Áudio': return 'bg-amber-500 text-white';
      case 'Foto': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleShare = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    triggerHaptic();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Olha isso no app da Nath: ${post.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Compartilhado!`);
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

  const filters = ['Todos', 'Áudio', 'Vídeo', 'Foto', 'Reels'];

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
        
        {/* Hero Profile */}
        <div className="flex flex-col items-center mb-4">
           <div className="w-24 h-24 rounded-full border-2 border-nath-pink p-1 mb-2 relative">
             <img src="https://i.imgur.com/1CWZt2p.jpg" alt="Mundo Nath" className="w-full h-full rounded-full object-cover" />
             <div className="absolute bottom-0 right-0 bg-nath-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
               VIP
             </div>
           </div>
           <h1 className="text-2xl font-bold text-nath-dark dark:text-white">Mundo Nath</h1>
           <p className="text-xs text-nath-dark/60 dark:text-gray-400 font-medium">
             Sem filtros. A maternidade como ela é.
           </p>
        </div>
      
        {/* Search Bar */}
        <div className="w-full relative mb-3">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O que você precisa ouvir hoje?"
            className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-nath-dark-bg border-transparent focus:bg-white dark:focus:bg-nath-dark-card border focus:border-nath-pink rounded-xl text-sm transition-all outline-none text-nath-dark dark:text-nath-dark-text placeholder-gray-400"
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
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeFilter === filter
                  ? 'bg-nath-dark text-white border-nath-dark shadow-md'
                  : 'bg-white dark:bg-nath-dark-bg text-gray-600 dark:text-gray-400 border-gray-200 dark:border-nath-dark-border'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6 relative z-0">
        
        {/* SEASON 1 - Retention Feature */}
        {!searchQuery && activeFilter === 'Todos' && (
          <section className="mb-2">
             <div className="flex justify-between items-end mb-3 px-1">
               <div className="flex items-center gap-2">
                 <div className="bg-red-600 text-white p-1 rounded-md">
                   <PlayCircle size={14} fill="currentColor" />
                 </div>
                 <div>
                    <h3 className="text-nath-dark dark:text-nath-dark-text font-bold text-sm uppercase tracking-wider">Série Original</h3>
                    <p className="text-[10px] text-gray-500 dark:text-nath-dark-muted font-medium">{MOCK_SEASON.subtitle}</p>
                 </div>
               </div>
             </div>

             <div className="bg-white dark:bg-nath-dark-card rounded-2xl p-0 shadow-sm border border-gray-100 dark:border-nath-dark-border overflow-hidden">
                {/* Season Header Image */}
                <div className="h-32 w-full relative">
                  <img src={MOCK_SEASON.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div>
                       <h2 className="text-white font-bold text-lg leading-none">{MOCK_SEASON.title}</h2>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded">NOVO</span>
                         <span className="text-[10px] text-gray-300">{episodes.length} Episódios</span>
                       </div>
                    </div>
                  </div>
                </div>
                
                {/* Episodes List */}
                <div className="divide-y divide-gray-50 dark:divide-nath-dark-border">
                  {episodes.map((ep, index) => (
                    <button 
                      key={ep.id} 
                      className={`flex items-center gap-3 w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-nath-dark-bg transition-colors ${ep.isLocked ? 'opacity-60' : ''}`}
                      onClick={() => toggleEpisode(ep.id)}
                    >
                      <div className="text-gray-400 font-bold text-lg w-6 text-center">{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${ep.isCompleted ? 'text-gray-400' : 'text-nath-dark dark:text-nath-dark-text'}`}>
                          {ep.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          {ep.duration} {ep.isCompleted && <span className="text-green-500">• Assistido</span>}
                        </span>
                      </div>
                      <div>
                        {ep.isCompleted ? (
                           <CheckCircle size={20} className="text-green-500" />
                        ) : ep.isLocked ? (
                           <Lock size={18} className="text-gray-300" />
                        ) : (
                           <PlayCircle size={24} className="text-nath-dark dark:text-white fill-white dark:fill-transparent" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
             </div>
          </section>
        )}

        {/* Feed Grid */}
        <section>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="text-nath-blue animate-spin" />
              <p className="text-xs text-gray-400 animate-pulse">Buscando conteúdos...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-10 opacity-60">
              <p className="text-nath-dark dark:text-nath-dark-text font-medium">Nenhum conteúdo encontrado.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredPosts.map((post) => {
                
                // --- AUDIO CARD ---
                if (post.type === 'Áudio') {
                   return (
                     <AudioPlayerCard 
                       key={post.id}
                       post={post}
                       isPlaying={playingAudioId === post.id}
                       onToggle={() => toggleAudio(post.id)}
                       onShare={(e) => handleShare(e, post)}
                     />
                   );
                }

                // --- STANDARD CARD (Video, Reels, Photo) ---
                return (
                  <div 
                    key={post.id} 
                    onClick={() => openViewer(post)}
                    className="bg-white dark:bg-nath-dark-card rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-nath-dark-border transition-all cursor-pointer group active:scale-[0.99]"
                  >
                    {/* Media Container */}
                    <div className="relative aspect-[4/3] bg-gray-200">
                          
                        {/* Video/Photo Layout */}
                        <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        
                        {/* Badge Top Left */}
                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md flex items-center gap-1 ${getBadgeColor(post.type)}`}>
                          {post.type === 'Vídeo' && <Video size={10} />}
                          {post.type === 'Reels' && <Flame size={10} />}
                          {post.type === 'Foto' && <ImageIcon size={10} />}
                          {post.type}
                        </div>
                        
                        {/* New Badge */}
                        {post.isNew && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm animate-pulse">
                            NOVO
                          </div>
                        )}

                        {/* Play Button Center */}
                        {post.type !== 'Foto' && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300">
                              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-lg">
                                  <PlayCircle size={32} className="text-white fill-white/20" />
                              </div>
                            </div>
                        )}

                        {/* Content Overlay Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-bold text-white text-lg mb-1 leading-tight line-clamp-2 drop-shadow-md">
                              {post.title}
                            </h3>
                            <p className="text-xs text-gray-200 line-clamp-1 opacity-90 font-medium">
                              {post.description}
                            </p>
                        </div>
                    </div>
                    
                    {/* Footer Interaction */}
                    <div className="px-4 py-3 flex justify-between items-center border-t border-gray-50 dark:border-nath-dark-border bg-white dark:bg-nath-dark-card">
                          <button className="flex items-center gap-1.5 text-gray-400 hover:text-nath-pink transition-colors text-xs font-bold group">
                              <Heart size={16} className="group-hover:scale-110 transition-transform" /> Curtir
                          </button>
                          <button onClick={(e) => handleShare(e, post)} className="text-gray-400 hover:text-nath-dark transition-colors p-1">
                              <Share2 size={18} />
                          </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Full Screen Viewer Modal */}
      {selectedPostIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
          
          {/* Viewer Header */}
          <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center text-white z-10 bg-gradient-to-b from-black/90 to-transparent">
            <button onClick={closeViewer} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md">
              <X size={24} />
            </button>
            <span className="text-xs font-bold tracking-widest opacity-70 uppercase">Visualizando</span>
            <button onClick={(e) => handleShare(e, filteredPosts[selectedPostIndex])} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md">
              <Share2 size={24} />
            </button>
          </div>

          {/* Main Content Area - Swipeable */}
          <div 
            className="flex-1 flex items-center justify-center relative bg-black"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
             {/* Image Fit Logic */}
             <img 
               src={filteredPosts[selectedPostIndex].thumbnailUrl} 
               alt={filteredPosts[selectedPostIndex].title} 
               className="w-full max-h-screen object-contain"
             />

             {/* Navigation Arrows Desktop */}
             <button 
               onClick={prevPost}
               className={`absolute left-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors hidden md:block backdrop-blur-md ${selectedPostIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
             >
               <ChevronLeft size={32} className="text-white" />
             </button>
             <button 
               onClick={nextPost}
               className={`absolute right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors hidden md:block backdrop-blur-md ${selectedPostIndex === filteredPosts.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}
             >
               <ChevronRight size={32} className="text-white" />
             </button>
          </div>

          {/* Caption Area - Expanded */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white pb-10">
             <div className="flex items-center gap-2 mb-3">
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${getBadgeColor(filteredPosts[selectedPostIndex].type)}`}>
                    {filteredPosts[selectedPostIndex].type}
                </div>
                {filteredPosts[selectedPostIndex].duration && (
                  <span className="text-xs font-mono opacity-70">{filteredPosts[selectedPostIndex].duration}</span>
                )}
             </div>
             
             <h2 className="text-xl font-bold mb-3 leading-tight">
               {filteredPosts[selectedPostIndex].title}
             </h2>
             
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
               {filteredPosts[selectedPostIndex].description && (
                 <p className="text-sm text-gray-200 opacity-90 leading-relaxed">
                   {filteredPosts[selectedPostIndex].description}
                 </p>
               )}
               {filteredPosts[selectedPostIndex].type !== 'Foto' && (
                 <button className="w-full mt-3 bg-white text-black font-bold py-3 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                   Assistir Agora
                 </button>
               )}
             </div>
          </div>

        </div>
      )}
    </div>
  );
};
