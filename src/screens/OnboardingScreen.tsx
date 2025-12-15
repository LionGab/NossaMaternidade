import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useAppStore } from "../state/store";
import { OnboardingStep, PregnancyStage, Interest, UserProfile } from "../types/navigation";

const STAGES: { id: PregnancyStage; label: string; icon: string; description: string }[] = [
  { id: "trying", label: "Tentando engravidar", icon: "heart", description: "Estou planejando minha gestacao" },
  { id: "pregnant", label: "Gravida", icon: "flower", description: "Estou esperando meu bebe" },
  { id: "postpartum", label: "Pos-parto", icon: "happy", description: "Meu bebe ja nasceu" },
];

const INTERESTS: { id: Interest; label: string; icon: string }[] = [
  { id: "nutrition", label: "Nutricao", icon: "nutrition" },
  { id: "exercise", label: "Exercicios", icon: "fitness" },
  { id: "mental_health", label: "Saude Mental", icon: "heart" },
  { id: "baby_care", label: "Cuidados com Bebe", icon: "happy" },
  { id: "breastfeeding", label: "Amamentacao", icon: "water" },
  { id: "sleep", label: "Sono", icon: "moon" },
  { id: "relationships", label: "Relacionamentos", icon: "people" },
  { id: "career", label: "Carreira", icon: "briefcase" },
];

const GOALS = [
  { id: "health", label: "Saude e bem-estar", icon: "heart-outline" },
  { id: "preparation", label: "Preparacao para o bebe", icon: "gift-outline" },
  { id: "knowledge", label: "Aprender sobre maternidade", icon: "book-outline" },
  { id: "community", label: "Conectar com outras maes", icon: "people-outline" },
  { id: "balance", label: "Equilibrar vida e maternidade", icon: "scale-outline" },
  { id: "support", label: "Encontrar apoio emocional", icon: "heart-circle-outline" },
];

const CHALLENGES = [
  { id: "anxiety", label: "Ansiedade", icon: "alert-circle-outline" },
  { id: "sleep", label: "Problemas de sono", icon: "moon-outline" },
  { id: "body_changes", label: "Mudancas no corpo", icon: "body-outline" },
  { id: "relationships", label: "Relacionamentos", icon: "people-outline" },
  { id: "finances", label: "Questoes financeiras", icon: "card-outline" },
  { id: "career", label: "Carreira e trabalho", icon: "briefcase-outline" },
];

const SUPPORT_OPTIONS = [
  { id: "partner", label: "Parceiro(a)", icon: "heart" },
  { id: "family", label: "Familia", icon: "home" },
  { id: "friends", label: "Amigas", icon: "people" },
  { id: "professionals", label: "Profissionais de saude", icon: "medical" },
  { id: "online", label: "Comunidades online", icon: "globe" },
  { id: "none", label: "Busco mais apoio", icon: "help-circle" },
];

