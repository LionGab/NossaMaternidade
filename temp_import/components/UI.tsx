import React from 'react';

// Utility for Haptic Feedback
export const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10); // Light vibration for UI feedback
  }
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  fullWidth, 
  variant = 'primary', 
  className = '', 
  onClick,
  ...props 
}) => {
  // Standardized base styles: py-4 for better touch target, rounded-xl for visual language
  const baseStyles = "py-4 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-nath-blue hover:bg-blue-500 dark:bg-nath-dark-hero dark:hover:bg-blue-700 text-white shadow-lg shadow-nath-blue/20 dark:shadow-none",
    outline: "border-2 border-gray-200 dark:border-nath-dark-border text-nath-dark dark:text-nath-dark-text hover:bg-gray-50 dark:hover:bg-nath-dark-card",
    ghost: "bg-transparent text-nath-dark dark:text-nath-dark-text hover:bg-gray-100 dark:hover:bg-nath-dark-card"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHaptic();
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full px-4 py-4 rounded-xl bg-white dark:bg-nath-dark-bg border border-gray-200 dark:border-nath-dark-border text-nath-dark dark:text-nath-dark-text placeholder-gray-400 focus:outline-none focus:border-nath-blue focus:ring-2 focus:ring-nath-blue/20 transition-all text-sm ${className}`}
      {...props}
    />
  );
};