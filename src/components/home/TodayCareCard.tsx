/**
 * TodayCareCard - Card "Meus Cuidados Hoje" com 3 estados
 *
 * Estado 1: Sem hábitos (totalHabits === 0) → CTA "Criar primeiro cuidado"
 * Estado 2: Com hábitos, nenhum concluído → Anel 0%, CTA "Ver cuidados"
 * Estado 3: Com progresso → Anel X%, frase motivacional, CTA "Ver cuidados"
 *
 * @version 1.0.0
 */

import * as Haptics from 'expo-haptics';
import { Heart, Plus, ChevronRight, Trophy } from 'lucide-react-native';
import { View, TouchableOpacity } from 'react-native';

import { ProgressRing } from '@/components/atoms/ProgressRing';
import { Text } from '@/components/atoms/Text';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius } from '@/theme/tokens';

export interface TodayCareCardProps {
  /** Total de hábitos do usuário */
  totalHabits: number;
  /** Hábitos completados hoje */
  completedHabits: number;
  /** Callback ao tocar em "Ver cuidados" */
  onViewHabits: () => void;
  /** Callback ao tocar em "Criar primeiro cuidado" */
  onCreateHabit: () => void;
}

/**
 * Frase motivacional baseada no percentual (NUNCA vazia)
 */
function getMotivationalPhrase(percent: number): string {
  if (percent === 0) return 'Começar já é um cuidado com você 💕';
  if (percent <= 33) return 'Cada pequeno passo conta 💕';
  if (percent <= 66) return 'Você está cuidando de você mesma em dias difíceis.';
  return 'Incrível o que você já fez por você hoje 💖';
}

export function TodayCareCard({
  totalHabits,
  completedHabits,
  onViewHabits,
  onCreateHabit,
}: TodayCareCardProps) {
  const colors = useThemeColors();

  const percent = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  const isComplete = percent >= 100;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (totalHabits === 0) {
      onCreateHabit();
    } else {
      onViewHabits();
    }
  };

  // ========================================
  // ESTADO 1: Sem hábitos cadastrados
  // ========================================
  if (totalHabits === 0) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.95}
        accessibilityLabel="Criar primeiro cuidado"
        accessibilityHint="Abre a tela de hábitos para criar seu primeiro cuidado"
        style={{
          backgroundColor: colors.background.card,
          borderRadius: Radius['3xl'],
          padding: Spacing['6'],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
          borderWidth: 1,
          borderColor: colors.border.light,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['5'] }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: `${colors.primary.main}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: Spacing['4'],
              borderWidth: 2,
              borderColor: `${colors.primary.main}25`,
            }}
          >
            <Heart size={28} color={colors.primary.main} strokeWidth={2.5} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text.primary,
                letterSpacing: -0.2,
                marginBottom: Spacing['1'],
              }}
            >
              Meus Cuidados Hoje
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.text.secondary,
                lineHeight: 20,
              }}
            >
              Você ainda não criou nenhum cuidado pra hoje.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary.main,
            paddingVertical: Spacing['4'],
            paddingHorizontal: Spacing['5'],
            borderRadius: Radius.full,
            gap: Spacing['2'],
            minHeight: 52,
            shadowColor: colors.primary.main,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Plus size={20} color="#FFF" strokeWidth={2.5} />
          <Text
            style={{
              color: '#FFF',
              fontWeight: '600',
              fontSize: 15,
              letterSpacing: 0.2,
            }}
          >
            Criar primeiro cuidado
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // ========================================
  // ESTADO 2 e 3: Com hábitos (0% ou com progresso)
  // ========================================
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.95}
      accessibilityLabel={`Meus cuidados hoje: ${completedHabits} de ${totalHabits} concluídos`}
      accessibilityHint="Abre a tela de hábitos para ver seus cuidados de hoje"
      style={{
        backgroundColor: colors.background.card,
        borderRadius: Radius['3xl'],
        padding: Spacing['6'],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing['5'] }}>
        <View style={{ flex: 1, paddingRight: Spacing['4'] }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.text.primary,
              letterSpacing: -0.2,
              marginBottom: Spacing['1'],
            }}
          >
            Meus Cuidados Hoje
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text.secondary,
              lineHeight: 20,
            }}
          >
            {completedHabits}/{totalHabits} concluídos
          </Text>
        </View>

        {/* Anel de Progresso ou Troféu */}
        {isComplete ? (
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.status.success + '20',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.status.success + '30',
            }}
          >
            <Trophy size={32} color={colors.status.success} strokeWidth={2.5} />
          </View>
        ) : (
          <ProgressRing
            progress={percent}
            size={64}
            strokeWidth={7}
            showPercentage
            color={colors.primary.main}
            backgroundColor={colors.primary.light + '40'}
          />
        )}
      </View>

      {/* Frase motivacional */}
      <Text
        style={{
          fontSize: 14,
          color: colors.text.secondary,
          lineHeight: 20,
          fontStyle: 'italic',
          marginBottom: Spacing['5'],
        }}
      >
        {getMotivationalPhrase(percent)}
      </Text>

      {/* CTA */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isComplete ? colors.status.success : colors.primary.main,
          paddingVertical: Spacing['4'],
          paddingHorizontal: Spacing['5'],
          borderRadius: Radius.full,
          gap: Spacing['2'],
          minHeight: 52,
          shadowColor: isComplete ? colors.status.success : colors.primary.main,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text
          style={{
            color: '#FFF',
            fontWeight: '600',
            fontSize: 15,
            letterSpacing: 0.2,
          }}
        >
          {isComplete ? 'Parabéns! Ver cuidados' : 'Ver cuidados de hoje'}
        </Text>
        <ChevronRight size={18} color="#FFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default TodayCareCard;
