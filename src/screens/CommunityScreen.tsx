/**
 * CommunityScreen - Tela de Comunidade MãesValentes
 *
 * Feed de posts da comunidade com criação de posts, filtros por categoria,
 * curtidas e comentários.
 * Referência: app-redesign-studio-ab40635e/src/pages/Community.tsx
 * Refatorado para usar componentes separados (CreatePostModal, PostCard).
 */

import { Users, MessageCircle } from 'lucide-react-native';
import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import { triggerPlatformHaptic } from '@/theme/platform';
import {
  ColorTokens,
  Tokens,
  Spacing,
  Radius,
} from '@/theme/tokens';
import { logger } from '@/utils/logger';

export default function CommunityScreen() {
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      edges={['top']}
      accessible={false}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing['20'] }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary.main} />
        }
      >
        {/* Header Section */}
        <Box
          bg="card"
          px="6"
          pt="6"
          pb="6"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border.light,
          }}
        >
          <Text size="2xl" weight="bold" style={{ marginBottom: Spacing['2'] }}>
            Comunidade
          </Text>
        </Box>

        {/* Cards Principais - Clube da Mãe e Fórum de Dúvidas */}
        <Box px="6" pt="6" gap="4">
          {/* Card: Clube da Mãe */}
          <TouchableOpacity
            onPress={() => {
              triggerPlatformHaptic('buttonPress');
              logger.info('[CommunityScreen] Clube da Mãe pressionado');
              // TODO: Navegar para tela de grupos quando disponível
            }}
            activeOpacity={0.95}
            style={{
              backgroundColor: isDark ? ColorTokens.primary[900] : ColorTokens.primary[50],
              borderRadius: Radius['3xl'],
              padding: Spacing['6'],
              borderWidth: 1,
              borderColor: isDark ? ColorTokens.primary[700] : ColorTokens.primary[200],
              ...Tokens.shadows.card,
            }}
            accessibilityRole="button"
            accessibilityLabel="Clube da Mãe"
            accessibilityHint="Entre nos grupos exclusivos e troque experiências com outras mães"
          >
            <Box align="center" gap="4">
              {/* Ícone */}
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: Radius.full,
                  backgroundColor: isDark ? ColorTokens.primary[800] : ColorTokens.primary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={32} color={ColorTokens.primary[500]} />
              </View>

              {/* Título */}
              <Text size="xl" weight="bold" style={{ color: colors.text.primary }}>
                Clube da Mãe
              </Text>

              {/* Descrição */}
              <Text
                size="sm"
                color="secondary"
                align="center"
              style={{
                  maxWidth: 280,
                  lineHeight: 20,
                }}
              >
                Entre nos grupos exclusivos e troque experiências com outras mães.
              </Text>

              {/* Botão */}
            <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  triggerPlatformHaptic('buttonPress');
                  logger.info('[CommunityScreen] Acessar Grupos pressionado');
                }}
              activeOpacity={0.8}
              style={{
                  backgroundColor: ColorTokens.primary[500],
                paddingVertical: Spacing['3'],
                  paddingHorizontal: Spacing['6'],
                borderRadius: Radius.xl,
                  minHeight: Tokens.touchTargets.min,
                  width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              accessibilityRole="button"
                accessibilityLabel="Acessar Grupos"
            >
                <Text size="sm" weight="bold" style={{ color: ColorTokens.neutral[0] }}>
                  Acessar Grupos
              </Text>
            </TouchableOpacity>
          </Box>
          </TouchableOpacity>

          {/* Card: Fórum de Dúvidas */}
          <TouchableOpacity
            onPress={() => {
              triggerPlatformHaptic('buttonPress');
              logger.info('[CommunityScreen] Fórum de Dúvidas pressionado');
              // TODO: Navegar para tela de fórum quando disponível
            }}
            activeOpacity={0.95}
            style={{
              backgroundColor: isDark ? ColorTokens.info[900] : ColorTokens.info[50],
              borderRadius: Radius['3xl'],
              padding: Spacing['6'],
              borderWidth: 1,
              borderColor: isDark ? ColorTokens.info[700] : ColorTokens.info[200],
              ...Tokens.shadows.card,
            }}
                accessibilityRole="button"
            accessibilityLabel="Fórum de Dúvidas"
            accessibilityHint="Pergunte e responda dúvidas de outras mães da comunidade"
          >
            <Box align="center" gap="4">
              {/* Ícone */}
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: Radius.full,
                  backgroundColor: isDark ? ColorTokens.info[800] : ColorTokens.info[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={32} color={ColorTokens.info[500]} />
              </View>

              {/* Título */}
              <Text size="xl" weight="bold" style={{ color: colors.text.primary }}>
                Fórum de Dúvidas
              </Text>

              {/* Descrição */}
                <Text
                  size="sm"
                color="secondary"
                align="center"
                  style={{
                  maxWidth: 280,
                  lineHeight: 20,
                  }}
                >
                Pergunte e responda dúvidas de outras mães da comunidade.
                </Text>

              {/* Botão */}
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  triggerPlatformHaptic('buttonPress');
                  logger.info('[CommunityScreen] Ver Fórum pressionado');
                }}
              activeOpacity={0.8}
              style={{
                  backgroundColor: ColorTokens.info[500],
                paddingVertical: Spacing['3'],
                paddingHorizontal: Spacing['6'],
                borderRadius: Radius.xl,
                  minHeight: Tokens.touchTargets.min,
                  width: '100%',
                alignItems: 'center',
                  justifyContent: 'center',
              }}
              accessibilityRole="button"
                accessibilityLabel="Ver Fórum"
            >
                <Text size="sm" weight="bold" style={{ color: ColorTokens.neutral[0] }}>
                  Ver Fórum
              </Text>
            </TouchableOpacity>
          </Box>
          </TouchableOpacity>
              </Box>

      </ScrollView>

    </SafeAreaView>
  );
}
