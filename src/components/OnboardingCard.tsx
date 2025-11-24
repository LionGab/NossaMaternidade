import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

export interface OnboardingCardProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress: () => void;
  className?: string;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  icon,
  title,
  subtitle,
  selected = false,
  onPress,
  className = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`
        flex-row items-center
        p-4 rounded-2xl
        mb-3
        border-2
        ${selected ? 'border-primary' : 'border-white/10'}
        ${className}
      `}
      style={{
        backgroundColor: selected
          ? `${Colors.primary.main}20`
          : Colors.background.card,
        borderColor: selected
          ? Colors.primary.main
          : Colors.border.light,
      }}
    >
      {icon && (
        <View className="mr-4">
          {icon}
        </View>
      )}
      
      <View className="flex-1">
        <Text
          className="text-base font-semibold mb-1"
          style={{ color: Colors.text.primary }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className="text-sm"
            style={{ color: Colors.text.secondary }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {selected && (
        <View
          className="w-5 h-5 rounded-full items-center justify-center"
          style={{ backgroundColor: Colors.primary.main }}
        >
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: Colors.text.primary }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OnboardingCard;

