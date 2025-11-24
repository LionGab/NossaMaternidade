/**
 * Error Boundary component to catch React errors
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const isDevelopment = process.env.NODE_ENV === 'development' || __DEV__;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView
            className="flex-1"
            contentContainerClassName="items-center justify-center p-6"
          >
            <View className="items-center">
              <Ionicons name="warning-outline" size={64} color="#FF6B6B" />
              
              <Text className="text-2xl font-bold text-gray-900 mt-6 text-center">
                Algo deu errado
              </Text>
              
              <Text className="text-base text-gray-600 mt-4 text-center">
                Ocorreu um erro inesperado. Por favor, tente novamente.
              </Text>

              {isDevelopment && this.state.error && (
                <View className="mt-6 p-4 bg-gray-100 rounded-lg w-full">
                  <Text className="text-sm font-mono text-gray-800 mb-2">
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text className="text-xs font-mono text-gray-600">
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity
                onPress={this.handleReset}
                className="mt-8 bg-blue-500 px-8 py-4 rounded-full"
                activeOpacity={0.7}
              >
                <Text className="text-white font-semibold text-base">
                  Tentar Novamente
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default ErrorBoundary;

