/**
 * NathIAChatInput - Componente de Input de Chat para NathIA
 *
 * Design inspirado na imagem: input arredondado escuro + botão circular rosa
 *
 * Features:
 * - Input arredondado com fundo escuro
 * - Botão circular rosa com ícone de send
 * - Suporte a multiline
 * - Animação no botão quando há texto
 * - Haptic feedback
 * - Acessibilidade WCAG AAA
 */

import * as Haptics from 'expo-haptics';
import { Send, Mic } from 'lucide-react-native';
import React, { useMemo, useCallback, memo } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';
import { Tokens, ColorTokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

// Constantes
const MIN_LINE_HEIGHT = 24;
const DEFAULT_MAX_LINES = 4;
const DEFAULT_PLACEHOLDER = 'Responder a NathIA...';

export interface NathIAChatInputProps extends Omit<TextInputProps, 'style'> {
  /** Valor do input */
  value: string;
  /** Callback ao mudar texto */
  onChangeText: (text: string) => void;
  /** Callback ao enviar */
  onSend: (text: string) => void;
  /** Placeholder customizado */
  placeholder?: string;
  /** Se está enviando */
  sending?: boolean;
  /** Estilo customizado do container */
  containerStyle?: ViewStyle;
  /** Estilo customizado do input */
  inputStyle?: TextStyle;
  /** Se deve usar multiline */
  multiline?: boolean;
  /** Máximo de linhas */
  maxLines?: number;
  /** Habilita fallback para modo de voz quando não há texto */
  voiceEnabled?: boolean;
  /** Callback para abrir modo de voz */
  onVoiceRequest?: () => void;
}

export const NathIAChatInput: React.FC<NathIAChatInputProps> = memo(
  ({
    value,
    onChangeText,
    onSend,
    placeholder = DEFAULT_PLACEHOLDER,
    sending = false,
    containerStyle,
    inputStyle,
    multiline = true,
    maxLines = DEFAULT_MAX_LINES,
    voiceEnabled = false,
    onVoiceRequest,
    ...textInputProps
  }) => {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    // Verificar se há texto para habilitar botão
    const hasText = useMemo(() => value.trim().length > 0, [value]);

    // Handler de envio com validação
    const handleSend = useCallback(() => {
      const trimmedValue = value.trim();

      if (!trimmedValue || sending) {
        return;
      }

      try {
        logger.info('NathIA chat input: send pressed', {
          messageLength: trimmedValue.length,
          screen: 'NathIAChatInput',
        });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSend(trimmedValue);
      } catch (error) {
        logger.error('NathIA chat input: error sending message', error);
      }
    }, [value, sending, onSend]);

    // Container style com SafeArea - Estilo ChatGPT
    const containerStyles: ViewStyle = useMemo(() => {
      return {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: Tokens.spacing['3'],
        paddingHorizontal: Tokens.spacing['4'],
        paddingTop: Tokens.spacing['4'],
        paddingBottom: Math.max(insets.bottom + Tokens.spacing['2'], Tokens.spacing['4']),
        backgroundColor: isDark ? ColorTokens.neutral[900] : ColorTokens.neutral[0],
        borderTopWidth: 1,
        borderTopColor: isDark ? ColorTokens.neutral[800] : ColorTokens.neutral[200],
        ...containerStyle,
      };
    }, [colors, containerStyle, insets.bottom, isDark]);

    // Input style - Estilo ChatGPT
    const inputStyles = useMemo((): TextStyle => {
      const calculatedMaxHeight = multiline
        ? Math.max(maxLines * MIN_LINE_HEIGHT, 44)
        : 44;

      return {
        flex: 1,
        minHeight: 44,
        maxHeight: calculatedMaxHeight,
        backgroundColor: isDark ? ColorTokens.neutral[800] : ColorTokens.neutral[50],
        borderRadius: 24,
        paddingHorizontal: Tokens.spacing['4'],
        paddingVertical: Tokens.spacing['3'],
        color: colors.text.primary,
        fontSize: 15,
        fontFamily: Tokens.typography.fonts.body,
        borderWidth: 1,
        borderColor: isDark ? ColorTokens.neutral[700] : ColorTokens.neutral[200],
        ...(multiline && {
          textAlignVertical: 'top' as const,
        }),
        ...inputStyle,
      };
    }, [isDark, colors, multiline, maxLines, inputStyle]);

    // Botão send style - Estilo ChatGPT
    const showVoiceButton = voiceEnabled && !hasText;

    const sendButtonStyle: ViewStyle = useMemo(() => {
      const buttonSize = 36;
      const disabledColor = isDark ? ColorTokens.neutral[700] : ColorTokens.neutral[300];

      const backgroundColor = hasText || showVoiceButton ? colors.primary.main : disabledColor;

      return {
        width: buttonSize,
        height: buttonSize,
        borderRadius: 18,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
      };
    }, [hasText, colors, isDark, showVoiceButton]);

    // Cor do ícone send
    const actionIconColor = useMemo(() => {
      if (hasText || showVoiceButton) {
        return ColorTokens.neutral[0];
      }
      return isDark ? ColorTokens.neutral[400] : ColorTokens.neutral[500];
    }, [hasText, isDark, showVoiceButton]);

    const handlePrimaryAction = useCallback(() => {
      logger.info('[NathIAChatInput] handlePrimaryAction chamado', {
        sending,
        hasText,
        showVoiceButton,
        hasOnSend: !!onSend,
      });

      if (sending) {
        logger.debug('[NathIAChatInput] Ação bloqueada: sending=true');
        return;
      }

      if (hasText) {
        logger.info('[NathIAChatInput] Chamando handleSend');
        handleSend();
        return;
      }

      if (showVoiceButton && onVoiceRequest) {
        logger.info('[NathIAChatInput] Abrindo modo de voz');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onVoiceRequest();
      } else {
        logger.warn('[NathIAChatInput] Nenhuma ação disponível', {
          hasText,
          showVoiceButton,
          hasOnVoiceRequest: !!onVoiceRequest,
        });
      }
    }, [handleSend, hasText, onVoiceRequest, sending, showVoiceButton, onSend]);

    const accessibilityLabel = hasText
      ? 'Enviar mensagem'
      : showVoiceButton
        ? 'Gravar áudio'
        : 'Botão de enviar desabilitado';

    const accessibilityHint = hasText
      ? 'Envia sua mensagem para a NathIA'
      : showVoiceButton
        ? 'Abre modo de gravação de voz'
        : 'Digite uma mensagem para habilitar o envio';

    return (
      <View style={containerStyles}>
        {/* Input Field */}
        <TextInput
          {...textInputProps}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          multiline={multiline}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          editable={!sending}
          style={inputStyles}
          accessibilityLabel="Campo de mensagem"
          accessibilityHint="Digite sua mensagem para a NathIA"
        />

        {/* Send Button */}
        <TouchableOpacity
          onPress={() => {
            logger.info('[NathIAChatInput] TouchableOpacity onPress disparado', {
              disabled: sending || (!hasText && !showVoiceButton),
              hasText,
              sending,
            });
            handlePrimaryAction();
          }}
          disabled={sending || (!hasText && !showVoiceButton)}
          style={sendButtonStyle}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled: sending || (!hasText && !showVoiceButton) }}
          testID="nathia-chat-send-button"
        >
          {showVoiceButton ? (
            <Mic size={20} color={actionIconColor} />
          ) : (
            <Send size={20} color={actionIconColor} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
);

NathIAChatInput.displayName = 'NathIAChatInput';

export default NathIAChatInput;
