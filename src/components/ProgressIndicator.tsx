import React from 'react';
import { View } from 'react-native';
import { Colors } from '../constants/Colors';

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
  return (
    <View className={`flex-row items-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index < currentStep;
        return (
          <View
            key={index}
            className={`h-1 flex-1 rounded-full ${
              isActive ? 'bg-primary' : 'bg-white/30'
            }`}
            style={{
              backgroundColor: isActive
                ? Colors.progress.active
                : Colors.progress.inactive,
            }}
          />
        );
      })}
    </View>
  );
};

export default ProgressIndicator;

