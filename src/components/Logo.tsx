import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { logoPrincipal } from '../assets/images';

export interface LogoProps {
  size?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  rounded?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 200,
  style,
  imageStyle,
  rounded = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
        rounded && styles.rounded,
        style,
      ]}
    >
      <Image
        source={logoPrincipal}
        style={[
          styles.image,
          { width: size, height: size },
          rounded && styles.roundedImage,
          imageStyle,
        ]}
        resizeMode="contain"
        accessibilityIgnoresInvertColors={true}
        accessibilityLabel="Logo NossaMaternidade"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 0,
  },
  rounded: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  roundedImage: {
    borderRadius: 20,
  },
});

export default Logo;

