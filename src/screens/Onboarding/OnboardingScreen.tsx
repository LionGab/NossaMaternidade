/**
 * OnboardingScreen - 1ª Experiência (5-7 Perguntas)
 * Promessa: Configuração rápida e emocional para personalizar o app
 *
 * Fluxo:
 * 1. Nome/Apelido (identidade emocional)
 * 2. Fase de vida (mãe ou não mãe)
 * 3. Motivo de entrada (job-to-be-done, multi-select)
 * 4. Estado emocional base
 * 5. Prioridade nº 1
 * 6. Estilo de fala da IA (opcional)
 * 7. Notificações (opcional)
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Sparkles, BellRing } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { Box } from '@/components/primitives/Box';
import { Text } from '@/components/primitives/Text';
import { Heading } from '@/components/primitives/Heading';
import { Tokens } from '@/theme/tokens';
import { onboardingService, type OnboardingData } from '@/services/onboardingService';
import { logger } from '@/utils/logger';
import type { RootStackParamList } from '@/navigation/types';

// ======================
// 🎯 TYPES
// ======================

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface OptionButton {
  value: string;
  emoji: string;
  label: string;
  description?: string;
}

// ======================
// 🧩 ONBOARDING SCREEN
// ======================

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  // ======================
  // 📊 STATE
  // ======================

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [displayName, setDisplayName] = useState('');
  const [lifeStage, setLifeStage] = useState<string | null>(null);
  const [mainGoals, setMainGoals] = useState<string[]>([]);
  const [baselineEmotion, setBaselineEmotion] = useState<string | null>(null);
  const [firstFocus, setFirstFocus] = useState<string | null>(null);
  const [languageTone, setLanguageTone] = useState<string | null>(null);
  const [notificationOptIn, setNotificationOptIn] = useState<boolean | null>(null);

  // ======================
  // 🎨 OPTIONS
  // ======================

  const lifeStageOptions: OptionButton[] = [
    { value: 'pregnant', emoji: '🤰', label: 'Estou grávida' },
    { value: 'has_children', emoji: '👶', label: 'Já tenho filho(s)' },
    { value: 'trying', emoji: '💭', label: 'Estou pensando em ser mãe / tentando' },
    { value: 'caregiver', emoji: '🫶', label: 'Cuido de alguém (sobrinho, afilhado, etc.)' },
    { value: 'self_care', emoji: '💆', label: 'Tô aqui mais por mim mesma' },
  ];

  const mainGoalsOptions: OptionButton[] = [
    { value: 'mental_health', emoji: '🧠', label: 'Cuidar da mente e das emoções' },
    { value: 'routine', emoji: '📅', label: 'Organizar minha rotina e hábitos' },
    { value: 'support', emoji: '💬', label: 'Ter um lugar pra desabafar sem julgamentos' },
    { value: 'content', emoji: '📚', label: 'Receber conteúdos e dicas que façam sentido' },
    { value: 'sleep', emoji: '😴', label: 'Melhorar meu sono / cansaço' },
    { value: 'curiosity', emoji: '✨', label: 'Só curiosidade, quero ver como funciona' },
  ];

  const emotionOptions: OptionButton[] = [
    { value: 'bem', emoji: '😊', label: 'Bem, no geral' },
    { value: 'triste', emoji: '😢', label: 'Triste / sensível' },
    { value: 'ansiosa', emoji: '😰', label: 'Ansiosa / acelerada' },
    { value: 'cansada', emoji: '😴', label: 'Muito cansada / esgotada' },
    { value: 'calma', emoji: '😌', label: 'Calma, mas querendo cuidar mais de mim' },
  ];

  const focusOptions: OptionButton[] = [
    { value: 'emotional_care', emoji: '💙', label: 'Cuidar melhor de mim emocionalmente' },
    { value: 'organization', emoji: '🧩', label: 'Me organizar (rotina, tarefas, vida)' },
    { value: 'reduce_fatigue', emoji: '😴', label: 'Me sentir menos cansada / sobrecarregada' },
    { value: 'community', emoji: '👥', label: 'Me sentir menos sozinha' },
    { value: 'content', emoji: '📚', label: 'Receber conteúdos certos pra minha fase' },
  ];

  const toneOptions: OptionButton[] = [
    { value: 'friendly', emoji: '🤎', label: 'Bem acolhedora, tipo amiga' },
    { value: 'direct', emoji: '🧠', label: 'Com carinho, mas direta ao ponto' },
    { value: 'mentor', emoji: '📋', label: 'Mais séria e organizada, quase como uma mentora' },
  ];

  // ======================
  // 🔄 HANDLERS
  // ======================

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return displayName.trim().length > 0;
      case 2:
        return lifeStage !== null;
      case 3:
        return mainGoals.length > 0 && mainGoals.length <= 3;
      case 4:
        return baselineEmotion !== null;
      case 5:
        return firstFocus !== null;
      case 6:
        return languageTone !== null;
      case 7:
        return notificationOptIn !== null;
      default:
        return false;
    }
  };

  const toggleGoal = (goal: string) => {
    if (mainGoals.includes(goal)) {
      setMainGoals(mainGoals.filter((g) => g !== goal));
    } else {
      if (mainGoals.length < 3) {
        setMainGoals([...mainGoals, goal]);
      }
    }
  };

  const handleFinish = async () => {
    try {
      setLoading(true);

      const data: OnboardingData = {
        display_name: displayName.trim(),
        life_stage_generic: lifeStage!,
        main_goals: mainGoals,
        baseline_emotion: baselineEmotion!,
        first_focus: firstFocus!,
        preferred_language_tone: languageTone,
        notification_opt_in: notificationOptIn ?? false,
      };

      const result = await onboardingService.completeOnboarding(data);

      if (result) {
        // Navigate to main app (Home)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error) {
      logger.error('Failed to complete onboarding', error, { screen: 'OnboardingScreen' });
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 🎨 RENDER STEPS
  // ======================

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Box style={styles.stepContainer}>
            <Heart
              size={48}
              color={colors.primary.main}
              style={{ marginBottom: Tokens.spacing['4'] }}
            />
            <Heading level="h2" style={styles.question}>
              Como você quer que eu te chame aqui dentro?
            </Heading>
            <Text style={styles.description}>
              Seu apelido, nome carinhoso, ou como você preferir 💙
            </Text>
            <TextInput
              style={{
                ...styles.textInput,
                backgroundColor: colors.background.card,
                color: colors.text.primary,
                borderColor: colors.border.light,
              }}
              placeholder="Digite seu nome..."
              placeholderTextColor={colors.text.tertiary}
              value={displayName}
              onChangeText={setDisplayName}
              autoFocus
              maxLength={50}
            />
          </Box>
        );

      case 2:
        return (
          <Box style={styles.stepContainer}>
            <Sparkles
              size={48}
              color={colors.primary.main}
              style={{ marginBottom: Tokens.spacing['4'] }}
            />
            <Heading level="h2" style={styles.question}>
              Em qual dessas fases você se sente hoje?
            </Heading>
            <Box style={styles.optionsContainer}>
              {lifeStageOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={lifeStage === option.value}
                  onPress={() => setLifeStage(option.value)}
                />
              ))}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box style={styles.stepContainer}>
            <Heading level="h2" style={styles.question}>
              O que te trouxe pro Nossa Maternidade hoje?
            </Heading>
            <Text style={styles.description}>
              Escolha até 3 opções que mais fazem sentido pra você
            </Text>
            <Box style={styles.optionsContainer}>
              {mainGoalsOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={mainGoals.includes(option.value)}
                  onPress={() => toggleGoal(option.value)}
                  multiSelect
                />
              ))}
            </Box>
            <Text style={{ ...styles.counter, color: colors.text.secondary }}>
              {mainGoals.length}/3 selecionados
            </Text>
          </Box>
        );

      case 4:
        return (
          <Box style={styles.stepContainer}>
            <Heading level="h2" style={styles.question}>
              E nos últimos dias, você tem se sentido mais…
            </Heading>
            <Box style={styles.optionsContainer}>
              {emotionOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={baselineEmotion === option.value}
                  onPress={() => setBaselineEmotion(option.value)}
                />
              ))}
            </Box>
          </Box>
        );

      case 5:
        return (
          <Box style={styles.stepContainer}>
            <Heading level="h2" style={styles.question}>
              Se eu pudesse te ajudar em uma coisa primeiro, qual seria?
            </Heading>
            <Box style={styles.optionsContainer}>
              {focusOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={firstFocus === option.value}
                  onPress={() => setFirstFocus(option.value)}
                />
              ))}
            </Box>
          </Box>
        );

      case 6:
        return (
          <Box style={styles.stepContainer}>
            <Heading level="h2" style={styles.question}>
              Como você prefere que eu fale com você?
            </Heading>
            <Box style={styles.optionsContainer}>
              {toneOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={languageTone === option.value}
                  onPress={() => setLanguageTone(option.value)}
                />
              ))}
            </Box>
          </Box>
        );

      case 7:
        return (
          <Box style={styles.stepContainer}>
            <BellRing
              size={48}
              color={colors.primary.main}
              style={{ marginBottom: Tokens.spacing['4'] }}
            />
            <Heading level="h2" style={styles.question}>
              Quer que eu te lembre, de vez em quando, de cuidar de você?
            </Heading>
            <Text style={styles.description}>
              Lembretes suaves, sem pressão, só pra te apoiar
            </Text>
            <Box style={styles.optionsContainer}>
              <OptionCard
                option={{ value: 'yes', emoji: '✅', label: 'Sim, pode me lembrar' }}
                selected={notificationOptIn === true}
                onPress={() => setNotificationOptIn(true)}
              />
              <OptionCard
                option={{ value: 'no', emoji: '🤚', label: 'Por enquanto não' }}
                selected={notificationOptIn === false}
                onPress={() => setNotificationOptIn(false)}
              />
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  // ======================
  // 🎨 RENDER
  // ======================

  return (
    <Box
      style={{ ...styles.container, backgroundColor: colors.background.canvas }}
    >
      {/* Progress Bar */}
      <Box style={{ ...styles.progressBarContainer, backgroundColor: `${colors.text.primary}1A` }}>
        <Box
          style={{
            ...styles.progressBar,
            width: `${(currentStep / 7) * 100}%`,
            backgroundColor: colors.primary.main,
          }}
        />
      </Box>

      {/* Step Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <Box style={styles.navigationContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={{
              ...styles.navButton,
              ...styles.backButton,
              backgroundColor: colors.background.card,
              borderColor: colors.border.light,
            }}
            onPress={handleBack}
          >
            <Text style={{ ...styles.backButtonText, color: colors.text.primary }}>
              Voltar
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            ...styles.navButton,
            ...styles.nextButton,
            backgroundColor: canProceed() ? colors.primary.main : colors.background.input,
            flex: currentStep === 1 ? 1 : undefined,
          }}
          onPress={handleNext}
          disabled={!canProceed() || loading}
        >
          <Text
            style={{
              ...styles.nextButtonText,
              color: canProceed() ? colors.text.inverse : colors.text.disabled,
            }}
          >
            {loading ? 'Salvando...' : currentStep === 7 ? 'Começar!' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </Box>

      {/* Step Counter */}
      <Text style={{ ...styles.stepCounter, color: colors.text.tertiary }}>
        {currentStep} de 7
      </Text>
    </Box>
  );
}

