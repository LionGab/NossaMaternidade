/**
 * ScreenErrorBoundary - Error Boundary específico para telas críticas
 *
 * Diferente do ErrorBoundary global, este permite:
 * - Voltar para a tela inicial
 * - Tentar novamente (reset do erro)
 * - Log específico de tela
 */

import React, { Component, ReactNode } from "react";
import { View, Text, Pressable, ScrollView, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions, NavigationProp } from "@react-navigation/native";
import { logger } from "../utils/logger";
import { Tokens, COLORS, COLORS_DARK } from "../theme/tokens";

interface Props {
  children: ReactNode;
  screenName: string; // Nome da tela para logging
  navigation?: NavigationProp<any>; // Para navegar para Home
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Componente funcional que renderiza a UI de erro da tela
 * Com dark mode support e botões de ação
 */
function ScreenErrorFallbackUI({
  error,
  errorInfo,
  screenName,
  onReset,
  onGoHome,
}: {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  screenName: string;
  onReset: () => void;
  onGoHome?: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = isDark ? COLORS_DARK : COLORS;
  const bgColor = colors.background.primary;
  const titleColor = isDark ? Tokens.neutral[900] : Tokens.neutral[800];
  const textColor = isDark ? Tokens.neutral[700] : Tokens.neutral[500];
  const errorColor = Tokens.semantic.light.error;
  const errorBg = Tokens.semantic.light.errorLight;
  const primaryColor = Tokens.brand.primary[500];

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
          <Ionicons name="warning" size={72} color={errorColor} />
        </View>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: titleColor,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Erro na tela {screenName}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: textColor,
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 24,
          }}
        >
          Encontramos um problema inesperado nesta tela. Você pode tentar novamente ou voltar para o início.
        </Text>

        {/* Development: mostra stack trace */}
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
                marginBottom: 8,
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
                }}
              >
                {errorInfo.componentStack.slice(0, 500)}...
              </Text>
            )}
          </View>
        )}

        {/* Ações */}
        <View style={{ gap: 12, width: "100%" }}>
          {/* Botão: Tentar novamente */}
          <Pressable
            onPress={onReset}
            style={({ pressed }) => ({
              backgroundColor: errorColor,
              paddingHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 12,
              opacity: pressed ? 0.8 : 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            })}
          >
            <Ionicons name="refresh" size={20} color={Tokens.text.light.inverse} />
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

          {/* Botão: Ir para Início (se navigation está disponível) */}
          {onGoHome && (
            <Pressable
              onPress={onGoHome}
              style={({ pressed }) => ({
                backgroundColor: primaryColor,
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              })}
            >
              <Ionicons name="home" size={20} color={Tokens.text.light.inverse} />
              <Text
                style={{
                  color: Tokens.text.light.inverse,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Ir para Início
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * ScreenErrorBoundary - Error Boundary para telas críticas
 *
 * Usage:
 * ```tsx
 * <ScreenErrorBoundary screenName="Comunidade" navigation={navigation}>
 *   <CommunityScreen />
 * </ScreenErrorBoundary>
 * ```
 */
export class ScreenErrorBoundary extends Component<Props, State> {
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
    const { screenName } = this.props;

    // Log estruturado com contexto da tela
    logger.error(
      `ScreenErrorBoundary: erro na tela ${screenName}`,
      "ScreenErrorBoundary",
      error,
      {
        screenName,
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      }
    );

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    logger.info(`ScreenErrorBoundary: tentando novamente na tela ${this.props.screenName}`, "ScreenErrorBoundary");
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    const { navigation, screenName } = this.props;
    if (!navigation) {
      logger.warn("ScreenErrorBoundary: navigation não disponível, não pode ir para Home", "ScreenErrorBoundary");
      return;
    }

    logger.info(`ScreenErrorBoundary: navegando para Home a partir de ${screenName}`, "ScreenErrorBoundary");

    // Reset para a tela Home (primeira tab)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      })
    );

    // Reset state após navegação
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ScreenErrorFallbackUI
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          screenName={this.props.screenName}
          onReset={this.handleReset}
          onGoHome={this.props.navigation ? this.handleGoHome : undefined}
        />
      );
    }

    return this.props.children;
  }
}
