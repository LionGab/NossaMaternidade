/**
 * ProgressIndicator Component
 * Indicador de progresso com dots horizontais conforme design do site
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  className = '',
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View className={`flex-row gap-1 items-center ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;

        const dotStyle: ViewStyle = {
          height: 6,
          borderRadius: 3,
          backgroundColor: isActive
            ? isDark
              ? '#3B82F6'
              : '#4285F4'
            : isDark
            ? 'rgba(255, 255, 255, 0.3)'
            : '#E5E5E5',
          width: isActive ? 16 : 6,
        };

        return (
          <View
            key={index}
            style={dotStyle}
            className="transition-all duration-500"
          />
        );
      })}
    </View>
  );
};

export default ProgressIndicator;
