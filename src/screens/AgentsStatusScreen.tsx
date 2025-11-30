/**
 * Agents Status Screen
 * Tela de debug/monitoring que mostra o status de todos os agentes IA
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Brain,
  Heart,
  Sparkles,
  Moon,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { useAgents } from '../contexts/AgentsContext';
import { Tokens } from '@/theme/tokens';

export default function AgentsStatusScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const {
    initialized,
    chatAgent,
    contentAgent,
    habitsAgent,
    emotionAgent,
    nathiaAgent,
    sleepAgent,
    designAgent,
    error,
  } = useAgents();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const agents = [
    {
      name: 'Maternal Chat Agent',
      description: 'Chat empático com IA Gemini 2.0',
      agent: chatAgent,
      icon: Sparkles,
      color: colors.primary.main,
      capabilities: ['chat', 'emotion-analysis', 'session-management'],
    },
    {
      name: 'Content Recommendation',
      description: 'Recomendações personalizadas',
      agent: contentAgent,
      icon: Brain,
      color: colors.status.info,
      capabilities: ['recommendation', 'filtering', 'scoring'],
    },
    {
      name: 'Habits Analysis Agent',
      description: 'Análise de bem-estar e hábitos',
      agent: habitsAgent,
      icon: Heart,
      color: colors.status.success,
      capabilities: ['habit-tracking', 'pattern-detection', 'insights'],
    },
    {
      name: 'Emotion Analysis Agent',
      description: 'Análise emocional profunda',
      agent: emotionAgent,
      icon: Heart,
      color: colors.status.warning,
      capabilities: ['emotion-detection', 'risk-assessment', 'support'],
      badge: 'NEW',
    },
    {
      name: 'Nathia Personality Agent',
      description: 'Voz autêntica da Nathália',
      agent: nathiaAgent,
      icon: Sparkles,
      color: colors.primary.dark,
      capabilities: ['personality-validation', 'medical-prevention', 'tone-correction'],
      badge: 'NEW',
      special: true,
    },
    {
      name: 'Sleep Analysis Agent',
      description: 'Análise inteligente de sono',
      agent: sleepAgent,
      icon: Moon,
      color: colors.status.info,
      capabilities: ['sleep-tracking', 'deprivation-assessment', 'recommendations'],
      badge: 'NEW',
    },
    {
      name: 'Design Quality Agent',
      description: 'Validação de design tokens e acessibilidade',
      agent: designAgent,
      icon: Sparkles,
      color: colors.secondary.main,
      capabilities: ['validate-design-tokens', 'audit-accessibility', 'suggest-fixes'],
      badge: 'NEW',
    },
  ];

  const activeCount = agents.filter(a => a.agent !== null).length;
  const progress = (activeCount / agents.length) * 100;

  const successColor = colors.status.success;
  const errorColor = colors.status.error;
  const warningColor = colors.status.warning;

  // Helper para converter hex para rgba com opacidade
  const hexToRgba = (hex: string, opacity: number): string => {
    // Remove # se presente
    const cleanHex = hex.replace('#', '');
    // Converte para RGB
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Overlays para cores de status - usa hexToRgba para cores específicas
  // ColorTokens.overlay.* é usado apenas para overlays genéricos (preto/branco)
  const getStatusOverlay = (color: string, opacity: number): string => {
    // Para cores específicas (success, error, warning, etc), sempre usar hexToRgba
    return hexToRgba(color, opacity);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}
      >
        <TouchableOpacity 
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Retorna para a tela anterior"
          onPress={handleBack}
          style={{
            width: Tokens.touchTargets.min, // 44pt WCAG AAA
            height: Tokens.touchTargets.min, // 44pt WCAG AAA
            borderRadius: Tokens.touchTargets.min / 2,
            backgroundColor: colors.background.elevated,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text.primary }}>
            Status dos Agentes IA
          </Text>
          <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 2 }}>
            Sistema de inteligência artificial
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.main}
          />
        }
      >
        {/* Status Geral */}
        <View
          style={{
            backgroundColor: initialized
              ? getStatusOverlay(successColor, 0.15)
              : error
              ? getStatusOverlay(errorColor, 0.15)
              : getStatusOverlay(warningColor, 0.15),
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: initialized
              ? getStatusOverlay(successColor, 0.40)
              : error
              ? getStatusOverlay(errorColor, 0.40)
              : getStatusOverlay(warningColor, 0.40),
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            {initialized ? (
              <CheckCircle2 size={28} color={successColor} />
            ) : error ? (
              <XCircle size={28} color={errorColor} />
            ) : (
              <Loader2 size={28} color={warningColor} />
            )}
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary }}>
                {initialized ? 'Sistema Ativo' : error ? 'Erro na Inicialização' : 'Inicializando...'}
              </Text>
              <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 2 }}>
                {initialized
                  ? `${activeCount}/${agents.length} agentes ativos`
                  : error
                  ? 'Falha ao inicializar agentes'
                  : 'Aguarde...'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              height: 8,
              backgroundColor: colors.background.elevated,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: initialized ? successColor : warningColor,
              }}
            />
          </View>

          {error && (
            <View
              style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: getStatusOverlay(errorColor, 0.20),
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: errorColor }}>
                Erro: {error}
              </Text>
            </View>
          )}
        </View>

        {/* Lista de Agentes */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: 12,
          }}
        >
          Agentes Registrados
        </Text>

        {agents.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.agent !== null;

          return (
            <View
              key={index}
              style={{
                backgroundColor: item.special
                  ? colors.background.elevated
                  : colors.background.card,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: item.special ? 2 : 1,
                borderColor: item.special
                  ? getStatusOverlay(item.color, 0.80)
                  : colors.border.light,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: getStatusOverlay(item.color, 0.20),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} color={item.color} />
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: colors.text.primary,
                      }}
                    >
                      {item.name}
                    </Text>
                    {item.badge && (
                      <View
                        style={{
                          backgroundColor: item.color,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 4,
                          marginLeft: 8,
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text.inverse }}>
                          {item.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.text.secondary,
                      marginTop: 2,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>

                {isActive ? (
                  <CheckCircle2 size={20} color={successColor} />
                ) : (
                  <XCircle size={20} color={colors.text.disabled} />
                )}
              </View>

              {/* Capabilities */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 8,
                  gap: 6,
                }}
              >
                {item.capabilities.map((cap, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: colors.background.elevated,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: colors.border.light,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.text.secondary,
                        fontWeight: '500',
                      }}
                    >
                      {cap}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Special Notice para Nathia */}
              {item.special && isActive && (
                <View
                  style={{
                    marginTop: 12,
                    padding: 8,
                    backgroundColor: getStatusOverlay(item.color, 0.15),
                    borderRadius: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: item.color,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.text.primary,
                      fontWeight: '600',
                    }}
                  >
                    🎭 VOZ AUTÊNTICA ATIVA
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.text.secondary,
                      marginTop: 4,
                    }}
                  >
                    Todas as respostas passam por validação. Zero conselhos médicos garantido.
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Orchestrator Info */}
        <View
          style={{
            marginTop: 12,
            backgroundColor: colors.background.elevated,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border.light,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary }}>
            🎛️ Orchestrator
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.text.secondary,
              marginTop: 4,
              lineHeight: 18,
            }}
          >
            Sistema de coordenação central que gerencia todos os agentes e MCPs (Supabase, Google
            AI, Analytics). Garante comunicação eficiente e tracking de eventos.
          </Text>
        </View>

        {/* Footer Info */}
        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.text.tertiary }}>
            Sistema de Agentes IA v1.0.0
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.text.tertiary,
              marginTop: 4,
              textAlign: 'center',
            }}
          >
            Powered by Gemini 2.0 Flash • React Native • Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
