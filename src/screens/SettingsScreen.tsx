/**
 * Settings Screen
 * Tela de configurações com funcionalidades LGPD (Export Data, Delete Account)
 */

import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import {
  ArrowLeft,
  Download,
  Trash2,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Cpu,
  User,
  Palette,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import { userDataService } from '../services/userDataService';
import { Tokens } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { logger } from '../utils/logger';

export default function SettingsScreen() {
  const { colors, isDark: _isDark } = useTheme();
  const navigation = useNavigation();
  const { signOut, user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /**
   * Exporta todos os dados do usuário
   */
  const handleExportData = async () => {
    Alert.alert(
      'Exportar Dados',
      'Todos os seus dados pessoais serão exportados em formato JSON. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Exportar',
          onPress: async () => {
            try {
              setExporting(true);
              logger.info('[SettingsScreen] Iniciando exportação de dados');

              const { data, error } = await userDataService.exportUserData();

              if (error || !data) {
                const errorMsg =
                  typeof error === 'string'
                    ? error
                    : error instanceof Error
                      ? error.message
                      : 'Erro ao exportar dados';
                throw new Error(errorMsg);
              }

              // Converter para JSON string
              const jsonString = JSON.stringify(data, null, 2);
              const fileName = `nossa-maternidade-dados-${new Date().toISOString().split('T')[0]}.json`;

              if (Platform.OS === 'web') {
                // Web: download direto
                try {
                  const blob = new Blob([jsonString], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);

                  // Verificar se document existe antes de usar
                  if (typeof document !== 'undefined' && document.createElement && document.body) {
                    try {
                      const link = document.createElement('a');
                      if (link) {
                        link.href = url;
                        link.download = fileName;
                        link.style.display = 'none';

                        // Verificar se body existe antes de adicionar
                        if (document.body) {
                          document.body.appendChild(link);
                          link.click();
                          // Aguardar um pouco antes de remover para garantir que o download iniciou
                          setTimeout(() => {
                            if (document.body && document.body.contains(link)) {
                              document.body.removeChild(link);
                            }
                            URL.revokeObjectURL(url);
                          }, 100);
                        } else {
                          throw new Error('Document body not found');
                        }
                      } else {
                        throw new Error('Não foi possível criar elemento de download');
                      }
                    } catch (domError) {
                      logger.error('[SettingsScreen] DOM manipulation error', domError);
                      URL.revokeObjectURL(url);
                      throw new Error('Erro ao manipular DOM para download');
                    }
                  } else {
                    logger.warn('[SettingsScreen] Document not available for web download');
                    throw new Error('Ambiente web não disponível para download');
                  }
                } catch (error) {
                  logger.error('[SettingsScreen] Erro ao criar download no web', error);
                  throw error;
                }
              } else {
                // Mobile: salvar arquivo e compartilhar
                const dir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
                const fileUri = `${dir}${fileName}`;
                await FileSystem.writeAsStringAsync(fileUri, jsonString, {
                  encoding: FileSystem.EncodingType.UTF8,
                });

                // Compartilhar arquivo
                await Share.share({
                  message: `Meus dados do Nossa Maternidade`,
                  url: fileUri,
                  title: 'Exportar Dados',
                });
              }

              Alert.alert('Sucesso', 'Seus dados foram exportados com sucesso!');
              logger.info('[SettingsScreen] Exportação concluída com sucesso');
            } catch (error) {
              logger.error('[SettingsScreen] Erro ao exportar dados', error);
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Não foi possível exportar seus dados. Tente novamente.';
              Alert.alert('Erro', errorMessage);
            } finally {
              setExporting(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Fluxo de deleção permanente da conta (LGPD - direito ao esquecimento)
   * Usa Edge Function delete-account + limpeza de dados locais
   *
   * Fluxo:
   * 1. Confirmação inicial com lista do que será deletado
   * 2. Confirmação final (dupla confirmação para segurança)
   * 3. Chama userDataService.deleteAccount() que:
   *    - Deleta dados no servidor via Edge Function
   *    - Faz signOut e limpa todos os dados locais
   * 4. AuthContext detecta signOut e redireciona para login
   */
  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Deletar Conta',
      'Esta ação é IRREVERSÍVEL. Todos os seus dados serão permanentemente deletados, incluindo:\n\n• Seu perfil\n• Todas as conversas com a IA\n• Seus hábitos e marcos\n• Interações e conteúdo salvo\n\nTem certeza que deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar Conta',
          style: 'destructive',
          onPress: () => {
            // Confirmação final (dupla confirmação para segurança)
            Alert.alert(
              'Última Confirmação',
              'Confirme que deseja excluir permanentemente sua conta e todos os dados associados.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Excluir definitivamente',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setDeleting(true);
                      logger.warn('[SettingsScreen] Iniciando deleção de conta', {
                        userId: user?.id,
                      });

                      const { success, error } = await userDataService.deleteAccount();

                      if (!success) {
                        // error já é string amigável do userDataService
                        throw new Error(error || 'Erro ao deletar conta');
                      }

                      // Sucesso: mostrar mensagem de despedida empática
                      // O signOut já foi feito pelo userDataService
                      // O AuthContext detectará e redirecionará para login
                      Alert.alert(
                        'Conta deletada',
                        'Sua conta e todos os dados foram removidos permanentemente. Obrigada por ter feito parte da Nossa Maternidade. 💙',
                        [{ text: 'OK' }]
                      );

                      logger.info('[SettingsScreen] Conta deletada com sucesso');
                    } catch (error) {
                      logger.error('[SettingsScreen] Erro ao deletar conta', error);
                      Alert.alert(
                        'Não foi possível excluir',
                        error instanceof Error
                          ? error.message
                          : 'Não conseguimos completar a exclusão da sua conta agora. Verifique sua conexão e tente novamente.'
                      );
                    } finally {
                      setDeleting(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  /**
   * Logout
   */
  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Text
      style={{
        fontSize: Tokens.typography.sizes.xs, // 12
        fontWeight: Tokens.typography.weights.semibold, // '600'
        color: colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 24,
        marginBottom: 12,
        marginHorizontal: 16,
      }}
    >
      {children}
    </Text>
  );

  const SettingItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    destructive = false,
    loading = false,
  }: {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    title: string;
    subtitle?: string;
    onPress: () => void;
    destructive?: boolean;
    loading?: boolean;
  }) => (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={loading}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
      }}
    >
      <View
        style={{
          width: Tokens.touchTargets.min, // 44pt WCAG AAA
          height: Tokens.touchTargets.min, // 44pt WCAG AAA
          borderRadius: Tokens.touchTargets.min / 2,
          backgroundColor: destructive ? `${colors.text.error}15` : `${colors.primary.main}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={destructive ? colors.text.error : colors.primary.main}
          />
        ) : (
          <Icon size={20} color={destructive ? colors.text.error : colors.primary.main} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: Tokens.typography.sizes.base, // 16
            fontWeight: Tokens.typography.weights.semibold, // '600'
            color: destructive ? colors.text.error : colors.text.primary,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: Tokens.typography.sizes.xs, // 12
              color: colors.text.secondary,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {!loading && <ChevronRight size={20} color={colors.text.tertiary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.canvas }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: colors.background.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Retorna para a tela anterior"
          onPress={() => navigation.goBack()}
          style={{
            width: Tokens.touchTargets.min, // 44pt WCAG AAA
            height: Tokens.touchTargets.min, // 44pt WCAG AAA
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: Tokens.typography.sizes.xl, // 20
            fontWeight: Tokens.typography.weights.bold,
            color: colors.text.primary,
          }}
        >
          Configurações
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Privacidade e Dados */}
        <SectionTitle>Privacidade e Dados</SectionTitle>

        <SettingItem
          icon={Download}
          title="Exportar Meus Dados"
          subtitle="Baixar todos os seus dados pessoais em formato JSON"
          onPress={handleExportData}
          loading={exporting}
        />

        <SettingItem
          icon={Shield}
          title="Política de Privacidade"
          subtitle="Como protegemos seus dados"
          onPress={() => {
            navigation.navigate('PrivacyPolicy' as never);
          }}
        />

        <SettingItem
          icon={FileText}
          title="Termos de Uso"
          subtitle="Termos e condições do serviço"
          onPress={() => {
            navigation.navigate('TermsOfService' as never);
          }}
        />

        <SettingItem
          icon={Shield}
          title="Aviso Médico"
          subtitle="Informações importantes sobre saúde"
          onPress={() => {
            navigation.navigate('MedicalDisclaimer' as never);
          }}
        />

        {/* Sistema / Debug */}
        <SectionTitle>Sistema</SectionTitle>

        <SettingItem
          icon={Palette}
          title="Design System"
          subtitle="Visualizar componentes e tokens de design"
          onPress={() => {
            navigation.navigate('DesignSystem' as never);
          }}
        />

        <SettingItem
          icon={Cpu}
          title="Status dos Agentes IA"
          subtitle="Monitorar 6 agentes inteligentes ativos"
          onPress={() => {
            navigation.navigate('AgentsStatus' as never);
          }}
        />

        {/* Conta */}
        <SectionTitle>Conta</SectionTitle>

        <SettingItem
          icon={User}
          title="Editar Perfil"
          subtitle="Atualizar seus dados pessoais e preferências"
          onPress={() => {
            navigation.navigate('Profile' as never);
          }}
        />

        <SettingItem
          icon={Trash2}
          title="Deletar Minha Conta"
          subtitle="Excluir permanentemente sua conta e todos os dados (irreversível)"
          onPress={handleDeleteAccount}
          destructive
          loading={deleting}
        />

        <SettingItem
          icon={LogOut}
          title="Sair da Conta"
          subtitle="Fazer logout do aplicativo"
          onPress={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
