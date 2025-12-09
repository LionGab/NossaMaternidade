/**
 * OnboardingScreenEnhanced - Sophisticated 15-Step Experience
 *
 * Based on research from leading maternal health apps:
 * - Flo: 70 questions across 5 health areas
 * - Ovia: Daily habits and symptom tracking
 * - Clinical PHQ-2 and GAD-2 mental health screening
 * - EMA (Ecological Momentary Assessment) principles
 *
 * Flow (15 steps):
 * 1. Nome/Apelido
 * 2. Fase de vida
 * 3. Objetivos principais (max 3)
 * 4. Estado emocional atual + intensidade
 * 5. Sintomas físicos (Flo-inspired)
 * 6. Qualidade do sono (Ovia-inspired)
 * 7. Sistema de apoio
 * 8. Hábitos diários baseline
 * 9. Nível de estresse e gatilhos
 * 10. Primeira prioridade
 * 11. Níveis de energia
 * 12. Saúde mental baseline (PHQ-2/GAD-2)
 * 13. Tom de voz da IA
 * 14. Preferências de metas
 * 15. Notificações
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Heart,
  Sparkles,
  BellRing,
  Activity,
  Moon,
  Users,
  Coffee,
  Zap,
  Brain,
  MessageCircle,
  Target,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';

import { Box } from '@/components/atoms/Box';
import { HapticButton } from '@/components/atoms/HapticButton';
import { Heading } from '@/components/atoms/Heading';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Text } from '@/components/atoms/Text';
import type { RootStackParamList } from '@/navigation/types';
import { sentimentAnalysisService } from '@/services/analytics/sentimentAnalysisService';
import { onboardingService, type OnboardingData } from '@/services/supabase';
import { useTheme } from '@/theme';
import { Tokens } from '@/theme/tokens';
import { logger } from '@/utils/logger';

// ======================
// 🎯 TYPES
// ======================

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

interface OptionButton {
  value: string;
  emoji: string;
  label: string;
  description?: string;
}

// ======================
// 🧩 ONBOARDING SCREEN ENHANCED
// ======================

export default function OnboardingScreenEnhanced() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  // ======================
  // 📊 STATE
  // ======================

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Step 1: Identity
  const [displayName, setDisplayName] = useState('');

  // Step 2: Life Stage
  const [lifeStage, setLifeStage] = useState<string | null>(null);

  // Step 3: Main Goals
  const [mainGoals, setMainGoals] = useState<string[]>([]);

  // Step 4: Emotional State + Intensity
  const [baselineEmotion, setBaselineEmotion] = useState<string | null>(null);
  const [emotionIntensity, setEmotionIntensity] = useState<number>(3);

  // Step 5: Physical Challenges
  const [physicalChallenges, setPhysicalChallenges] = useState<string[]>([]);
  const [physicalPainLevel, setPhysicalPainLevel] = useState<number>(5);

  // Step 6: Sleep Quality
  const [sleepQuality, setSleepQuality] = useState<string | null>(null);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepChallenges, setSleepChallenges] = useState<string[]>([]);

  // Step 7: Support System
  const [supportSystem, setSupportSystem] = useState<string[]>([]);
  const [partnerRelationship, setPartnerRelationship] = useState<string | null>(null);
  const [feelsIsolated, setFeelsIsolated] = useState<boolean | null>(null);

  // Step 8: Daily Habits
  const [dailyHabits, setDailyHabits] = useState({
    prenatal_vitamins: false,
    exercise_frequency: '',
    water_intake: '',
    healthy_meals: 2,
  });

  // Step 9: Stress & Triggers
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [stressTriggers, setStressTriggers] = useState<string[]>([]);
  const [copingMechanisms, setCopingMechanisms] = useState<string[]>([]);

  // Step 10: First Focus
  const [firstFocus, setFirstFocus] = useState<string | null>(null);

  // Step 11: Energy Levels
  const [energyLevel, setEnergyLevel] = useState<string | null>(null);
  const [fatiguePattern, setFatiguePattern] = useState<string | null>(null);

  // Step 12: Mental Health
  const [mentalHealthConcerns, setMentalHealthConcerns] = useState<string[]>([]);
  const [previousMentalHealthSupport, setPreviousMentalHealthSupport] = useState<boolean | null>(
    null
  );
  const [interestedInResources, setInterestedInResources] = useState<boolean | null>(null);

  // Step 13: Language Tone
  const [languageTone, setLanguageTone] = useState<string | null>(null);

  // Step 14: Goal-Setting
  const [goalSettingStyle, setGoalSettingStyle] = useState<string | null>(null);
  const [wantsReminders, setWantsReminders] = useState<boolean | null>(null);
  const [wantsProgressTracking, setWantsProgressTracking] = useState<boolean | null>(null);

  // Step 15: Notifications
  const [notificationOptIn, setNotificationOptIn] = useState<boolean | null>(null);
  const [notificationPreferences, setNotificationPreferences] = useState({
    daily_check_in: false,
    health_tips: false,
    community_updates: false,
    milestone_celebrations: false,
  });

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

  const physicalChallengesOptions: OptionButton[] = [
    { value: 'nausea', emoji: '🤢', label: 'Náuseas / enjoo' },
    { value: 'back_pain', emoji: '🔙', label: 'Dores nas costas' },
    { value: 'headaches', emoji: '🤕', label: 'Dores de cabeça' },
    { value: 'swelling', emoji: '💧', label: 'Inchaço' },
    { value: 'fatigue', emoji: '😴', label: 'Fadiga extrema' },
    { value: 'none', emoji: '✅', label: 'Nenhum desconforto significativo' },
  ];

  const sleepQualityOptions: OptionButton[] = [
    { value: 'excellent', emoji: '⭐', label: 'Excelente - durmo muito bem' },
    { value: 'good', emoji: '😌', label: 'Bom - durmo bem na maioria das vezes' },
    { value: 'fair', emoji: '😐', label: 'Razoável - acordo algumas vezes' },
    { value: 'poor', emoji: '😔', label: 'Ruim - custa a dormir ou acordo muito' },
    { value: 'very_poor', emoji: '😫', label: 'Muito ruim - quase não durmo' },
  ];

  const sleepChallengesOptions: OptionButton[] = [
    { value: 'falling_asleep', emoji: '🌙', label: 'Dificuldade para pegar no sono' },
    { value: 'staying_asleep', emoji: '⏰', label: 'Acordo várias vezes durante a noite' },
    { value: 'early_waking', emoji: '🌅', label: 'Acordo muito cedo e não consigo voltar a dormir' },
    { value: 'restless', emoji: '😖', label: 'Sono agitado / pesadelos' },
    { value: 'none', emoji: '✅', label: 'Nenhum problema específico' },
  ];

  const supportSystemOptions: OptionButton[] = [
    { value: 'partner', emoji: '💑', label: 'Parceiro(a)' },
    { value: 'family', emoji: '👨‍👩‍👧', label: 'Família' },
    { value: 'friends', emoji: '👯', label: 'Amigos(as)' },
    { value: 'professional', emoji: '👩‍⚕️', label: 'Profissional (terapeuta, médico)' },
    { value: 'online_community', emoji: '🌐', label: 'Comunidades online' },
    { value: 'none', emoji: '💭', label: 'Não tenho muito apoio no momento' },
  ];

  const partnerRelationshipOptions: OptionButton[] = [
    { value: 'very_supportive', emoji: '💖', label: 'Muito apoiador(a) e presente' },
    { value: 'supportive', emoji: '💙', label: 'Apoiador(a) na maioria das vezes' },
    { value: 'neutral', emoji: '😐', label: 'Neutro - poderia ser melhor' },
    { value: 'strained', emoji: '😔', label: 'Temos tido alguns desafios' },
    { value: 'not_applicable', emoji: '🤷', label: 'Não tenho parceiro(a) / não se aplica' },
  ];

  const exerciseFrequencyOptions: OptionButton[] = [
    { value: 'daily', emoji: '💪', label: 'Quase todo dia' },
    { value: '3-5_week', emoji: '🏃', label: '3-5 vezes por semana' },
    { value: '1-2_week', emoji: '🚶', label: '1-2 vezes por semana' },
    { value: 'rarely', emoji: '😅', label: 'Raramente / quase nunca' },
  ];

  const waterIntakeOptions: OptionButton[] = [
    { value: 'adequate', emoji: '💧', label: 'Bebo bastante água (8+ copos)' },
    { value: 'moderate', emoji: '🥤', label: 'Bebo uma quantidade ok (4-7 copos)' },
    { value: 'low', emoji: '😓', label: 'Bebo pouca água (menos de 4 copos)' },
  ];

  const stressTriggersOptions: OptionButton[] = [
    { value: 'work', emoji: '💼', label: 'Trabalho / carreira' },
    { value: 'family', emoji: '👨‍👩‍👧', label: 'Família / relacionamentos' },
    { value: 'health_concerns', emoji: '🏥', label: 'Preocupações com saúde (minha ou do bebê)' },
    { value: 'finances', emoji: '💰', label: 'Finanças / situação financeira' },
    { value: 'time_management', emoji: '⏰', label: 'Falta de tempo / sobrecarga' },
    { value: 'uncertainty', emoji: '🤔', label: 'Incerteza sobre o futuro' },
  ];

  const copingMechanismsOptions: OptionButton[] = [
    { value: 'exercise', emoji: '🏃', label: 'Exercício físico' },
    { value: 'meditation', emoji: '🧘', label: 'Meditação / mindfulness' },
    { value: 'talking', emoji: '💬', label: 'Conversar com alguém' },
    { value: 'journaling', emoji: '📝', label: 'Escrever / fazer diário' },
    { value: 'creative', emoji: '🎨', label: 'Atividades criativas' },
    { value: 'none', emoji: '😔', label: 'Não tenho estratégias específicas no momento' },
  ];

  const focusOptions: OptionButton[] = [
    { value: 'emotional_care', emoji: '💙', label: 'Cuidar melhor de mim emocionalmente' },
    { value: 'organization', emoji: '🧩', label: 'Me organizar (rotina, tarefas, vida)' },
    { value: 'reduce_fatigue', emoji: '😴', label: 'Me sentir menos cansada / sobrecarregada' },
    { value: 'community', emoji: '👥', label: 'Me sentir menos sozinha' },
    { value: 'content', emoji: '📚', label: 'Receber conteúdos certos pra minha fase' },
  ];

  const energyLevelOptions: OptionButton[] = [
    { value: 'high', emoji: '⚡', label: 'Alta - me sinto energizada' },
    { value: 'moderate', emoji: '😊', label: 'Moderada - consigo fazer o que preciso' },
    { value: 'low', emoji: '😴', label: 'Baixa - me sinto cansada frequentemente' },
    { value: 'very_low', emoji: '😫', label: 'Muito baixa - estou exausta' },
  ];

  const fatiguePatternOptions: OptionButton[] = [
    { value: 'morning', emoji: '🌅', label: 'Manhã - acordo cansada' },
    { value: 'afternoon', emoji: '☀️', label: 'Tarde - a energia cai depois do almoço' },
    { value: 'evening', emoji: '🌙', label: 'Noite - chego no fim do dia esgotada' },
    { value: 'all_day', emoji: '😴', label: 'O dia todo - não tenho picos de energia' },
  ];

  const mentalHealthConcernsOptions: OptionButton[] = [
    { value: 'anxiety', emoji: '😰', label: 'Ansiedade / preocupação excessiva' },
    { value: 'depression', emoji: '😢', label: 'Tristeza persistente / falta de interesse' },
    { value: 'mood_swings', emoji: '🎭', label: 'Mudanças de humor frequentes' },
    { value: 'intrusive_thoughts', emoji: '💭', label: 'Pensamentos intrusivos / ruminação' },
    { value: 'panic', emoji: '😱', label: 'Ataques de pânico / ansiedade intensa' },
    { value: 'none', emoji: '✅', label: 'Nenhuma preocupação específica no momento' },
  ];

  const toneOptions: OptionButton[] = [
    { value: 'friendly', emoji: '🤎', label: 'Bem acolhedora, tipo amiga' },
    { value: 'direct', emoji: '🧠', label: 'Com carinho, mas direta ao ponto' },
    { value: 'mentor', emoji: '📋', label: 'Mais séria e organizada, quase como uma mentora' },
  ];

  const goalSettingStyleOptions: OptionButton[] = [
    { value: 'structured', emoji: '📋', label: 'Estruturado - quero metas claras e prazos' },
    { value: 'flexible', emoji: '🌊', label: 'Flexível - prefiro sugestões sem pressão' },
    { value: 'minimal', emoji: '🤲', label: 'Mínimo - só quero apoio quando eu pedir' },
  ];

  // ======================
  // 🔄 HANDLERS
  // ======================

  const handleNext = () => {
    if (currentStep < 15) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep((prev) => (prev + 1) as OnboardingStep);
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
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep((prev) => (prev - 1) as OnboardingStep);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
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
        return physicalChallenges.length > 0;
      case 6:
        return sleepQuality !== null;
      case 7:
        return supportSystem.length > 0 && partnerRelationship !== null && feelsIsolated !== null;
      case 8:
        return dailyHabits.exercise_frequency !== '' && dailyHabits.water_intake !== '';
      case 9:
        return stressTriggers.length > 0 && copingMechanisms.length > 0;
      case 10:
        return firstFocus !== null;
      case 11:
        return energyLevel !== null && fatiguePattern !== null;
      case 12:
        return (
          mentalHealthConcerns.length > 0 &&
          previousMentalHealthSupport !== null &&
          interestedInResources !== null
        );
      case 13:
        return languageTone !== null;
      case 14:
        return (
          goalSettingStyle !== null && wantsReminders !== null && wantsProgressTracking !== null
        );
      case 15:
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

  const toggleMultiSelect = (
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const handleFinish = async () => {
    logger.info('[OnboardingScreenEnhanced] handleFinish called', { currentStep });
    try {
      setLoading(true);

      const data: OnboardingData = {
        // Step 1
        display_name: displayName.trim(),

        // Step 2
        life_stage_generic: lifeStage!,

        // Step 3
        main_goals: mainGoals,

        // Step 4
        baseline_emotion: baselineEmotion!,
        emotion_intensity: emotionIntensity,

        // Step 5
        physical_challenges: physicalChallenges,
        physical_pain_level: physicalPainLevel,

        // Step 6
        sleep_quality: sleepQuality!,
        sleep_hours: sleepHours,
        sleep_challenges: sleepChallenges,

        // Step 7
        support_system: supportSystem.join(', '),
        partner_relationship: partnerRelationship!,
        feels_isolated: feelsIsolated!,

        // Step 8
        daily_habits: [
          dailyHabits.prenatal_vitamins ? 'prenatal_vitamins' : '',
          dailyHabits.exercise_frequency,
          dailyHabits.water_intake,
          `${dailyHabits.healthy_meals} healthy meals`,
        ].filter(Boolean),

        // Step 9
        stress_level: stressLevel,
        stress_triggers: stressTriggers,
        coping_mechanisms: copingMechanisms,

        // Step 10
        first_focus: firstFocus!,

        // Step 11
        energy_level: energyLevel!,
        fatigue_pattern: fatiguePattern!,

        // Step 12
        mental_health_concerns: mentalHealthConcerns,
        previous_mental_health_support: previousMentalHealthSupport!,
        interested_in_resources: interestedInResources!,

        // Step 13
        preferred_language_tone: languageTone ?? undefined,

        // Step 14
        goal_setting_style: goalSettingStyle!,
        wants_reminders: wantsReminders!,
        wants_progress_tracking: wantsProgressTracking!,

        // Step 15
        notification_opt_in: notificationOptIn!,
        notification_preferences: notificationPreferences,
      };

      // Save onboarding data
      const result = await onboardingService.completeOnboarding(data);

      if (result) {
        // Record initial sentiment for baseline
        await sentimentAnalysisService.recordSentiment({
          emotional_state: baselineEmotion!,
          intensity: emotionIntensity,
          stress_level: stressLevel,
          energy_level: energyLevel!,
          sleep_quality: sleepQuality!,
        });

        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        Alert.alert(
          'Atenção',
          'Não foi possível salvar seus dados no momento. Você pode continuar usando o app e tentar salvar depois.',
          [
            {
              text: 'Tentar novamente',
              style: 'cancel',
              onPress: () => handleFinish(),
            },
            {
              text: 'Continuar mesmo assim',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
              },
            },
          ]
        );
      }
    } catch (error) {
      logger.error('Failed to complete onboarding', error, { screen: 'OnboardingScreenEnhanced' });
      Alert.alert('Erro', 'Ocorreu um erro ao finalizar o onboarding. Tente novamente.', [
        {
          text: 'Tentar novamente',
          onPress: () => handleFinish(),
        },
        {
          text: 'Continuar mesmo assim',
          style: 'cancel',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 🎨 RENDER STEPS
  // ======================

  const renderStepContent = () => {
    const iconSize = 56;
    const iconColor = colors.primary.main;

    switch (currentStep) {
      case 1:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="6" align="center">
                <Heart size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" align="center" style={styles.question}>
                Como você quer que eu te chame aqui dentro?
              </Heading>
              <Text variant="body" color="secondary" align="center" style={styles.description}>
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
                <Sparkles size={iconSize} color={iconColor} />
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
              <Text variant="body" color="secondary" align="center" style={styles.description}>
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
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
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
              {baselineEmotion && (
                <Box mt="6" width="100%">
                  <Text variant="body" color="secondary" align="center" style={{ marginBottom: 12 }}>
                    Com que intensidade? (1 = leve, 5 = muito intenso)
                  </Text>
                  <SliderComponent
                    value={emotionIntensity}
                    onValueChange={setEmotionIntensity}
                    min={1}
                    max={5}
                    step={1}
                  />
                </Box>
              )}
            </Box>
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Activity size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Você tem sentido algum desses sintomas físicos?
              </Heading>
              <Text variant="body" color="secondary" align="center" style={styles.description}>
                Pode escolher vários (ou nenhum)
              </Text>
              <Box style={styles.optionsContainer} mt="6">
                {physicalChallengesOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    selected={physicalChallenges.includes(option.value)}
                    onPress={() =>
                      toggleMultiSelect(option.value, physicalChallenges, setPhysicalChallenges)
                    }
                    multiSelect
                  />
                ))}
              </Box>
              {physicalChallenges.length > 0 && !physicalChallenges.includes('none') && (
                <Box mt="6" width="100%">
                  <Text variant="body" color="secondary" align="center" style={{ marginBottom: 12 }}>
                    Nível de desconforto físico (1 = leve, 10 = muito forte)
                  </Text>
                  <SliderComponent
                    value={physicalPainLevel}
                    onValueChange={setPhysicalPainLevel}
                    min={1}
                    max={10}
                    step={1}
                  />
                </Box>
              )}
            </Box>
          </Animated.View>
        );

      case 6:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Moon size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Como você descreveria a qualidade do seu sono?
              </Heading>
              <Box style={styles.optionsContainer} mt="4">
                {sleepQualityOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    selected={sleepQuality === option.value}
                    onPress={() => setSleepQuality(option.value)}
                  />
                ))}
              </Box>
              {sleepQuality && (
                <>
                  <Box mt="6" width="100%">
                    <Text variant="body" color="secondary" align="center" style={{ marginBottom: 12 }}>
                      Quantas horas você dorme por noite (em média)?
                    </Text>
                    <SliderComponent
                      value={sleepHours}
                      onValueChange={setSleepHours}
                      min={3}
                      max={12}
                      step={0.5}
                      unit="h"
                    />
                  </Box>
                  <Box mt="6" width="100%">
                    <Text variant="body" color="secondary" align="center" style={{ marginBottom: 12 }}>
                      Algum problema específico com o sono?
                    </Text>
                    <Box style={styles.optionsContainer}>
                      {sleepChallengesOptions.map((option) => (
                        <OptionCard
                          key={option.value}
                          option={option}
                          selected={sleepChallenges.includes(option.value)}
                          onPress={() =>
                            toggleMultiSelect(option.value, sleepChallenges, setSleepChallenges)
                          }
                          multiSelect
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Animated.View>
        );

      case 7:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Users size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Quem faz parte da sua rede de apoio?
              </Heading>
              <Text variant="body" color="secondary" align="center" style={styles.description}>
                Pode escolher vários
              </Text>
              <Box style={styles.optionsContainer} mt="4">
                {supportSystemOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    selected={supportSystem.includes(option.value)}
                    onPress={() => toggleMultiSelect(option.value, supportSystem, setSupportSystem)}
                    multiSelect
                  />
                ))}
              </Box>
              {supportSystem.length > 0 && (
                <>
                  <Box mt="6" width="100%">
                    <Text variant="body" color="secondary" align="center" style={{ marginBottom: 12 }}>
                      Como está o relacionamento com seu/sua parceiro(a)?
                    </Text>
                    <Box style={styles.optionsContainer}>
                      {partnerRelationshipOptions.map((option) => (
                        <OptionCard
                          key={option.value}
                          option={option}
                          selected={partnerRelationship === option.value}
                          onPress={() => setPartnerRelationship(option.value)}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box mt="6" width="100%">
                    <Text variant="body" color="secondary" align="center" style={{ marginBottom: 12 }}>
                      Você se sente isolada ou sozinha?
                    </Text>
                    <Box style={styles.optionsContainer} direction="row">
                      <OptionCard
                        option={{ value: 'yes', emoji: '😔', label: 'Sim, às vezes' }}
                        selected={feelsIsolated === true}
                        onPress={() => setFeelsIsolated(true)}
                      />
                      <OptionCard
                        option={{ value: 'no', emoji: '💙', label: 'Não, me sinto apoiada' }}
                        selected={feelsIsolated === false}
                        onPress={() => setFeelsIsolated(false)}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Animated.View>
        );

      case 8:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Coffee size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Vamos entender seus hábitos diários
              </Heading>
              <Box mt="6" width="100%">
                <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                  Você toma vitaminas pré-natais?
                </Text>
                <Box style={styles.optionsContainer} direction="row">
                  <OptionCard
                    option={{ value: 'yes', emoji: '💊', label: 'Sim' }}
                    selected={dailyHabits.prenatal_vitamins === true}
                    onPress={() => setDailyHabits({ ...dailyHabits, prenatal_vitamins: true })}
                  />
                  <OptionCard
                    option={{ value: 'no', emoji: '❌', label: 'Não' }}
                    selected={dailyHabits.prenatal_vitamins === false}
                    onPress={() => setDailyHabits({ ...dailyHabits, prenatal_vitamins: false })}
                  />
                </Box>
              </Box>
              <Box mt="6" width="100%">
                <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                  Com que frequência você se exercita?
                </Text>
                <Box style={styles.optionsContainer}>
                  {exerciseFrequencyOptions.map((option) => (
                    <OptionCard
                      key={option.value}
                      option={option}
                      selected={dailyHabits.exercise_frequency === option.value}
                      onPress={() =>
                        setDailyHabits({ ...dailyHabits, exercise_frequency: option.value })
                      }
                    />
                  ))}
                </Box>
              </Box>
              <Box mt="6" width="100%">
                <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                  Quanta água você bebe por dia?
                </Text>
                <Box style={styles.optionsContainer}>
                  {waterIntakeOptions.map((option) => (
                    <OptionCard
                      key={option.value}
                      option={option}
                      selected={dailyHabits.water_intake === option.value}
                      onPress={() => setDailyHabits({ ...dailyHabits, water_intake: option.value })}
                    />
                  ))}
                </Box>
              </Box>
              <Box mt="6" width="100%">
                <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                  Quantas refeições saudáveis você faz por dia? ({dailyHabits.healthy_meals})
                </Text>
                <SliderComponent
                  value={dailyHabits.healthy_meals}
                  onValueChange={(val) => setDailyHabits({ ...dailyHabits, healthy_meals: val })}
                  min={0}
                  max={5}
                  step={1}
                />
              </Box>
            </Box>
          </Animated.View>
        );

      case 9:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Zap size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Vamos falar sobre estresse
              </Heading>
              <Box mt="4" width="100%">
                <Text variant="body" color="secondary" align="center" style={{ marginBottom: 12 }}>
                  Qual seu nível de estresse hoje? (1 = baixo, 10 = muito alto)
                </Text>
                <SliderComponent
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  min={1}
                  max={10}
                  step={1}
                />
              </Box>
              <Box mt="6" width="100%">
                <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                  O que mais te estressa? (pode escolher vários)
                </Text>
                <Box style={styles.optionsContainer}>
                  {stressTriggersOptions.map((option) => (
                    <OptionCard
                      key={option.value}
                      option={option}
                      selected={stressTriggers.includes(option.value)}
                      onPress={() =>
                        toggleMultiSelect(option.value, stressTriggers, setStressTriggers)
                      }
                      multiSelect
                    />
                  ))}
                </Box>
              </Box>
              <Box mt="6" width="100%">
                <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                  Como você costuma lidar com o estresse?
                </Text>
                <Box style={styles.optionsContainer}>
                  {copingMechanismsOptions.map((option) => (
                    <OptionCard
                      key={option.value}
                      option={option}
                      selected={copingMechanisms.includes(option.value)}
                      onPress={() =>
                        toggleMultiSelect(option.value, copingMechanisms, setCopingMechanisms)
                      }
                      multiSelect
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Animated.View>
        );

      case 10:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Target size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Se eu pudesse te ajudar em uma coisa primeiro, qual seria?
              </Heading>
              <Box style={styles.optionsContainer} mt="4">
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
          </Animated.View>
        );

      case 11:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Zap size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Como estão seus níveis de energia?
              </Heading>
              <Box style={styles.optionsContainer} mt="4">
                {energyLevelOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    selected={energyLevel === option.value}
                    onPress={() => setEnergyLevel(option.value)}
                  />
                ))}
              </Box>
              {energyLevel && (
                <Box mt="6" width="100%">
                  <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                    Quando você se sente mais cansada?
                  </Text>
                  <Box style={styles.optionsContainer}>
                    {fatiguePatternOptions.map((option) => (
                      <OptionCard
                        key={option.value}
                        option={option}
                        selected={fatiguePattern === option.value}
                        onPress={() => setFatiguePattern(option.value)}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Animated.View>
        );

      case 12:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Brain size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Vamos cuidar da sua saúde mental
              </Heading>
              <Text variant="body" color="secondary" align="center" style={styles.description}>
                Você tem sentido alguma dessas preocupações? (pode escolher várias ou nenhuma)
              </Text>
              <Box style={styles.optionsContainer} mt="4">
                {mentalHealthConcernsOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    selected={mentalHealthConcerns.includes(option.value)}
                    onPress={() =>
                      toggleMultiSelect(option.value, mentalHealthConcerns, setMentalHealthConcerns)
                    }
                    multiSelect
                  />
                ))}
              </Box>
              {mentalHealthConcerns.length > 0 && (
                <>
                  <Box mt="6" width="100%">
                    <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                      Você já recebeu apoio profissional de saúde mental antes?
                    </Text>
                    <Box style={styles.optionsContainer} direction="row">
                      <OptionCard
                        option={{ value: 'yes', emoji: '✅', label: 'Sim' }}
                        selected={previousMentalHealthSupport === true}
                        onPress={() => setPreviousMentalHealthSupport(true)}
                      />
                      <OptionCard
                        option={{ value: 'no', emoji: '❌', label: 'Não' }}
                        selected={previousMentalHealthSupport === false}
                        onPress={() => setPreviousMentalHealthSupport(false)}
                      />
                    </Box>
                  </Box>
                  <Box mt="6" width="100%">
                    <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                      Gostaria de receber recursos de apoio à saúde mental?
                    </Text>
                    <Box style={styles.optionsContainer} direction="row">
                      <OptionCard
                        option={{ value: 'yes', emoji: '💙', label: 'Sim, por favor' }}
                        selected={interestedInResources === true}
                        onPress={() => setInterestedInResources(true)}
                      />
                      <OptionCard
                        option={{ value: 'no', emoji: '🤚', label: 'Não agora' }}
                        selected={interestedInResources === false}
                        onPress={() => setInterestedInResources(false)}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Animated.View>
        );

      case 13:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <MessageCircle size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Como você prefere que eu fale com você?
              </Heading>
              <Box style={styles.optionsContainer} mt="4">
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
          </Animated.View>
        );

      case 14:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <Target size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Como você gosta de trabalhar com metas?
              </Heading>
              <Box style={styles.optionsContainer} mt="4">
                {goalSettingStyleOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    option={option}
                    selected={goalSettingStyle === option.value}
                    onPress={() => setGoalSettingStyle(option.value)}
                  />
                ))}
              </Box>
              {goalSettingStyle && (
                <>
                  <Box mt="6" width="100%">
                    <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                      Quer que eu te mande lembretes gentis para suas metas?
                    </Text>
                    <Box style={styles.optionsContainer} direction="row">
                      <OptionCard
                        option={{ value: 'yes', emoji: '✅', label: 'Sim, por favor' }}
                        selected={wantsReminders === true}
                        onPress={() => setWantsReminders(true)}
                      />
                      <OptionCard
                        option={{ value: 'no', emoji: '🤚', label: 'Não, prefiro sem pressão' }}
                        selected={wantsReminders === false}
                        onPress={() => setWantsReminders(false)}
                      />
                    </Box>
                  </Box>
                  <Box mt="6" width="100%">
                    <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                      Quer acompanhar seu progresso ao longo do tempo?
                    </Text>
                    <Box style={styles.optionsContainer} direction="row">
                      <OptionCard
                        option={{ value: 'yes', emoji: '📊', label: 'Sim, adoro ver evolução' }}
                        selected={wantsProgressTracking === true}
                        onPress={() => setWantsProgressTracking(true)}
                      />
                      <OptionCard
                        option={{ value: 'no', emoji: '🤷', label: 'Não precisa' }}
                        selected={wantsProgressTracking === false}
                        onPress={() => setWantsProgressTracking(false)}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Animated.View>
        );

      case 15:
        return (
          <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
            <Box style={styles.stepContainer}>
              <Box mb="4" align="center">
                <BellRing size={iconSize} color={iconColor} />
              </Box>
              <Heading level="h2" style={styles.question}>
                Quer que eu te lembre, de vez em quando, de cuidar de você?
              </Heading>
              <Text style={styles.description}>Lembretes suaves, sem pressão, só pra te apoiar</Text>
              <Box style={styles.optionsContainer} mt="4">
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
              {notificationOptIn === true && (
                <Box mt="6" width="100%">
                  <Text variant="body" color="secondary" style={{ marginBottom: 12 }}>
                    Que tipo de notificações você quer receber?
                  </Text>
                  <Box style={styles.optionsContainer}>
                    <OptionCard
                      option={{ value: 'daily_check_in', emoji: '💙', label: 'Check-in diário' }}
                      selected={notificationPreferences.daily_check_in}
                      onPress={() =>
                        setNotificationPreferences({
                          ...notificationPreferences,
                          daily_check_in: !notificationPreferences.daily_check_in,
                        })
                      }
                      multiSelect
                    />
                    <OptionCard
                      option={{ value: 'health_tips', emoji: '📚', label: 'Dicas de saúde' }}
                      selected={notificationPreferences.health_tips}
                      onPress={() =>
                        setNotificationPreferences({
                          ...notificationPreferences,
                          health_tips: !notificationPreferences.health_tips,
                        })
                      }
                      multiSelect
                    />
                    <OptionCard
                      option={{
                        value: 'community_updates',
                        emoji: '👥',
                        label: 'Atualizações da comunidade',
                      }}
                      selected={notificationPreferences.community_updates}
                      onPress={() =>
                        setNotificationPreferences({
                          ...notificationPreferences,
                          community_updates: !notificationPreferences.community_updates,
                        })
                      }
                      multiSelect
                    />
                    <OptionCard
                      option={{
                        value: 'milestone_celebrations',
                        emoji: '🎉',
                        label: 'Celebrações de marcos',
                      }}
                      selected={notificationPreferences.milestone_celebrations}
                      onPress={() =>
                        setNotificationPreferences({
                          ...notificationPreferences,
                          milestone_celebrations: !notificationPreferences.milestone_celebrations,
                        })
                      }
                      multiSelect
                    />
                  </Box>
                </Box>
              )}
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
    <Box style={{ ...styles.container, backgroundColor: colors.background.canvas }}>
      {/* Progress Bar */}
      <Box px="4" pt="3" pb="2">
        <ProgressBar
          current={currentStep}
          total={15}
          color={colors.primary.main}
          height={4}
          animated
        />
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
              logger.info('[OnboardingScreenEnhanced] Button pressed', {
                currentStep,
                canProceed: canProceed(),
              });
              if (currentStep === 15) {
                logger.info('[OnboardingScreenEnhanced] Calling handleFinish');
                handleFinish();
              } else {
                logger.info('[OnboardingScreenEnhanced] Calling handleNext');
                handleNext();
              }
            }}
            disabled={!canProceed() || loading}
            loading={loading}
            fullWidth={currentStep === 1}
            accessibilityLabel={
              currentStep === 15 ? 'Finalizar onboarding e começar a usar o app' : 'Próximo passo'
            }
            accessibilityHint={
              currentStep === 15
                ? 'Salva seus dados e navega para a tela principal'
                : 'Avança para o próximo passo do onboarding'
            }
          >
            {loading ? 'Salvando...' : currentStep === 15 ? 'Começar!' : 'Próximo'}
          </HapticButton>
        </Box>
      </Box>

      {/* Step Counter */}
      <Box
        pb="4"
        align="center"
        accessibilityRole="text"
        accessibilityLabel={`Passo ${currentStep} de 15`}
        accessibilityHint="Indicador de progresso do onboarding"
      >
        <Text variant="small" color="tertiary" align="center">
          {currentStep} de 15
        </Text>
      </Box>
    </Box>
  );
}

