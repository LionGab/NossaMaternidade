import React, { useState } from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-text text-sm font-medium mb-2">
          {label}
        </Text>
      )}
      
      <View
        className={`
          flex-row
          items-center
          bg-background
          rounded-xl
          px-4
          py-3
          border-2
          ${error ? 'border-red-500' : isFocused ? 'border-primary' : 'border-border'}
        `}
      >
        {leftIcon && (
          <View className="mr-3">
            {leftIcon}
          </View>
        )}
        
        <TextInput
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor="#999"
          className={`
            flex-1
            text-text
            text-base
            ${className}
          `}
        />
        
        {rightIcon && (
          <View className="ml-3">
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;

