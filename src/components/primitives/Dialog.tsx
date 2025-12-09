/**
 * Dialog Component - Modal Dialog
 * Baseado em shadcn/ui dialog
 * 
 * @version 3.0.0
 */

import React, { useRef, useEffect } from 'react';
import { Modal, Pressable, Animated, ViewStyle, Platform } from 'react-native';

import { ModernTokens } from '@/theme/modernTokens';
import { useTheme } from '@/theme/ThemeContext';

import { Box } from './Box';
import { Text } from './Text';
import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  dismissible?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'full';
  style?: ViewStyle;
}

export const Dialog = React.memo<DialogProps>(({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  dismissible = true,
  size = 'md',
  style,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? ModernTokens.colors.dark : ModernTokens.colors.light;
  
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 0.9,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, scaleValue, opacityValue]);

  const sizeConfig = {
    sm: { maxWidth: 400 },
    md: { maxWidth: 500 },
    lg: { maxWidth: 700 },
    full: { maxWidth: '90%' },
  };

  const dialogStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: ModernTokens.radius.lg,
    ...sizeConfig[size],
    width: '90%',
    maxHeight: '80%',
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
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={dismissible ? onClose : undefined}
      >
        {/* Dialog */}
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              dialogStyle,
              {
                transform: [{ scale: scaleValue }],
                opacity: opacityValue,
              },
            ]}
          >
            {/* Close button */}
            {dismissible && (
              <Box
                position="absolute"
                top={ModernTokens.spacing['4']}
                right={ModernTokens.spacing['4']}
                zIndex={1}
              >
                <Pressable
                  onPress={onClose}
                  hitSlop={8}
                  style={({ pressed }) => [
                    {
                      padding: ModernTokens.spacing['1'],
                      borderRadius: ModernTokens.radius.sm,
                    },
                    pressed && { opacity: 0.5 },
                  ]}
                >
                  <Text size="lg">✕</Text>
                </Pressable>
              </Box>
            )}

            {/* Header */}
            {(title || description) && (
              <Box p="6" pb="4">
                {title && (
                  <Text variant="h3" style={{ marginBottom: ModernTokens.spacing['2'] }}>
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
            {children && (
              <Box px="6" style={{ maxHeight: 400 }}>
                {children}
              </Box>
            )}

            {/* Footer */}
            {footer && (
              <Box
                p="6"
                pt="4"
                direction="row"
                justify="flex-end"
                gap="2"
                borderTopWidth={1}
                style={{ borderTopColor: colors.border }}
              >
                {footer}
              </Box>
            )}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';

// Alert Dialog preset
export interface AlertDialogProps extends Omit<DialogProps, 'children' | 'footer'> {
  variant?: 'default' | 'destructive';
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
}

export const AlertDialog = React.memo<AlertDialogProps>(({
  variant = 'default',
  cancelLabel = 'Cancelar',
  confirmLabel = 'Confirmar',
  onConfirm,
  onClose,
  ...props
}) => (
  <Dialog
    {...props}
    onClose={onClose}
    footer={
      <>
        <Button variant="outline" onPress={onClose}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onPress={() => {
            onConfirm?.();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </>
    }
  />
));

AlertDialog.displayName = 'AlertDialog';

export default Dialog;
