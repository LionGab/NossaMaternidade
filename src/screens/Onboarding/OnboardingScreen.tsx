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

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Sparkles, BellRing } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, Animated, TouchableOpacity, Alert } from 'react-native';

import { Box } from '@/components/atoms/Box';
import { HapticButton } from '@/components/atoms/HapticButton';
import { Heading } from '@/components/atoms/Heading';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Text } from '@/components/atoms/Text';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { RootStackParamList } from '@/navigation/types';
import { onboardingService, type OnboardingData } from '@/services/supabase/onboardingService';
import { useTheme } from '@/theme';
import { Tokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

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
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

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
      // Animate fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep((prev) => (prev + 1) as OnboardingStep);
        // Animate fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
    // Note: Step 7 now calls handleFinish directly via onPress
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Animate fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep((prev) => (prev - 1) as OnboardingStep);
        // Animate fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const canProceed = (): boolean => {
    const result = (() => {
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
          // Step 7 (notificações) é opcional - sempre pode prosseguir
          return true;
        default:
          return false;
      }
    })();
    
    logger.debug('[OnboardingScreen] canProceed', { 
      currentStep, 
      result,
      displayName: displayName.trim().length,
      lifeStage,
      mainGoals: mainGoals.length,
      baselineEmotion,
      firstFocus,
      languageTone,
      notificationOptIn,
    });
    
    return result;
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
    logger.info('[OnboardingScreen] handleFinish called', { 
      currentStep,
      displayName: displayName.trim(),
      lifeStage,
      mainGoals,
      baselineEmotion,
      firstFocus,
      languageTone,
      notificationOptIn,
    });
    
    try {
      setLoading(true);

      const data: OnboardingData = {
        display_name: displayName.trim(),
        life_stage_generic: lifeStage!,
        main_goals: mainGoals,
        baseline_emotion: baselineEmotion!,
        first_focus: firstFocus!,
        preferred_language_tone: languageTone ?? undefined,
        notification_opt_in: notificationOptIn ?? false,
      };

      logger.info('[OnboardingScreen] Saving onboarding data...', { data });
      const result = await onboardingService.completeOnboarding(data);
      logger.info('[OnboardingScreen] Onboarding save result', { result });

      // Sempre navegar para Main, mesmo se houver erro ao salvar
      // O serviço sempre retorna true se salvar localmente
      logger.info('[OnboardingScreen] Navigating to Main screen...');
      
      // Usar setTimeout para garantir que o estado seja atualizado antes da navegação
      setTimeout(() => {
        try {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
          logger.info('[OnboardingScreen] Navigation to Main completed');
        } catch (navError) {
          logger.error('[OnboardingScreen] Navigation error', navError);
          // Fallback: tentar navigate em vez de reset
          try {
            navigation.navigate('Main' as never);
            logger.info('[OnboardingScreen] Fallback navigation to Main completed');
          } catch (fallbackError) {
            logger.error('[OnboardingScreen] Fallback navigation also failed', fallbackError);
            Alert.alert(
              'Erro de Navegação',
              'Não foi possível navegar para a tela principal. Por favor, feche e abra o app novamente.',
              [{ text: 'OK' }]
            );
          }
        }
      }, 100);

      if (!result) {
        // Se falhou ao salvar, mostrar aviso mas continuar navegação
        logger.warn('[OnboardingScreen] Onboarding save returned false, but continuing navigation');
        Alert.alert(
          'Atenção',
          'Não foi possível salvar seus dados no momento, mas você pode continuar usando o app.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      logger.error('[OnboardingScreen] Failed to complete onboarding', error);
      
      // Mesmo com erro, tentar navegar
      try {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
        logger.info('[OnboardingScreen] Navigation after error completed');
      } catch (navError) {
        logger.error('[OnboardingScreen] Navigation after error failed', navError);
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao finalizar o onboarding. Por favor, feche e abra o app novamente.',
          [{ text: 'OK' }]
        );
      }
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
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="6" align="center">
                <Heart size={56} color={colors.primary.main} />
              </Box>
              <Heading level="h2" align="center" style={styles.question}>
                Como você quer que eu te chame aqui dentro?
              </Heading>
              <Text 
                variant="body" 
                color="secondary" 
                align="center" 
                style={styles.description}
              >
                Seu apelido, nome carinhoso, ou como você preferir 💙
              </Text>
              <Box mt="6" width="100%">
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
                  accessible={true}
                  accessibilityRole="none"
                  accessibilityLabel="Campo de nome"
                  accessibilityHint="Digite como você quer ser chamada"
                />
              </Box>
            </Box>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="6" align="center">
                <Sparkles size={56} color={colors.primary.main} />
              </Box>
              <Heading level="h2" align="center" style={styles.question}>
                Em qual dessas fases você se sente hoje?
              </Heading>
              <Box style={styles.optionsContainer} mt="6">
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
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Heading level="h2" align="center" style={styles.question}>
                O que te trouxe pro Nossa Maternidade hoje?
              </Heading>
              <Text 
                variant="body" 
                color="secondary" 
                align="center" 
                style={styles.description}
              >
                Escolha até 3 opções que mais fazem sentido pra você
              </Text>
              <Box style={styles.optionsContainer} mt="6">
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
              <Box mt="4" align="center">
                <Text variant="small" color="secondary">
                  {mainGoals.length}/3 selecionados
                </Text>
              </Box>
            </Box>
          </Animated.View>
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
            <Box mb="4" align="center">
              <BellRing
                size={48}
                color={colors.primary.main}
              />
            </Box>
            <Heading level="h2" style={styles.question}>
              Quer que eu te lembre, de vez em quando, de cuidar de você?
            </Heading>
            <Text variant="body" color="secondary" style={styles.description}>
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
    <Box style={{ ...styles.container, backgroundColor: colors.background.canvas }}>
      {/* Header com Theme Toggle */}
      <Box 
        px="4" 
        pt="3" 
        pb="2" 
        direction="row" 
        align="center" 
        justify="space-between"
      >
        <Box style={{ flex: 1 }}>
          <ProgressBar
            current={currentStep}
            total={7}
            color={colors.primary.main}
            height={4}
            animated
          />
        </Box>
        <Box ml="3">
          <ThemeToggle variant="outline" />
        </Box>
      </Box>

      {/* Step Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <Box px="4" pb="4" direction="row">
        {currentStep > 1 && (
          <Box mr="3">
            <HapticButton
              variant="outline"
              size="lg"
              onPress={handleBack}
              style={{ minWidth: 100 }}
            >
              Voltar
            </HapticButton>
          </Box>
        )}

        <Box style={{ flex: currentStep === 1 ? 1 : undefined }}>
          <HapticButton
            variant="primary"
            size="lg"
            onPress={() => {
              logger.info('[OnboardingScreen] Button pressed', {
                currentStep,
                canProceed: canProceed(),
              });
              if (currentStep === 7) {
                logger.info('[OnboardingScreen] Calling handleFinish');
                handleFinish();
              } else {
                logger.info('[OnboardingScreen] Calling handleNext');
                handleNext();
              }
            }}
            disabled={!canProceed() || loading}
            loading={loading}
            fullWidth={currentStep === 1}
            accessibilityLabel={
              currentStep === 7 ? 'Finalizar onboarding e começar a usar o app' : 'Próximo passo'
            }
            accessibilityHint={
              currentStep === 7
                ? 'Salva seus dados e navega para a tela principal'
                : 'Avança para o próximo passo do onboarding'
            }
          >
            {loading ? 'Salvando...' : currentStep === 7 ? 'Começar!' : 'Próximo'}
          </HapticButton>
        </Box>
      </Box>

      {/* Step Counter */}
      <Box
        pb="4"
        align="center"
        accessibilityRole="text"
        accessibilityLabel={`Passo ${currentStep} de 7`}
        accessibilityHint="Indicador de progresso do onboarding"
      >
        <Text variant="small" color="tertiary" align="center">
          {currentStep} de 7
        </Text>
      </Box>
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
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityHint={selected ? 'Selecionado. Toque para desmarcar' : 'Toque para selecionar'}
      accessibilityState={{ selected }}
      style={{
        ...styles.optionCard,
        backgroundColor: selected ? colors.primary.main : colors.background.card,
        borderColor: selected ? colors.primary.main : colors.border.light,
        borderWidth: 2,
        borderRadius: Tokens.radius.lg,
        padding: Tokens.spacing['4'],
        minHeight: Tokens.touchTargets.large,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={{
          fontSize: Tokens.typography.sizes['2xl'],
          marginRight: Tokens.spacing['3'],
        }}
      >
        {option.emoji}
      </Text>
      <Text
        variant="body"
        color={selected ? 'inverse' : 'primary'}
        weight="medium"
        style={{ flex: 1 }}
      >
        {option.label}
      </Text>
      {multiSelect && selected && (
        <Box
          style={{
            width: Tokens.icons.md,
            height: Tokens.icons.md,
            borderRadius: Tokens.icons.md / 2,
            backgroundColor: colors.text.inverse,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: Tokens.typography.sizes.sm,
              color: colors.primary.main,
              fontWeight: Tokens.typography.weights.bold,
            }}
          >
            ✓
          </Text>
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
    width: '100%',
    paddingHorizontal: Tokens.spacing['4'],
  },
  question: {
    marginBottom: Tokens.spacing['4'],
    paddingHorizontal: Tokens.spacing['2'],
  },
  description: {
    marginBottom: Tokens.spacing['6'],
    paddingHorizontal: Tokens.spacing['4'],
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
    minHeight: Tokens.touchTargets.large,
  },
});
