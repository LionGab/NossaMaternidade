import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowRight, Check, Sun, ArrowLeft, Heart, Baby, Users, Brain, Bell, Shield } from 'lucide-react-native';
import { UserEmotion, UserStage, UserProfile, UserChallenge, UserSupport, UserNeed } from '../../types/user';
import { Colors } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingFlow() {
  const navigation = useNavigation<any>();
  const { isDark, toggleTheme, colors } = useTheme();

  // Flow Management
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 9;

  // Form Data State
  const [formData, setFormData] = useState<UserProfile>({});

  // Temporary state for timeline slider
  const [sliderValue, setSliderValue] = useState(20);

  const updateData = (key: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Logic to skip timeline screen if not pregnant or new mom
  const nextStep = () => {
    let next = step + 1;

    // Skip Timeline (Step 4) if not applicable
    if (step === 3) {
      const needsTimeline = formData.stage === UserStage.PREGNANT || formData.stage === UserStage.NEW_MOM;
      if (!needsTimeline) next = 5;
    }

    setStep(next);
  };

  const prevStep = () => {
    let prev = step - 1;
    if (step === 5) {
      const needsTimeline = formData.stage === UserStage.PREGNANT || formData.stage === UserStage.NEW_MOM;
      if (!needsTimeline) prev = 3;
    }
    setStep(Math.max(1, prev));
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('nath_user', JSON.stringify(formData));
      navigation.navigate('Main');
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  // --- SUB-COMPONENTS FOR SCREENS ---

  const Header = () => (
    <View className="flex-row justify-between items-center mb-6">
      {step > 1 ? (
        <TouchableOpacity onPress={prevStep} className="p-2 -ml-2">
          <ArrowLeft size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      ) : <View className="w-6" />}

      {step < TOTAL_STEPS && (
        <View className="flex-row gap-1">
          {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
            <View
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: step > i + 1 ? 16 : step === i + 1 ? 16 : 6,
                backgroundColor: step > i + 1 ? colors.primary.main : step === i + 1 ? colors.primary.light : colors.border.light
              }}
            />
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={toggleTheme}
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{
          backgroundColor: colors.background.card,
          borderWidth: 1,
          borderColor: colors.border.light
        }}
      >
        <Sun size={18} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );

  const StepTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <View className="mb-8">
      <Text className="text-2xl font-bold mb-2 leading-tight" style={{ color: colors.text.primary }}>
        {title}
      </Text>
      <Text className="leading-relaxed" style={{ color: colors.text.secondary }}>
        {subtitle}
      </Text>
    </View>
  );

  // 1. WELCOME (After Splash)
  if (step === 1) {
    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <Header />
        <View className="flex-1 justify-center items-center">
          <View className="w-32 h-32 rounded-full p-1 mb-6 relative" style={{ backgroundColor: colors.background.card, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}>
            <Image
              source={{ uri: 'https://i.imgur.com/GDYdiuy.jpg' }}
              className="w-full h-full rounded-full"
              contentFit="cover"
            />
            <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-400" style={{ borderWidth: 4, borderColor: colors.background.canvas }} />
          </View>

          <Text className="text-3xl font-bold text-center mb-3" style={{ color: colors.text.primary }}>
            Oi, que bom que você chegou.
          </Text>

          <Text className="text-lg font-medium text-center italic mb-6 max-w-[300px]" style={{ color: colors.primary.main }}>
            "Aqui, você não precisa fingir que está tudo bem."
          </Text>

          <Text className="text-base text-center mb-8 max-w-[280px]" style={{ color: colors.text.secondary }}>
            Eu sou a MãesValente. Quero criar um espaço seguro para você.{'\n'}Vamos conversar rapidinho?
          </Text>

          <TouchableOpacity
            onPress={nextStep}
            className="w-full py-4 rounded-xl shadow-lg active:scale-95 flex-row items-center justify-center gap-2"
            style={{ backgroundColor: colors.primary.main }}
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-base">Começar agora</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. NAME
  if (step === 2) {
    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <Header />
        <StepTitle
          title="Como você gosta de ser chamada?"
          subtitle="Quero que nossa conversa seja íntima, como amigas."
        />

        <View className="flex-1">
          <TextInput
            autoFocus
            placeholder="Seu nome ou apelido"
            placeholderTextColor={colors.text.tertiary}
            value={formData.name || ''}
            onChangeText={(text) => updateData('name', text)}
            className="w-full px-4 py-6 rounded-xl text-lg"
            style={{
              backgroundColor: colors.background.card,
              borderWidth: 1,
              borderColor: colors.border.light,
              color: colors.text.primary
            }}
          />
        </View>

        <TouchableOpacity
          onPress={nextStep}
          disabled={!formData.name}
          className="w-full py-4 rounded-xl"
          style={{
            backgroundColor: formData.name ? colors.text.primary : colors.border.light,
            opacity: formData.name ? 1 : 0.5
          }}
          activeOpacity={0.9}
        >
          <Text className="text-white font-bold text-center">Continuar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 3. STAGE
  if (step === 3) {
    const stages = Object.values(UserStage);
    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <Header />
        <StepTitle
          title={`Prazer, ${formData.name}! Em que fase você está?`}
          subtitle="Vou adaptar meus conselhos para o seu momento."
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="space-y-3">
            {stages.map((stage) => (
              <TouchableOpacity
                key={stage}
                onPress={() => { updateData('stage', stage); nextStep(); }}
                className="w-full p-5 rounded-xl flex-row items-center justify-between"
                style={{
                  borderWidth: 2,
                  borderColor: formData.stage === stage ? colors.primary.main : colors.border.light,
                  backgroundColor: formData.stage === stage ? colors.primary.light + '20' : colors.background.card
                }}
                activeOpacity={0.9}
              >
                <Text className="font-semibold" style={{ color: formData.stage === stage ? colors.primary.main : colors.text.primary }}>
                  {stage}
                </Text>
                <View
                  className="w-5 h-5 rounded-full items-center justify-center"
                  style={{
                    borderWidth: 2,
                    borderColor: formData.stage === stage ? colors.primary.main : colors.border.light,
                    backgroundColor: formData.stage === stage ? colors.primary.main : 'transparent'
                  }}
                >
                  {formData.stage === stage && <Check size={12} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 4. TIMELINE (Conditional)
  if (step === 4) {
    const isPregnant = formData.stage === UserStage.PREGNANT;
    const maxVal = isPregnant ? 42 : 24; // 42 weeks or 24 months

    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <Header />
        <StepTitle
          title="Conta um pouquinho mais..."
          subtitle={isPregnant ? "Assim te aviso sobre sintomas comuns dessa semana." : "Para acompanhar os saltos de desenvolvimento."}
        />

        <View className="flex-1 justify-center items-center">
          <Text className="text-6xl font-bold mb-2" style={{ color: colors.primary.main }}>
            {sliderValue}
          </Text>
          <Text className="text-gray-500 font-medium mb-12 uppercase tracking-widest text-sm">
            {isPregnant ? 'Semanas' : 'Meses'}
          </Text>

          <View className="w-full">
            {/* React Native Slider - you'll need @react-native-community/slider */}
            <Text className="text-center text-sm" style={{ color: colors.text.secondary }}>
              Use os botões + e - para ajustar
            </Text>
            <View className="flex-row items-center justify-center gap-4 mt-4">
              <TouchableOpacity
                onPress={() => setSliderValue(Math.max(1, sliderValue - 1))}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary.main }}
              >
                <Text className="text-white text-2xl font-bold">-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSliderValue(Math.min(maxVal, sliderValue + 1))}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary.main }}
              >
                <Text className="text-white text-2xl font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            updateData('timelineInfo', `${sliderValue} ${isPregnant ? 'semanas' : 'meses'}`);
            nextStep();
          }}
          className="w-full py-4 rounded-xl"
          style={{ backgroundColor: colors.text.primary }}
          activeOpacity={0.9}
        >
          <Text className="text-white font-bold text-center">Confirmar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 5. FEELING
  if (step === 5) {
    const feelings = Object.values(UserEmotion);
    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <Header />
        <StepTitle
          title="Como você está se sentindo hoje?"
          subtitle="Seja sincera. Aqui é um lugar livre de julgamentos."
        />

        <View className="flex-1 flex-row flex-wrap gap-3">
          {feelings.map((feeling) => (
            <TouchableOpacity
              key={feeling}
              onPress={() => { updateData('currentFeeling', feeling); nextStep(); }}
              className="px-6 py-3 rounded-full"
              style={{
                borderWidth: 1,
                borderColor: formData.currentFeeling === feeling ? Colors.accent.pink : colors.border.light,
                backgroundColor: formData.currentFeeling === feeling ? Colors.accent.pink : colors.background.card
              }}
              activeOpacity={0.9}
            >
              <Text style={{ color: formData.currentFeeling === feeling ? '#FFFFFF' : colors.text.primary }}>
                {feeling}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // 6. BIGGEST CHALLENGE
  if (step === 6) {
    const challenges = Object.values(UserChallenge);
    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <Header />
        <StepTitle
          title="O que mais pesa no seu coração agora?"
          subtitle="Vou priorizar conteúdos para te ajudar nisso."
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="space-y-3">
            {challenges.map((challenge) => (
              <TouchableOpacity
                key={challenge}
                onPress={() => { updateData('biggestChallenge', challenge); nextStep(); }}
                className="w-full p-4 rounded-xl"
                style={{
                  backgroundColor: formData.biggestChallenge === challenge ? colors.text.primary : colors.background.card,
                  borderWidth: 1,
                  borderColor: formData.biggestChallenge === challenge ? colors.text.primary : 'transparent'
                }}
                activeOpacity={0.9}
              >
                <Text style={{ color: formData.biggestChallenge === challenge ? '#FFFFFF' : colors.text.primary }}>
                  {challenge}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 7. SUPPORT NETWORK
  if (step === 7) {
    const options = [
      { val: UserSupport.HIGH, icon: <Users size={24} color={colors.text.primary} />, text: "Tenho, graças a Deus" },
      { val: UserSupport.MEDIUM, icon: <Users size={24} color={colors.text.primary} />, text: "Às vezes/Pouca" },
      { val: UserSupport.LOW, icon: <Heart size={24} color={colors.text.primary} />, text: "Me sinto muito sozinha" },
    ];

    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <Header />
        <StepTitle
          title="Você tem rede de apoio?"
          subtitle="Para eu saber o quanto posso te exigir ou te acolher."
        />

        <View className="flex-1">
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.val}
              onPress={() => { updateData('supportLevel', opt.val); nextStep(); }}
              className="p-6 rounded-2xl mb-4 flex-row items-center gap-4"
              style={{
                borderWidth: 2,
                borderColor: formData.supportLevel === opt.val ? '#A78BFA' : colors.border.light,
                backgroundColor: formData.supportLevel === opt.val ? '#F3E8FF' : colors.background.card
              }}
              activeOpacity={0.9}
            >
              <View className="p-3 rounded-full" style={{ backgroundColor: colors.background.canvas }}>
                {opt.icon}
              </View>
              <Text className="font-bold text-lg flex-1" style={{ color: formData.supportLevel === opt.val ? '#7C3AED' : colors.text.primary }}>
                {opt.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // 8. PRIMARY NEED
  if (step === 8) {
    const needs = [
      { val: UserNeed.CHAT, icon: <Brain size={20} color="#FFFFFF" />, title: "Desabaf", sub: "Conversar com alguém que entenda" },
      { val: UserNeed.LEARN, icon: <Baby size={20} color="#FFFFFF" />, title: "Aprender", sub: "Dicas práticas sobre o bebê" },
      { val: UserNeed.CALM, icon: <Heart size={20} color="#FFFFFF" />, title: "Acalmar", sub: "Respirar e diminuir ansiedade" },
      { val: UserNeed.CONNECT, icon: <Users size={20} color="#FFFFFF" />, title: "Conectar", sub: "Ver relatos de outras mães" },
    ];

    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <Header />
        <StepTitle
          title="O que você mais precisa AGORA?"
          subtitle="Vou configurar sua tela inicial baseada nisso."
        />

        <View className="flex-1">
          {needs.map((n) => (
            <TouchableOpacity
              key={n.val}
              onPress={() => { updateData('primaryNeed', n.val); nextStep(); }}
              className="p-4 rounded-2xl mb-3 flex-row items-center gap-4"
              style={{
                borderWidth: 1,
                borderColor: formData.primaryNeed === n.val ? colors.primary.main : colors.border.light,
                backgroundColor: formData.primaryNeed === n.val ? colors.primary.main : colors.background.card,
                shadowColor: formData.primaryNeed === n.val ? colors.primary.main : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: formData.primaryNeed === n.val ? 8 : 0
              }}
              activeOpacity={0.9}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: formData.primaryNeed === n.val ? 'rgba(255,255,255,0.2)' : colors.primary.light }}
              >
                {React.cloneElement(n.icon, { color: formData.primaryNeed === n.val ? '#FFFFFF' : colors.primary.main })}
              </View>
              <View className="flex-1">
                <Text className="font-bold" style={{ color: formData.primaryNeed === n.val ? '#FFFFFF' : colors.text.primary }}>
                  {n.title}
                </Text>
                <Text className="text-xs" style={{ color: formData.primaryNeed === n.val ? 'rgba(255,255,255,0.7)' : colors.text.secondary }}>
                  {n.sub}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // 9. TERMS, PRIVACY & SUCCESS
  if (step === 9) {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const canProceed = termsAccepted && privacyAccepted;

    const handleFinishWithAcceptance = async () => {
      if (!canProceed) return;

      try {
        // Salvar datas de aceitação
        const now = new Date().toISOString();
        await AsyncStorage.setItem('terms_accepted_date', now);
        await AsyncStorage.setItem('privacy_accepted_date', now);

        handleFinish();
      } catch (error) {
        console.error('Erro ao salvar aceitação:', error);
      }
    };

    return (
      <SafeAreaView className="flex-1 p-6" style={{ backgroundColor: colors.background.canvas }}>
        <TouchableOpacity
          onPress={toggleTheme}
          className="absolute top-6 right-6 w-10 h-10 rounded-full items-center justify-center z-10"
          style={{
            backgroundColor: colors.background.card,
            borderWidth: 1,
            borderColor: colors.border.light
          }}
        >
          <Sun size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingTop: 40 }}
        >
          <View className="w-24 h-24 rounded-full items-center justify-center mb-6" style={{ backgroundColor: '#D1FAE5' }}>
            <Check size={48} color="#10B981" strokeWidth={3} />
          </View>

          <Text className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Tudo pronto, {formData.name?.split(' ')[0]}!
          </Text>

          <Text className="text-center mb-8 max-w-[280px]" style={{ color: colors.text.secondary }}>
            Configurei o app para te ajudar com <Text className="font-bold">{formData.biggestChallenge?.toLowerCase()}</Text>.{'\n'}
            Seu refúgio está preparado.
          </Text>

          {/* Terms & Privacy Acceptance (OBRIGATÓRIO para store compliance) */}
          <View
            className="w-full p-4 rounded-xl mb-4"
            style={{
              backgroundColor: colors.background.card,
              borderWidth: 1,
              borderColor: colors.border.light
            }}
          >
            <Text className="text-sm font-bold mb-3" style={{ color: colors.text.primary }}>
              📋 Antes de começar
            </Text>

            {/* Terms of Service Checkbox */}
            <TouchableOpacity
              onPress={() => setTermsAccepted(!termsAccepted)}
              className="flex-row items-start mb-3"
              activeOpacity={0.7}
            >
              <View
                className="w-5 h-5 rounded mr-3 items-center justify-center mt-0.5"
                style={{
                  backgroundColor: termsAccepted ? colors.primary.main : 'transparent',
                  borderWidth: 2,
                  borderColor: termsAccepted ? colors.primary.main : colors.border.medium
                }}
              >
                {termsAccepted && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <View className="flex-1">
                <Text className="text-xs leading-4" style={{ color: colors.text.secondary }}>
                  Li e aceito os{' '}
                  <Text
                    className="font-bold"
                    style={{ color: colors.primary.main }}
                    onPress={() => navigation.navigate('TermsOfService' as never)}
                  >
                    Termos de Serviço
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>

            {/* Privacy Policy Checkbox */}
            <TouchableOpacity
              onPress={() => setPrivacyAccepted(!privacyAccepted)}
              className="flex-row items-start"
              activeOpacity={0.7}
            >
              <View
                className="w-5 h-5 rounded mr-3 items-center justify-center mt-0.5"
                style={{
                  backgroundColor: privacyAccepted ? colors.primary.main : 'transparent',
                  borderWidth: 2,
                  borderColor: privacyAccepted ? colors.primary.main : colors.border.medium
                }}
              >
                {privacyAccepted && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <View className="flex-1">
                <Text className="text-xs leading-4" style={{ color: colors.text.secondary }}>
                  Li e aceito a{' '}
                  <Text
                    className="font-bold"
                    style={{ color: colors.primary.main }}
                    onPress={() => navigation.navigate('PrivacyPolicy' as never)}
                  >
                    Política de Privacidade
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>

            {!canProceed && (
              <Text className="text-[10px] mt-2" style={{ color: colors.raw.warning[500] }}>
                ⚠️ É necessário aceitar os termos para continuar
              </Text>
            )}
          </View>

          {/* Notification Permission Card */}
          <View
            className="p-4 rounded-xl w-full mb-8 flex-row items-center gap-3"
            style={{
              backgroundColor: colors.background.card,
              borderWidth: 1,
              borderColor: colors.border.light
            }}
          >
            <View className="p-2 rounded-full" style={{ backgroundColor: '#FED7AA' }}>
              <Bell size={20} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold" style={{ color: colors.text.primary }}>
                Lembretes de autocuidado
              </Text>
              <Text className="text-[10px]" style={{ color: colors.text.tertiary }}>
                Posso te mandar um carinho por dia?
              </Text>
            </View>
            <Switch
              value={formData.notificationsEnabled || false}
              onValueChange={(value) => updateData('notificationsEnabled', value)}
              trackColor={{ false: colors.border.light, true: colors.primary.main }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleFinishWithAcceptance}
            disabled={!canProceed}
            className="w-full py-4 rounded-xl shadow-lg flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: canProceed ? colors.primary.main : colors.border.medium,
              opacity: canProceed ? 1 : 0.5
            }}
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-base">Entrar na minha casa</Text>
            <Shield size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row items-center gap-1 mt-4">
            <Shield size={10} color={colors.text.tertiary} />
            <Text className="text-[10px]" style={{ color: colors.text.tertiary }}>
              Seus dados estão seguros comigo.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}
