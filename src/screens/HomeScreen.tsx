/**
 * HomeScreen - Tela Principal (Home) Moderna e Modular
 *
 * Design System completo com:
 * - Componentes modulares reutilizáveis
 * - NathIACard (avatar + áudio/texto)
 * - VibeTrackerCard (tabs + slider + emojis)
 * - ProjetoAfricaCard (vídeo com overlay)
 * - HomeFooter (branding)
 * - Gradiente de fundo
 * - Navegação para Chat, MundoNath, etc.
 *
 * @version 3.0.0
 * @date 2025-12-10
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SafeAreaContainer } from '@/components/layout/SafeAreaContainer';
import { SOSMaeFloatingButton } from '@/components/sos';
import { NathIACard } from '@/components/home/NathIACard';
import { VibeTrackerCard, type VibeData } from '@/components/home/VibeTrackerCard';
import { ProjetoAfricaCard } from '@/components/home/ProjetoAfricaCard';
import { HomeFooter } from '@/components/home/HomeFooter';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { logger } from '@/utils/logger';
import { Tokens } from '@/theme/tokens';

// Paleta de cores do gradiente
const GRADIENT_COLORS = {
  top: '#FDF9FB', // Rosa suave
  bottom: '#F3F7FF', // Azul suave
};

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [isSavingVibe, setIsSavingVibe] = useState(false);

  // Handlers
  const handleAudioPress = useCallback(() => {
    logger.info('[HomeScreen] Audio button pressed');
    navigation.navigate('Chat', {
      sessionId: undefined,
      startRecording: true,
      context: 'welcome',
    });
  }, [navigation]);

  const handleTextPress = useCallback(() => {
    logger.info('[HomeScreen] Text button pressed');
    navigation.navigate('Chat', {
      sessionId: undefined,
      context: 'welcome',
    });
  }, [navigation]);

  const handleViewLastConversation = useCallback(() => {
    logger.info('[HomeScreen] View last conversation pressed');
    navigation.navigate('Chat', {
      sessionId: undefined,
      context: 'welcome',
      showHistory: true,
    });
  }, [navigation]);

  const handleSaveVibe = useCallback(async (data: VibeData) => {
    logger.info('[HomeScreen] Saving vibe data', { data });
    setIsSavingVibe(true);

    try {
      // Simular salvamento (substituir por chamada real ao Supabase)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      logger.info('[HomeScreen] Vibe saved successfully', { data });
      Alert.alert(
        'Vibe Salva!',
        `Seu humor de ${data.vibeLevel}% ${data.emoji} foi registrado com sucesso.`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      logger.error('[HomeScreen] Error saving vibe', error);
      Alert.alert('Erro', 'Não foi possível salvar seu humor. Tente novamente.');
    } finally {
      setIsSavingVibe(false);
    }
  }, []);

  const handlePlayProjectVideo = useCallback(() => {
    logger.info('[HomeScreen] Play Projeto África video');
    // Se não tiver videoUrl no ProjetoAfricaCard, este handler será chamado
    // Pode navegar para uma tela específica ou abrir modal
    navigation.navigate('MundoNath');
  }, [navigation]);

  return (
    <SafeAreaContainer edges={['top']} backgroundColor={GRADIENT_COLORS.top}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[GRADIENT_COLORS.top, GRADIENT_COLORS.bottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: Tokens.spacing['6'],
          // Espaço para: tab bar (~70px) + botão SOS (~134px) + padding extra
          paddingBottom: insets.bottom + 200,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* NathIA Card */}
        <NathIACard
          onAudioPress={handleAudioPress}
          onTextPress={handleTextPress}
          onViewLastConversation={handleViewLastConversation}
          lastConversation="Ontem às 14:30"
          aiName="NathIA"
          description="Sua bestie de bolso, sempre pronta pra te ouvir"
        />

        {/* Vibe Tracker Card */}
        <VibeTrackerCard
          onSave={handleSaveVibe}
          initialPeriod={0}
          initialVibeLevel={50}
          initialEmoji="🙂"
          isSaving={isSavingVibe}
        />

        {/* Projeto África Card */}
        <ProjetoAfricaCard
          title="Projeto África"
          description="Conheça o impacto da nossa comunidade no continente africano"
          imageUrl="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"
          videoUrl={undefined} // Se tiver URL de vídeo, colocar aqui
          onPlayPress={handlePlayProjectVideo}
          height={280}
        />

        {/* Footer */}
        <HomeFooter
          message="Feito com amor para mães que fazem a diferença"
          showIcons
        />
      </ScrollView>

      {/* SOS Mãe Floating Button */}
      <SOSMaeFloatingButton />
    </SafeAreaContainer>
  );
}
