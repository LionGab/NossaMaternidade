import React, { useState, useEffect } from 'react';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Feed } from './pages/Feed';
import { Community } from './pages/Community';
import { Habits } from './pages/Habits';
import { Ritual } from './pages/Ritual';
import { Diary } from './pages/Diary';
import { BottomNavigation } from './components/Navigation';
import { UserProfile } from './types';
import { triggerHaptic } from './components/UI';

// Expanded view manager to include retention features
type ViewState = 'SPLASH' | 'LOGIN' | 'ONBOARDING' | 'APP' | 'RITUAL' | 'DIARY';
type AppTab = 'home' | 'community' | 'chat' | 'content' | 'habits';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('SPLASH');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  
  // Initialize Dark Mode with LocalStorage or OS Preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedUser = localStorage.getItem('nath_user');
    if (savedUser) {
      setUserProfile(JSON.parse(savedUser));
    }
  }, []);

  // Effect to apply theme class and persist to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    triggerHaptic();
    setIsDarkMode(prev => !prev);
  };

  const handleSplashComplete = () => {
    setView('LOGIN');
  };

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem('nath_user');
    if (savedUser) {
        setView('APP');
    } else {
        setView('ONBOARDING');
    }
  };

  const handleLogout = () => {
    triggerHaptic();
    localStorage.removeItem('nath_user'); // Clear user data on logout
    setUserProfile({}); // Reset user profile state
    setView('LOGIN');
  };

  const handleOnboardingFinish = (data: UserProfile) => {
    const newUser = { ...userProfile, ...data };
    setUserProfile(newUser);
    localStorage.setItem('nath_user', JSON.stringify(newUser));
    setView('APP');
  };

  const handleNavigateToChat = (msg?: string) => {
    if (msg) setChatInitialMessage(msg);
    setActiveTab('chat');
    setView('APP');
  };

  const handleOpenRitual = () => setView('RITUAL');
  const handleOpenDiary = () => setView('DIARY');
  const handleBackToHome = () => setView('APP');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            user={userProfile} 
            onNavigateToChat={handleNavigateToChat} 
            onNavigateToFeed={() => setActiveTab('content')} 
            onNavigateToRitual={handleOpenRitual}
            onNavigateToDiary={handleOpenDiary}
            onLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
        );
      case 'community':
        return <Community />;
      case 'chat':
        return (
          <Chat 
            onBack={() => setActiveTab('home')} 
            initialMessage={chatInitialMessage}
          />
        );
      case 'content':
        return <Feed />; // Represents "Mundo Nath"
      case 'habits':
        return <Habits onOpenRitual={handleOpenRitual} onOpenDiary={handleOpenDiary} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center transition-colors duration-300">
      {/* Mobile Container */}
      <div className="w-full max-w-[480px] bg-[#FFF8F3] dark:bg-nath-dark-bg min-h-screen relative shadow-2xl overflow-hidden transition-colors duration-300 flex flex-col">
        
        {view === 'SPLASH' && (
          <Splash onComplete={handleSplashComplete} />
        )}

        {view === 'LOGIN' && (
          <Login 
            onLogin={handleLoginSuccess} 
            onBack={() => setView('SPLASH')} 
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
        )}

        {view === 'ONBOARDING' && (
          <Onboarding 
            onFinish={handleOnboardingFinish} 
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
        )}

        {view === 'RITUAL' && (
          <Ritual onComplete={handleBackToHome} onBack={handleBackToHome} />
        )}

        {view === 'DIARY' && (
          <Diary onBack={handleBackToHome} />
        )}

        {view === 'APP' && (
          <>
            <div className={`flex-1 ${activeTab === 'chat' ? 'overflow-hidden' : 'overflow-y-auto no-scrollbar'}`}>
              {renderContent()}
            </div>
            
            <BottomNavigation activeTab={activeTab} onTabChange={(t) => {
              if (t !== 'chat') setChatInitialMessage(undefined);
              setActiveTab(t);
            }} />
          </>
        )}
        
      </div>
    </div>
  );
};

export default App;