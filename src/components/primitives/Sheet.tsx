/**
 * Sheet Component - Bottom Sheet / Drawer
 * Baseado em shadcn/ui sheet e react-native-bottom-sheet
 * 
 * @version 3.0.0
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  Animated,
  PanResponder,
  Dimensions,
  ViewStyle,
  Platform,
} from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  snapPoints?: number[]; // Array of snap points as percentages (e.g., [50, 90])
  children: React.ReactNode;
  dismissible?: boolean;
  style?: ViewStyle;
}

export const Sheet = React.memo<SheetProps>(({
  isOpen,
  onClose,
  title,
  description,
  snapPoints = [50, 90],
  children,
  dismissible = true,
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  
  const [snapIndex, setSnapIndex] = useState(0);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const currentSnapPoint = (snapPoints[snapIndex] / 100) * SCREEN_HEIGHT;

  useEffect(() => {
    if (isOpen) {
      // Open animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT - currentSnapPoint,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, snapIndex, currentSnapPoint, translateY, backdropOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = SCREEN_HEIGHT - currentSnapPoint + gestureState.dy;
        if (newY >= SCREEN_HEIGHT - currentSnapPoint) {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 && dismissible) {
          // Swipe down to close
          onClose();
        } else if (gestureState.dy < -100 && snapIndex < snapPoints.length - 1) {
          // Swipe up to next snap point
          setSnapIndex(prev => Math.min(prev + 1, snapPoints.length - 1));
        } else {
          // Snap back to current position
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT - currentSnapPoint,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const sheetStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: ModernTokens.radius['3xl'],
    borderTopRightRadius: ModernTokens.radius['3xl'],
    minHeight: currentSnapPoint,
    maxHeight: SCREEN_HEIGHT * 0.95,
    ...ModernTokens.shadows['2xl'],
    ...style,
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissible ? onClose : undefined}
    >
      {/* Backdrop */}
      <Pressable
        style={{ flex: 1 }}
        onPress={dismissible ? onClose : undefined}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: '#000',
            opacity: backdropOpacity,
          }}
        />
      </Pressable>

      {/* Sheet */}
      <Animated.View
        style={[
          sheetStyle,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle */}
        <Box align="center" py="3">
          <Box
            width={40}
            height={4}
            rounded="full"
            style={{ backgroundColor: colors.muted }}
          />
        </Box>

        {/* Header */}
        {(title || description) && (
          <Box px="6" pb="4">
            {title && (
              <Text variant="h3" style={{ marginBottom: ModernTokens.spacing['1'] }}>
                {title}
              </Text>
            )}
            {description && (
              <Text size="sm" color="muted">
                {description}
              </Text>
            )}
          </Box>
        )}

        {/* Content */}
        <Box flex={1} px="6" pb="6">
          {children}
        </Box>
      </Animated.View>
    </Modal>
  );
});

Sheet.displayName = 'Sheet';

export default Sheet;
