/**
 * NotificationItem
 * 
 * Item de notificação com ícone, título e descrição.
 * Inspirado no design do Lofee - Health Woman UI Kit.
 * 
 * @see https://www.figma.com/design/fqH3Ro3Ll8sL2s3EJuW22H/Lofee---Woman-Health-UI-Mobile-Design-Kit
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Bell,
  Heart,
  Calendar,
  Moon,
  Droplet,
  Baby,
  Pill,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import { Text } from '@/components/primitives/Text';
import { HapticButton } from '@/components/primitives/HapticButton';

// ======================
// 🎯 TYPES
// ======================

export type NotificationType = 
  | 'ovulation' 
  | 'period' 
  | 'pregnancy' 
  | 'reminder' 
  | 'mood' 
  | 'sleep'
  | 'water'
  | 'medicine'
  | 'appointment'
  | 'general';

export interface NotificationItemProps {
  /** ID da notificação */
  id: string;
  /** Tipo da notificação */
  type: NotificationType;
  /** Título da notificação */
  title: string;
  /** Descrição/corpo da notificação */
  description: string;
  /** Data/hora da notificação */
  timestamp: Date;
  /** Se a notificação foi lida */
  isRead?: boolean;
  /** Callback ao clicar */
  onPress: () => void;
  /** Callback ao descartar */
  onDismiss?: () => void;
}

// ======================
// 🎨 TYPE CONFIGS
// ======================

const TYPE_CONFIG: Record<NotificationType, {
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  bgColor: string;
}> = {
  ovulation: {
    icon: Heart,
    color: ColorTokens.notification.ovulation.main,
    bgColor: ColorTokens.notification.ovulation.bg,
  },
  period: {
    icon: Droplet,
    color: ColorTokens.notification.period.main,
    bgColor: ColorTokens.notification.period.bg,
  },
  pregnancy: {
    icon: Baby,
    color: ColorTokens.notification.pregnancy.main,
    bgColor: ColorTokens.notification.pregnancy.bg,
  },
  reminder: {
    icon: Bell,
    color: ColorTokens.notification.reminder.main,
    bgColor: ColorTokens.notification.reminder.bg,
  },
  mood: {
    icon: Heart,
    color: ColorTokens.notification.mood.main,
    bgColor: ColorTokens.notification.mood.bg,
  },
  sleep: {
    icon: Moon,
    color: ColorTokens.notification.sleep.main,
    bgColor: ColorTokens.notification.sleep.bg,
  },
  water: {
    icon: Droplet,
    color: ColorTokens.notification.water.main,
    bgColor: ColorTokens.notification.water.bg,
  },
  medicine: {
    icon: Pill,
    color: ColorTokens.notification.medicine.main,
    bgColor: ColorTokens.notification.medicine.bg,
  },
  appointment: {
    icon: Calendar,
    color: ColorTokens.notification.appointment.main,
    bgColor: ColorTokens.notification.appointment.bg,
  },
  general: {
    icon: AlertCircle,
    color: ColorTokens.notification.general.main,
    bgColor: ColorTokens.notification.general.bg,
  },
};

// ======================
// 🧩 COMPONENT
// ======================

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id: _id,
  type,
  title,
  description,
  timestamp,
  isRead = false,
  onPress,
  onDismiss: _onDismiss,
}) => {
  const { colors, isDark } = useTheme();
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  const timeAgo = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    return timestamp.toLocaleDateString('pt-BR');
  }, [timestamp]);

  return (
    <HapticButton
      variant="ghost"
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isDark 
            ? isRead ? colors.background.card : colors.background.elevated
            : isRead ? colors.background.canvas : colors.background.card,
          borderColor: colors.border.light,
          opacity: isRead ? 0.7 : 1,
        },
      ]}
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint="Toque para ver detalhes"
      accessibilityRole="button"
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
        <Icon size={20} color={config.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text 
          size="sm" 
          weight={isRead ? 'regular' : 'semibold'} 
          color="primary"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text 
          size="xs" 
          color="secondary" 
          numberOfLines={2}
          style={{ marginTop: Tokens.spacing['1'] }}
        >
          {description}
        </Text>
        <Text 
          size="xs" 
          color="tertiary"
          style={{ marginTop: Tokens.spacing['1'] }}
        >
          {timeAgo}
        </Text>
      </View>

      {/* Arrow */}
      <ChevronRight size={18} color={colors.text.tertiary} />

      {/* Unread Indicator */}
      {!isRead && (
        <View style={[styles.unreadDot, { backgroundColor: config.color }]} />
      )}
    </HapticButton>
  );
};

// ======================
// 💄 STYLES
// ======================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Tokens.spacing['3'],
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    marginBottom: Tokens.spacing['2'],
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Tokens.spacing['3'],
  },
  content: {
    flex: 1,
    marginRight: Tokens.spacing['2'],
  },
  unreadDot: {
    position: 'absolute',
    top: Tokens.spacing['3'],
    right: Tokens.spacing['3'],
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default NotificationItem;

