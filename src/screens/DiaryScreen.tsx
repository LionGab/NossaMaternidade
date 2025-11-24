import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Sparkles, Send, Layout, Calendar, BookHeart, Shield } from 'lucide-react-native';
import { geminiService } from '../services/geminiService';
import { useTheme } from '../theme/ThemeContext';
import { Button } from '../components';

export default function DiaryScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setIsAnalyzing(true);

    try {
      const aiResponse = await geminiService.analyzeDiaryEntry(entry);
      setResponse(aiResponse.text || 'Guardei seu desabafo com carinho, mesmo com minha conexão instável.');
    } catch (error) {
      console.error('Error analyzing diary:', error);
      setResponse('Guardei seu desabafo com carinho, mesmo com minha conexão instável.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ActionBtn = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
    <TouchableOpacity
      className="w-full bg-white dark:bg-nath-dark-card p-4 rounded-xl border flex-row items-center gap-4 mb-3"
      style={{
        borderColor: colors.border.light,
      }}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      accessibilityHint="Toque para executar esta ação"
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{
          backgroundColor: isDark ? '#1D2843' : '#F3F4F6',
        }}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-bold mb-0.5" style={{ color: colors.text.primary }}>
          {title}
        </Text>
        <Text className="text-xs" style={{ color: colors.text.secondary }}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#020617' : '#F8F9FA' }}
      accessible={true}
      accessibilityLabel="Tela do Diário MãesValente"
    >
      {/* Header */}
      <View
        className="px-4 py-4 flex-row items-center justify-between border-b"
        style={{
          backgroundColor: isDark ? '#0B1220' : '#FFFFFF',
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
          <ArrowLeft size={20} color={isDark ? '#000000' : '#FFFFFF'} />
        </TouchableOpacity>

        <View className="items-center" accessible={true} accessibilityRole="header">
          <Text
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: colors.primary.main }}
            accessibilityLabel="Nossa Maternidade"
          >
            Nossa Maternidade
          </Text>
          <View className="flex-row items-center gap-1">
            <Text
              className="text-sm font-bold"
              style={{ color: colors.text.primary }}
              accessibilityLabel="Diário MãesValente"
            >
              Diário{' '}
            </Text>
            <Sparkles size={10} color={colors.primary.main} />
            <Text className="text-sm font-bold" style={{ color: colors.text.primary }}>
              {' '}MãesValente
            </Text>
          </View>
        </View>

        <View className="w-9" />
      </View>

      <ScrollView
        className="flex-1 p-6"
        showsVerticalScrollIndicator={false}
        accessible={false}
      >
        {!response ? (
          // Input State
          <View>
            <Text
              className="block font-bold text-lg mb-4"
              style={{ color: colors.text.primary }}
              accessibilityRole="header"
              accessibilityLabel="Como você está se sentindo?"
            >
              Como você está se sentindo?
            </Text>
            <TextInput
              value={entry}
              onChangeText={setEntry}
              placeholder="Desabafa aqui, como se estivesse falando com uma amiga... Não vou julgar, só te escutar."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={10}
              className="w-full p-4 rounded-2xl border text-base"
              style={{
                backgroundColor: isDark ? '#0B1220' : '#FFFFFF',
                borderColor: colors.border.light,
                color: colors.text.primary,
                minHeight: 256,
                textAlignVertical: 'top',
              }}
              accessibilityLabel="Campo de texto do diário"
              accessibilityHint="Digite seus pensamentos e sentimentos aqui"
            />
            <View className="mt-2 flex-row justify-end">
              <View
                className="flex-row items-center gap-1"
                accessible={true}
                accessibilityLabel="Ambiente seguro e privado"
              >
                <Shield size={12} color={colors.text.tertiary} />
                <Text className="text-xs" style={{ color: colors.text.tertiary }}>
                  Ambiente seguro e privado
                </Text>
              </View>
            </View>
          </View>
        ) : (
          // Response State
          <View>
            {/* Original Entry (Collapsed or Preview) */}
            <View
              className="bg-white dark:bg-nath-dark-card p-4 rounded-xl border mb-6 opacity-70"
              style={{ borderColor: colors.border.light }}
              accessible={true}
              accessibilityLabel={`Sua entrada no diário: ${entry}`}
              accessibilityRole="text"
            >
              <Text className="text-sm italic" numberOfLines={3} style={{ color: colors.text.secondary }}>
                "{entry}"
              </Text>
            </View>

            {/* NathIA Response */}
            <View className="flex-row gap-4 mb-8">
              <View
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md"
                accessible={true}
                accessibilityLabel="Avatar da MãesValente"
              >
                <Image
                  source={{ uri: 'https://i.imgur.com/RRIaE7t.jpg' }}
                  className="w-full h-full"
                  contentFit="cover"
                  transition={200}
                />
              </View>
              <View
                className="flex-1 p-5 rounded-2xl rounded-tl-none relative"
                style={{
                  backgroundColor: isDark ? '#0B1220' : '#E8F0FE',
                }}
                accessible={true}
                accessibilityLabel={`Resposta da MãesValente: ${response}`}
                accessibilityRole="text"
              >
                <Sparkles
                  size={16}
                  color={colors.primary.main}
                  style={{ position: 'absolute', top: 16, right: 16 }}
                />
                <Text className="leading-relaxed" style={{ color: colors.text.primary }}>
                  {response}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <Text
              className="font-bold text-sm uppercase tracking-wider mb-4"
              style={{ color: colors.text.secondary }}
              accessibilityRole="header"
              accessibilityLabel="Como posso te ajudar agora?"
            >
              Como posso te ajudar agora?
            </Text>
            <View>
              <ActionBtn
                icon={<Layout size={20} color={colors.text.primary} />}
                title="Organizar meu dia de amanhã"
                subtitle="Criar checklist leve"
              />
              <ActionBtn
                icon={<Calendar size={20} color={colors.text.primary} />}
                title="Criar rotina para a semana"
                subtitle="Planejamento suave"
              />
              <ActionBtn
                icon={<BookHeart size={20} color={colors.text.primary} />}
                title="Guardar no meu Refúgio"
                subtitle="Salvar como memória"
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Action */}
      {!response && (
        <View
          className="p-6 border-t"
          style={{
            backgroundColor: isDark ? '#0B1220' : '#FFFFFF',
            borderTopColor: colors.border.light,
          }}
        >
          <Button
            title={isAnalyzing ? 'Analisando com carinho...' : 'Enviar para MãesValente'}
            onPress={handleSubmit}
            disabled={!entry.trim() || isAnalyzing}
            loading={isAnalyzing}
            fullWidth
          />
        </View>
      )}
    </SafeAreaView>
  );
}

