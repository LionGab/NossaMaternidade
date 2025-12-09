/**
 * Tabs Component - Modern Tabbed Navigation
 * Baseado em shadcn/ui tabs
 * 
 * @version 3.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Pressable, Animated, ViewStyle, TextStyle, ScrollView, LayoutChangeEvent } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const Tabs = React.memo<TabsProps>(({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  scrollable = false,
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const activeLayout = tabLayouts[activeTab];
    if (activeLayout && variant === 'underline') {
      Animated.spring(indicatorPosition, {
        toValue: activeLayout.x,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      Animated.spring(indicatorWidth, {
        toValue: activeLayout.width,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }).start();
    }
  }, [activeTab, tabLayouts, variant, indicatorPosition, indicatorWidth]);

  const sizeConfig = {
    sm: { height: 36, fontSize: ModernTokens.typography.fontSize.sm, px: ModernTokens.spacing['3'] },
    md: { height: 44, fontSize: ModernTokens.typography.fontSize.base, px: ModernTokens.spacing['4'] },
    lg: { height: 52, fontSize: ModernTokens.typography.fontSize.lg, px: ModernTokens.spacing['6'] },
  };

  const { height, fontSize, px } = sizeConfig[size];

  const getTabStyle = (tabId: string): ViewStyle => {
    const isActive = activeTab === tabId;
    
    const baseStyle: ViewStyle = {
      height,
      paddingHorizontal: px,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      ...(fullWidth && { flex: 1 }),
    };

    switch (variant) {
      case 'pills':
        return {
          ...baseStyle,
          borderRadius: ModernTokens.radius.full,
          backgroundColor: isActive ? colors.primary : 'transparent',
        };
      
      case 'underline':
        return {
          ...baseStyle,
          borderBottomWidth: 0,
        };
      
      default: // 'default'
        return {
          ...baseStyle,
          backgroundColor: isActive ? colors.background : colors.muted,
          borderRadius: ModernTokens.radius.md,
        };
    }
  };

  const getTextStyle = (tabId: string): TextStyle => {
    const isActive = activeTab === tabId;
    
    return {
      fontSize,
      fontWeight: isActive 
        ? ModernTokens.typography.fontWeight.semibold 
        : ModernTokens.typography.fontWeight.medium,
      color: variant === 'pills' && isActive 
        ? colors.primaryForeground 
        : isActive 
          ? colors.primary 
          : colors.mutedForeground,
    };
  };

  const handleTabLayout = (tabId: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({ ...prev, [tabId]: { x, width } }));
  };

  const renderTabs = () => (
    <>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            onLayout={(e) => handleTabLayout(tab.id, e)}
            style={({ pressed }) => [
              getTabStyle(tab.id),
              pressed && { opacity: 0.7 },
            ]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            {tab.icon && (
              <Box mr="2">
                {tab.icon}
              </Box>
            )}
            
            <Text style={getTextStyle(tab.id)}>
              {tab.label}
            </Text>
            
            {tab.badge && (
              <Box
                ml="2"
                px="2"
                py="0.5"
                rounded="full"
                bg={isActive ? 'secondary' : 'muted'}
              >
                <Text 
                  style={{ 
                    fontSize: ModernTokens.typography.fontSize.xs,
                    color: colors.mutedForeground,
                    fontWeight: ModernTokens.typography.fontWeight.semibold,
                  }}
                >
                  {tab.badge}
                </Text>
              </Box>
            )}
          </Pressable>
        );
      })}
    </>
  );

  const containerStyle: ViewStyle = {
    backgroundColor: variant === 'default' ? colors.muted : 'transparent',
    borderRadius: variant === 'default' ? ModernTokens.radius.lg : 0,
    padding: variant === 'default' ? ModernTokens.spacing['1'] : 0,
    flexDirection: 'row',
    position: 'relative',
    ...(variant === 'underline' && {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }),
    ...style,
  };

  const content = scrollable ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: fullWidth ? 1 : 0 }}
    >
      {renderTabs()}
    </ScrollView>
  ) : (
    renderTabs()
  );

  return (
    <Box style={containerStyle}>
      {content}
      
      {variant === 'underline' && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            height: 2,
            backgroundColor: colors.primary,
            borderRadius: 1,
            transform: [{ translateX: indicatorPosition }],
            width: indicatorWidth,
          }}
        />
      )}
    </Box>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
