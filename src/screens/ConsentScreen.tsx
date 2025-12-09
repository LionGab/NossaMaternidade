/**
 * ConsentScreen - Tela de Consentimento LGPD
 * Permite usuária conceder/revogar consentimentos granulares
 *
 * Uso:
 * - Onboarding: step obrigatório para consentimentos essenciais
 * - Settings: tela para revisar/revogar consentimentos
 */

import { Shield, CheckCircle2, XCircle, Info, ChevronRight } from 'lucide-react-native';
import React, { useState, useCallback } from 'react';
import { ScrollView, Alert, Platform, View, StyleSheet } from 'react-native';

import { Box } from '@/components/atoms/Box';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { useConsent, useAllConsentTerms } from '@/hooks/useConsent';
import { useThemeColors } from '@/hooks/useTheme';
import { consentService } from '@/services/supabase';
import { Tokens } from '@/theme/tokens';
import type { ConsentType, ConsentTermsVersion } from '@/types/consent';
import { logger } from '@/utils/logger';

interface ConsentScreenProps {
  /**
   * Modo da tela:
   * - 'onboarding': obrigatório, apenas consentimentos essenciais
   * - 'settings': opcional, todos os consentimentos podem ser revogados
   */
  mode?: 'onboarding' | 'settings';
  /**
   * Callback quando todos os consentimentos obrigatórios foram concedidos
   */
  onComplete?: () => void;
}

/**
 * Mapeamento de tipos de consentimento para informações amigáveis
 */
const CONSENT_INFO: Record<
  ConsentType,
  { emoji: string; title: string; description: string; required: boolean }
> = {
  essential: {
    emoji: '🔐',
    title: 'Funcionamento Essencial',
    description:
      'Permissões mínimas para o app funcionar: armazenamento local e sincronização com nuvem.',
    required: true,
  },
  ai_processing: {
    emoji: '🤖',
    title: 'Processamento por IA (NathIA)',
    description:
      'Suas mensagens serão processadas pela NathIA para fornecer respostas personalizadas. Dados são anonimizados.',
    required: false,
  },
  analytics: {
    emoji: '📊',
    title: 'Analytics e Melhorias',
    description:
      'Coletamos dados de uso anonimizados para melhorar o app. Nenhum dado pessoal é compartilhado.',
    required: false,
  },
  marketing: {
    emoji: '📧',
    title: 'Comunicações',
    description:
      'Receba dicas, novidades e conteúdo personalizado por email ou push. Pode desativar a qualquer momento.',
    required: false,
  },
  data_sharing: {
    emoji: '🤝',
    title: 'Compartilhamento com Terceiros',
    description:
      'Compartilhamos dados anonimizados com parceiros confiáveis para melhorar serviços.',
    required: false,
  },
  health_data: {
    emoji: '🏥',
    title: 'Dados de Saúde',
    description:
      'Dados sensíveis de saúde (peso, pressão, sintomas) são protegidos com criptografia adicional.',
    required: false,
  },
};

