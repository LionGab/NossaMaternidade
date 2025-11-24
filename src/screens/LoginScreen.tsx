import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Avatar } from '../components';
import { Colors } from '../constants/Colors';
import { useHaptics } from '../hooks/useHaptics';
import { Ionicons } from '@expo/vector-icons';
import { nathAvatar } from '../assets/images';

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
}

export default function LoginScreen({
  onLogin,
  onSignUp,
  onForgotPassword,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const haptics = useHaptics();

  const handleLogin = () => {
    haptics.light();
    onLogin();
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.background.dark }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4">
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Avatar
          size={40}
          source={nathAvatar}
          onPress={() => {
            // Abrir menu de perfil ou configurações
          }}
        />
      </View>

      {/* Content */}
      <View className="flex-1 items-center px-8 pt-8">
        {/* Profile Picture - Nathália Valente */}
        <Avatar
          size={128}
          source={nathAvatar}
        />

        {/* Welcome Text */}
        <Text
          className="text-2xl font-bold text-center mb-2"
          style={{ color: Colors.text.primary }}
        >
          Bem-vinda de volta
        </Text>
        <Text
          className="text-base text-center mb-8"
          style={{ color: Colors.text.secondary }}
        >
          Entre para acessar seu espaço seguro.
        </Text>

        {/* Inputs */}
        <Input
          label="E-MAIL"
          value={email}
          onChangeText={setEmail}
          placeholder="exemplo@email.com"
          placeholderTextColor={Colors.text.tertiary}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={{ width: '100%', marginBottom: 16 }}
        />

        <View className="w-full mb-2">
          <Input
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.text.tertiary}
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
            }
            containerStyle={{ marginBottom: 0 }}
          />
          <TouchableOpacity
            onPress={onForgotPassword}
            className="self-end mt-2"
          >
            <Text
              className="text-sm"
              style={{ color: Colors.primary.main }}
            >
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <Button
          title="Entrar"
          onPress={handleLogin}
          fullWidth
          className="mb-6"
        />

        {/* Divider */}
        <View className="flex-row items-center w-full mb-6">
          <View
            className="flex-1 h-px"
            style={{ backgroundColor: Colors.border.light }}
          />
          <Text
            className="px-4 text-sm"
            style={{ color: Colors.text.secondary }}
          >
            OU CONTINUE COM
          </Text>
          <View
            className="flex-1 h-px"
            style={{ backgroundColor: Colors.border.light }}
          />
        </View>

        {/* Social Login */}
        <TouchableOpacity
          className="w-full flex-row items-center justify-center p-4 rounded-xl mb-3 border"
          style={{
            backgroundColor: Colors.background.card,
            borderColor: Colors.border.light,
          }}
        >
          <Ionicons name="logo-apple" size={24} color={Colors.text.primary} />
          <Text
            className="ml-3 text-base font-semibold"
            style={{ color: Colors.text.primary }}
          >
            Continuar com Apple
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full flex-row items-center justify-center p-4 rounded-xl mb-6 border"
          style={{
            backgroundColor: Colors.background.card,
            borderColor: Colors.border.light,
          }}
        >
          <Ionicons name="logo-google" size={24} color={Colors.text.primary} />
          <Text
            className="ml-3 text-base font-semibold"
            style={{ color: Colors.text.primary }}
          >
            Continuar com Google
          </Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row items-center">
          <Text
            className="text-sm"
            style={{ color: Colors.text.secondary }}
          >
            Ainda não tem conta?{' '}
          </Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text
              className="text-sm font-bold"
              style={{ color: Colors.primary.main }}
            >
              Criar agora
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

