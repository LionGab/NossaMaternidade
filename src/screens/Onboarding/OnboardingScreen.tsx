/**
 * OnboardingScreen - 1ª Experiência (4 Perguntas)
 * Promessa: Configuração rápida e emocional para personalizar o app
 *
 * Fluxo:
 * 1. Nome/Apelido (identidade emocional)
 * 2. Fase de vida (mãe ou não mãe)
 * 3. Detalhe rápido da fase (condicional, 1 passo)
 * 4. Motivo de entrada (job-to-be-done, multi-select)
 *
 * Itens movidos para progressive profiling (pós-primeiro valor):
 * - Emoção base, foco #1, tom da IA, notificações
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, Sparkles, Baby } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, Animated, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

type OnboardingStep = 1 | 2 | 3 | 4;

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
  const [stageDetail, setStageDetail] = useState<string | null>(null);
  const [pregnancyWeeks, setPregnancyWeeks] = useState<number | null>(null);
  const [babyAgeMonths, setBabyAgeMonths] = useState<number | null>(null);
  const [mainGoals, setMainGoals] = useState<string[]>([]);

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

  const baseMainGoalsOptions: OptionButton[] = [
    { value: 'mental_health', emoji: '🧠', label: 'Cuidar da mente e das emoções' },
    { value: 'routine', emoji: '📅', label: 'Organizar minha rotina e hábitos' },
    { value: 'support', emoji: '💬', label: 'Ter um lugar pra desabafar sem julgamentos' },
    { value: 'content', emoji: '📚', label: 'Receber conteúdos e dicas que façam sentido' },
    { value: 'sleep', emoji: '😴', label: 'Melhorar meu sono / cansaço' },
    { value: 'curiosity', emoji: '✨', label: 'Só curiosidade, quero ver como funciona' },
  ];

  const stageDetailOptionsByLifeStage: Record<string, OptionButton[]> = {
    pregnant: [
      { value: 'weeks_1_12', emoji: '🌱', label: '1–12 semanas' },
      { value: 'weeks_13_26', emoji: '🌿', label: '13–26 semanas' },
      { value: 'weeks_27_42', emoji: '🌸', label: '27–42 semanas' },
    ],
    has_children: [
      { value: 'baby_newborn', emoji: '🍼', label: 'Recém-nascido' },
      { value: 'baby_0_3', emoji: '👶', label: '0–3 meses' },
      { value: 'baby_4_6', emoji: '🧸', label: '4–6 meses' },
      { value: 'baby_7_12', emoji: '🧩', label: '7–12 meses' },
      { value: 'baby_13_24', emoji: '🚼', label: '1–2 anos' },
      { value: 'baby_25_plus', emoji: '🌟', label: '3+ anos' },
    ],
  };

  // ======================
  // 🔄 HANDLERS
  // ======================

  const handleNext = () => {
    if (currentStep < 4) {
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
          // Step 3 é condicional. Para fases sem detalhe, pode prosseguir.
          if (lifeStage === 'pregnant') return pregnancyWeeks !== null;
          if (lifeStage === 'has_children') return babyAgeMonths !== null;
          return true;
        case 4:
          return mainGoals.length > 0 && mainGoals.length <= 3;
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
      pregnancyWeeks,
      babyAgeMonths,
    });
    
    return result;
  };

  const getMainGoalsOptions = (): OptionButton[] => {
    // Adicionar opções “maternidade real” apenas quando fizer sentido (sem poluir)
    const extra: OptionButton[] = [];
    if (lifeStage === 'has_children') {
      extra.push(
        { value: 'baby_sleep', emoji: '😴', label: 'Sono do bebê / rotina do bebê' },
        { value: 'feeding', emoji: '🍼', label: 'Amamentação / alimentação' }
      );
    }
    if (lifeStage === 'pregnant') {
      extra.push({ value: 'feeding', emoji: '🍼', label: 'Amamentação / alimentação (me preparar)' });
    }
    return [...extra, ...baseMainGoalsOptions];
  };

  const toggleGoal = (goal: string) => {
    if (mainGoals.includes(goal)) {
      setMainGoals(mainGoals.filter((g) => g !== goal));
    } else {
      if (mainGoals.length < 3) {
        setMainGoals([...mainGoals, goal]);
      } else {
        Alert.alert('Limite de escolhas', 'Você pode escolher até 3 opções.');
      }
    }
  };

  const handleFinish = async () => {
    logger.info('[OnboardingScreen] handleFinish called', { 
      currentStep,
      displayName: displayName.trim(),
      lifeStage,
      stageDetail,
      pregnancyWeeks,
      babyAgeMonths,
      mainGoals,
    });
    
    try {
      setLoading(true);

      const data: OnboardingData = {
        display_name: displayName.trim(),
        life_stage_generic: lifeStage!,
        main_goals: mainGoals,
        preferred_language_tone: 'friendly',
        notification_opt_in: false,
        weeks: pregnancyWeeks ?? undefined,
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

      if (!result.success) {
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
                    onPress={() => {
                      setLifeStage(option.value);
                      // Resetar detalhe ao trocar fase
                      setStageDetail(null);
                      setPregnancyWeeks(null);
                      setBabyAgeMonths(null);
                    }}
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
              <Box mb="6" align="center">
                <Baby size={56} color={colors.primary.main} />
              </Box>
              <Heading level="h2" align="center" style={styles.question}>
                Só pra eu acertar melhor…
              </Heading>
              <Text variant="body" color="secondary" align="center" style={styles.description}>
                {lifeStage === 'pregnant'
                  ? 'Em que período da gestação você está?'
                  : lifeStage === 'has_children'
                    ? 'Qual a idade do(a) mais novo(a)?'
                    : 'Você pode pular esse passo.'}
              </Text>

              <Box style={styles.optionsContainer} mt="6">
                {(lifeStage && stageDetailOptionsByLifeStage[lifeStage]
                  ? stageDetailOptionsByLifeStage[lifeStage]
                  : [
                      { value: 'skip', emoji: '➡️', label: 'Continuar' },
                    ]
                ).map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    selected={stageDetail === option.value || (option.value === 'skip' && stageDetail === null)}
                    onPress={() => {
                      setStageDetail(option.value === 'skip' ? null : option.value);
                      if (lifeStage === 'pregnant') {
                        const weeks =
                          option.value === 'weeks_1_12'
                            ? 8
                            : option.value === 'weeks_13_26'
                              ? 20
                              : option.value === 'weeks_27_42'
                                ? 32
                                : null;
                        setPregnancyWeeks(weeks);
                      }
                      if (lifeStage === 'has_children') {
                        const months =
                          option.value === 'baby_newborn'
                            ? 0
                            : option.value === 'baby_0_3'
                              ? 2
                              : option.value === 'baby_4_6'
                                ? 5
                                : option.value === 'baby_7_12'
                                  ? 9
                                  : option.value === 'baby_13_24'
                                    ? 18
                                    : option.value === 'baby_25_plus'
                                      ? 36
                                      : null;
                        setBabyAgeMonths(months);
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Heading level="h2" align="center" style={styles.question}>
                O que te trouxe pro Nossa Maternidade hoje?
              </Heading>
              <Text variant="body" color="secondary" align="center" style={styles.description}>
                Escolha até 3 opções que mais fazem sentido pra você
              </Text>
              <Box style={styles.optionsContainer} mt="6">
                {getMainGoalsOptions().map((option) => (
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

      default:
        return null;
    }
  };

  // ======================
  // 🎨 RENDER
  // ======================

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      edges={['top', 'bottom']}
    >
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
            total={4}
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepContent()}
      </ScrollView>

      {/* Bottom Section - Fixed */}
      <Box>
        {/* Navigation Buttons */}
        <Box
          px="6"
          py="4"
          direction="row"
          justify={currentStep === 1 ? "center" : "space-between"}
          width="100%"
          align="center"
        >
          {currentStep > 1 && (
            <HapticButton
              variant="outline"
              size="lg"
              onPress={handleBack}
              style={{ minWidth: 100 }}
            >
              Voltar
            </HapticButton>
          )}

          <HapticButton
            variant="tertiary"
            size="lg"
            onPress={() => {
              logger.info('[OnboardingScreen] Button pressed', {
                currentStep,
                canProceed: canProceed(),
              });
              if (currentStep === 4) {
                logger.info('[OnboardingScreen] Calling handleFinish');
                handleFinish();
              } else {
                logger.info('[OnboardingScreen] Calling handleNext');
                handleNext();
              }
            }}
            disabled={!canProceed() || loading}
            loading={loading}
            style={currentStep === 1 ? { width: '100%' } : { minWidth: 100 }}
            accessibilityLabel={
              currentStep === 4 ? 'Finalizar onboarding e começar a usar o app' : 'Próximo passo'
            }
            accessibilityHint={
              currentStep === 4
                ? 'Salva seus dados e navega para a tela principal'
                : 'Avança para o próximo passo do onboarding'
            }
          >
            {loading ? 'Salvando...' : currentStep === 4 ? 'Começar!' : 'Próximo'}
          </HapticButton>
        </Box>

        {/* Step Counter */}
        <Box
          pb="4"
          align="center"
          accessibilityRole="text"
          accessibilityLabel={`Passo ${currentStep} de 4`}
          accessibilityHint="Indicador de progresso do onboarding"
        >
          <Text variant="small" color="tertiary" align="center">
            {currentStep} de 4
          </Text>
        </Box>
      </Box>
    </SafeAreaView>
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
    padding: Tokens.spacing['6'],
    minHeight: '100%',
  },
  stepContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Tokens.spacing['4'],
    paddingVertical: Tokens.spacing['8'],
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
