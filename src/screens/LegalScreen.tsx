import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Constants from "expo-constants";
import { RootStackScreenProps } from "../types/navigation";
import { shadowPresets } from "../utils/shadow";
import * as Haptics from "expo-haptics";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../hooks/useTheme";
import { Tokens, semantic } from "../theme/tokens";

// Design system colors alias
const DS_COLORS = {
  semantic: semantic.light,
};

// URLs dos documentos legais via expo-constants (definidos em app.json extra.legal)
const legalConfig = Constants.expoConfig?.extra?.legal as {
  privacyUrl?: string;
  termsUrl?: string;
  aiDisclaimerUrl?: string;
} | undefined;

const LEGAL_URLS = {
  privacy: legalConfig?.privacyUrl ?? "https://nossamaternidade.com.br/privacidade",
  terms: legalConfig?.termsUrl ?? "https://nossamaternidade.com.br/termos",
  aiDisclaimer: legalConfig?.aiDisclaimerUrl ?? "https://nossamaternidade.com.br/ai-disclaimer",
};

interface LegalItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  url: string;
}

const LEGAL_ITEMS: LegalItem[] = [
  {
    id: "privacy",
    title: "Política de Privacidade",
    description: "Como coletamos, usamos e protegemos seus dados",
    icon: "shield-checkmark-outline",
    color: Tokens.brand.primary[500],
    url: LEGAL_URLS.privacy,
  },
  {
    id: "terms",
    title: "Termos de Uso",
    description: "Regras e condições para usar o app",
    icon: "document-text-outline",
    color: Tokens.brand.secondary[500],
    url: LEGAL_URLS.terms,
  },
  {
    id: "aiDisclaimer",
    title: "Uso de Inteligência Artificial",
    description: "Informações sobre a NathIA e uso de IA no app",
    icon: "sparkles-outline",
    color: Tokens.brand.accent[500],
    url: LEGAL_URLS.aiDisclaimer,
  },
];

const INFO_ITEMS = [
  {
    id: "lgpd",
    title: "Seus Direitos (LGPD)",
    items: [
      "Acessar seus dados pessoais",
      "Corrigir dados incompletos ou incorretos",
      "Solicitar exclusão dos seus dados",
      "Revogar consentimento a qualquer momento",
    ],
  },
  {
    id: "medical",
    title: "Aviso Médico Importante",
    content:
      "Este aplicativo não substitui consultas médicas. A NathIA oferece apoio emocional e informações gerais, mas não é uma profissional de saúde. Em caso de emergência, procure atendimento médico imediato.",
    icon: "medkit-outline",
    color: DS_COLORS.semantic.error,
  },
];

/**
 * Cores semânticas para LegalScreen com suporte a dark mode
 */
const getLegalColors = (isDark: boolean) => ({
  // Backgrounds
  cardBg: isDark ? Tokens.neutral[800] : Tokens.neutral[0],
  // Medical warning - using semantic error colors
  medicalBg: isDark ? Tokens.semantic.light.errorLight : Tokens.semantic.light.errorLight,
  medicalBorder: isDark ? `${Tokens.semantic.light.error}30` : Tokens.brand.accent[500],
  medicalIconBg: isDark ? `${Tokens.semantic.light.error}20` : Tokens.semantic.light.errorLight,
  medicalTitle: Tokens.semantic.light.error,
  medicalText: Tokens.semantic.light.error,
  // LGPD - using info/primary colors
  lgpdCheckBg: isDark ? Tokens.semantic.light.infoLight : Tokens.semantic.light.infoLight,
  lgpdCheck: Tokens.brand.primary[500],
  lgpdContactBg: isDark ? `${Tokens.brand.primary[500]}10` : Tokens.brand.primary[50],
  lgpdContactText: Tokens.brand.primary[500],
  // AI section - using secondary colors
  aiBg: isDark ? `${Tokens.brand.secondary[500]}10` : Tokens.brand.secondary[50],
  aiBorder: isDark ? `${Tokens.brand.secondary[300]}20` : Tokens.brand.secondary[200],
  aiIconBg: isDark ? `${Tokens.brand.secondary[400]}15` : Tokens.brand.secondary[100],
  aiTitle: isDark ? Tokens.brand.secondary[300] : Tokens.brand.secondary[700],
  aiText: isDark ? Tokens.brand.secondary[400] : Tokens.brand.secondary[600],
  aiInfo: isDark ? Tokens.brand.secondary[400] : Tokens.brand.secondary[500],
  aiInfoText: isDark ? Tokens.brand.secondary[300] : Tokens.brand.secondary[600],
  // Gradient for header - using primary soft gradient
  headerGradient: isDark
    ? [Tokens.neutral[900], Tokens.neutral[800], Tokens.neutral[700]] as const
    : [Tokens.brand.primary[50], Tokens.brand.secondary[50], Tokens.neutral[50]] as const,
});

