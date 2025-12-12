/**
 * DailyInspirationCard - Card "Inspiração do dia"
 *
 * Exibe frase motivacional com opção de trocar.
 * Link "Quero outra frase" chama refetch ou navega para NathIA.
 *
 * @version 1.0.0
 */

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, RefreshCw } from 'lucide-react-native';
import { View, TouchableOpacity } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';

export interface DailyInspirationCardProps {
  /** Frase do dia */
  quote: string;
  /** Callback ao tocar em "Quero outra frase" */
  onRequestNewQuote: () => void;
  /** Se está carregando nova frase */
  isLoading?: boolean;
}

export function DailyInspirationCard({
  quote,
  onRequestNewQuote,
  isLoading = false,
}: DailyInspirationCardProps) {
  const colors = useThemeColors();

  const handleRequestNewQuote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRequestNewQuote();
  };

  return (
    <View
      style={{
        backgroundColor: colors.background.card,
        borderRadius: Radius['3xl'],
        padding: Spacing['6'],
        borderWidth: 1,
        borderColor: colors.border.light,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={[`${colors.status.success}12`, `${colors.status.success}06`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: Radius['3xl'],
        }}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing['5'],
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.status.success + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing['3'],
            borderWidth: 1.5,
            borderColor: colors.status.success + '30',
          }}
        >
          <Sparkles size={18} color={colors.status.success} strokeWidth={2.5} />
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: colors.status.success,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          Inspiração do dia
        </Text>
      </View>

      {/* Frase */}
      <Text
        style={{
          fontSize: 17,
          fontWeight: '500',
          color: colors.text.primary,
          lineHeight: 26,
          marginBottom: Spacing['5'],
          letterSpacing: 0.1,
        }}
      >
        {quote}
      </Text>

      {/* Link "Quero outra frase" */}
      <TouchableOpacity
        onPress={handleRequestNewQuote}
        activeOpacity={0.8}
        disabled={isLoading}
        accessibilityLabel="Quero outra frase"
        accessibilityHint="Troca a frase inspiracional por uma nova"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          paddingVertical: Spacing['3'],
          paddingHorizontal: Spacing['4'],
          borderRadius: Radius.full,
          backgroundColor: colors.status.success + '15',
          borderWidth: 1,
          borderColor: colors.status.success + '25',
          gap: Spacing['2'],
          minHeight: 44,
        }}
      >
        <RefreshCw
          size={16}
          color={colors.status.success}
          strokeWidth={2.5}
          style={isLoading ? { opacity: 0.5 } : undefined}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: colors.status.success,
            letterSpacing: 0.2,
          }}
        >
          {isLoading ? 'Carregando...' : 'Quero outra frase'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default DailyInspirationCard;
