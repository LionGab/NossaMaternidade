/**
 * AI Disclaimer Modal
 * Modal legal que exibe disclaimer sobre uso de IA antes do primeiro uso do chat
 * @version 1.0.0
 */

import * as Haptics from 'expo-haptics';
import { Heart, Stethoscope, Brain, Phone, Sparkles, Info } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { Modal } from '@/components/Modal';
import { Box } from '@/components/atoms/Box';
import { HapticButton } from '@/components/atoms/HapticButton';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import { Radius, Spacing } from '@/theme/tokens';
import { logger } from '@/utils/logger';

export interface AIDisclaimerModalProps {
  visible: boolean;
  onAccept: () => void;
  onDismiss?: () => void;
}

export const AIDisclaimerModal: React.FC<AIDisclaimerModalProps> = ({
  visible,
  onAccept,
  onDismiss,
}) => {
  const { colors, isDark } = useTheme();

  const handleAccept = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logger.info('[AIDisclaimerModal] User accepted AI disclaimer');
    onAccept();
  };

  const handleDismiss = () => {
    if (onDismiss) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={handleDismiss}
      title=""
      fullScreen={true}
      showCloseButton={true}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: Spacing['6'],
            paddingBottom: Spacing['6'] + 84, // espaço pro footer fixo
          }}
          showsVerticalScrollIndicator={false}
        >
        {/* Header elegante */}
        <Box align="center" mb="6">
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: `${colors.primary.main}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: Spacing['4'],
              borderWidth: 2,
              borderColor: `${colors.primary.main}25`,
            }}
          >
            <Sparkles size={36} color={colors.primary.main} strokeWidth={2.5} />
          </View>
          
          <Heading
            level="h3"
            weight="bold"
            align="center"
            style={{
              marginBottom: Spacing['2'],
              fontSize: 24,
              letterSpacing: -0.3,
            }}
          >
            NathIA
          </Heading>
          
          <Text
            size="sm"
            color="secondary"
            align="center"
            style={{
              fontSize: 14,
              letterSpacing: 0.2,
            }}
          >
            Assistente Virtual de IA
          </Text>
        </Box>

        {/* Descrição */}
        <Box
          mb="6"
          p="4"
          rounded="xl"
          style={{
            backgroundColor: isDark ? `${colors.primary.main}10` : `${colors.primary.main}08`,
            borderWidth: 1,
            borderColor: `${colors.primary.main}20`,
          }}
        >
          <Text
            size="md"
            color="primary"
            align="center"
            style={{
              lineHeight: 22,
              letterSpacing: 0.1,
            }}
          >
            NathIA é uma assistente virtual de inteligência artificial desenvolvida para oferecer
            apoio emocional e informações gerais sobre maternidade.
          </Text>
        </Box>

        {/* Avisos importantes - Design elegante */}
        <Box mb="6">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Spacing['4'],
              paddingBottom: Spacing['3'],
              borderBottomWidth: 1,
              borderBottomColor: colors.border.light,
            }}
          >
            <Info size={18} color={colors.text.secondary} strokeWidth={2.5} />
            <Text
              size="md"
              weight="semibold"
              color="primary"
              style={{
                marginLeft: Spacing['2'],
                fontSize: 16,
                letterSpacing: -0.1,
              }}
            >
              Importante saber
            </Text>
          </View>

          <Box mb="3">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: Spacing['3'],
                borderRadius: Radius.xl,
                backgroundColor: isDark ? `${colors.status.info}10` : `${colors.status.info}08`,
                borderWidth: 1,
                borderColor: `${colors.status.info}20`,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${colors.status.info}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: Spacing['3'],
                }}
              >
                <Stethoscope size={20} color={colors.status.info} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  size="sm"
                  weight="semibold"
                  color="primary"
                  style={{
                    marginBottom: Spacing['1'],
                    fontSize: 14,
                    letterSpacing: -0.1,
                  }}
                >
                  Consultas médicas profissionais
                </Text>
                <Text
                  size="xs"
                  color="secondary"
                  style={{
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  Para questões de saúde, sempre consulte um médico.
                </Text>
              </View>
            </View>
          </Box>

          <Box mb="3">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: Spacing['3'],
                borderRadius: Radius.xl,
                backgroundColor: isDark ? `${colors.status.info}10` : `${colors.status.info}08`,
                borderWidth: 1,
                borderColor: `${colors.status.info}20`,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${colors.status.info}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: Spacing['3'],
                }}
              >
                <Brain size={20} color={colors.status.info} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  size="sm"
                  weight="semibold"
                  color="primary"
                  style={{
                    marginBottom: Spacing['1'],
                    fontSize: 14,
                    letterSpacing: -0.1,
                  }}
                >
                  Diagnósticos clínicos
                </Text>
                <Text
                  size="xs"
                  color="secondary"
                  style={{
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  NathIA não pode diagnosticar condições médicas.
                </Text>
              </View>
            </View>
          </Box>

          <Box mb="3">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: Spacing['3'],
                borderRadius: Radius.xl,
                backgroundColor: isDark ? `${colors.primary.main}10` : `${colors.primary.main}08`,
                borderWidth: 1,
                borderColor: `${colors.primary.main}20`,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${colors.primary.main}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: Spacing['3'],
                }}
              >
                <Heart size={20} color={colors.primary.main} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  size="sm"
                  weight="semibold"
                  color="primary"
                  style={{
                    marginBottom: Spacing['1'],
                    fontSize: 14,
                    letterSpacing: -0.1,
                  }}
                >
                  Tratamentos psicológicos
                </Text>
                <Text
                  size="xs"
                  color="secondary"
                  style={{
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  Para apoio psicológico profissional, procure um psicólogo.
                </Text>
              </View>
            </View>
          </Box>

          <Box mb="3">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: Spacing['3'],
                borderRadius: Radius.xl,
                backgroundColor: isDark ? `${colors.status.warning}10` : `${colors.status.warning}08`,
                borderWidth: 1,
                borderColor: `${colors.status.warning}20`,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${colors.status.warning}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: Spacing['3'],
                }}
              >
                <Phone size={20} color={colors.status.warning} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  size="sm"
                  weight="semibold"
                  color="primary"
                  style={{
                    marginBottom: Spacing['1'],
                    fontSize: 14,
                    letterSpacing: -0.1,
                  }}
                >
                  Atendimento de emergência
                </Text>
                <Text
                  size="xs"
                  color="secondary"
                  style={{
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  Em emergências, ligue imediatamente para 192 (SAMU) ou 190 (Polícia).
                </Text>
              </View>
            </View>
          </Box>
        </Box>

        {/* Aviso de emergência - Design suave */}
        <View
          style={{
            padding: Spacing['4'],
            borderRadius: Radius['2xl'],
            marginBottom: Spacing['6'],
            backgroundColor: isDark ? `${colors.status.error}15` : `${colors.status.error}10`,
            borderWidth: 1.5,
            borderColor: `${colors.status.error}30`,
            borderLeftWidth: 4,
            borderLeftColor: colors.status.error,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: Spacing['2'],
            }}
          >
            <Phone size={18} color={colors.status.error} strokeWidth={2.5} style={{ marginTop: 2 }} />
            <Text
              size="sm"
              weight="semibold"
              color="primary"
              style={{
                marginLeft: Spacing['2'],
                fontSize: 14,
                letterSpacing: -0.1,
                flex: 1,
              }}
            >
              Em caso de emergência médica ou crise emocional:
            </Text>
          </View>
          <Text
            size="sm"
            color="primary"
            style={{
              fontSize: 13,
              lineHeight: 20,
              paddingLeft: Spacing['6'],
            }}
          >
            Procure imediatamente um profissional de saúde ou ligue para o{' '}
            <Text
              size="sm"
              weight="bold"
              style={{
                color: colors.status.error,
                fontSize: 14,
              }}
            >
              CVV: 188
            </Text>{' '}
            (24h, gratuito, confidencial).
          </Text>
        </View>

        {/* Link para mais informações */}
        <View style={{ marginTop: Spacing['4'], alignItems: 'center' }}>
          <Text
            size="xs"
            color="tertiary"
            align="center"
            style={{
              fontSize: 12,
              lineHeight: 16,
            }}
          >
            Ao continuar, você confirma que leu e compreendeu este aviso.
          </Text>
        </View>
        </ScrollView>

        {/* Footer fixo com CTA sempre visível */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: Spacing['6'],
            paddingTop: Spacing['3'],
            paddingBottom: Spacing['4'],
            backgroundColor: colors.background.card,
            borderTopWidth: 1,
            borderTopColor: colors.border.light,
          }}
        >
          <HapticButton
            onPress={handleAccept}
            variant="primary"
            style={{
              minHeight: 52,
              borderRadius: Radius.full,
              shadowColor: colors.primary.main,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            accessibilityLabel="Entendi e aceito continuar"
            accessibilityHint="Aceita os termos e fecha o aviso"
          >
            <Text
              size="md"
              weight="semibold"
              align="center"
              style={{
                color: colors.text.inverse,
                fontSize: 15,
                letterSpacing: 0.2,
              }}
            >
              Entendi e aceito continuar
            </Text>
          </HapticButton>
        </View>
      </View>
    </Modal>
  );
};
