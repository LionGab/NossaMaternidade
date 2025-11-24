import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Eye, EyeOff, ChevronLeft, Sun, Moon, Apple } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onLogin?: () => void;
  onBack?: () => void;
}

export default function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const navigation = useNavigation<any>();
  const { isDark, toggleTheme, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha e-mail e senha');
      return;
    }

    setIsLoading(true);
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Verificar se usuário já completou onboarding
      const savedUser = await AsyncStorage.getItem('nath_user');
      
      if (onLogin) {
        onLogin();
      } else if (savedUser) {
        // Se já completou onboarding, vai direto para Main
        navigation.navigate('Main');
      } else {
        // Se não completou, vai para Onboarding
        navigation.navigate('Onboarding');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'apple' | 'google') => {
    setIsLoading(true);
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Verificar se usuário já completou onboarding
      const savedUser = await AsyncStorage.getItem('nath_user');
      
      if (savedUser) {
        navigation.navigate('Main');
      } else {
        navigation.navigate('Onboarding');
      }
    } catch (error) {
      console.error(`Erro no login ${provider}:`, error);
      Alert.alert('Erro', `Não foi possível fazer login com ${provider === 'apple' ? 'Apple' : 'Google'}. Tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar senha',
      'Funcionalidade em desenvolvimento. Em breve você poderá recuperar sua senha por e-mail.',
      [{ text: 'OK' }]
    );
  };

  const handleSignUp = () => {
    navigation.navigate('Onboarding');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: colors.text.primary
            }}
            activeOpacity={0.9}
          >
            <ChevronLeft size={20} color={colors.background.canvas} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleTheme}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.background.card,
              borderWidth: 1,
              borderColor: colors.border.light
            }}
          >
            {isDark ? <Sun size={20} color={colors.text.primary} /> : <Moon size={20} color={colors.text.primary} />}
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              overflow: 'hidden',
              marginBottom: 16,
              backgroundColor: isDark ? colors.background.card : colors.primary.light,
              borderWidth: 4,
              borderColor: isDark ? colors.border.dark : colors.background.card,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8
            }}
          >
            <Image
              source={{ uri: 'https://i.imgur.com/GDYdiuy.jpg' }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: colors.text.primary }}>
            Bem-vinda de volta
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center', color: colors.text.secondary }}>
            Entre para acessar seu espaço seguro.
          </Text>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1, color: colors.text.secondary }}>
            E-mail
          </Text>
          <TextInput
            placeholder="exemplo@email.com"
            placeholderTextColor={colors.text.tertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderRadius: 12,
              fontSize: 14,
              backgroundColor: colors.background.card,
              borderWidth: 1,
              borderColor: colors.border.light,
              color: colors.text.primary
            }}
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 1, color: colors.text.secondary }}>
            Senha
          </Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={colors.text.tertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={{
                width: '100%',
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 12,
                fontSize: 14,
                backgroundColor: colors.background.card,
                borderWidth: 1,
                borderColor: colors.border.light,
                color: colors.text.primary
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 12, top: 16, padding: 4 }}
            >
              {showPassword ? (
                <EyeOff size={18} color={colors.text.tertiary} />
              ) : (
                <Eye size={18} color={colors.text.tertiary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.primary.main }}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            paddingVertical: 16,
            borderRadius: 12,
            marginBottom: 24,
            backgroundColor: colors.primary.main,
            opacity: isLoading ? 0.7 : 1
          }}
          activeOpacity={0.9}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.inverse} />
          ) : (
            <Text style={{ color: colors.text.inverse, fontWeight: 'bold', textAlign: 'center' }}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <View style={{ height: 1, flex: 1, backgroundColor: colors.border.light }} />
          <Text style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, color: colors.text.tertiary }}>
            Ou continue com
          </Text>
          <View style={{ height: 1, flex: 1, backgroundColor: colors.border.light }} />
        </View>

        {/* Social Login */}
        <View style={{ marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => handleSocialLogin('apple')}
            disabled={isLoading}
            style={{
              width: '100%',
              paddingVertical: 16,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 12,
              backgroundColor: colors.background.card,
              borderWidth: 1,
              borderColor: colors.border.light,
              opacity: isLoading ? 0.7 : 1
            }}
            activeOpacity={0.9}
          >
            <Apple size={20} color={colors.text.primary} />
            <Text style={{ fontWeight: '600', color: colors.text.primary }}>
              Continuar com Apple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialLogin('google')}
            disabled={isLoading}
            style={{
              width: '100%',
              paddingVertical: 16,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: colors.background.card,
              borderWidth: 1,
              borderColor: colors.border.light,
              opacity: isLoading ? 0.7 : 1
            }}
            activeOpacity={0.9}
          >
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.raw.primary[400] }} />
            <Text style={{ fontWeight: '600', color: colors.text.primary }}>
              Continuar com Google
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSignUp}>
          <Text style={{ textAlign: 'center', fontSize: 12, color: colors.text.tertiary }}>
            Ainda não tem conta?{' '}
            <Text style={{ fontWeight: 'bold', color: colors.secondary.main }}>
              Criar agora
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
