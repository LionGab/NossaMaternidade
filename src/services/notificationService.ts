/**
 * Push Notification Service - Nossa Maternidade
 * Gerencia registro de tokens e handlers de notificações
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { logger } from '@/utils/logger';

// Configuração de como notificações são exibidas quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
}

/**
 * Registra o dispositivo para receber push notifications
 * @returns Token de push ou null se não for possível registrar
 */
export async function registerForPushNotifications(): Promise<PushToken | null> {
  // Verifica se é um dispositivo físico (push não funciona em simuladores)
  if (!Device.isDevice) {
    logger.warn('Push notifications requerem dispositivo físico');
    return null;
  }

  try {
    // Verifica permissões existentes
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Solicita permissão se ainda não foi concedida
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.warn('Permissão para push notifications não concedida');
      return null;
    }

    // Obtém o token do Expo Push
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      logger.error('EAS Project ID não configurado');
      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const token = tokenResponse.data;
    const platform = Platform.OS as 'ios' | 'android';

    logger.info('Push token registrado', { platform });

    // Configurações específicas do Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Nossa Maternidade',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF7A96',
      });
    }

    return { token, platform };
  } catch (error) {
    logger.error('Erro ao registrar push notifications', { error });
    return null;
  }
}

/**
 * Configura listeners para notificações recebidas e interações
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
): () => void {
  // Listener para notificações recebidas enquanto o app está aberto
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      logger.info('Notificação recebida', {
        title: notification.request.content.title,
      });
      onNotificationReceived?.(notification);
    }
  );

  // Listener para quando o usuário interage com a notificação
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      logger.info('Usuário interagiu com notificação', {
        actionIdentifier: response.actionIdentifier,
      });
      onNotificationResponse?.(response);
    }
  );

  // Retorna função de cleanup
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}

/**
 * Agenda uma notificação local
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  triggerSeconds: number = 1,
  data?: Record<string, unknown>
): Promise<string> {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: triggerSeconds,
    },
  });

  return identifier;
}

/**
 * Cancela todas as notificações agendadas
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Obtém o badge count atual (iOS)
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Define o badge count (iOS)
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}
