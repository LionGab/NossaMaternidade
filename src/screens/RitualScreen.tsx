import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight, Check, ArrowLeft, Moon, Sun, Coffee, Heart, Shield, Smile, Meh, Frown, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Button } from '../components';

export default function RitualScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [currentFeeling, setCurrentFeeling] = useState<string | null>(null);
  const [desiredFeeling, setDesiredFeeling] = useState<string | null>(null);

  const getPractice = () => {
    return {
      title: 'Pausa de Respiração 4-7-8',
      text: 'Inspire pelo nariz contando até 4. Segure o ar por 7. Solte pela boca fazendo som de "ahh" por 8. Repita 3 vezes.',
      action: 'Fazer agora (30s)',
    };
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // @ts-ignore
      navigation.navigate('Main');
    }
  };

  const feelings = [
    { icon: BatteryLow, label: 'Exausta', id: 'exausta', color: colors.status.error },
    { icon: Frown, label: 'Ansiosa', id: 'ansiosa', color: colors.raw.accent.orange },
    { icon: Meh, label: 'Confusa', id: 'confusa', color: colors.status.warning },
    { icon: BatteryMedium, label: 'Ok', id: 'ok', color: colors.primary.main },
    { icon: BatteryFull, label: 'Grata', id: 'grata', color: colors.status.success },
  ];

  const desires = [
    { icon: Shield, label: 'Mais forte', id: 'forte', color: colors.primary.main },
    { icon: Heart, label: 'Acolhida', id: 'acolhida', color: colors.raw.accent.pink },
    { icon: Moon, label: 'Em paz', id: 'paz', color: colors.raw.accent.purple },
    { icon: Sun, label: 'Energizada', id: 'energia', color: colors.status.warning },
  ];

  const practice = getPractice();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background.canvas }}
      accessible={true}
      accessibilityLabel="Tela de Ritual de Respiração"
    >
      {/* Header */}
      <View
        className="px-4 py-4 flex-row items-center justify-between border-b"
        style={{
          backgroundColor: `${colors.background.card}CC`,
          borderBottomColor: colors.border.light,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-black dark:bg-white p-2 rounded-full"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Retorna para a tela anterior"
        >
          <ArrowLeft size={20} color={isDark ? colors.text.primary : colors.text.inverse} />
        </TouchableOpacity>

        <View className="flex-1 mx-4 items-center">
          <Text
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: colors.primary.main }}
            accessibilityLabel="Nossa Maternidade"
          >
            Nossa Maternidade
          </Text>
          <View
            className="w-full max-w-[120px] bg-gray-200 dark:bg-nath-dark-bg h-1.5 rounded-full mt-1.5 overflow-hidden"
            accessible={true}
            accessibilityLabel={`Progresso: ${step} de 3 passos`}
            accessibilityRole="progressbar"
          >
            <View
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </View>
        </View>

        <Text
          className="text-xs font-bold w-9 text-right"
          style={{ color: colors.text.secondary }}
          accessibilityLabel="30 segundos"
        >
          00:30
        </Text>
      </View>

      <View className="flex-1 p-6 justify-center">
        {/* Step 1: Current Feeling */}
        {step === 1 && (
          <View accessible={true} accessibilityRole="none">
            <Text
              className="text-2xl font-bold mb-2 text-center"
              style={{ color: colors.text.primary }}
              accessibilityRole="header"
              accessibilityLabel="Passo 1: Como você está agora?"
            >
              Como você está agora?
            </Text>
            <Text
              className="text-center mb-8"
              style={{ color: colors.text.secondary }}
              accessibilityLabel="Sem julgamentos, só a verdade"
            >
              Sem julgamentos, só a verdade.
            </Text>
            <View className="flex-row flex-wrap gap-3 justify-center">
              {feelings.map((f) => {
                const Icon = f.icon;
                const isSelected = currentFeeling === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => setCurrentFeeling(f.id)}
                    className="p-4 rounded-2xl border-2 items-center gap-2"
                    style={{
                      borderColor: isSelected ? colors.primary.main : colors.border.light,
                      backgroundColor: isSelected
                        ? isDark
                          ? `${colors.primary.main}33`
                          : colors.primary.light
                        : colors.background.card,
                      width: '47%',
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Sentimento: ${f.label}`}
                    accessibilityHint={`Toque para selecionar ${f.label} como seu sentimento atual`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Icon size={24} color={f.color} />
                    <Text
                      className="font-medium"
                      style={{
                        color: isSelected ? colors.primary.main : colors.text.primary,
                      }}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Desired Feeling */}
        {step === 2 && (
          <View accessible={true} accessibilityRole="none">
            <Text
              className="text-2xl font-bold mb-2 text-center"
              style={{ color: colors.text.primary }}
              accessibilityRole="header"
              accessibilityLabel="Passo 2: Como você quer se sentir?"
            >
              Como você quer se sentir?
            </Text>
            <Text
              className="text-center mb-8"
              style={{ color: colors.text.secondary }}
              accessibilityLabel="Vamos setar uma intenção pro dia"
            >
              Vamos setar uma intenção pro dia.
            </Text>
            <View className="flex-row flex-wrap gap-3 justify-center">
              {desires.map((d) => {
                const Icon = d.icon;
                const isSelected = desiredFeeling === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => setDesiredFeeling(d.id)}
                    className="p-4 rounded-2xl border-2 items-center gap-2"
                    style={{
                      borderColor: isSelected ? colors.raw.accent.pink : colors.border.light,
                      backgroundColor: isSelected
                        ? isDark
                          ? `${colors.raw.accent.pink}33`
                          : colors.secondary.light
                        : colors.background.card,
                      width: '47%',
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Intenção: ${d.label}`}
                    accessibilityHint={`Toque para selecionar ${d.label} como sua intenção do dia`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Icon size={24} color={d.color} />
                    <Text
                      className="font-medium"
                      style={{
                        color: isSelected ? colors.raw.accent.pink : colors.text.primary,
                      }}
                    >
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Practice */}
        {step === 3 && (
          <View className="items-center" accessible={true} accessibilityRole="none">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mx-auto mb-6"
              style={{
                backgroundColor: isDark ? `${colors.status.success}33` : colors.primary.light,
              }}
              accessible={true}
              accessibilityLabel="Ícone de exercício de respiração"
            >
              <Coffee size={32} color={colors.status.success} />
            </View>
            <Text
              className="text-xl font-bold mb-4 text-center"
              style={{ color: colors.text.primary }}
              accessibilityRole="header"
              accessibilityLabel="Passo 3: Vamos fazer isso juntas"
            >
              Vamos fazer isso juntas:
            </Text>

            <View
              className="bg-white dark:bg-nath-dark-card p-6 rounded-2xl mb-8 border-l-4"
              style={{
                borderLeftColor: colors.primary.main,
                borderColor: colors.border.light,
              }}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`${practice.title}. Instruções: ${practice.text}`}
            >
              <Text className="font-bold mb-2" style={{ color: colors.primary.main }}>
                {practice.title}
              </Text>
              <Text className="leading-relaxed" style={{ color: colors.text.primary }}>
                {practice.text}
              </Text>
            </View>

            <Button
              title="Concluído (Vitória!)"
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Main');
              }}
              fullWidth
              accessibilityLabel="Concluído. Vitória!"
              accessibilityHint="Marca o exercício como concluído e retorna para a tela inicial"
            />
            <Text
              className="text-xs mt-4"
              style={{ color: colors.text.tertiary }}
              accessibilityLabel="Isso conta para sua Jornada Emocional"
            >
              Isso conta para sua Jornada Emocional.
            </Text>
          </View>
        )}
      </View>

      {/* Footer Navigation (Steps 1 & 2) */}
      {step < 3 && (
        <View className="p-6">
          <Button
            title="Continuar"
            onPress={handleNext}
            disabled={step === 1 ? !currentFeeling : !desiredFeeling}
            fullWidth
            accessibilityLabel="Continuar para o próximo passo"
            accessibilityHint={
              step === 1
                ? currentFeeling
                  ? 'Avança para selecionar como você quer se sentir'
                  : 'Selecione um sentimento antes de continuar'
                : desiredFeeling
                ? 'Avança para o exercício de respiração'
                : 'Selecione uma intenção antes de continuar'
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

