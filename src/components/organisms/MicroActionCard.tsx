import { View, Pressable } from 'react-native';
import { Text } from '@/components/primitives/Text';
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';

interface Props {
  title: string;
  description: string;
  duration?: string;
  icon?: string;
  onPress?: () => void;
}

export function MicroActionCard({
  title,
  description,
  duration,
  icon,
  onPress,
}: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.background.card,
        padding: Tokens.spacing['5'],
        borderRadius: Tokens.radius.xl,
        marginBottom: Tokens.spacing['4'],
        flexDirection: 'row',
        alignItems: 'center',
        gap: Tokens.spacing['4'],
        minHeight: Tokens.touchTargets.min,
      }}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      {/* Ícone */}
      <View
        style={{
          backgroundColor: colors.primary.subtle,
          height: 52,
          width: 52,
          borderRadius: Tokens.radius.full,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 22 }}>{icon ?? '💗'}</Text>
      </View>

      {/* Conteúdo */}
      <View style={{ flex: 1 }}>
        <Text
          style={[
            Tokens.textStyles.titleSmall,
            {
              color: colors.text.primary,
              marginBottom: Tokens.spacing['1'],
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            Tokens.textStyles.bodySmall,
            {
              color: colors.text.secondary,
              marginTop: Tokens.spacing['1'],
            },
          ]}
        >
          {description}
        </Text>

        {duration && (
          <Text
            style={[
              Tokens.textStyles.bodySmall,
              {
                marginTop: Tokens.spacing['1'],
                color: colors.primary.main,
              },
            ]}
          >
            {duration}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

