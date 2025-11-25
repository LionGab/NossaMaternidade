import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/theme';
import { Tokens } from '@/theme/tokens';

export interface AvatarProps {
  size?: number;
  source?: { uri: string } | number;
  name?: string;
  className?: string;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 40,
  source,
  name,
  className = '',
  onPress,
}) => {
  const colors = useThemeColors();
  const TouchableComponent = onPress ? TouchableOpacity : View;

  const content = (
    <View
      className={`rounded-full items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: colors.background.card,
        borderRadius: size / 2,
        ...Tokens.shadows.sm,
      }}
    >
      {source ? (
        <Image
          source={source}
          style={{
            width: size,
            height: size,
          }}
          resizeMode="cover"
        />
      ) : name ? (
        <Text
          className="font-semibold"
          style={{
            color: colors.text.primary,
            fontSize: size * 0.4,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Text>
      ) : (
        <Text style={{ fontSize: size * 0.6 }}>👤</Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableComponent onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableComponent>
    );
  }

  return content;
};

export default Avatar;

