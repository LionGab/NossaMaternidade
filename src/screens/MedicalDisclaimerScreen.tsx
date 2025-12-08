import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, AlertTriangle, Phone, Stethoscope, Heart } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme, type ThemeColors } from '../theme/ThemeContext';
import { getShadowFromToken } from '../utils/shadowHelper';

export default function MedicalDisclaimerScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleCallSAMU = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('tel:192');
  };

  const handleCallCVV = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('tel:188');
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.canvas }}
      accessibilityLabel="Tela de Aviso Médico"
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={{
          backgroundColor: colors.background.card,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
          ...getShadowFromToken('sm', colors.raw.neutral[900]),
        }}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          style={{
            backgroundColor: colors.background.elevated,
            padding: 8,
            borderRadius: 20,
            marginRight: 12,
          }}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Retorna para a tela anterior"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text.primary,
          }}
          accessibilityRole="header"
        >
          Aviso Médico
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="Conteúdo do Aviso Médico"
      >
        <Text
          style={{
            fontSize: 12,
            color: colors.text.tertiary,
            marginBottom: 20,
          }}
          accessibilityLabel="Última atualização: 24 de novembro de 2025"
        >
          Última atualização: 24 de novembro de 2025
        </Text>

        {/* Critical Warning Box */}
        <View
          style={{
            backgroundColor: isDark ? colors.raw.error[900] : colors.raw.error[50],
            padding: 20,
            borderRadius: 16,
            borderLeftWidth: 4,
            borderLeftColor: colors.status.error,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <AlertTriangle size={24} color={colors.status.error} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.status.error,
                marginLeft: 12,
              }}
            >
              AVISO CRÍTICO
            </Text>
          </View>
          <Paragraph colors={colors} bold>
            Este aplicativo NÃO substitui atendimento médico profissional.
          </Paragraph>
          <Paragraph colors={colors}>
            A Nossa Maternidade é uma plataforma de apoio emocional e informacional. A IA (NathIA)
            oferece suporte emocional, mas NÃO fornece diagnóstico, tratamento ou aconselhamento
            médico.
          </Paragraph>
        </View>

        {/* What This App Does */}
        <Section title="O Que Este App Faz" colors={colors}>
          <BulletPoint colors={colors}>Apoio emocional através de conversas com IA</BulletPoint>
          <BulletPoint colors={colors}>
            Informações educacionais sobre maternidade e desenvolvimento infantil
          </BulletPoint>
          <BulletPoint colors={colors}>
            Comunidade de mães para compartilhamento de experiências
          </BulletPoint>
          <BulletPoint colors={colors}>Rastreamento de hábitos e bem-estar</BulletPoint>
          <BulletPoint colors={colors}>Conteúdos informativos (vídeos, artigos, áudios)</BulletPoint>
        </Section>

        {/* What This App Does NOT Do */}
        <Section title="O Que Este App NÃO Faz" colors={colors}>
          <BulletPoint colors={colors}>NÃO fornece diagnóstico médico</BulletPoint>
          <BulletPoint colors={colors}>
            NÃO prescreve medicamentos ou tratamentos
          </BulletPoint>
          <BulletPoint colors={colors}>
            NÃO substitui consultas com médicos, pediatras ou profissionais de saúde
          </BulletPoint>
          <BulletPoint colors={colors}>NÃO oferece aconselhamento médico de emergência</BulletPoint>
          <BulletPoint colors={colors}>NÃO trata condições médicas graves</BulletPoint>
        </Section>

        {/* Emergency Section */}
        <Section title="Em Caso de Emergência Médica" colors={colors}>
          <Paragraph colors={colors} bold>
            Se você ou seu bebê estiverem com sintomas graves ou emergência médica:
          </Paragraph>
          <BulletPoint colors={colors}>
            Ligue imediatamente para{' '}
            <Text
              style={{ fontWeight: 'bold', color: colors.status.error }}
              onPress={handleCallSAMU}
            >
              192 (SAMU)
            </Text>{' '}
            ou vá ao pronto-socorro mais próximo
          </BulletPoint>
          <BulletPoint colors={colors}>
            NÃO use este app para diagnosticar ou tratar emergências
          </BulletPoint>
          <BulletPoint colors={colors}>
            Sempre consulte um profissional de saúde qualificado para questões médicas
          </BulletPoint>

          {/* Emergency Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 16,
            }}
          >
            <TouchableOpacity
              onPress={handleCallSAMU}
              style={{
                flex: 1,
                backgroundColor: colors.status.error,
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                minHeight: 44,
              }}
              accessibilityRole="button"
              accessibilityLabel="Ligar para SAMU 192"
              accessibilityHint="Abre o discador para ligar para emergências médicas"
            >
              <Phone size={20} color={colors.text.inverse} style={{ marginRight: 8 }} />
              <Text
                style={{
                  color: colors.text.inverse,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                SAMU 192
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCallCVV}
              style={{
                flex: 1,
                backgroundColor: colors.primary.main,
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                minHeight: 44,
              }}
              accessibilityRole="button"
              accessibilityLabel="Ligar para CVV 188"
              accessibilityHint="Abre o discador para ligar para apoio emocional"
            >
              <Heart size={20} color={colors.text.inverse} style={{ marginRight: 8 }} />
              <Text
                style={{
                  color: colors.text.inverse,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                CVV 188
              </Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* When to Seek Medical Help */}
        <Section title="Quando Procurar Ajuda Médica Profissional" colors={colors}>
          <Paragraph colors={colors}>
            Você deve procurar um médico, pediatra ou profissional de saúde se:
          </Paragraph>
          <BulletPoint colors={colors}>
            <Text style={{ fontWeight: 'bold', color: colors.status.error }}>Emergência médica</Text>{' '}
            (febre alta, dificuldade respiratória, convulsões)
          </BulletPoint>
          <BulletPoint colors={colors}>
            <Text style={{ fontWeight: 'bold', color: colors.status.error }}>Sintomas graves</Text> no
            bebê (vômitos persistentes, desidratação, choro inconsolável)
          </BulletPoint>
          <BulletPoint colors={colors}>
            <Text style={{ fontWeight: 'bold', color: colors.status.error }}>
              Problemas de saúde mental
            </Text>{' '}
            (depressão pós-parto, ansiedade severa, pensamentos suicidas)
          </BulletPoint>
          <BulletPoint colors={colors}>
            <Text style={{ fontWeight: 'bold', color: colors.status.error }}>
              Complicações na gravidez
            </Text>{' '}
            (sangramento, dor abdominal intensa, pressão alta)
          </BulletPoint>
          <BulletPoint colors={colors}>
            <Text style={{ fontWeight: 'bold', color: colors.status.error }}>Qualquer dúvida sobre saúde</Text> que
            exija avaliação profissional
          </BulletPoint>
        </Section>

        {/* Limitation of Liability */}
        <Section title="Limitação de Responsabilidade" colors={colors}>
          <Paragraph colors={colors}>A Nossa Maternidade não se responsabiliza por:</Paragraph>
          <BulletPoint colors={colors}>
            Decisões médicas tomadas com base em informações do app
          </BulletPoint>
          <BulletPoint colors={colors}>
            Consequências de não procurar atendimento médico quando necessário
          </BulletPoint>
          <BulletPoint colors={colors}>
            Interpretações incorretas de informações educacionais
          </BulletPoint>
          <BulletPoint colors={colors}>Ações de terceiros (outros usuários da comunidade)</BulletPoint>
        </Section>

        {/* Final Recommendation */}
        <Section title="Recomendação Final" colors={colors}>
          <Paragraph colors={colors} bold>
            Sempre consulte um médico, pediatra ou profissional de saúde qualificado para:
          </Paragraph>
          <BulletPoint colors={colors}>Questões de saúde física ou mental</BulletPoint>
          <BulletPoint colors={colors}>Sintomas preocupantes</BulletPoint>
          <BulletPoint colors={colors}>Decisões sobre medicamentos ou tratamentos</BulletPoint>
          <BulletPoint colors={colors}>Emergências médicas</BulletPoint>
          <Paragraph colors={colors} style={{ marginTop: 12 }}>
            Este app é uma <Text style={{ fontWeight: 'bold' }}>ferramenta complementar</Text> de apoio
            emocional e informação, não um substituto para cuidados médicos profissionais.
          </Paragraph>
        </Section>

        {/* Contact */}
        <Section title="Contato para Dúvidas" colors={colors}>
          <Paragraph colors={colors}>
            Se tiver dúvidas sobre este aviso ou sobre quando procurar ajuda médica:
          </Paragraph>
          <Paragraph colors={colors}>
            <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>Email:</Text>{' '}
            contato@nossaMATERNIDADE.app
          </Paragraph>
          <Paragraph colors={colors}>
            <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>Suporte:</Text>{' '}
            suporte@nossaMATERNIDADE.app
          </Paragraph>
        </Section>

        {/* Final Message */}
        <View
          style={{
            backgroundColor: colors.background.elevated,
            padding: 20,
            borderRadius: 16,
            marginTop: 24,
            marginBottom: 40,
            borderWidth: 1,
            borderColor: colors.border.medium,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Stethoscope size={24} color={colors.primary.main} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: colors.text.primary,
                marginLeft: 12,
              }}
            >
              Lembre-se
            </Text>
          </View>
          <Paragraph colors={colors}>
            Sua saúde e a saúde do seu bebê são prioridades. Quando em dúvida, sempre procure um
            profissional de saúde qualificado.
          </Paragraph>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Components
