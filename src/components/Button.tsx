import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  className?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  hapticFeedback = true,
  className = '',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress();
  };

  // Variant styles
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-transparent border-2 border-primary',
    ghost: 'bg-transparent',
  };

  // Primary button uses the vibrant blue
  const primaryBgColor = variant === 'primary' ? '#6DA9E4' : undefined;

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  // Text variant styles
  const textVariantStyles = {
    primary: 'text-white',
    secondary: 'text-primary',
    outline: 'text-primary',
    ghost: 'text-primary',
  };

  // Text size styles
  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : 'opacity-100'}
        rounded-full
        items-center
        justify-center
        ${className}
      `}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#fff' : '#FF69B4'} 
        />
      ) : (
        <Text
          className={`
            ${textVariantStyles[variant]}
            ${textSizeStyles[size]}
            font-semibold
          `}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

