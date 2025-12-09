/**
 * Avatar Component - Modern Profile Image Primitive
 * Baseado em shadcn/ui avatars
 * 
 * @version 3.0.0
 */

import React, { useState } from 'react';
import { Image, ImageProps, ViewStyle, ImageStyle } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export interface AvatarProps {
  // Source
  source?: ImageProps['source'];
  uri?: string;
  
  // Fallback
  fallbackText?: string;
  fallbackIcon?: React.ReactNode;
  
  // Size
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  
  // Style
  rounded?: boolean;
  bordered?: boolean;
  
  // Badge (online indicator, notification, etc)
  badge?: React.ReactNode;
  badgePosition?: 'top-right' | 'bottom-right';
  
  // Custom styles
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  
  // Accessibility
  accessibilityLabel?: string;
}

export const Avatar = React.memo<AvatarProps>(({
  source,
  uri,
  fallbackText,
  fallbackIcon,
  size = 'md',
  rounded = true,
  bordered = false,
  badge,
  badgePosition = 'bottom-right',
  style,
  imageStyle,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  const [imageError, setImageError] = useState(false);

  // Size mapping
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  };

  const avatarSize = typeof size === 'number' ? size : sizeMap[size];

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: rounded ? avatarSize / 2 : ModernTokens.radius.md,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...(bordered && {
      borderWidth: 2,
      borderColor: colors.border,
    }),
    ...style,
  };

  const imageStyleCombined: ImageStyle = {
    width: '100%',
    height: '100%',
    ...imageStyle,
  };

  const badgeContainerStyle: ViewStyle = {
    position: 'absolute',
    ...(badgePosition === 'top-right' && {
      top: -2,
      right: -2,
    }),
    ...(badgePosition === 'bottom-right' && {
      bottom: -2,
      right: -2,
    }),
  };

  // Render fallback (text initials or icon)
  const renderFallback = () => {
    if (fallbackIcon) {
      return fallbackIcon;
    }

    if (fallbackText) {
      const initials = fallbackText
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const fontSize = avatarSize * 0.4;

      return (
        <Text 
          style={{
            color: colors.mutedForeground,
            fontSize,
            fontWeight: ModernTokens.typography.fontWeight.medium,
          }}
        >
          {initials}
        </Text>
      );
    }

    return null;
  };

  // Show image if source exists and no error
  const imageSource = source || (uri ? { uri } : undefined);
  const showImage = imageSource && !imageError;

  return (
    <Box 
      style={containerStyle}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || fallbackText}
    >
      {showImage ? (
        <Image
          source={imageSource}
          style={imageStyleCombined}
          onError={() => setImageError(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        renderFallback()
      )}
      
      {badge && (
        <Box style={badgeContainerStyle}>
          {badge}
        </Box>
      )}
    </Box>
  );
});

Avatar.displayName = 'Avatar';

// Avatar Group (for stacked avatars)
export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  spacing?: number;
  style?: ViewStyle;
}

export const AvatarGroup = React.memo<AvatarGroupProps>(({
  children,
  max = 3,
  size = 'md',
  spacing = -8,
  style,
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = childrenArray.length - visibleChildren.length;

  return (
    <Box 
      direction="row" 
      align="center"
      style={style}
    >
      {visibleChildren.map((child, index) => (
        <Box 
          key={index}
          style={{ 
            marginLeft: index > 0 ? spacing : 0,
            zIndex: visibleChildren.length - index,
          }}
        >
          {child}
        </Box>
      ))}
      
      {remainingCount > 0 && (
        <Avatar
          size={size}
          fallbackText={`+${remainingCount}`}
          style={{ 
            marginLeft: spacing,
            zIndex: 0,
          }}
        />
      )}
    </Box>
  );
});

AvatarGroup.displayName = 'AvatarGroup';

export default Avatar;
