import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Eye, EyeOff, ChevronLeft, Sun, Moon, Apple } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

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
    setIsLoading(true);
    // Simula delay de rede
    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) {
        onLogin();
      } else {
        // Check if user has completed onboarding
        navigation.navigate('Onboarding');
      }
    }, 1200);
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
              backgroundColor: isDark ? '#FFFFFF' : '#000000'
            }}
            activeOpacity={0.9}
          >
            <ChevronLeft size={20} color={isDark ? '#000000' : '#FFFFFF'} />
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
              borderColor: isDark ? colors.border.dark : '#FFFFFF',
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
          <TouchableOpacity>
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
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Entrar</Text>
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
            onPress={handleLogin}
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
              borderColor: colors.border.light
            }}
            activeOpacity={0.9}
          >
            <Apple size={20} color={colors.text.primary} />
            <Text style={{ fontWeight: '600', color: colors.text.primary }}>
              Continuar com Apple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
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
              borderColor: colors.border.light
            }}
            activeOpacity={0.9}
          >
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#4285F4' }} />
            <Text style={{ fontWeight: '600', color: colors.text.primary }}>
              Continuar com Google
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: 'center', fontSize: 12, color: colors.text.tertiary }}>
          Ainda não tem conta?{' '}
          <Text style={{ fontWeight: 'bold', color: Colors.accent.pink }}>
            Criar agora
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
