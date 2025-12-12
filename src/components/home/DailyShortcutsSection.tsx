/**
 * DailyShortcutsSection - Seção "Atalhos do dia"
 *
 * Grid com até 3 atalhos rápidos para navegação.
 * Por padrão: Meu Diário, Mães Valentes, Mundo da Nath
 *
 * @version 1.0.0
 */

import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';
import { View, TouchableOpacity, Dimensions } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ShortcutItem {
  /** ID único do atalho */
  id: string;
  /** Ícone Lucide */
  icon: LucideIcon;
  /** Título do atalho */
  title: string;
  /** Descrição curta (1 linha) */
  description: string;
  /** Cor de destaque (hex ou token) */
  color: string;
  /** Callback ao pressionar */
  onPress: () => void;
}

export interface DailyShortcutsSectionProps {
  /** Lista de atalhos (máximo 3) */
  shortcuts: ShortcutItem[];
  /** Título da seção */
  title?: string;
}

export function DailyShortcutsSection({
  shortcuts,
  title = 'Atalhos do dia',
}: DailyShortcutsSectionProps) {
  const colors = useThemeColors();

  // Limita a 3 atalhos
  const displayShortcuts = shortcuts.slice(0, 3);

  // Calcula largura dos cards (2 colunas com gap)
  const cardWidth = (SCREEN_WIDTH - Spacing['6'] * 2 - Spacing['3']) / 2;

  const handlePress = (item: ShortcutItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    item.onPress();
  };

  return (
    <View>
      {/* Título da seção */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.text.primary,
          marginBottom: Spacing['5'],
          letterSpacing: -0.2,
        }}
      >
        {title}
      </Text>

      {/* Grid de atalhos */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing['3'],
        }}
      >
        {displayShortcuts.map((item) => {
          const IconComponent = item.icon;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item)}
              activeOpacity={0.9}
              accessibilityLabel={item.title}
              accessibilityHint={item.description}
              style={{
                width: cardWidth,
                backgroundColor: colors.background.card,
                borderRadius: Radius['2xl'],
                padding: Spacing['5'],
                borderWidth: 1,
                borderColor: colors.border.light,
                minHeight: 120,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              {/* Ícone */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: `${item.color}15`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: Spacing['4'],
                  borderWidth: 2,
                  borderColor: `${item.color}25`,
                }}
              >
                <IconComponent size={24} color={item.color} strokeWidth={2.5} />
              </View>

              {/* Título */}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: Spacing['1'],
                  letterSpacing: -0.1,
                }}
              >
                {item.title}
              </Text>

              {/* Descrição */}
              <Text
                style={{
                  fontSize: 13,
                  color: colors.text.secondary,
                  lineHeight: 18,
                }}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default DailyShortcutsSection;