// ======================
// 🧩 OPTION CARD COMPONENT
// ======================

interface OptionCardProps {
  option: OptionButton;
  selected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
}

function OptionCard({ option, selected, onPress, multiSelect }: OptionCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={{
        ...styles.optionCard,
        backgroundColor: selected ? colors.background.elevated : colors.background.card,
        borderColor: selected ? colors.primary.main : colors.border.light,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.optionEmoji}>{option.emoji}</Text>
      <Text
        style={{
          ...styles.optionLabel,
          color: selected ? colors.primary.main : colors.text.primary,
        }}
      >
        {option.label}
      </Text>
      {multiSelect && selected && (
        <Box style={{ ...styles.checkmark, backgroundColor: colors.primary.main }}>
          <Text style={{ ...styles.checkmarkText, color: colors.text.inverse }}>✓</Text>
        </Box>
      )}
    </TouchableOpacity>
  );
}

// ======================
// 🎨 STYLES
// ======================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBarContainer: {
    height: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Tokens.spacing['6'],
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    textAlign: 'center',
    marginBottom: Tokens.spacing['3'],
    fontSize: Tokens.typography.sizes['3xl'],
    fontWeight: Tokens.typography.weights.bold,
  },
  description: {
    textAlign: 'center',
    marginBottom: Tokens.spacing['6'],
    fontSize: Tokens.typography.sizes.base,
    fontWeight: Tokens.typography.weights.medium,
  },
  textInput: {
    width: '100%',
    height: Tokens.touchTargets.large + Tokens.spacing['3'],
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    paddingHorizontal: Tokens.spacing['4'],
    fontSize: Tokens.typography.sizes.base,
  },
  optionsContainer: {
    width: '100%',
    gap: Tokens.spacing['3'],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Tokens.spacing['4'],
    borderRadius: Tokens.radius.lg,
    borderWidth: 2,
    minHeight: Tokens.touchTargets.min,
  },
  optionEmoji: {
    fontSize: Tokens.typography.sizes['2xl'],
    marginRight: Tokens.spacing['3'],
  },
  optionLabel: {
    flex: 1,
    fontSize: Tokens.typography.sizes.base,
    fontWeight: Tokens.typography.weights.medium,
  },
  checkmark: {
    width: Tokens.icons.md,
    height: Tokens.icons.md,
    borderRadius: Tokens.icons.md / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: Tokens.typography.sizes.sm,
    fontWeight: Tokens.typography.weights.bold,
  },
  counter: {
    marginTop: Tokens.spacing['2'],
    textAlign: 'center',
    fontSize: 14,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: Tokens.spacing['4'],
    gap: Tokens.spacing['3'],
  },
  navButton: {
    height: 56,
    borderRadius: Tokens.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Tokens.spacing['6'],
  },
  backButton: {
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: Tokens.typography.sizes.base,
    fontWeight: Tokens.typography.weights.semibold,
  },
  nextButton: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: Tokens.typography.sizes.base,
    fontWeight: Tokens.typography.weights.semibold,
  },
  stepCounter: {
    textAlign: 'center',
    paddingBottom: Tokens.spacing['4'],
    fontSize: Tokens.typography.sizes.xs,
  },
});
