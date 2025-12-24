import React, { Component, ReactNode } from "react";
import { View, Text, Pressable, ScrollView, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logger } from "../utils/logger";
import { Tokens, COLORS, COLORS_DARK } from "../theme/tokens";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Componente interno funcional que renderiza a UI de erro
 * Permite usar hooks (useColorScheme) para dark mode
 */
function ErrorFallbackUI({
  error,
  errorInfo,
  onReset,
}: {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onReset: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Cores adaptadas para o tema
  const colors = isDark ? COLORS_DARK : COLORS;
  const bgColor = colors.background.primary;
  const titleColor = isDark ? Tokens.neutral[900] : Tokens.neutral[800];
  const textColor = isDark ? Tokens.neutral[700] : Tokens.neutral[500];
  const errorColor = Tokens.semantic.light.error;
  const errorBg = Tokens.semantic.light.errorLight;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
        <View style={{ marginBottom: 24 }}>
          <Ionicons name="alert-circle" size={64} color={errorColor} />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: titleColor,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Ops! Algo deu errado
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: textColor,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Encontramos um problema inesperado. Por favor, tente novamente.
        </Text>
        {__DEV__ && error && (
          <View
            style={{
              backgroundColor: errorBg,
              padding: 16,
              borderRadius: 8,
              marginBottom: 24,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: errorColor,
                fontFamily: "monospace",
              }}
            >
              {error.toString()}
            </Text>
            {errorInfo?.componentStack && (
              <Text
                style={{
                  fontSize: 10,
                  color: textColor,
                  fontFamily: "monospace",
                  marginTop: 8,
                }}
              >
                {errorInfo.componentStack}
              </Text>
            )}
          </View>
        )}
        <Pressable
          onPress={onReset}
          style={({ pressed }) => ({
            backgroundColor: errorColor,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              color: Tokens.text.light.inverse,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Tentar novamente
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error("ErrorBoundary caught an error", "ErrorBoundary", error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
