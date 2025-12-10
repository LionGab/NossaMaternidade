/**
 * VibeTrackerCard - Card de rastreamento de humor
 *
 * Componente completo de vibe tracker com:
 * - Tabs de período (Hoje/Semana/Mês/Histórico)
 * - Slider de vibe 0-100%
 * - Seletor de emojis
 * - Botão de salvar
 *
 * Usa os componentes:
 * - TabSelector (Fase 1)
 * - VibeSlider (Fase 1)
 * - EmojiSelector (Fase 1)
 *
 * @example
 * <VibeTrackerCard
 *   onSave={(data) => saveVibeData(data)}
 *   initialPeriod={0}
 * />
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Box } from '@/components/atoms/Box';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { GradientButton } from '@/components/atoms/GradientButton';
import { TabSelector } from '@/components/home/VibeTrackerCard/TabSelector';
import { VibeSlider } from '@/components/home/VibeTrackerCard/VibeSlider';
import { EmojiSelector, type Emoji } from '@/components/home/VibeTrackerCard/EmojiSelector';
import { useThemeColors } from '@/hooks/useTheme';
import { Spacing, Radius, ColorTokens } from '@/theme/tokens';
import { getShadowFromToken } from '@/utils/shadowHelper';

export interface VibeData {
  period: 'today' | 'week' | 'month' | 'history';
  vibeLevel: number;
  emoji: string;
  timestamp: Date;
}

export interface VibeTrackerCardProps {
  /** Callback ao salvar vibe */
  onSave?: (data: VibeData) => void;
  /** Período inicial selecionado (índice 0-3) */
  initialPeriod?: number;
  /** Vibe inicial (0-100) */
  initialVibeLevel?: number;
  /** Emoji inicial */
  initialEmoji?: string;
  /** Desabilitar haptic feedback */
  disableHaptic?: boolean;
  /** Loading state ao salvar */
  isSaving?: boolean;
}

// Emojis de vibe com labels
const VIBE_EMOJIS: Emoji[] = [
  { emoji: '😍', label: 'Radiante' },
  { emoji: '😊', label: 'Feliz' },
  { emoji: '🙂', label: 'Tranquila' },
  { emoji: '😐', label: 'Neutra' },
  { emoji: '😔', label: 'Triste' },
  { emoji: '😫', label: 'Cansada' },
  { emoji: '😡', label: 'Irritada' },
  { emoji: '🤗', label: 'Acolhida' },
];

// Tabs de período
const PERIOD_TABS = ['Hoje', 'Semana', 'Mês', 'Histórico'];

export const VibeTrackerCard: React.FC<VibeTrackerCardProps> = ({
  onSave,
  initialPeriod = 0,
  initialVibeLevel = 50,
  initialEmoji = '🙂',
  disableHaptic = false,
  isSaving = false,
}) => {
  const colors = useThemeColors();

  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);
  const [vibeLevel, setVibeLevel] = useState(initialVibeLevel);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(initialEmoji);

  const handleSave = () => {
    if (!selectedEmoji) return;

    const periodMap: Record<number, VibeData['period']> = {
      0: 'today',
      1: 'week',
      2: 'month',
      3: 'history',
    };

    const data: VibeData = {
      period: periodMap[selectedPeriod],
      vibeLevel,
      emoji: selectedEmoji,
      timestamp: new Date(),
    };

    onSave?.(data);
  };

  const isFormValid = selectedEmoji !== null;

  return (
    <Box style={{ marginBottom: Spacing['6'], paddingHorizontal: Spacing['6'] }}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.background.card,
            ...getShadowFromToken('lg', colors.text.primary),
          },
        ]}
      >
        {/* Header */}
        <Box className="mb-5">
          <Heading level="h4" weight="bold">
            Como você está hoje?
          </Heading>
          <Text size="xs" color="secondary" style={{ marginTop: Spacing['1'] }}>
            Registre seu humor e acompanhe sua jornada
          </Text>
        </Box>

        {/* Tabs de Período */}
        <TabSelector
          tabs={PERIOD_TABS}
          selectedIndex={selectedPeriod}
          onTabChange={setSelectedPeriod}
          disableHaptic={disableHaptic}
          containerStyle={{ marginBottom: Spacing['5'] }}
        />

        {/* Slider de Vibe */}
        <View style={{ marginBottom: Spacing['5'] }}>
          <Text size="xs" weight="semibold" color="secondary" style={{ marginBottom: Spacing['3'] }}>
            NÍVEL DE ENERGIA
          </Text>
          <VibeSlider
            value={vibeLevel}
            onChange={setVibeLevel}
            disableHaptic={disableHaptic}
          />
        </View>

        {/* Seletor de Emojis */}
        <View style={{ marginBottom: Spacing['5'] }}>
          <Text size="xs" weight="semibold" color="secondary" style={{ marginBottom: Spacing['3'] }}>
            COMO SE SENTE?
          </Text>
          <EmojiSelector
            emojis={VIBE_EMOJIS}
            selectedEmoji={selectedEmoji}
            onSelect={setSelectedEmoji}
            disableHaptic={disableHaptic}
            columns={4}
          />
        </View>

        {/* Botão Salvar */}
        <GradientButton
          title={isSaving ? 'Salvando...' : 'Salvar Vibe'}
          onPress={handleSave}
          disabled={!isFormValid || isSaving}
          loading={isSaving}
          fullWidth
          size="md"
          gradientColors={[ColorTokens.primary[500], ColorTokens.secondary[500]]}
          disableHaptic={disableHaptic}
          accessibilityLabel="Salvar vibe do dia"
          accessibilityHint={`Salva sua vibe de ${vibeLevel}% com emoji ${selectedEmoji}`}
        />

        {/* Feedback visual (se não tiver emoji selecionado) */}
        {!isFormValid && (
          <Text
            size="xs"
            color="tertiary"
            align="center"
            style={{ marginTop: Spacing['2'], fontStyle: 'italic' }}
          >
            Selecione um emoji para continuar
          </Text>
        )}
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius['2xl'],
    padding: Spacing['6'],
    overflow: 'hidden',
  },
});

export default VibeTrackerCard;
