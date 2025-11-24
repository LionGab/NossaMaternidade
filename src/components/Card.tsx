import React from 'react';
import { View, ViewProps, Pressable } from 'react-native';

export interface CardProps extends ViewProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  pressable?: boolean;
  onPress?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  header,
  footer,
  pressable = false,
  onPress,
  className = '',
  children,
  ...props
}) => {
  const cardContent = (
    <>
      {header && (
        <View className="px-4 pt-4 pb-2">
          {header}
        </View>
      )}
      
      <View className={`px-4 ${!header && !footer ? 'py-4' : header && footer ? 'py-2' : 'py-4'}`}>
        {children}
      </View>
      
      {footer && (
        <View className="px-4 pt-2 pb-4">
          {footer}
        </View>
      )}
    </>
  );

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`
          bg-white
          rounded-2xl
          shadow-sm
          active:opacity-80
          ${className}
        `}
        {...props}
      >
        {cardContent}
      </Pressable>
    );
  }

  return (
    <View
      className={`
        bg-white
        rounded-2xl
        shadow-sm
        ${className}
      `}
      {...props}
    >
      {cardContent}
    </View>
  );
};

export default Card;

