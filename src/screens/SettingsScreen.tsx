/**
 * Settings Screen
 * Tela de configurações com funcionalidades LGPD (Export Data, Delete Account)
 */

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
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Download,
  Trash2,
  Shield,
  Lock,
  FileText,
  LogOut,
  ChevronRight,
  Cpu,
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Tokens } from '../theme';
import { useAuth } from '../context/AuthContext';
import { userDataService } from '../services/userDataService';
import { logger } from '../utils/logger';
import * as FileSystem from 'expo-file-system';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
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
                throw new Error(error?.message || 'Erro ao exportar dados');
              }

              // Converter para JSON string
              const jsonString = JSON.stringify(data, null, 2);
              const fileName = `nossa-maternidade-dados-${new Date().toISOString().split('T')[0]}.json`;

              if (Platform.OS === 'web') {
                // Web: download direto
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);
              } else {
                // Mobile: salvar arquivo e compartilhar
                const dir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
                const fileUri = `${dir}${fileName}`;
                await FileSystem.writeAsStringAsync(fileUri, jsonString, {
                  encoding: 'utf8' as any,
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
            } catch (error: any) {
              logger.error('[SettingsScreen] Erro ao exportar dados', error);
              Alert.alert('Erro', error.message || 'Não foi possível exportar seus dados. Tente novamente.');
            } finally {
              setExporting(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Solicita deleção da conta
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
            // Confirmação final
            Alert.alert(
              'Última Confirmação',
              'Digite "DELETAR" para confirmar a exclusão permanente da sua conta.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Confirmar',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      setDeleting(true);
                      logger.warn('[SettingsScreen] Iniciando deleção de conta', {
                        userId: user?.id,
                      });

                      // Usar soft delete (marca para deleção após período de retenção)
                      const { success, error } = await userDataService.requestAccountDeletion();

                      if (!success) {
                        throw new Error(error?.message || 'Erro ao deletar conta');
                      }

                      Alert.alert(
                        'Conta Deletada',
                        'Sua solicitação de exclusão foi registrada. Sua conta será permanentemente deletada em até 30 dias, conforme previsto pela LGPD.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              signOut();
                              // Navigation será redirecionado automaticamente pelo AuthContext
                            },
                          },
                        ]
                      );
                    } catch (error: any) {
                      logger.error('[SettingsScreen] Erro ao deletar conta', error);
                      Alert.alert('Erro', error.message || 'Não foi possível deletar sua conta. Tente novamente.');
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
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
    destructive?: boolean;
    loading?: boolean;
  }) => (
    <TouchableOpacity
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
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: destructive
            ? `${colors.text.error}15`
            : `${colors.primary.main}15`,
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
          <Icon
            size={20}
            color={destructive ? colors.text.error : colors.primary.main}
          />
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
      {!loading && (
        <ChevronRight size={20} color={colors.text.tertiary} />
      )}
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
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
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
            // @ts-ignore
            navigation.navigate('PrivacyPolicy');
          }}
        />

        <SettingItem
          icon={FileText}
          title="Termos de Uso"
          subtitle="Termos e condições do serviço"
          onPress={() => {
            // @ts-ignore
            navigation.navigate('TermsOfService');
          }}
        />

        {/* Sistema / Debug */}
        <SectionTitle>Sistema</SectionTitle>

        <SettingItem
          icon={Cpu}
          title="Status dos Agentes IA"
          subtitle="Monitorar 6 agentes inteligentes ativos"
          onPress={() => {
            // @ts-ignore
            navigation.navigate('AgentsStatus');
          }}
        />

        {/* Conta */}
        <SectionTitle>Conta</SectionTitle>

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

