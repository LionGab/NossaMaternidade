/**
 * Accordion Component - Collapsible Content Sections
 * Baseado em shadcn/ui accordion
 * 
 * @version 3.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Pressable, Animated, ViewStyle, LayoutChangeEvent } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultOpen?: string | string[];
  variant?: 'default' | 'bordered' | 'separated';
  animated?: boolean;
  style?: ViewStyle;
  onValueChange?: (value: string | string[]) => void;
}

export const Accordion = React.memo<AccordionProps>(({
  items,
  type = 'single',
  defaultOpen,
  variant = 'default',
  animated = true,
  style,
  onValueChange,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (defaultOpen) {
      return new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen]);
    }
    return new Set();
  });

  const handleToggle = (itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      
      if (type === 'single') {
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.clear();
          newSet.add(itemId);
        }
      } else {
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
      }
      
      const value = type === 'single' 
        ? Array.from(newSet)[0] || '' 
        : Array.from(newSet);
      onValueChange?.(value);
      
      return newSet;
    });
  };

  return (
    <Box style={style}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openItems.has(item.id)}
          onToggle={() => handleToggle(item.id)}
          variant={variant}
          animated={animated}
          isLast={index === items.length - 1}
        />
      ))}
    </Box>
  );
});

Accordion.displayName = 'Accordion';

interface AccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  variant: NonNullable<AccordionProps['variant']>;
  animated: boolean;
  isLast: boolean;
}

const AccordionItem = React.memo<AccordionItemProps>(({
  item,
  isOpen,
  onToggle,
  variant,
  animated,
  isLast,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(animatedHeight, {
          toValue: isOpen ? contentHeight : 0,
          tension: 50,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.spring(rotateValue, {
          toValue: isOpen ? 1 : 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      animatedHeight.setValue(isOpen ? contentHeight : 0);
      rotateValue.setValue(isOpen ? 1 : 0);
    }
  }, [isOpen, contentHeight, animated, animatedHeight, rotateValue]);

  const handleContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const containerStyle: ViewStyle = {
    ...(variant === 'bordered' && {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: ModernTokens.radius.lg,
      marginBottom: isLast ? 0 : ModernTokens.spacing['2'],
    }),
    ...(variant === 'separated' && {
      marginBottom: isLast ? 0 : ModernTokens.spacing['4'],
    }),
    ...(variant === 'default' && {
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: colors.border,
    }),
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ModernTokens.spacing['4'],
    ...(variant !== 'default' && {
      paddingHorizontal: ModernTokens.spacing['4'],
    }),
  };

  return (
    <Box style={containerStyle}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          headerStyle,
          pressed && { opacity: 0.7 },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={item.title}
      >
        <Box direction="row" align="center" gap="3" flex={1}>
          {item.icon && item.icon}
          <Text variant="h4" style={{ flex: 1 }}>
            {item.title}
          </Text>
        </Box>
        
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Text size="lg">▼</Text>
        </Animated.View>
      </Pressable>

      <Animated.View
        style={{
          height: animated ? animatedHeight : isOpen ? 'auto' : 0,
          overflow: 'hidden',
        }}
      >
        <Box
          onLayout={handleContentLayout}
          py="4"
          style={{
            ...(variant !== 'default' && {
              paddingHorizontal: ModernTokens.spacing['4'],
            }),
          }}
        >
          {typeof item.content === 'string' ? (
            <Text color="muted">{item.content}</Text>
          ) : (
            item.content
          )}
        </Box>
      </Animated.View>
    </Box>
  );
});

AccordionItem.displayName = 'AccordionItem';

export default Accordion;
