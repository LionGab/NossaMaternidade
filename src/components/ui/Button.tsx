import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { buttonAccessibility } from "../../utils/accessibility";

interface ButtonProps {
  /** Button text label */
  children: string;
  /** Press handler */
  onPress: () => void;
  /**
   * Visual style variant:
   * - accent: Rosa CTA (ação principal, destaque máximo) - texto navy para AAA
   * - primary: Azul pastel (ação primária, calmo)
   * - secondary: Outline azul (ação secundária)
   * - outline: Outline customizável
   * - ghost: Sem fundo (terciário)
   * - soft: Fundo suave azul
   */
  variant?: "accent" | "primary" | "secondary" | "outline" | "ghost" | "soft";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional icon (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Icon position relative to text */
  iconPosition?: "left" | "right";
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom color override (for outline/ghost variants) */
  color?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
  /** Additional style overrides */
  style?: ViewStyle;
}

/**
 * Design System Button Component - Calm FemTech 2025
 *
 * Paleta híbrida: Azul (calma) + Rosa (CTAs)
 *
 * Hierarquia:
 * - accent (rosa): Ação principal, máximo destaque, texto navy (AAA contrast)
 * - primary (azul): Ação primária, tom calmo
 * - secondary (outline): Ação secundária
 * - ghost: Ação terciária
 * - soft: Fundo suave azul
 *
 * @example
 * ```tsx
 * <Button variant="accent" onPress={handleSave}>Salvar</Button>
 * <Button variant="primary" onPress={handleNext}>Próximo</Button>
 * <Button variant="secondary" icon="heart">Favoritar</Button>
 * <Button variant="ghost" onPress={handleCancel}>Cancelar</Button>
 * ```
 */
export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  color,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const { button: buttonTokens, brand, neutral, isDark } = useTheme();

  const handlePress = async () => {
    if (!disabled && !loading) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  // iOS HIG minimum tap target: 44pt for all sizes
  const sizeStyles = useMemo(
    () => ({
      sm: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 14,
        iconSize: 16,
        minHeight: 44, // iOS HIG minimum
      },
      md: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        fontSize: 15,
        iconSize: 18,
        minHeight: 44,
      },
      lg: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        fontSize: 16,
        iconSize: 20,
        minHeight: 52,
      },
    }),
    []
  );

  const variantStyles = useMemo(() => {
    // Get preset tokens for primary/secondary/ghost/soft
    const primary = buttonTokens.primary;
    const secondary = buttonTokens.secondary;
    const ghost = buttonTokens.ghost;
    const soft = buttonTokens.soft;

    return {
      // Rosa CTA - Destaque máximo
      // IMPORTANTE: Texto navy escuro para AAA contrast (não branco!)
      accent: {
        bg: primary.background,
        text: primary.text,
        border: primary.border,
        bgPressed: primary.backgroundPressed,
        bgDisabled: primary.backgroundDisabled,
        textDisabled: primary.textDisabled,
        shadow: {
          shadowColor: brand.accent[400],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 6,
        },
      },
      // Azul pastel - Ação primária (calmo, confiante)
      // Texto branco sobre azul garante contraste adequado
      primary: {
        bg: brand.primary[500],
        text: isDark ? brand.primary[50] : neutral[0],
        border: "transparent",
        bgPressed: brand.primary[600],
        bgDisabled: neutral[200],
        textDisabled: neutral[400],
        shadow: undefined,
      },
      // Outline azul - Ação secundária
      secondary: {
        bg: secondary.background,
        text: secondary.text,
        border: secondary.border,
        bgPressed: secondary.backgroundPressed,
        bgDisabled: secondary.backgroundDisabled,
        textDisabled: secondary.textDisabled,
        shadow: undefined,
        borderWidth: 1.5,  // Thicker border for visibility
      },
      // Outline customizável
      outline: {
        bg: "transparent",
        text: color || secondary.text,
        border: color || secondary.border,
        bgPressed: secondary.backgroundPressed,
        bgDisabled: "transparent",
        textDisabled: neutral[400],
        shadow: undefined,
        borderWidth: 1.5,  // Thicker border for visibility
      },
      // Sem fundo - Terciário
      ghost: {
        bg: ghost.background,
        text: color || ghost.text,
        border: ghost.border,
        bgPressed: ghost.backgroundPressed,
        bgDisabled: ghost.backgroundDisabled,
        textDisabled: ghost.textDisabled,
        shadow: undefined,
      },
      // Fundo suave azul
      soft: {
        bg: soft.background,
        text: color || soft.text,
        border: soft.border,
        bgPressed: soft.backgroundPressed,
        bgDisabled: soft.backgroundDisabled,
        textDisabled: soft.textDisabled,
        shadow: undefined,
      },
    };
  }, [buttonTokens, brand, neutral, isDark, color]);

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];
  const isDisabled = disabled || loading;

  const accessibilityProps = buttonAccessibility(
    accessibilityLabel || children,
    disabled ? "Botão desabilitado" : loading ? "Carregando..." : undefined,
    isDisabled
  );

  return (
    <Pressable
      {...accessibilityProps}
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDisabled
          ? currentVariant.bgDisabled
          : pressed
            ? currentVariant.bgPressed
            : currentVariant.bg,
        borderWidth: currentVariant.border !== "transparent" 
          ? (currentVariant.borderWidth || 1.5) 
          : 0,
        borderColor: currentVariant.border,
        borderRadius: 14,
        paddingVertical: currentSize.paddingVertical,
        paddingHorizontal: currentSize.paddingHorizontal,
        minHeight: currentSize.minHeight,
        opacity: isDisabled ? 0.6 : pressed ? 0.95 : 1,
        transform: pressed && !isDisabled ? [{ scale: 0.98 }] : [{ scale: 1 }],
        width: fullWidth ? "100%" : "auto",
        ...(currentVariant.shadow || {}),
        ...style,
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isDisabled ? currentVariant.textDisabled : currentVariant.text}
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={isDisabled ? currentVariant.textDisabled : currentVariant.text}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={{
              color: isDisabled ? currentVariant.textDisabled : currentVariant.text,
              fontSize: currentSize.fontSize,
              fontWeight: "600",
              fontFamily: "Manrope_600SemiBold",
            }}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={isDisabled ? currentVariant.textDisabled : currentVariant.text}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

/** Legacy export for backward compatibility */
export default Button;
