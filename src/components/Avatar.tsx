import React from 'react';
import { View, Image, Text } from 'react-native';
import { Colors } from '../constants/Colors';

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
  const TouchableComponent = onPress
    ? require('react-native').TouchableOpacity
    : View;

  const content = (
    <View
      className={`rounded-full items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: Colors.background.card,
        borderRadius: size / 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
            color: Colors.text.primary,
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

