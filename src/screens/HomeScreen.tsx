import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { Text } from '@/components/primitives/Text';
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';
import { EmotionSlider } from '@/components/molecules/EmotionSlider';
import { MicroActionCard } from '@/components/organisms/MicroActionCard';
import { useHabitsToday } from '@/hooks/useHabits';
import { FlashList } from '@shopify/flash-list';
import { logger } from '@/utils/logger';

export function HomeScreen() {
  const colors = useThemeColors();
  const [emotion, setEmotion] = useState<number>(4); // índice inicial (feliz)
  const { data: habits, error } = useHabitsToday();

  if (error) {
    logger.error('Falha ao carregar hábitos do dia', error);
  }

  const renderItem = useCallback(
    ({ item }: { item: { title: string; description: string; duration?: string; icon?: string; onPress?: () => void } }) => {
      return (
        <MicroActionCard
          title={item.title}
          description={item.description}
          duration={item.duration}
          icon={item.icon}
          onPress={item.onPress}
        />
      );
    },
    []
  );

  return (
    <ScreenLayout>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: Tokens.spacing['5'],
          paddingTop: Tokens.spacing['4'],
          paddingBottom: Tokens.spacing['6'],
        }}
      >
        <Text
          style={[
            Tokens.textStyles.titleLarge,
            {
              color: colors.text.primary,
              marginBottom: Tokens.spacing['1'],
            },
          ]}
        >
          Nossa Maternidade
        </Text>
        <Text
          style={[
            Tokens.textStyles.bodyMedium,
            {
              color: colors.text.secondary,
            },
          ]}
        >
          Estamos aqui por você
        </Text>
      </View>

      {/* BLOCO 01 — CHECK-IN EMOCIONAL */}
      <View
        style={{
          backgroundColor: colors.background.card,
          padding: Tokens.spacing['6'],
          borderRadius: Tokens.radius.xl,
          marginHorizontal: Tokens.spacing['5'],
          marginBottom: Tokens.spacing['6'],
        }}
      >
        <Text
          style={[
            Tokens.textStyles.titleMedium,
            {
              color: colors.text.primary,
              marginBottom: Tokens.spacing['4'],
            },
          ]}
        >
          Como está hoje?
        </Text>

        <EmotionSlider value={emotion} onChange={setEmotion} />
      </View>

      {/* BLOCO 02 — MICRO-AÇÕES */}
      <View
        style={{
          paddingHorizontal: Tokens.spacing['5'],
          marginBottom: Tokens.spacing['4'],
        }}
      >
        <Text
          style={[
            Tokens.textStyles.titleMedium,
            {
              color: colors.text.primary,
              marginBottom: Tokens.spacing['1'],
            },
          ]}
        >
          Para você agora
        </Text>
        <Text
          style={[
            Tokens.textStyles.bodySmall,
            {
              color: colors.text.secondary,
              marginBottom: Tokens.spacing['4'],
            },
          ]}
        >
          Micro-ações que funcionam
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: Tokens.spacing['5'] }}>
        <FlashList
          data={habits ?? []}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.title + index}
          drawDistance={300}
          ListEmptyComponent={() => (
            <Text
              style={[
                Tokens.textStyles.bodyMedium,
                {
                  textAlign: 'center',
                  color: colors.text.secondary,
                  paddingVertical: Tokens.spacing['8'],
                },
              ]}
            >
              Carregando recomendações...
            </Text>
          )}
        />
      </View>
    </ScreenLayout>
  );
}
