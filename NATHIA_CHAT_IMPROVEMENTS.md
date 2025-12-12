# ✅ Melhorias NathIA Chat - Status de Implementação

**Data:** 11 de dezembro de 2025
**Versão:** 1.0.0

---

## 📊 Status Geral

| Fase | Status | Complexidade | Tempo |
|------|--------|--------------|-------|
| 1. Consolidar Chat Principal | 🔄 Em progresso | Baixa | 30min |
| 2. Conectar Lista de Conversas | ⏳ Pendente | Média | 30min |
| 3. Bottom Sheet de Áudio | ✅ **COMPLETO** | Média | 45min |
| 4. Preparar Memória (TODOs) | 🔄 Parcial | Baixa | 15min |
| 5. Config IA (TODOs) | ⏳ Pendente | Baixa | 10min |

---

## ✅ FASE 3 COMPLETA - Bottom Sheet de Áudio

### Arquivo Criado

**`src/components/features/chat/VoiceRecordBottomSheet.tsx`** (520 linhas)

#### Funcionalidades Implementadas

✅ **Estados de Gravação:**
- `idle` - Pronto para gravar (botão microfone)
- `recording` - Gravando com waveform animado + timer
- `preview` - Preview com play/pause/delete/send
- `sending` - Enviando (loading state)

✅ **UI/UX:**
- Bottom sheet 40% da tela (não fullscreen como antes)
- Animação slide up/down com React Native Reanimated
- Backdrop com blur
- Waveform animado durante gravação (5 barras oscilando)
- Timer formatado (0:00)

✅ **Acessibilidade WCAG AAA:**
- `accessibilityLabel` em todos os botões
- `accessibilityRole="button"` adequado
- `accessibilityHint` descritivo

✅ **Integrações:**
- Hook `useVoiceRecording` para gravação
- Hook `useAudioPlayer` para preview
- Haptic feedback em todas as ações
- Logger para tracking

#### TODOs Documentados

```typescript
// TODO: Implementar transcrição real via STT (Speech-to-Text)
// const transcript = await transcribeAudio(recordingUri);
const mockTranscript = 'Mensagem de voz enviada (transcrição futura)';

// TODO: Mostrar alerta pedindo permissão se negada
// TODO: Adicionar indicador de progresso no estado 'sending'
```

#### Como Integrar no ChatScreen

```typescript
import { VoiceRecordBottomSheet } from '@/components/features/chat/VoiceRecordBottomSheet';

// No component:
const [showVoiceSheet, setShowVoiceSheet] = useState(false);

const handleSendAudio = (uri: string, transcript: string) => {
  // Adicionar mensagem de voz ao chat
  const newMessage = {
    role: 'user',
    content: transcript,
    metadata: { audioUri: uri, type: 'voice' },
  };
  // ... adicionar à lista de mensagens
};

return (
  <>
    {/* Botão de voz no input */}
    <TouchableOpacity onPress={() => setShowVoiceSheet(true)}>
      <Mic />
    </TouchableOpacity>

    {/* Bottom sheet */}
    <VoiceRecordBottomSheet
      visible={showVoiceSheet}
      onClose={() => setShowVoiceSheet(false)}
      onSendAudio={handleSendAudio}
    />
  </>
);
```

---

## 🔄 FASE 1 - Consolidar Chat Principal

### Arquivos Afetados

- ✅ `src/screens/ChatScreenRefactored.tsx` (manter como base)
- 🗑️ `src/screens/ChatScreen.tsx` (deprecar - já existe `.old.tsx`)
- ✏️ `src/navigation/TabNavigator.tsx` (garantir rota correta)

### Mudanças Necessárias

#### 1.1 Melhorar Quick Actions (ChatScreenRefactored)

**Localização:** Linha ~400-500 (seção de sugestões)

**Antes:**
```typescript
// Botões grandes ocupando tela toda verticalmente
<View style={{ flex: 1, paddingVertical: 20 }}>
  {suggestions.map(s => (
    <BigButton>{s.text}</BigButton>
  ))}
</View>
```

**Depois:**
```typescript
// Chips horizontais discretos (ScrollView horizontal)
<View style={{ marginBottom: Spacing['4'] }}>
  <Text variant="labelMedium" style={{ marginBottom: Spacing['2'] }}>
    Como posso te ajudar hoje?
  </Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {suggestions.map(s => (
      <TouchableOpacity
        key={s.text}
        style={{
          backgroundColor: colors.background.elevated,
          paddingVertical: Spacing['2'],
          paddingHorizontal: Spacing['3'],
          borderRadius: Radius.full,
          marginRight: Spacing['2'],
          borderWidth: 1,
          borderColor: colors.border.light,
        }}
      >
        <Text>{s.emoji} {s.text}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>
```

#### 1.2 Adicionar CTA de Emergência

**Localização:** Acima do `NathIAChatInput` (final do componente)