export default function LegalScreen({ navigation }: RootStackScreenProps<"Legal">) {
  const insets = useSafeAreaInsets();
  const { showError, showInfo } = useToast();
  const { colors, isDark } = useTheme();
  const legalColors = useMemo(() => getLegalColors(isDark), [isDark]);

  const handleOpenLink = async (url: string, title: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        showError(`Não foi possível abrir ${title}. Tente novamente mais tarde.`);
      }
    } catch {
      showError("Ocorreu um erro ao abrir o link.");
    }
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleContactDPO = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const email = "privacidade@nossamaternidade.com.br";
    const subject = encodeURIComponent("Solicitação LGPD - Nossa Maternidade");
    const url = `mailto:${email}?subject=${subject}`;

    try {
      await Linking.openURL(url);
    } catch {
      showInfo(`Entre em contato pelo email: ${email}`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <LinearGradient
        colors={legalColors.headerGradient as unknown as [string, string, ...string[]]}
        locations={[0, 0.4, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 350 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{ paddingTop: insets.top + 8 }}
        className="px-4 pb-4 flex-row items-center"
      >
        <Pressable
          onPress={handleBack}
          className="p-2 mr-3"
          style={[{ backgroundColor: legalColors.cardBg, borderRadius: 12 }, shadowPresets.sm]}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Retorna para a tela anterior"
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral[500]} />
        </Pressable>
        <Text
          style={{ color: colors.text.primary, fontSize: 24, fontFamily: "DMSerifDisplay_400Regular", flex: 1 }}
          accessibilityRole="header"
        >
          Legal e Privacidade
        </Text>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Documentos Legais */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500).springify()}
          className="px-4 mb-6"
        >
          <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: "500", marginBottom: 12, marginLeft: 4 }}>
            DOCUMENTOS
          </Text>
          <View
            style={[
              { backgroundColor: legalColors.cardBg, borderRadius: 20, overflow: "hidden" },
              shadowPresets.md,
            ]}
          >
            {LEGAL_ITEMS.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => handleOpenLink(item.url, item.title)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  borderBottomWidth: index < LEGAL_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.neutral[200],
                }}
                accessibilityRole="link"
                accessibilityLabel={item.title}
                accessibilityHint={`Abre ${item.title} no navegador`}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    backgroundColor: `${item.color}15`,
                  }}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: "600" }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: colors.text.secondary, fontSize: 14, marginTop: 2 }}>
                    {item.description}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={20} color={colors.neutral[400]} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Aviso Médico */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500).springify()}
          className="px-4 mb-6"
        >
          <View
            style={{
              backgroundColor: legalColors.medicalBg,
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: legalColors.medicalBorder,
            }}
            accessibilityRole="alert"
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                  backgroundColor: legalColors.medicalIconBg,
                }}
              >
                <Ionicons name="medkit-outline" size={20} color={Tokens.semantic.light.error} />
              </View>
              <Text style={{ color: legalColors.medicalTitle, fontSize: 16, fontWeight: "700", flex: 1 }}>
                Aviso Médico Importante
              </Text>
            </View>
            <Text style={{ color: legalColors.medicalText, fontSize: 14, lineHeight: 20 }}>
              Este aplicativo não substitui consultas médicas. A NathIA oferece
              apoio emocional e informações gerais, mas não é uma profissional de
              saúde. Em caso de emergência, procure atendimento médico imediato.
            </Text>
          </View>
        </Animated.View>

        {/* Direitos LGPD */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500).springify()}
          className="px-4 mb-6"
        >
          <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: "500", marginBottom: 12, marginLeft: 4 }}>
            SEUS DIREITOS (LGPD)
          </Text>
          <View
            style={[
              { backgroundColor: legalColors.cardBg, borderRadius: 20, padding: 16 },
              shadowPresets.md,
            ]}
          >
            <Text style={{ color: colors.text.secondary, fontSize: 14, marginBottom: 16 }}>
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </Text>
            {INFO_ITEMS[0].items?.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    marginTop: 2,
                    backgroundColor: legalColors.lgpdCheckBg,
                  }}
                >
                  <Ionicons name="checkmark" size={14} color={legalColors.lgpdCheck} />
                </View>
                <Text style={{ color: colors.text.secondary, fontSize: 14, flex: 1 }}>{item}</Text>
              </View>
            ))}
            <Pressable
              onPress={handleContactDPO}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 16,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: legalColors.lgpdContactBg,
              }}
              accessibilityRole="button"
              accessibilityLabel="Entrar em contato com o DPO"
              accessibilityHint="Abre o email para contato sobre privacidade"
            >
              <Ionicons name="mail-outline" size={18} color={legalColors.lgpdContactText} />
              <Text style={{ color: legalColors.lgpdContactText, fontSize: 14, fontWeight: "600", marginLeft: 8 }}>
                Entrar em contato sobre seus dados
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Uso de IA */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(500).springify()}
          className="px-4 mb-6"
        >
          <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: "500", marginBottom: 12, marginLeft: 4 }}>
            SOBRE A INTELIGÊNCIA ARTIFICIAL
          </Text>
          <View
            style={{
              backgroundColor: legalColors.aiBg,
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: legalColors.aiBorder,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                  backgroundColor: legalColors.aiIconBg,
                }}
              >
                <Ionicons name="sparkles" size={20} color={Tokens.brand.secondary[500]} />
              </View>
              <Text style={{ color: legalColors.aiTitle, fontSize: 16, fontWeight: "700", flex: 1 }}>
                NathIA - Sua Assistente
              </Text>
            </View>
            <Text style={{ color: legalColors.aiText, fontSize: 14, lineHeight: 20, marginBottom: 12 }}>
              A NathIA utiliza inteligência artificial para oferecer apoio
              emocional e informações sobre maternidade. Suas conversas são
              processadas por provedores de IA (OpenAI/Google) para gerar respostas.
            </Text>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={legalColors.aiInfo}
                style={{ marginTop: 2, marginRight: 6 }}
              />
              <Text style={{ color: legalColors.aiInfoText, fontSize: 12, flex: 1 }}>
                Não compartilhamos suas conversas com terceiros para fins de marketing.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Versão e Copyright */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(500).springify()}
          style={{ alignItems: "center", marginTop: 16 }}
        >
          <Text style={{ color: colors.neutral[400], fontSize: 14 }}>Nossa Maternidade v1.0.0</Text>
          <Text style={{ color: colors.neutral[300], fontSize: 12, marginTop: 4 }}>
            © 2025 Nathália Valente. Todos os direitos reservados.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
