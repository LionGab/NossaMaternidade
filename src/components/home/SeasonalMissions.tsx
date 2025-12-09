/**
 * SeasonalMissions - Missões Sazonais
 * 
 * Componente com chips de missões sazonais
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Box } from '@/components/atoms/Box';
import { Text } from '@/components/atoms/Text';
import { Tokens } from '@/theme/tokens';

// Paleta Premium
const PREMIUM_COLORS = {
  azul_acento: '#6DA9E4',
  rosa_acento: '#FF8BA3',
  roxo_suave: '#C5A8FF',
  fundo_rosado: '#FDF9FB',
  fundo_azulado: '#F3F7FF',
  texto_principal: '#3A2E2E',
  texto_suave: '#6A5450',
};

const MISSIONS = [
  'Look de verão',
  'Look de Natal/Ano Novo',
  'Look mãe estilosa',
];

interface SeasonalMissionsProps {
  onMissionPress?: (mission: string) => void;
}

export const SeasonalMissions: React.FC<SeasonalMissionsProps> = ({ onMissionPress: _onMissionPress }) => {

  return (
    <View style={styles.container}>
      <Text
        variant="body"
        size="lg"
        weight="bold"
        style={StyleSheet.flatten([styles.title, { color: PREMIUM_COLORS.texto_principal }])}
      >
        Missões sazonais
      </Text>
      <Box direction="row" gap="2" style={{ flexWrap: 'wrap', marginTop: Tokens.spacing['3'] }}>
        {MISSIONS.map((mission, index) => (
          <View
            key={index}
            style={[
              styles.chip,
              {
                backgroundColor: index === 0
                  ? `${PREMIUM_COLORS.rosa_acento}20`
                  : index === 1
                  ? `${PREMIUM_COLORS.azul_acento}20`
                  : `${PREMIUM_COLORS.roxo_suave}20`,
                borderColor: index === 0
                  ? `${PREMIUM_COLORS.rosa_acento}40`
                  : index === 1
                  ? `${PREMIUM_COLORS.azul_acento}40`
                  : `${PREMIUM_COLORS.roxo_suave}40`,
              },
            ]}
          >
            <Text
              variant="caption"
              size="xs"
              weight="medium"
              style={{
                color: index === 0
                  ? PREMIUM_COLORS.rosa_acento
                  : index === 1
                  ? PREMIUM_COLORS.azul_acento
                  : PREMIUM_COLORS.roxo_suave,
              }}
            >
              {mission}
            </Text>
          </View>
        ))}
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Tokens.spacing['5'],
    marginBottom: Tokens.spacing['4'],
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  chip: {
    paddingHorizontal: Tokens.spacing['4'],
    paddingVertical: Tokens.spacing['2'],
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