// ======================
// 🧩 SLIDER COMPONENT
// ======================

interface SliderComponentProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

function SliderComponent({ value, onValueChange, min, max, step, unit }: SliderComponentProps) {
  const { colors } = useTheme();

  // Simple slider implementation (you can replace with @react-native-community/slider)
  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          fontSize: Tokens.typography.sizes['3xl'],
          fontWeight: Tokens.typography.weights.bold,
          color: colors.primary.main,
          marginBottom: Tokens.spacing['3'],
        }}
      >
        {value}
        {unit}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: Tokens.spacing['2'],
        }}
      >
        <Text style={{ color: colors.text.secondary }}>{min}</Text>
        <Text style={{ color: colors.text.secondary }}>{max}</Text>
      </View>
      {/* Note: Add actual slider component here (@react-native-community/slider) */}
      <Text style={{ marginTop: Tokens.spacing['2'], color: colors.text.tertiary, fontSize: 12 }}>
        Use os botões +/- ou arraste para ajustar
      </Text>
      <View style={{ flexDirection: 'row', gap: Tokens.spacing['2'], marginTop: Tokens.spacing['2'] }}>
        <TouchableOpacity
          onPress={() => onValueChange(Math.max(min, value - step))}
          style={{
            backgroundColor: colors.primary.main,
            padding: Tokens.spacing['3'],
            borderRadius: Tokens.radius.md,
          }}
        >
          <Text style={{ color: colors.text.inverse, fontWeight: 'bold' }}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onValueChange(Math.min(max, value + step))}
          style={{
            backgroundColor: colors.primary.main,
            padding: Tokens.spacing['3'],
            borderRadius: Tokens.radius.md,
          }}
        >
          <Text style={{ color: colors.text.inverse, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
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