```typescript
{/* CTA de Emergência - acima do input */}
<View style={{ paddingHorizontal: Spacing['4'], marginBottom: Spacing['2'] }}>
  <TouchableOpacity
    onPress={() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // TODO: Navegar para fluxo de emergência ou abrir SOS
      navigation.navigate('SOSScreen');
    }}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: ColorTokens.error[500],
      paddingVertical: Spacing['3'],
      paddingHorizontal: Spacing['4'],
      borderRadius: Radius.lg,
      gap: Spacing['2'],
    }}
    accessibilityLabel="Preciso de ajuda urgente"
    accessibilityHint="Abre recursos de emergência e contatos de apoio"
  >
    <AlertTriangle size={18} color="#FFF" />
    <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>
      Preciso de ajuda urgente
    </Text>
  </TouchableOpacity>
</View>

<NathIAChatInput ... />
```

#### 1.3 Banner de Aviso (Discreto)

**Localização:** Abaixo do `ChatHeader`

```typescript
{/* Banner de aviso - fino e discreto */}
<View
  style={{
    backgroundColor: ColorTokens.warning[100],
    paddingVertical: Spacing['2'],
    paddingHorizontal: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: ColorTokens.warning[300],
  }}
>
  <Text
    style={{
      fontSize: 12,
      color: ColorTokens.warning[800],
      textAlign: 'center',
    }}
  >
    💡 A NathIA é um apoio emocional. Em emergências médicas, procure um profissional.
  </Text>
</View>
```

---

## 🔄 FASE 2 - Conectar Lista de Conversas

### Arquivos Afetados

- ✏️ `src/screens/ChatSessionsScreen.tsx`
- ✏️ `src/screens/ChatScreenRefactored.tsx`

### Mudanças Necessárias

#### 2.1 ChatSessionsScreen - Melhorar UI e Navegação

**Adicionar `useNavigation` e handler:**

```typescript
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ChatSessionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleThreadPress = (threadId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Chat', { threadId });
  };

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Chat'); // Sem threadId = nova conversa
  };

  // ... resto do código
};
```

**Melhorar card de thread:**

```typescript
<TouchableOpacity
  onPress={() => handleThreadPress(thread.id)}
  style={{
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    padding: Spacing['4'],
    borderRadius: Radius.xl,
    marginBottom: Spacing['3'],
    borderWidth: 1,
    borderColor: colors.border.light,
  }}
>
  {/* Ícone NathIA */}
  <View
    style={{
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: ColorTokens.primary[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing['3'],
    }}
  >
    <Image
      source={{ uri: AVATAR_URL }}
      style={{ width: 40, height: 40, borderRadius: 20 }}
    />
  </View>

  {/* Conteúdo */}
  <View style={{ flex: 1 }}>
    {/* Título e data */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing['1'] }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text.primary }}>
        {thread.title || 'Conversa com NathIA'}
      </Text>
      <Text style={{ fontSize: 12, color: colors.text.tertiary }}>
        {formatRelativeTime(thread.updatedAt)}
      </Text>
    </View>

    {/* Snippet da última mensagem */}
    <Text
      style={{ fontSize: 13, color: colors.text.secondary }}
      numberOfLines={2}
    >
      {thread.lastMessage}
    </Text>

    {/* Tag de sentimento (se houver) */}
    {thread.moodTag && (
      <View
        style={{
          marginTop: Spacing['2'],
          alignSelf: 'flex-start',
          backgroundColor: getMoodTagColor(thread.moodTag),
          paddingHorizontal: Spacing['2'],
          paddingVertical: 2,
          borderRadius: Radius.sm,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: '600', color: colors.text.primary }}>
          {getMoodTagLabel(thread.moodTag)}
        </Text>
      </View>
    )}
  </View>
</TouchableOpacity>
```

**Helper para formatação de data:**

```typescript
const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 1) return 'Agora';
  if (diffHours < 24) return `há ${Math.floor(diffHours)}h`;
  if (diffDays < 2) return 'Ontem';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};
```

#### 2.2 ChatScreenRefactored - Receber threadId

**No início do componente:**

```typescript
export default function ChatScreenRefactored({ route }: any) {
  const threadId = route?.params?.threadId;

  useEffect(() => {
    if (threadId) {
      // TODO: Carregar mensagens da thread específica
      // const messages = await chatService.getMessages(threadId);
      // setMessages(messages);
      logger.info('[ChatScreen] Loading thread', { threadId });
    } else {
      // Nova conversa
      logger.info('[ChatScreen] New conversation');
    }
  }, [threadId]);

  // ... resto do código
}
```

---

## ⏳ FASE 4 - Preparar Memória (TODOs)

### Arquivo: `src/types/chat.ts`

**Adicionar tipos:**

```typescript
/**
 * Tags de sentimento/tema para threads
 */
export type MoodTag =
  | 'sono'
  | 'culpa'
  | 'amamentacao'
  | 'cansaco'
  | 'duvida'
  | 'celebracao'
  | 'ansiedade'
  | 'solidao';

/**
 * Thread de conversa (para lista de conversas)
 */
export interface ChatThread {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  moodTag?: MoodTag;
  isPinned?: boolean;
  messageCount: number;
}
```