export default function ConsentScreen({ mode = 'onboarding', onComplete }: ConsentScreenProps) {
  const colors = useThemeColors();
  const { consents, isLoading } = useConsent();
  const { data: terms, isLoading: isLoadingTerms } = useAllConsentTerms();

  const [expandedConsent, setExpandedConsent] = useState<ConsentType | null>(null);

  /**
   * Obter IP address (aproximado, para contexto de auditoria)
   */
  const getDeviceInfo = useCallback(() => {
    return {
      ip_address: undefined, // Não disponível no React Native sem biblioteca adicional
      user_agent: Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web',
      device_id: Platform.OS,
    };
  }, []);

  /**
   * Conceder consentimento
   */
  const handleGrantConsent = useCallback(
    async (consentType: ConsentType) => {
      try {
        const term = terms?.find((t) => t.consent_type === consentType && t.is_current);
        if (!term) {
          Alert.alert('Erro', 'Versão dos termos não encontrada. Tente novamente.');
          return;
        }

        const deviceInfo = getDeviceInfo();
        const result = await consentService.grantConsent({
          consent_type: consentType,
          terms_version_id: term.id,
          collection_method: mode === 'onboarding' ? 'onboarding' : 'settings',
          ...deviceInfo,
        });

        if (result.success) {
          logger.info('Consentimento concedido', {
            screen: 'ConsentScreen',
            consentType,
            mode,
          });

          // Verificar se todos os obrigatórios foram concedidos (modo onboarding)
          if (mode === 'onboarding') {
            const hasEssential = await consentService.hasConsent('essential');
            const hasAI = await consentService.hasConsent('ai_processing');

            if (hasEssential && hasAI && onComplete) {
              onComplete();
            }
          }
        } else {
          Alert.alert('Erro', result.error || 'Não foi possível conceder consentimento.');
        }
      } catch (error) {
        logger.error('Erro ao conceder consentimento', error, {
          screen: 'ConsentScreen',
          consentType,
        });
        Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
      }
    },
    [terms, mode, onComplete, getDeviceInfo]
  );

  /**
   * Revogar consentimento
   */
  const handleRevokeConsent = useCallback(
    async (consentType: ConsentType) => {
      Alert.alert(
        'Revogar Consentimento',
        `Tem certeza que deseja revogar o consentimento para "${CONSENT_INFO[consentType].title}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Revogar',
            style: 'destructive',
            onPress: async () => {
              try {
                const deviceInfo = getDeviceInfo();
                const result = await consentService.revokeConsent({
                  consent_type: consentType,
                  revocation_reason: 'Revogado pela usuária',
                  ...deviceInfo,
                });

                if (result.success) {
                  logger.info('Consentimento revogado', {
                    screen: 'ConsentScreen',
                    consentType,
                  });
                } else {
                  Alert.alert('Erro', result.error || 'Não foi possível revogar consentimento.');
                }
              } catch (error) {
                logger.error('Erro ao revogar consentimento', error, {
                  screen: 'ConsentScreen',
                  consentType,
                });
                Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
              }
            },
          },
        ]
      );
    },
    [getDeviceInfo]
  );

  /**
   * Verificar se pode prosseguir (onboarding)
   */
  const canProceed =
    mode === 'onboarding' &&
    consents?.essential?.status === 'granted' &&
    consents?.ai_processing?.status === 'granted';

  /**
   * Consentimentos a exibir baseado no modo
   */
  const consentTypesToShow: ConsentType[] =
    mode === 'onboarding'
      ? ['essential', 'ai_processing'] // Apenas obrigatórios no onboarding
      : ['essential', 'ai_processing', 'analytics', 'marketing', 'data_sharing', 'health_data']; // Todos em settings

  if (isLoading || isLoadingTerms) {
    return (
      <Box flex={1} justify="center" align="center" bg="canvas">
        <Text variant="body" color="secondary">
          Carregando...
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="canvas">
      <ScrollView
        contentContainerStyle={{
          padding: Tokens.spacing['6'],
          paddingBottom: Tokens.spacing['12'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Box mb="8">
          <View style={styles.headerRow}>
            <Shield size={32} color={colors.primary.main} />
            <Heading level="h1" style={{ marginLeft: Tokens.spacing['3'] }}>
              Consentimento LGPD
            </Heading>
          </View>
          <Text
            variant="body"
            color="secondary"
            style={{ lineHeight: Tokens.typography.lineHeights.base }}
          >
            {mode === 'onboarding'
              ? 'Para continuar, precisamos do seu consentimento para funcionalidades essenciais do app.'
              : 'Gerencie seus consentimentos de privacidade. Você pode revogar a qualquer momento.'}
          </Text>
        </Box>

        {/* Lista de Consentimentos */}
        <Box gap="4">
          {consentTypesToShow.map((consentType) => {
            const info = CONSENT_INFO[consentType];
            const hasConsent = consents?.[consentType]?.status === 'granted';
            const isExpanded = expandedConsent === consentType;
            const term = terms?.find(
              (t: ConsentTermsVersion) => t.consent_type === consentType && t.is_current
            );

            return (
              <View
                key={consentType}
                style={[
                  styles.consentCard,
                  {
                    backgroundColor: colors.background.card,
                    borderColor: hasConsent ? colors.status.success : colors.border.light,
                    shadowColor: colors.raw.neutral[900],
                  },
                ]}
              >
                {/* Header do Consentimento */}
                <View style={styles.consentHeader}>
                  <View style={styles.consentInfo}>
                    <Text size="lg" style={{ marginRight: Tokens.spacing['3'] }}>
                      {info.emoji}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <View style={styles.titleRow}>
                        <Text variant="body" weight="semibold">
                          {info.title}
                        </Text>
                        {info.required && (
                          <View style={[styles.badge, { backgroundColor: colors.status.error }]}>
                            <Text size="xs" weight="semibold" color="inverse">
                              OBRIGATÓRIO
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text size="sm" color="secondary" style={{ marginTop: Tokens.spacing['1'] }}>
                        {info.description}
                      </Text>
                    </View>
                  </View>
                  {hasConsent ? (
                    <CheckCircle2 size={24} color={colors.status.success} />
                  ) : (
                    <XCircle size={24} color={colors.status.error} />
                  )}
                </View>

                {/* Ações */}
                <View style={styles.actionsRow}>
                  {hasConsent ? (
                    <>
                      {mode === 'settings' && (
                        <Button
                          title="Revogar"
                          variant="outline"
                          size="sm"
                          onPress={() => handleRevokeConsent(consentType)}
                          fullWidth
                        />
                      )}
                    </>
                  ) : (
                    <Button
                      title={info.required ? 'Aceitar (Obrigatório)' : 'Aceitar'}
                      variant="primary"
                      size="sm"
                      onPress={() => handleGrantConsent(consentType)}
                      disabled={info.required === false && mode === 'onboarding'}
                      fullWidth
                    />
                  )}
                  {term && (
                    <Button
                      title="Ver Termos"
                      variant="ghost"
                      size="sm"
                      onPress={() => setExpandedConsent(isExpanded ? null : consentType)}
                      rightIcon={<ChevronRight size={16} color={colors.text.secondary} />}
                    />
                  )}
                </View>

                {/* Termos Expandidos */}
                {isExpanded && term && (
                  <View style={[styles.termsBox, { backgroundColor: colors.background.elevated }]}>
                    <View style={styles.termsHeader}>
                      <Info size={16} color={colors.text.secondary} />
                      <Text
                        size="sm"
                        weight="semibold"
                        color="secondary"
                        style={{ marginLeft: Tokens.spacing['2'] }}
                      >
                        Versão {term.version}
                      </Text>
                    </View>
                    <Text
                      size="sm"
                      color="secondary"
                      style={{ lineHeight: Tokens.typography.lineHeights.base }}
                    >
                      {term.full_text}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </Box>

        {/* Footer Info */}
        <View style={[styles.footerInfo, { backgroundColor: colors.background.card }]}>
          <Text
            size="sm"
            color="secondary"
            align="center"
            style={{ lineHeight: Tokens.typography.lineHeights.base }}
          >
            💙 Seus dados são protegidos pela LGPD. Você pode revogar consentimentos a qualquer
            momento nas configurações.
          </Text>
        </View>

        {/* Botão de Conclusão (onboarding) */}
        {mode === 'onboarding' && (
          <Box mt="8">
            <Button
              title="Continuar"
              variant="primary"
              size="lg"
              onPress={() => {
                if (canProceed && onComplete) {
                  onComplete();
                } else {
                  Alert.alert(
                    'Consentimentos Obrigatórios',
                    'Por favor, aceite os consentimentos obrigatórios para continuar.'
                  );
                }
              }}
              disabled={!canProceed}
              fullWidth
            />
          </Box>
        )}
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Tokens.spacing['4'],
  },
  consentCard: {
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing['5'],
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  consentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Tokens.spacing['3'],
  },
  consentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing['2'],
  },
  badge: {
    borderRadius: 9999,
    paddingHorizontal: Tokens.spacing['2'],
    paddingVertical: Tokens.spacing['1'],
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Tokens.spacing['3'],
    marginTop: Tokens.spacing['4'],
  },
  termsBox: {
    marginTop: Tokens.spacing['4'],
    padding: Tokens.spacing['4'],
    borderRadius: Tokens.radius.md,
  },
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Tokens.spacing['2'],
  },
  footerInfo: {
    marginTop: Tokens.spacing['8'],
    padding: Tokens.spacing['4'],
    borderRadius: Tokens.radius.md,
  },
});
