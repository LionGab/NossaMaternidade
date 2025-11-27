# 📱 Adaptação para Mobile Nativo (iOS/Android)

**Data:** 27 de novembro de 2025  
**Objetivo:** Garantir que todos os componentes funcionem nativamente em iOS e Android

---

## ⚠️ Diferenças Web vs Mobile

### Componentes Web → React Native

| Web | React Native | Notas |
|-----|--------------|-------|
| `<button>` | `<Pressable>` ou `<TouchableOpacity>` | Pressable é mais moderno |
| `<input>` | `<TextInput>` | Props diferentes |
| `<div>` | `<View>` | Sempre usar View |
| `<img>` | `<Image>` | Requer `source` prop |
| `className` | `style` | Não há classes CSS |
| `onClick` | `onPress` | Event handler diferente |
| `hover:` | Não existe | Usar `pressed` state |

---

## 🔄 Componentes a Adaptar

### 1. Button.tsx

**Status:** ⚠️ Precisa adaptação

**Problemas atuais:**
- Usa `TouchableOpacity` (OK, mas `Pressable` é melhor)
- Não tem haptic feedback
- Não usa safe areas

**Solução:**

```typescript
import { Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDERS, SIZES } from '@/design-system';
import { useTheme } from '@/theme/ThemeContext';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const handlePress = () => {
    if (!disabled && !loading) {
      // Haptic feedback (iOS/Android)
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress?.();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          // Estilos base
          borderRadius: BORDERS.buttonRadius,
          minHeight: SIZES.button[size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium'],
          paddingHorizontal: SPACING[6],
          paddingVertical: SPACING[3],
          backgroundColor: variant === 'primary' ? COLORS.primary[500] : 'transparent',
          // Feedback visual nativo
          opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        fullWidth && { width: '100%' },
        props.style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.neutral[0]} />
      ) : (
        <Text style={{ color: COLORS.neutral[0], ...TYPOGRAPHY.button }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};
```

---

### 2. Input.tsx

**Status:** ⚠️ Precisa adaptação

**Problemas atuais:**
- Não existe no projeto atual (só no app de referência)
- Precisa ser criado para React Native

**Solução:**

```typescript
import { TextInput, View, Text, Platform } from 'react-native';
import { COLORS, SPACING, BORDERS, TYPOGRAPHY } from '@/design-system';
import { useTheme } from '@/theme/ThemeContext';
import { KeyboardAvoidingView } from 'react-native';

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ marginBottom: SPACING[4] }}>
        {label && (
          <Text style={{
            fontSize: TYPOGRAPHY.label.fontSize,
            fontWeight: TYPOGRAPHY.label.fontWeight,
            color: colors.text.secondary,
            marginBottom: SPACING[2],
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {label}
          </Text>
        )}
        <View style={{ position: 'relative' }}>
          {icon && (
            <View style={{
              position: 'absolute',
              left: SPACING[4],
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              zIndex: 1,
            }}>
              {icon}
            </View>
          )}
          <TextInput
            style={{
              height: 48, // Touch target mínimo
              borderRadius: BORDERS.inputRadius,
              backgroundColor: colors.background.input,
              borderWidth: 2,
              borderColor: error ? COLORS.semantic.danger : 'transparent',
              paddingHorizontal: icon ? SPACING[11] : SPACING[4],
              paddingVertical: SPACING[3],
              fontSize: TYPOGRAPHY.input.fontSize,
              color: colors.text.primary,
              ...(Platform.OS === 'ios' && {
                paddingVertical: SPACING[4],
              }),
            }}
            placeholderTextColor={colors.text.tertiary}
            returnKeyType="done"
            autoComplete="off"
            autoCorrect={false}
            {...props}
          />
        </View>
        {error && (
          <Text style={{
            fontSize: TYPOGRAPHY.caption.fontSize,
            color: COLORS.semantic.danger,
            marginTop: SPACING[1],
          }}>
            {error}
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
```

---

### 3. Card.tsx

**Status:** ✅ Já adaptado (usa SafeView)

**Melhorias sugeridas:**
- Adicionar haptic feedback ao pressionar
- Melhorar shadow para mobile

```typescript
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

export const Card: React.FC<CardProps> = ({
  pressable,
  onPress,
  ...props
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  if (pressable || onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          baseStyles,
          pressed && { opacity: 0.9 },
        ]}
      >
        {/* Conteúdo */}
      </Pressable>
    );
  }

  return <View style={baseStyles}>{/* Conteúdo */}</View>;
};
```

---

### 4. ThemeToggle.tsx

**Status:** ✅ Já adaptado (usa TouchableOpacity)

**Melhorias:**
- Adicionar haptic feedback
- Melhorar animação nativa

```typescript
import * as Haptics from 'expo-haptics';
import { Animated } from 'react-native';

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  ...props
}) => {
  const { isDark, toggleTheme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animação nativa
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable onPress={handlePress} style={containerStyle}>
        {/* Ícone */}
      </Pressable>
    </Animated.View>
  );
};
```

---

## 📐 Layout Components

### ScreenLayout

**Status:** ✅ Já usa SafeAreaView

**Verificar:**
- Safe areas estão corretas
- ScrollView funciona bem

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

export function ScreenLayout({ children, ...props }) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      edges={['top', 'left', 'right']} // Não incluir 'bottom' se tiver tab bar
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## 🎨 Design Tokens - Mobile

### Shadows (React Native)

**Problema:** Web usa `boxShadow`, mobile usa `shadowColor`, `shadowOffset`, etc.

**Solução:**

```typescript
// src/design-system/shadows.ts
import { Platform } from 'react-native';

export const createShadow = (elevation: number, color: string = '#000') => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: 0.1,
      shadowRadius: elevation,
    };
  } else {
    return {
      elevation,
    };
  }
};

export const SHADOWS = {
  sm: createShadow(2),
  md: createShadow(4),
  lg: createShadow(8),
  premium: createShadow(10, COLORS.primary[500]),
};
```

---

### Border Radius

**Status:** ✅ Já implementado

**Verificar:**
- Valores são adequados para mobile
- Não usar valores muito grandes (performance)

---

## 🔧 Utilitários Mobile

### useSafeAreaPadding

```typescript
// src/hooks/useSafeAreaPadding.ts
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSafeAreaPadding = () => {
  const insets = useSafeAreaInsets();
  
  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  };
};
```

### useHaptics

```typescript
// src/hooks/useHaptics.ts
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const useHaptics = () => {
  const light = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const success = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return { light, success };
};
```

---

## ✅ Checklist de Adaptação

### Componentes

- [ ] Button - Adicionar haptic + Pressable
- [ ] Input - Criar componente React Native
- [ ] Card - Adicionar haptic
- [ ] ThemeToggle - Melhorar animação
- [ ] Text - Verificar fontes nativas
- [ ] Heading - Verificar fontes nativas

### Layout

- [ ] ScreenLayout - Verificar safe areas
- [ ] TabNavigator - Configurar safe area bottom
- [ ] Modal - Usar Modal nativo

### Design Tokens

- [ ] Shadows - Criar helper para mobile
- [ ] Colors - Verificar contraste em mobile
- [ ] Typography - Fontes nativas

### Performance

- [ ] Usar `useNativeDriver: true` em animações
- [ ] Lazy loading de imagens
- [ ] Memoização de componentes pesados

---

## 🚀 Próximos Passos

1. **Adaptar Button** para usar Pressable + haptic
2. **Criar Input** nativo
3. **Melhorar shadows** para mobile
4. **Testar em dispositivos** reais
5. **Otimizar performance**

---

**Componentes adaptados para mobile nativo!** 📱

