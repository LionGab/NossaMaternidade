
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(onComplete, 500);
  };

  return (
    <div className={`h-screen w-full flex flex-col items-center justify-between bg-nath-warm dark:bg-nath-dark-bg p-8 transition-all duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Top Title */}
      <div className="mt-12 text-center">
        <h1 className="text-3xl font-bold text-nath-dark dark:text-nath-dark-text transition-colors">
          Nossa <br /> Maternidade
        </h1>
      </div>

      {/* Center Image */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-64 h-64 rounded-full border-4 border-white dark:border-nath-dark-card shadow-xl overflow-hidden mb-8 relative">
          <img 
            src="https://i.imgur.com/GDYdiuy.jpg" 
            alt="Nathalia Valente" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="text-center max-w-[280px]">
          <p className="text-nath-dark dark:text-nath-dark-text text-lg font-medium italic leading-relaxed transition-colors">
            "Você é forte.<br/>Mesmo nos dias em que não parece."
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="w-full mb-8">
        <button 
          onClick={handleStart}
          className="w-full bg-nath-blue hover:bg-blue-500 dark:bg-nath-dark-hero dark:hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-nath-blue/20 dark:shadow-none active:scale-95 transition-all"
        >
          Começar com a Nath
        </button>
      </div>
    </div>
  );
};
