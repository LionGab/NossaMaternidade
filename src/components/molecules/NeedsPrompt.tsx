/**
 * NeedsPrompt - "O que você mais precisa agora?"
 *
 * Substitui perguntas tóxicas de "arrependimento" por uma pergunta empática
 * que oferece opções práticas de apoio.
 *
 * @version 1.0.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColors } from '@/theme';
import { Tokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

const LAST_NEED_KEY = '@needs_prompt:last_selection';

export type NeedValue = 'descanso' | 'apoio-emocional' | 'organizacao' | 'conexao';

export interface NeedsPromptProps {
  title?: string;
  selectedNeed?: NeedValue;
  onSelect: (need: NeedValue) => void;
}

interface NeedOption {
  emoji: string;
  label: string;
  value: NeedValue;
  description: string;
}

const NEED_OPTIONS: NeedOption[] = [
  {
    emoji: '😴',
    label: 'Descanso',
    value: 'descanso',
    description: 'Preciso de um momento para descansar',
  },
  {
    emoji: '💙',
    label: 'Apoio emocional',
    value: 'apoio-emocional',
    description: 'Preciso de alguém para me ouvir',
  },
  {
    emoji: '📋',
    label: 'Organização',
    value: 'organizacao',
    description: 'Preciso de ajuda para organizar minha rotina',
  },
  {
    emoji: '🤝',
    label: 'Conexão',
    value: 'conexao',
    description: 'Preciso me conectar com outras mães',
  },
];

export function NeedsPrompt({
  title = 'O que você mais precisa agora?',
  selectedNeed,
  onSelect,
}: NeedsPromptProps) {
  const colors = useThemeColors();
  const haptics = useHaptics();

  // Carregar última seleção ao montar (para cruzar com retenção)
  useEffect(() => {
    loadLastSelection();
  }, []);

  const loadLastSelection = async () => {
    try {
      const lastNeed = await AsyncStorage.getItem(LAST_NEED_KEY);
      if (lastNeed) {
        logger.debug('[NeedsPrompt] Última seleção recuperada', { lastNeed });
      }
    } catch (error) {
      logger.error('[NeedsPrompt] Erro ao carregar última seleção', error);
    }
  };

  const handleSelect = async (need: NeedValue) => {
    haptics.light();

    // Analytics: logar seleção para cruzar com retenção
    logger.info('[NeedsPrompt] Need selecionado', {
      need,
      timestamp: new Date().toISOString(),
    });

    // Persistir última escolha para análise futura
    try {
      await AsyncStorage.setItem(
        LAST_NEED_KEY,
        JSON.stringify({
          need,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      logger.error('[NeedsPrompt] Erro ao persistir seleção', error);
    }

    onSelect(need);
  };

  return (
    <Box>
      {/* Título */}
      {title && (
        <Text size="md" weight="semibold" style={{ marginBottom: Tokens.spacing['3'] }}>
          {title}
        </Text>
      )}

      {/* Grid de opções */}
      <Box
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Tokens.spacing['3'],
        }}
      >
        {NEED_OPTIONS.map((need) => {
          const isSelected = selectedNeed === need.value;

          return (
            <TouchableOpacity
              key={need.value}
              onPress={() => handleSelect(need.value)}
              accessibilityRole="button"
              accessibilityLabel={`Preciso de ${need.label}: ${need.description}`}
              accessibilityState={{ selected: isSelected }}
              style={{
                flex: 1,
                minWidth: '45%',
                minHeight: Tokens.touchTargets.min,
              }}
            >
              <Box
                bg="card"
                rounded="2xl"
                p="4"
                style={{
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary.main : colors.border.light,
                  backgroundColor: isSelected
                    ? `${colors.primary.main}0F` // 6% opacity
                    : colors.background.card,
                  ...Tokens.shadows.sm,
                }}
              >
                {/* Emoji */}
                <Text
                  style={{
                    fontSize: 32,
                    marginBottom: Tokens.spacing['2'],
                    textAlign: 'center',
                  }}
                >
                  {need.emoji}
                </Text>

                {/* Label */}
                <Text
                  size="sm"
                  weight={isSelected ? 'semibold' : 'medium'}
                  color={isSelected ? 'primary' : 'primary'}
                  style={{
                    textAlign: 'center',
                    marginBottom: Tokens.spacing['1'],
                  }}
                >
                  {need.label}
                </Text>

                {/* Descrição (opcional, aparece quando selecionado) */}
                {isSelected && (
                  <Text
                    size="xs"
                    color="secondary"
                    style={{
                      textAlign: 'center',
                      marginTop: Tokens.spacing['1'],
                    }}
                  >
                    {need.description}
                  </Text>
                )}
              </Box>
            </TouchableOpacity>
          );
        })}
      </Box>
    </Box>
  );
}