interface SectionProps {
  title: string;
  colors: ThemeColors;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, colors, children }) => (
  <View style={{ marginBottom: 24 }} accessible={true} accessibilityRole="text">
    <Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 12,
      }}
      accessibilityRole="header"
    >
      {title}
    </Text>
    {children}
  </View>
);

interface ParagraphProps {
  colors: ThemeColors;
  children: React.ReactNode;
  bold?: boolean;
  style?: Record<string, unknown>;
}

const Paragraph: React.FC<ParagraphProps> = ({ colors, children, bold = false, style }) => (
  <Text
    style={{
      fontSize: 14,
      lineHeight: 22,
      color: colors.text.secondary,
      marginBottom: 8,
      fontWeight: bold ? '600' : 'normal',
      ...style,
    }}
  >
    {children}
  </Text>
);

interface BulletPointProps {
  colors: ThemeColors;
  children: React.ReactNode;
}

const BulletPoint: React.FC<BulletPointProps> = ({ colors, children }) => (
  <View
    style={{
      flexDirection: 'row',
      marginBottom: 6,
      paddingLeft: 8,
    }}
  >
    <Text
      style={{
        color: colors.primary.main,
        marginRight: 8,
        fontSize: 14,
      }}
    >
      •
    </Text>
    <Text
      style={{
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: colors.text.secondary,
      }}
    >
      {children}
    </Text>
  </View>
);