const COMMUNICATION_PREFS = [
  { id: "daily", label: "Dicas diarias", icon: "today" },
  { id: "weekly", label: "Resumo semanal", icon: "calendar" },
  { id: "milestones", label: "Marcos importantes", icon: "star" },
  { id: "minimal", label: "Apenas essencial", icon: "notifications-off" },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const {
    setUser,
    setOnboardingComplete,
  } = useAppStore();

  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [data, setData] = useState({
    name: "",
    stage: null as PregnancyStage | null,
    age: "",
    location: "",
    goals: [] as string[],
    challenges: [] as string[],
    support: [] as string[],
    communication: null as string | null,
    interests: [] as Interest[],
  });

  const updateData = (updates: Partial<typeof data>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = (nextStep: OnboardingStep) => {
    setStep(nextStep);
  };

  const handleComplete = () => {
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: data.name,
      stage: data.stage || "pregnant",
      interests: data.interests,
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
    };
    setUser(newUser);
    setOnboardingComplete(true);
  };

  const getProgress = () => {
    const steps: OnboardingStep[] = ["name", "stage", "age", "location", "goals", "challenges", "support", "communication", "interests"];
    const currentIndex = steps.indexOf(step);
    return currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
  };

  const canProceed = () => {
    switch (step) {
      case "name": return data.name.trim().length > 0;
      case "stage": return data.stage !== null;
      case "age": return data.age.trim().length > 0;
      case "location": return data.location.trim().length > 0;
      case "goals": return data.goals.length > 0;
      case "challenges": return data.challenges.length > 0;
      case "support": return data.support.length > 0;
      case "communication": return data.communication !== null;
      case "interests": return data.interests.length > 0;
      default: return true;
    }
  };

  const renderWelcome = () => (
    <Animated.View
      entering={FadeIn.duration(800)}
      exiting={SlideOutLeft.duration(300)}
      className="flex-1 justify-center items-center px-8"
    >
      <View
        className="w-32 h-32 rounded-full items-center justify-center mb-10"
        style={{
          backgroundColor: "rgba(225, 29, 72, 0.1)",
          shadowColor: "#E11D48",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.15,
          shadowRadius: 24
        }}
      >
        <Ionicons name="heart" size={64} color="#E11D48" />
      </View>
      <Text className="text-4xl font-serif text-warmGray-800 text-center mb-4">
        Nossa Maternidade
      </Text>
      <Text className="text-lg text-warmGray-500 text-center mb-3 font-medium">
        Por Nathalia Valente
      </Text>
      <Text className="text-base text-warmGray-500 text-center leading-6 mb-12 px-4">
        Vamos conhecer voce melhor para personalizar sua jornada de maternidade com carinho e cuidado.
      </Text>
      <Pressable
        onPress={() => handleNext("name")}
        className="w-full py-5 rounded-3xl active:bg-rose-600"
        style={{
          backgroundColor: "#E11D48",
          shadowColor: "#E11D48",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16
        }}
      >
        <Text className="text-white text-center text-lg font-semibold">Comecar</Text>
      </Pressable>
    </Animated.View>
  );

  const renderNameStep = () => (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      className="flex-1 px-8 pt-12"
    >
      <Text className="text-3xl font-serif text-warmGray-800 mb-3">
        Como podemos te chamar?
      </Text>
      <Text className="text-base text-warmGray-500 mb-8">
        Adorariamos te conhecer melhor
      </Text>
      <TextInput
        value={data.name}
        onChangeText={(text) => updateData({ name: text })}
        placeholder="Seu nome"
        placeholderTextColor="#A8A29E"
        className="text-lg text-warmGray-800 mb-10"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 18,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8
        }}
        autoFocus
      />
      <Pressable
        onPress={() => handleNext("stage")}
        disabled={!canProceed()}
        className="py-5 rounded-3xl"
        style={{
          backgroundColor: canProceed() ? "#E11D48" : "#E7E5E4"
        }}
      >
        <Text className={`text-center text-lg font-semibold ${canProceed() ? "text-white" : "text-warmGray-400"}`}>
          Continuar
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderStageStep = () => (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      className="flex-1 px-8 pt-12"
    >
      <Text className="text-3xl font-serif text-warmGray-800 mb-3">
        Em que momento voce esta?
      </Text>
      <Text className="text-base text-warmGray-500 mb-8">
        Isso nos ajuda a personalizar sua experiencia
      </Text>
      <View className="space-y-4">
        {STAGES.map((stage) => (
          <Pressable
            key={stage.id}
            onPress={() => updateData({ stage: stage.id })}
            className="mb-4"
            style={{
              backgroundColor: data.stage === stage.id ? "rgba(225, 29, 72, 0.05)" : "#FFFFFF",
              borderRadius: 24,
              padding: 20,
              borderWidth: 2,
              borderColor: data.stage === stage.id ? "#E11D48" : "transparent",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: data.stage === stage.id ? 0.08 : 0.04,
              shadowRadius: 12
            }}
          >
            <View className="flex-row items-center">
              <View
                className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
                  data.stage === stage.id ? "bg-rose-500" : "bg-blush-100"
                }`}
              >
                <Ionicons
                  name={stage.icon as any}
                  size={26}
                  color={data.stage === stage.id ? "#FFFFFF" : "#BC8B7B"}
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-lg font-semibold mb-1 ${
                    data.stage === stage.id ? "text-rose-600" : "text-warmGray-700"
                  }`}
                >
                  {stage.label}
                </Text>
                <Text className="text-sm text-warmGray-500">{stage.description}</Text>
              </View>
              {data.stage === stage.id && (
                <Ionicons name="checkmark-circle" size={26} color="#E11D48" />
              )}
            </View>
          </Pressable>
        ))}
      </View>
      <View className="flex-1" />
      <Pressable
        onPress={() => handleNext("age")}
        disabled={!canProceed()}
        className="py-5 rounded-3xl mb-4"
        style={{
          backgroundColor: canProceed() ? "#E11D48" : "#E7E5E4"
        }}
      >
        <Text className={`text-center text-lg font-semibold ${canProceed() ? "text-white" : "text-warmGray-400"}`}>
          Continuar
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderAgeStep = () => (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      className="flex-1 px-8 pt-12"
    >
      <Text className="text-3xl font-serif text-warmGray-800 mb-3">
        Qual sua idade?
      </Text>
      <Text className="text-base text-warmGray-500 mb-8">
        Isso nos ajuda a oferecer conteudo mais relevante
      </Text>
      <TextInput
        value={data.age}
        onChangeText={(text) => updateData({ age: text })}
        placeholder="Sua idade"
        placeholderTextColor="#A8A29E"
        keyboardType="numeric"
        className="text-lg text-warmGray-800 mb-10"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 18,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8
        }}
        autoFocus
      />
      <Pressable
        onPress={() => handleNext("location")}
        disabled={!canProceed()}
        className="py-5 rounded-3xl"
        style={{
          backgroundColor: canProceed() ? "#E11D48" : "#E7E5E4"
        }}
      >
        <Text className={`text-center text-lg font-semibold ${canProceed() ? "text-white" : "text-warmGray-400"}`}>
          Continuar
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderLocationStep = () => (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      className="flex-1 px-8 pt-12"
    >
      <Text className="text-3xl font-serif text-warmGray-800 mb-3">
        De onde voce e?
      </Text>
      <Text className="text-base text-warmGray-500 mb-8">
        Cidade e estado onde voce mora
      </Text>
      <TextInput
        value={data.location}
        onChangeText={(text) => updateData({ location: text })}
        placeholder="Ex: Sao Paulo, SP"
        placeholderTextColor="#A8A29E"
        className="text-lg text-warmGray-800 mb-10"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 18,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8
        }}
        autoFocus
      />
      <Pressable
        onPress={() => handleNext("goals")}
        disabled={!canProceed()}
        className="py-5 rounded-3xl"
        style={{
          backgroundColor: canProceed() ? "#E11D48" : "#E7E5E4"
        }}
      >
        <Text className={`text-center text-lg font-semibold ${canProceed() ? "text-white" : "text-warmGray-400"}`}>
          Continuar
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderMultiSelectStep = (
    title: string,
    subtitle: string,
    options: typeof GOALS,
    selected: string[],
    onUpdate: (items: string[]) => void,
    nextStep: OnboardingStep
  ) => (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      className="flex-1 px-8 pt-12"
    >
      <Text className="text-3xl font-serif text-warmGray-800 mb-3">
        {title}
      </Text>
      <Text className="text-base text-warmGray-500 mb-6">
        {subtitle}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row flex-wrap -mx-2">
          {options.map((option) => {
            const isSelected = selected.includes(option.id);
            return (
              <Pressable
                key={option.id}
                onPress={() => {
                  const newSelected = isSelected
                    ? selected.filter((i) => i !== option.id)
                    : [...selected, option.id];
                  onUpdate(newSelected);
                }}
                className="w-[46%] mx-[2%] mb-4 items-center"
                style={{
                  backgroundColor: isSelected ? "rgba(225, 29, 72, 0.05)" : "#FFFFFF",
                  borderRadius: 20,
                  padding: 18,
                  borderWidth: 2,
                  borderColor: isSelected ? "#E11D48" : "transparent",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.08 : 0.04,
                  shadowRadius: 12
                }}
              >
                <View
                  className={`w-14 h-14 rounded-full items-center justify-center mb-3 ${
                    isSelected ? "bg-rose-500" : "bg-blush-100"
                  }`}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={26}
                    color={isSelected ? "#FFFFFF" : "#BC8B7B"}
                  />
                </View>
                <Text
                  className={`text-sm font-medium text-center ${
                    isSelected ? "text-rose-600" : "text-warmGray-600"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Pressable
        onPress={() => handleNext(nextStep)}
        disabled={!canProceed()}
        className="py-5 rounded-3xl mb-4"
        style={{
          backgroundColor: canProceed() ? "#E11D48" : "#E7E5E4"
        }}
      >
        <Text
          className={`text-center text-lg font-semibold ${
            canProceed() ? "text-white" : "text-warmGray-400"
          }`}
        >
          Continuar
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderCommunicationStep = () => (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      className="flex-1 px-8 pt-12"
    >
      <Text className="text-3xl font-serif text-warmGray-800 mb-3">
        Como prefere ser avisada?
      </Text>
      <Text className="text-base text-warmGray-500 mb-8">
        Escolha sua frequencia de notificacoes
      </Text>
      <View className="space-y-4">
        {COMMUNICATION_PREFS.map((pref) => (
          <Pressable
            key={pref.id}
            onPress={() => updateData({ communication: pref.id })}
            className="mb-4"
            style={{
              backgroundColor: data.communication === pref.id ? "rgba(225, 29, 72, 0.05)" : "#FFFFFF",
              borderRadius: 24,
              padding: 20,
              borderWidth: 2,
              borderColor: data.communication === pref.id ? "#E11D48" : "transparent",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: data.communication === pref.id ? 0.08 : 0.04,
              shadowRadius: 12
            }}
          >
            <View className="flex-row items-center">
              <View
                className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
                  data.communication === pref.id ? "bg-rose-500" : "bg-blush-100"
                }`}
              >
                <Ionicons
                  name={pref.icon as any}
                  size={26}
                  color={data.communication === pref.id ? "#FFFFFF" : "#BC8B7B"}
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-lg font-semibold ${
                    data.communication === pref.id ? "text-rose-600" : "text-warmGray-700"
                  }`}
                >
                  {pref.label}
                </Text>
              </View>
              {data.communication === pref.id && (
                <Ionicons name="checkmark-circle" size={26} color="#E11D48" />
              )}
            </View>
          </Pressable>
        ))}
      </View>
      <View className="flex-1" />
      <Pressable
        onPress={() => handleNext("interests")}
        disabled={!canProceed()}
        className="py-5 rounded-3xl mb-4"
        style={{
          backgroundColor: canProceed() ? "#E11D48" : "#E7E5E4"
        }}
      >
        <Text className={`text-center text-lg font-semibold ${canProceed() ? "text-white" : "text-warmGray-400"}`}>
          Continuar
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderInterestsStep = () => (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      className="flex-1 px-8 pt-12"
    >
      <Text className="text-3xl font-serif text-warmGray-800 mb-3">
        Ultimas preferencias!
      </Text>
      <Text className="text-base text-warmGray-500 mb-6">
        Selecione os temas que mais importam para voce
      </Text>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row flex-wrap -mx-2">
          {INTERESTS.map((interest) => {
            const isSelected = data.interests.includes(interest.id);
            return (
              <Pressable
                key={interest.id}
                onPress={() => {
                  const newInterests = isSelected
                    ? data.interests.filter((i) => i !== interest.id)
                    : [...data.interests, interest.id];
                  updateData({ interests: newInterests });
                }}
                className="w-[46%] mx-[2%] mb-4 items-center"
                style={{
                  backgroundColor: isSelected ? "rgba(225, 29, 72, 0.05)" : "#FFFFFF",
                  borderRadius: 20,
                  padding: 18,
                  borderWidth: 2,
                  borderColor: isSelected ? "#E11D48" : "transparent",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.08 : 0.04,
                  shadowRadius: 12
                }}
              >
                <View
                  className={`w-14 h-14 rounded-full items-center justify-center mb-3 ${
                    isSelected ? "bg-rose-500" : "bg-blush-100"
                  }`}
                >
                  <Ionicons
                    name={interest.icon as any}
                    size={26}
                    color={isSelected ? "#FFFFFF" : "#BC8B7B"}
                  />
                </View>
                <Text
                  className={`text-base font-medium text-center ${
                    isSelected ? "text-rose-600" : "text-warmGray-600"
                  }`}
                >
                  {interest.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Pressable
        onPress={handleComplete}
        disabled={!canProceed()}
        className="py-5 rounded-3xl mb-4"
        style={{
          backgroundColor: canProceed() ? "#E11D48" : "#E7E5E4"
        }}
      >
        <Text
          className={`text-center text-lg font-semibold ${
            canProceed() ? "text-white" : "text-warmGray-400"
          }`}
        >
          Entrar na comunidade
        </Text>
      </Pressable>
    </Animated.View>
  );

  const goBack = () => {
    const steps: OnboardingStep[] = ["welcome", "name", "stage", "age", "location", "goals", "challenges", "support", "communication", "interests"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  return (
    <View className="flex-1 bg-cream-50" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient
        colors={["#FFF5F7", "#FFF9F3", "#FFFCF9"]}
        locations={[0, 0.5, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400 }}
      />

      {/* Progress indicator */}
      {step !== "welcome" && (
        <View className="px-8 py-5">
          <View className="flex-row items-center mb-2">
            <Pressable
              onPress={goBack}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                padding: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#78716C" />
            </Pressable>
            <View className="flex-1 ml-4">
              <View className="h-2 bg-warmGray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${getProgress()}%` }}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {step === "welcome" && renderWelcome()}
      {step === "name" && renderNameStep()}
      {step === "stage" && renderStageStep()}
      {step === "age" && renderAgeStep()}
      {step === "location" && renderLocationStep()}
      {step === "goals" && renderMultiSelectStep(
        "Quais sao seus objetivos?",
        "Selecione tudo que se aplica",
        GOALS,
        data.goals,
        (goals) => updateData({ goals }),
        "challenges"
      )}
      {step === "challenges" && renderMultiSelectStep(
        "Com o que voce precisa de ajuda?",
        "Queremos te apoiar da melhor forma",
        CHALLENGES,
        data.challenges,
        (challenges) => updateData({ challenges }),
        "support"
      )}
      {step === "support" && renderMultiSelectStep(
        "Quem te apoia nessa jornada?",
        "Entender sua rede de apoio e importante",
        SUPPORT_OPTIONS,
        data.support,
        (support) => updateData({ support }),
        "communication"
      )}
      {step === "communication" && renderCommunicationStep()}
      {step === "interests" && renderInterestsStep()}
    </View>
  );
}
