/**
 * Utilitários de Acessibilidade
 * Helpers para garantir WCAG AAA compliance
 */

import { AccessibilityProps } from "react-native";

export interface AccessibilityConfig {
  label: string;
  hint?: string;
  role?: AccessibilityProps["accessibilityRole"];
  state?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
  };
}

/**
 * Cria props de acessibilidade padronizadas
 */
export function createAccessibilityProps(config: AccessibilityConfig): AccessibilityProps {
  const { label, hint, role = "button", state } = config;

  const props: AccessibilityProps = {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: role,
  };

  if (hint) {
    props.accessibilityHint = hint;
  }

  if (state) {
    if (state.disabled !== undefined) {
      props.accessibilityState = { disabled: state.disabled };
    }
    if (state.selected !== undefined) {
      props.accessibilityState = { ...props.accessibilityState, selected: state.selected };
    }
    if (state.checked !== undefined) {
      props.accessibilityState = { ...props.accessibilityState, checked: state.checked };
    }
  }

  return props;
}

/**
 * Helper para botões
 */
export function buttonAccessibility(label: string, hint?: string, disabled?: boolean): AccessibilityProps {
  return createAccessibilityProps({
    label,
    hint,
    role: "button",
    state: { disabled },
  });
}

/**
 * Helper para textos
 */
export function textAccessibility(label: string, role: "text" | "header" = "text"): AccessibilityProps {
  return createAccessibilityProps({
    label,
    role,
  });
}

/**
 * Helper para imagens
 */
export function imageAccessibility(label: string, hint?: string): AccessibilityProps {
  const props: AccessibilityProps = {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: "image",
  };
  if (hint) {
    props.accessibilityHint = hint;
  }
  return props;
}
