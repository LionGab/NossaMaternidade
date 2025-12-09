/**
 * Toast Component - Modern Notification System
 * Baseado em shadcn/ui toast
 * 
 * @version 3.0.0
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Animated, Pressable, ViewStyle, Platform } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      duration: 5000,
      variant: 'default',
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const containerStyle: ViewStyle = {
    position: 'absolute',
    top: Platform.select({ ios: 60, android: 40, default: 20 }),
    right: ModernTokens.spacing['4'],
    left: ModernTokens.spacing['4'],
    zIndex: ModernTokens.zIndex.toast,
    gap: ModernTokens.spacing['2'],
  };

  return (
    <Box style={containerStyle} pointerEvents="box-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </Box>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      // Exit animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: -100,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    };
  }, [translateY, opacity]);

  const variantStyles: Record<NonNullable<Toast['variant']>, ViewStyle> = {
    default: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    success: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    warning: {
      backgroundColor: colors.warning,
      borderColor: colors.warning,
    },
    error: {
      backgroundColor: colors.destructive,
      borderColor: colors.destructive,
    },
  };

  const textColor = toast.variant && toast.variant !== 'default' 
    ? colors.primaryForeground 
    : colors.foreground;

  const containerStyle: ViewStyle = {
    ...variantStyles[toast.variant || 'default'],
    borderRadius: ModernTokens.radius.lg,
    borderWidth: 1,
    padding: ModernTokens.spacing['4'],
    ...ModernTokens.shadows.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <Box style={containerStyle}>
        <Box flex={1}>
          {toast.title && (
            <Text 
              weight="semibold"
              style={{ color: textColor, marginBottom: ModernTokens.spacing['1'] }}
            >
              {toast.title}
            </Text>
          )}
          {toast.description && (
            <Text 
              size="sm"
              style={{ color: textColor, opacity: 0.9 }}
            >
              {toast.description}
            </Text>
          )}
        </Box>

        <Box direction="row" align="center" gap="2" ml="4">
          {toast.action && (
            <Pressable
              onPress={() => {
                toast.action?.onPress();
                onRemove(toast.id);
              }}
              style={({ pressed }) => [
                {
                  paddingHorizontal: ModernTokens.spacing['3'],
                  paddingVertical: ModernTokens.spacing['1.5'],
                  borderRadius: ModernTokens.radius.md,
                  backgroundColor: toast.variant && toast.variant !== 'default'
                    ? colors.background
                    : colors.primary,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text 
                size="sm" 
                weight="semibold"
                style={{ 
                  color: toast.variant && toast.variant !== 'default'
                    ? colors.foreground
                    : colors.primaryForeground,
                }}
              >
                {toast.action.label}
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => onRemove(toast.id)}
            hitSlop={8}
            style={({ pressed }) => [
              { padding: ModernTokens.spacing['1'] },
              pressed && { opacity: 0.5 },
            ]}
          >
            <Text style={{ color: textColor }}>✕</Text>
          </Pressable>
        </Box>
      </Box>
    </Animated.View>
  );
};

export default ToastProvider;
