import { View, Pressable } from 'react-native';
import { Tokens } from '@/theme/tokens';
import { useThemeColors } from '@/hooks/useTheme';
import { Text } from '@/components/primitives/Text';

const EMOJIS = ['😍', '🙂', '😎', '🔥', '🙂', '😓', '🥶', '😱'];

interface Props {
  value: number;
  onChange: (newValue: number) => void;
}

export function EmotionSlider({ value, onChange }: Props) {
  const colors = useThemeColors();

  return (
    <View style={{ marginTop: Tokens.spacing['4'] }}>
      <View
        style={{
          height: 6,
          borderRadius: 999,
          backgroundColor: colors.primary.subtle,
          marginBottom: Tokens.spacing['4'],
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {EMOJIS.map((emoji, index) => (
          <Pressable
            key={index}
            onPress={() => onChange(index)}
            accessibilityLabel={`Selecionar emoção ${emoji}`}
            accessibilityRole="button"
            style={{
              padding: Tokens.spacing['2'],
              borderRadius: Tokens.radius.lg,
              backgroundColor: value === index ? colors.primary.tint : 'transparent',
              minWidth: Tokens.touchTargets.min,
              minHeight: Tokens.touchTargets.min,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 28,
                opacity: value === index ? 1 : 0.4,
              }}
            >
              {emoji}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

