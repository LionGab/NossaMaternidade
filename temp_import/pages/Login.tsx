import React, { useState } from 'react';
import { Button, Input } from '../components/UI';
import { Eye, EyeOff, ChevronLeft, Sun, Moon, Apple } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void; // Usually to Splash or Exit
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack, toggleTheme, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    // Simula delay de rede e login Supabase
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="h-screen bg-nath-warm dark:bg-nath-dark-bg p-6 flex flex-col justify-center animate-in fade-in duration-500 relative transition-colors">
      
      {/* Top Navigation */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
        <button 
          onClick={onBack} 
          className="bg-black text-white dark:bg-white dark:text-black p-2 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} />
        </button>

        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-white dark:bg-nath-dark-card text-nath-dark dark:text-white flex items-center justify-center shadow-sm border border-gray-100 dark:border-nath-dark-border transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="text-center mb-8 mt-4">
        <div className="w-24 h-24 rounded-full bg-nath-light-blue dark:bg-nath-dark-card mx-auto mb-4 flex items-center justify-center border-4 border-white dark:border-nath-dark-border shadow-xl overflow-hidden">
           <img src="https://i.imgur.com/GDYdiuy.jpg" alt="Logo Nathália Valente" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-nath-dark dark:text-nath-dark-text mb-1">Bem-vinda de volta</h1>
        <p className="text-nath-dark/60 dark:text-nath-dark-muted text-sm">Entre para acessar seu espaço seguro.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-nath-dark/70 dark:text-nath-dark-muted mb-1 ml-1 uppercase tracking-wider">E-mail</label>
          <Input 
            type="email" 
            placeholder="exemplo@email.com" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            // required 
            // Optional for demo speed
          />
        </div>
        
        <div className="relative">
          <label className="block text-xs font-bold text-nath-dark/70 dark:text-nath-dark-muted mb-1 ml-1 uppercase tracking-wider">Senha</label>
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            // required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-4 text-gray-400 dark:text-gray-500 p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="text-right">
          <button type="button" className="text-xs text-nath-blue dark:text-nath-dark-hero font-bold hover:underline">Esqueceu a senha?</button>
        </div>

        <Button fullWidth type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-gray-200 dark:bg-nath-dark-border flex-1" />
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ou continue com</span>
        <div className="h-px bg-gray-200 dark:bg-nath-dark-border flex-1" />
      </div>

      <div className="space-y-3">
        <button 
          type="button"
          onClick={() => handleLogin()}
          className="w-full py-4 rounded-xl border border-gray-200 dark:border-nath-dark-border flex items-center justify-center gap-2 bg-white dark:bg-nath-dark-card text-nath-dark dark:text-nath-dark-text font-semibold hover:bg-gray-50 dark:hover:bg-nath-dark-bg transition-colors shadow-sm"
        >
          <Apple size={20} className="mb-0.5" />
          Continuar com Apple
        </button>
        
        <button 
          type="button"
          onClick={() => handleLogin()}
          className="w-full py-4 rounded-xl border border-gray-200 dark:border-nath-dark-border flex items-center justify-center gap-2 bg-white dark:bg-nath-dark-card text-nath-dark dark:text-nath-dark-text font-semibold hover:bg-gray-50 dark:hover:bg-nath-dark-bg transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 4.66c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar com Google
        </button>
      </div>

      <p className="text-center mt-8 text-xs text-gray-400">
        Ainda não tem conta? <button className="text-nath-pink font-bold hover:underline">Criar agora</button>
      </p>

    </div>
  );
};