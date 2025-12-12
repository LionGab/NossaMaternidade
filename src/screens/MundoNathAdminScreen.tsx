/**
 * MundoNathAdminScreen - Painel Admin da Nath
 *
 * Permite que apenas a Nathália Valente (e equipe) postem e gerenciem
 * conteúdos do Mundo da Nath.
 *
 * Features:
 * - Lista de conteúdos com status (draft/scheduled/published)
 * - Formulário de criação/edição
 * - Definir conteúdo como destaque
 * - Mock apenas (sem persistência real ainda)
 *
 * @version 1.0.0
 */

import { StatusBar } from 'expo-status-bar';
import { Video, Headphones, BookOpen, Sparkles, Plus, Edit2, Star } from 'lucide-react-native';
import { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { Spacing, Radius } from '@/theme/tokens';
import type { NathContentItem, NathContentType, NathContentStatus } from '@/types/nathContent';
import { logger } from '@/utils/logger';

// Cores
const COLORS = {
  background: '#FAFAFA',
  card: '#FFFFFF',
  primary: '#E91E63',
  primaryLight: '#FFE4EC',
  textDark: '#3A2E2E',
  textMuted: '#6A5450',
  border: 'rgba(0,0,0,0.08)',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

// Mock inicial
const INITIAL_CONTENT: NathContentItem[] = [
  {
    id: '1',
    type: 'ritual',
    title: 'Ritual de 3 Minutos',
    description: 'Reconecte-se com você antes de começar o caos do dia',
    durationMinutes: 3,
    isExclusive: true,
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    likesCount: 234,
    viewsCount: 1542,
  },
  {
    id: '2',
    type: 'video',
    title: 'Autocuidado em 10 Minutos',
    description: 'Práticas rápidas para se cuidar no dia a dia',
    durationMinutes: 10,
    isExclusive: true,
    status: 'published',
    createdAt: new Date().toISOString(),
    likesCount: 178,
    viewsCount: 1456,
  },
  {
    id: '3',
    type: 'article',
    title: 'Como lidar com a privação de sono',
    description: 'Dicas práticas para sobreviver às noites mal dormidas',
    durationMinutes: 5,
    isExclusive: false,
    status: 'draft',
    createdAt: new Date().toISOString(),
    likesCount: 0,
    viewsCount: 0,
  },
];

export default function MundoNathAdminScreen() {
  const insets = useSafeAreaInsets();
  const [contents, setContents] = useState<NathContentItem[]>(INITIAL_CONTENT);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState<NathContentItem | null>(null);

  // Form state
  const [formType, setFormType] = useState<NathContentType>('video');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formMediaUrl, setFormMediaUrl] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formStatus, setFormStatus] = useState<NathContentStatus>('draft');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsExclusive, setFormIsExclusive] = useState(false);

  // Open create modal
  const handleCreate = () => {
    resetForm();
    setEditingContent(null);
    setModalVisible(true);
  };

  // Open edit modal
  const handleEdit = (item: NathContentItem) => {
    setEditingContent(item);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormDuration(item.durationMinutes?.toString() || '');
    setFormMediaUrl(item.mediaUrl || '');
    setFormTags(item.tags?.join(', ') || '');
    setFormStatus(item.status);
    setFormIsFeatured(item.isFeatured || false);
    setFormIsExclusive(item.isExclusive);
    setModalVisible(true);
  };

  // Save content
  const handleSave = () => {
    // TODO: Persistir no backend/Supabase
    const newContent: NathContentItem = {
      id: editingContent?.id || Date.now().toString(),
      type: formType,
      title: formTitle,
      description: formDescription,
      durationMinutes: formDuration ? parseInt(formDuration, 10) : undefined,
      mediaUrl: formMediaUrl || undefined,
      tags: formTags ? formTags.split(',').map((t) => t.trim()) : undefined,
      status: formStatus,
      isFeatured: formIsFeatured,
      isExclusive: formIsExclusive,
      createdAt: editingContent?.createdAt || new Date().toISOString(),
      likesCount: editingContent?.likesCount || 0,
      viewsCount: editingContent?.viewsCount || 0,
    };

    if (editingContent) {
      // Update existing
      setContents(contents.map((c) => (c.id === editingContent.id ? newContent : c)));
      logger.info('[MundoNathAdmin] Content updated', { id: editingContent.id });
    } else {
      // Create new
      setContents([...contents, newContent]);
      logger.info('[MundoNathAdmin] Content created', { id: newContent.id });
    }

    setModalVisible(false);
    resetForm();
  };

  // Set as featured
  const handleSetFeatured = (id: string) => {
    // TODO: Persistir no backend
    setContents(
      contents.map((c) => ({
        ...c,
        isFeatured: c.id === id,
      }))
    );
    logger.info('[MundoNathAdmin] Featured set', { id });
  };

  const resetForm = () => {
    setFormType('video');
    setFormTitle('');
    setFormDescription('');
    setFormDuration('');
    setFormMediaUrl('');
    setFormTags('');
    setFormStatus('draft');
    setFormIsFeatured(false);
    setFormIsExclusive(false);
  };

  // Status badge color
  const getStatusColor = (status: NathContentStatus) => {
    switch (status) {
      case 'published':
        return COLORS.success;
      case 'scheduled':
        return COLORS.warning;
      default:
        return COLORS.textMuted;
    }
  };

  // Type icon
  const getTypeIcon = (type: NathContentType) => {
    switch (type) {
      case 'video':
        return Video;
      case 'audio':
        return Headphones;
      case 'article':
        return BookOpen;
      default:
        return Sparkles;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + Spacing['4'],
          paddingHorizontal: Spacing['6'],
          paddingBottom: Spacing['4'],
          backgroundColor: COLORS.card,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.textDark }}>
          Painel da Nath
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>
          Gerenciar conteúdo exclusivo do Mundo da Nath
        </Text>

        {/* Banner de admin */}
        <View
          style={{
            marginTop: Spacing['4'],
            backgroundColor: COLORS.primaryLight,
            padding: Spacing['3'],
            borderRadius: Radius.lg,
          }}
        >
          <Text style={{ fontSize: 13, color: COLORS.primary, lineHeight: 18 }}>
            💕 Painel da Nath – apenas você (Nath) e equipe podem ver e postar aqui. As mães só
            visualizam o conteúdo publicado.
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing['6'],
          paddingTop: Spacing['6'],
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Create button */}
        <TouchableOpacity
          onPress={handleCreate}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.primary,
            paddingVertical: Spacing['3'],
            paddingHorizontal: Spacing['5'],
            borderRadius: Radius.full,
            marginBottom: Spacing['6'],
          }}
        >
          <Plus size={20} color="#FFF" />
          <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '600', color: '#FFF' }}>
            Criar Conteúdo
          </Text>
        </TouchableOpacity>

        {/* Content list */}
        <View style={{ gap: Spacing['3'] }}>
          {contents.map((item) => {
            const Icon = getTypeIcon(item.type);
            const statusColor = getStatusColor(item.status);

            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: Radius.xl,
                  padding: Spacing['4'],
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: Spacing['3'],
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: `${COLORS.primary}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: Spacing['3'],
                    }}
                  >
                    <Icon size={20} color={COLORS.primary} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.textDark }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}
                      numberOfLines={1}
                    >
                      {item.description}
                    </Text>
                  </View>

                  {item.isFeatured && (
                    <View
                      style={{
                        marginLeft: 8,
                        backgroundColor: '#FFC107',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: Radius.md,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#000' }}>
                        DESTAQUE
                      </Text>
                    </View>
                  )}
                </View>

                {/* Meta */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing['3'],
                    marginBottom: Spacing['3'],
                  }}
                >
                  <View
                    style={{
                      backgroundColor: `${statusColor}20`,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: Radius.sm,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: statusColor,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                    {item.type} • {item.durationMinutes} min
                  </Text>

                  {item.isExclusive && (
                    <View
                      style={{
                        backgroundColor: COLORS.primaryLight,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.primary }}>
                        EXCLUSIVO
                      </Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={{ flexDirection: 'row', gap: Spacing['2'] }}>
                  <TouchableOpacity
                    onPress={() => handleEdit(item)}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.background,
                      paddingVertical: Spacing['2'],
                      borderRadius: Radius.lg,
                    }}
                  >
                    <Edit2 size={16} color={COLORS.textDark} />
                    <Text
                      style={{
                        marginLeft: 6,
                        fontSize: 13,
                        fontWeight: '600',
                        color: COLORS.textDark,
                      }}
                    >
                      Editar
                    </Text>
                  </TouchableOpacity>

                  {!item.isFeatured && (
                    <TouchableOpacity
                      onPress={() => handleSetFeatured(item.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFC10720',
                        paddingHorizontal: Spacing['3'],
                        paddingVertical: Spacing['2'],
                        borderRadius: Radius.lg,
                      }}
                    >
                      <Star size={16} color="#FFC107" />
                      <Text
                        style={{ marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#FFC107' }}
                      >
                        Destacar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal de Criação/Edição */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          {/* Modal Header */}
          <View
            style={{
              paddingTop: Platform.OS === 'ios' ? 60 : insets.top + Spacing['4'],
              paddingHorizontal: Spacing['6'],
              paddingBottom: Spacing['4'],
              backgroundColor: COLORS.card,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.textDark }}>
                {editingContent ? 'Editar Conteúdo' : 'Criar Conteúdo'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 16, color: COLORS.primary }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: Spacing['6'],
              paddingTop: Spacing['6'],
              paddingBottom: insets.bottom + 100,
            }}
          >
            {/* Tipo */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: Spacing['2'] }}>
              Tipo
            </Text>
            <View style={{ flexDirection: 'row', gap: Spacing['2'], marginBottom: Spacing['4'] }}>
              {(['video', 'audio', 'article', 'ritual'] as NathContentType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFormType(type)}
                  style={{
                    flex: 1,
                    paddingVertical: Spacing['2'],
                    borderRadius: Radius.lg,
                    backgroundColor: formType === type ? COLORS.primary : COLORS.card,
                    borderWidth: 1,
                    borderColor: formType === type ? COLORS.primary : COLORS.border,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: formType === type ? '#FFF' : COLORS.textMuted,
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Título */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: Spacing['2'] }}>
              Título
            </Text>
            <TextInput
              value={formTitle}
              onChangeText={setFormTitle}
              placeholder="Ex: Meditação para Mães"
              style={{
                backgroundColor: COLORS.card,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: Radius.lg,
                paddingHorizontal: Spacing['4'],
                paddingVertical: Spacing['3'],
                fontSize: 15,
                color: COLORS.textDark,
                marginBottom: Spacing['4'],
              }}
            />

            {/* Descrição */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: Spacing['2'] }}>
              Descrição
            </Text>
            <TextInput
              value={formDescription}
              onChangeText={setFormDescription}
              placeholder="Descreva o conteúdo..."
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: COLORS.card,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: Radius.lg,
                paddingHorizontal: Spacing['4'],
                paddingVertical: Spacing['3'],
                fontSize: 15,
                color: COLORS.textDark,
                marginBottom: Spacing['4'],
                textAlignVertical: 'top',
              }}
            />

            {/* Duração */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: Spacing['2'] }}>
              Duração (minutos)
            </Text>
            <TextInput
              value={formDuration}
              onChangeText={setFormDuration}
              placeholder="Ex: 10"
              keyboardType="numeric"
              style={{
                backgroundColor: COLORS.card,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: Radius.lg,
                paddingHorizontal: Spacing['4'],
                paddingVertical: Spacing['3'],
                fontSize: 15,
                color: COLORS.textDark,
                marginBottom: Spacing['4'],
              }}
            />

            {/* URL de Mídia */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: Spacing['2'] }}>
              URL de Mídia (mock)
            </Text>
            <TextInput
              value={formMediaUrl}
              onChangeText={setFormMediaUrl}
              placeholder="https://..."
              style={{
                backgroundColor: COLORS.card,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: Radius.lg,
                paddingHorizontal: Spacing['4'],
                paddingVertical: Spacing['3'],
                fontSize: 15,
                color: COLORS.textDark,
                marginBottom: Spacing['4'],
              }}
            />

            {/* Tags */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: Spacing['2'] }}>
              Tags (separadas por vírgula)
            </Text>
            <TextInput
              value={formTags}
              onChangeText={setFormTags}
              placeholder="Ex: mindfulness, relaxamento"
              style={{
                backgroundColor: COLORS.card,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: Radius.lg,
                paddingHorizontal: Spacing['4'],
                paddingVertical: Spacing['3'],
                fontSize: 15,
                color: COLORS.textDark,
                marginBottom: Spacing['4'],
              }}
            />

            {/* Status */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: Spacing['2'] }}>
              Status
            </Text>
            <View style={{ flexDirection: 'row', gap: Spacing['2'], marginBottom: Spacing['4'] }}>
              {(['draft', 'scheduled', 'published'] as NathContentStatus[]).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setFormStatus(status)}
                  style={{
                    flex: 1,
                    paddingVertical: Spacing['2'],
                    borderRadius: Radius.lg,
                    backgroundColor: formStatus === status ? COLORS.primary : COLORS.card,
                    borderWidth: 1,
                    borderColor: formStatus === status ? COLORS.primary : COLORS.border,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: formStatus === status ? '#FFF' : COLORS.textMuted,
                      textTransform: 'capitalize',
                    }}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toggles */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: COLORS.card,
                padding: Spacing['4'],
                borderRadius: Radius.lg,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginBottom: Spacing['3'],
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark }}>
                Definir como destaque
              </Text>
              <Switch value={formIsFeatured} onValueChange={setFormIsFeatured} />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: COLORS.card,
                padding: Spacing['4'],
                borderRadius: Radius.lg,
                borderWidth: 1,
                borderColor: COLORS.border,
                marginBottom: Spacing['6'],
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.textDark }}>
                Conteúdo exclusivo
              </Text>
              <Switch value={formIsExclusive} onValueChange={setFormIsExclusive} />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: Spacing['4'],
                borderRadius: Radius.full,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFF' }}>
                {editingContent ? 'Salvar Alterações' : 'Criar Conteúdo'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