**Expandir `ChatMessageMetadata`:**

```typescript
export interface ChatMessageMetadata {
  // ... campos existentes

  // TODO MEMÓRIA: Adicionar campos para contexto
  // user_context?: {
  //   pregnancy_week?: number;
  //   baby_age_months?: number;
  //   recent_topics?: string[];
  //   emotional_state?: string;
  // };
}
```

**Adicionar TODOs globais no final:**

```typescript
// TODO MEMÓRIA: Conectar ChatThread/ChatMessage com backend
// Supabase tables: chat_conversations, chat_messages (já existem)
// Usar chatService.getMessages(conversationId) para carregar histórico

// TODO METADATA: Popular contains_crisis_keywords
// Analisar mensagem do usuário antes de enviar para IA
// Se detectar palavras-chave de crise, marcar metadata
```

---

## ⏳ FASE 5 - Config de IA (TODOs)

### Arquivo: `src/screens/ChatScreenRefactored.tsx`

**Abstrair função de envio de mensagem:**

```typescript
/**
 * Envia mensagem para NathIA
 * TODO IA: Usar aiRouter para escolher modelo baseado em:
 * - Contexto da mensagem (crise vs dúvida)
 * - Custo (Gemini Flash mais barato, GPT-4o para crise)
 * - Histórico de falhas (circuit breaker)
 * - Modo selecionado (rapido/equilibrado/pensar)
 */
const sendMessageToNathIA = async (
  text: string,
  threadId: string | undefined
): Promise<string> => {
  try {
    // TODO: Detectar crise antes de enviar
    // const containsCrisis = detectCrisisKeywords(text);

    // TODO: Usar aiRouter real
    // const response = await aiRouter.sendMessage({
    //   threadId: threadId || 'temp',
    //   messages: [...messageHistory, { role: 'user', content: text }],
    //   mode: aiMode, // do state
    // });

    // Mock temporário
    const mockResponse = await new Promise<string>((resolve) =>
      setTimeout(() => resolve('Olá, mãe. Entendo como você se sente...'), 1000)
    );

    return mockResponse;
  } catch (error) {
    logger.error('[ChatScreen] Failed to send message', error);
    throw error;
  }
};
```

**Documentar aiRouter no comentário:**

```typescript
/**
 * AI ROUTING - Estratégia de Modelos
 *
 * Default: Gemini 2.5 Flash (mais barato, ~$0.075/1M tokens)
 * - Respostas rápidas
 * - Dúvidas simples
 * - Conversas leves
 *
 * GPT-4o (segurança, ~$2.50/1M tokens input)
 * - Detecção de crise (suicide, self-harm keywords)
 * - Emergências emocionais
 * - Validação de conteúdo sensível
 *
 * Claude Opus (análise profunda, ~$15/1M tokens input)
 * - Modo "pensar" (ativado pelo usuário)
 * - Questões complexas
 * - Reflexões longas
 *
 * Fallback: Se modelo primário falhar, circuit breaker redireciona
 * Circuit breaker: 5 falhas consecutivas = 5min cooldown
 *
 * @see src/services/ai/aiRouter.ts
 */
```

---

## 📦 Arquivos de Referência

### Componentes Reutilizáveis (já existem, usar!)

- ✅ `src/components/atoms/ChatBubble.tsx` - Bubbles customizadas
- ✅ `src/components/molecules/ChatHeader.tsx` - Header premium
- ✅ `src/components/nathia/NathIAChatInput.tsx` - Input da NathIA
- ✅ `src/components/organisms/ChatEmptyState.tsx` - Estado vazio
- ✅ `src/components/features/chat/VoiceRecordBottomSheet.tsx` - **NOVO!**

### Hooks (já existem, usar!)

- ✅ `src/hooks/useVoiceRecording.ts` - Gravação + transcrição
- ✅ `src/hooks/useAudioPlayer.ts` - Playback de áudio

### Services (já existem, usar!)

- ✅ `src/services/supabase/chatService.ts` - CRUD de conversas
- ✅ `src/services/ai/aiRouter.ts` - Routing multi-modelo

---

## 🎯 Próximos Passos (Ordem de Prioridade)

1. ✅ **COMPLETO:** Bottom Sheet de Áudio
2. 🔄 **FAZER AGORA:** Consolidar Chat Principal (Quick Actions + CTA Emergência)
3. 🔄 **FAZER AGORA:** Conectar Lista de Conversas (navegação + formatação)
4. ⏳ **DEPOIS:** Expandir tipos de chat.ts (MoodTag, ChatThread)
5. ⏳ **DEPOIS:** Adicionar TODOs de IA routing

---

## ✅ Validação Final

Antes de mergear, executar:

```bash
npm run type-check  # TypeScript compila sem erros
npm run lint        # ESLint passa
npm run validate:design  # 100% uso de tokens
```

---

**Status:** 🔄 Implementação parcial (Fase 3 completa)
**Próxima ação:** Implementar Fases 1, 2, 4, 5
**Tempo estimado restante:** ~1h30min
