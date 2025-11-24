# 🎯 Guia de Execução para Claude Code - Otimização React Native

## 📊 Estado Atual do Projeto

### ✅ Já Implementado
- ✅ **SecureStore para Supabase**: `src/utils/supabaseSecureStorage.ts` existe e está sendo usado em `src/services/supabase.ts`
- ✅ **ErrorBoundary**: Criado em `src/components/ErrorBoundary.tsx` e integrado no `App.tsx`
- ✅ **Migração de tokens**: Função `migrateSupabaseSessionToSecureStore()` já existe e é chamada no `App.tsx`

### ❌ Pendente de Implementação

#### Fase 1: Segurança & Crítico
1. **Race Condition Onboarding** (Tarefa 1.3)
   - **Arquivo**: `src/navigation/StackNavigator.tsx`
   - **Linha**: 34
   - **Problema**: `checkOnboarding()` chamado sem `await`
   - **Solução**: Adicionar `await` e sincronizar com loading state

2. **AudioPlayer Real** (Tarefa 1.2)
   - **Arquivo**: `src/components/AudioPlayer.tsx`
   - **Problema**: Apenas UI mockada, não toca áudio real
   - **Solução**: Implementar `expo-av` com controles reais

#### Fase 2: Performance
3. **Dependências Faltantes**
   - **Arquivo**: `package.json`
   - **Falta**: `expo-image` e `expo-av`
   - **Comando**: `expo install expo-image expo-av`

4. **MundoNathScreen - FlashList** (Tarefa 2.1)
   - **Arquivo**: `src/screens/MundoNathScreen.tsx`
   - **Linha**: 168-169
   - **Problema**: ScrollView horizontal com `.map()`
   - **Solução**: Converter para FlashList horizontal

5. **CommunityScreen - FlatList** (Tarefa 2.2)
   - **Arquivo**: `src/screens/CommunityScreen.tsx`
   - **Linha**: 160
   - **Problema**: `.map()` em lista de discussões
   - **Solução**: Converter para FlatList

6. **FeedScreen - Chips FlashList** (Tarefa 2.3)
   - **Arquivo**: `src/screens/FeedScreen.tsx`
   - **Linhas**: 35-57
   - **Problema**: ScrollView horizontal com `.map()` para chips
   - **Solução**: Converter para FlashList horizontal

7. **Migração expo-image** (Tarefa 2.4)
   - **Arquivos a modificar**:
     - `src/screens/Onboarding/OnboardingStep1.tsx` (linha 2)
     - `src/screens/FeedScreen.tsx` (linha 2)
     - `src/screens/CommunityScreen.tsx` (linha 2)
     - `src/components/Logo.tsx` (linha 2)
     - `src/components/ContentCard.tsx` (linha 7)
     - `src/components/Avatar.tsx` (linha 2)
     - `src/screens/MundoNathScreen.tsx` (linha 7)
     - `src/screens/DiaryScreen.tsx` (linha 151)
   - **Solução**: Substituir `import { Image } from 'react-native'` por `import { Image } from 'expo-image'`

#### Fase 3: Qualidade
8. **Tratamento de Erros Storage** (Tarefa 3.1)
   - **Arquivo**: `src/screens/MundoNathScreen.tsx`
   - **Linha**: 45-57 (função `loadUser`)
   - **Problema**: `JSON.parse` sem try-catch adequado
   - **Solução**: Adicionar try-catch e fallback

9. **Audit SafeAreaView** (Tarefa 3.2)
   - **Verificar**: Todas as telas de onboarding têm SafeAreaView
   - **Arquivos**: `src/screens/Onboarding/OnboardingStep*.tsx`

## 🔧 Guia Passo a Passo por Tarefa

### Tarefa 1.3: Corrigir Race Condition Onboarding

**Arquivo**: `src/navigation/StackNavigator.tsx`

**Código Atual (linhas 21-65)**:
```typescript
useEffect(() => {
  // Verificar se usuário completou onboarding
  const checkOnboarding = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('nath_user');
      if (savedUser) {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.warn('Erro ao verificar onboarding:', error);
    }
  };

  checkOnboarding(); // ❌ SEM AWAIT - Race condition

  if (!isSupabaseReady()) {
    setLoading(false);
    return;
  }
  // ... resto do código
}, []);
```

**Código Corrigido**:
```typescript
useEffect(() => {
  const initialize = async () => {
    // Verificar se usuário completou onboarding
    try {
      const savedUser = await AsyncStorage.getItem('nath_user');
      if (savedUser) {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.warn('Erro ao verificar onboarding:', error);
    }

    if (!isSupabaseReady()) {
      setLoading(false);
      return;
    }

    // Get initial session
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Erro ao obter sessão:', error.message);
      }
      setUser(session?.user ?? null);
    } catch (error) {
      console.warn('Erro ao carregar sessão (não crítico):', error);
    } finally {
      setLoading(false);
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  };

  initialize();
}, []);
```

### Tarefa 1.2: Implementar AudioPlayer com expo-av

**Arquivo**: `src/components/AudioPlayer.tsx`

**Mudanças necessárias**:
1. Adicionar import: `import { Audio } from 'expo-av';`
2. Criar estado para o Sound object
3. Implementar funções reais de play/pause/seek
4. Atualizar progresso baseado no status real do áudio

**Estrutura esperada**:
```typescript
import { Audio, AVPlaybackStatus } from 'expo-av';

// Dentro do componente:
const [sound, setSound] = useState<Audio.Sound | null>(null);

useEffect(() => {
  loadAudio();
  return () => {
    sound?.unloadAsync();
  };
}, [audioUrl]);

const loadAudio = async () => {
  try {
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: false }
    );
    setSound(newSound);
    
    // Listener para atualizar progresso
    newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        if (status.didJustFinish) {
          setIsPlaying(false);
          onEnd?.();
        }
      }
    });
  } catch (error) {
    console.error('Erro ao carregar áudio:', error);
  }
};

const playPause = async () => {
  if (!sound) return;
  
  haptics.light();
  
  if (isPlaying) {
    await sound.pauseAsync();
    setIsPlaying(false);
    onPause?.();
  } else {
    await sound.playAsync();
    setIsPlaying(true);
    onPlay?.();
  }
};
```

### Tarefa 2.1: MundoNathScreen - FlashList Horizontal

**Arquivo**: `src/screens/MundoNathScreen.tsx`

**Linhas 168-200**: Substituir ScrollView + map por FlashList

**Código Atual**:
```typescript
<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: -24, paddingLeft: 24 }}>
  {MOCK_POSTS.map((post) => (
    <TouchableOpacity key={post.id} ...>
      {/* conteúdo do card */}
    </TouchableOpacity>
  ))}
</ScrollView>
```

**Código Otimizado**:
```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={MOCK_POSTS}
  renderItem={({ item: post }) => (
    <TouchableOpacity
      style={{ marginRight: 16, width: 240, ... }}
      onPress={() => {/* navegação */}}
    >
      {/* conteúdo do card */}
    </TouchableOpacity>
  )}
  horizontal
  showsHorizontalScrollIndicator={false}
  estimatedItemSize={240}
  contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
  keyExtractor={(item) => item.id}
/>
```

### Tarefa 2.2: CommunityScreen - FlatList

**Arquivo**: `src/screens/CommunityScreen.tsx`

**Linha 160**: Substituir `.map()` por FlatList

**Código Atual**:
```typescript
{mockDiscussions.map((discussion) => (
  <TouchableOpacity key={discussion.id} ...>
    {/* conteúdo */}
  </TouchableOpacity>
))}
```

**Código Otimizado**:
```typescript
import { FlatList } from 'react-native';

<FlatList
  data={mockDiscussions}
  renderItem={({ item: discussion }) => (
    <TouchableOpacity ...>
      {/* conteúdo */}
    </TouchableOpacity>
  )}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ padding: 16, paddingTop: 8 }}
  ListHeaderComponent={/* header existente */}
/>
```

### Tarefa 2.3: FeedScreen - Chips FlashList

**Arquivo**: `src/screens/FeedScreen.tsx`

**Linhas 35-57**: Converter chips para FlashList horizontal

**Código Atual**:
```typescript
<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, marginLeft: -16, paddingLeft: 16 }}>
  {filterOptions.map((option) => (
    <TouchableOpacity key={option.value} ...>
      <Text>{option.label}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```

**Código Otimizado**:
```typescript
<FlashList
  data={filterOptions}
  renderItem={({ item: option }) => (
    <TouchableOpacity
      onPress={() => setFilter(option.value)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: filter === option.value ? colors.primary.main : colors.background.elevated,
        marginRight: 8,
      }}
    >
      <Text style={{...}}>{option.label}</Text>
    </TouchableOpacity>
  )}
  horizontal
  showsHorizontalScrollIndicator={false}
  estimatedItemSize={80}
  contentContainerStyle={{ paddingLeft: 16 }}
  keyExtractor={(item) => item.value}
/>
```

### Tarefa 2.4: Migração expo-image

**Padrão de substituição em todos os arquivos**:

**Antes**:
```typescript
import { Image } from 'react-native';

<Image
  source={{ uri: '...' }}
  style={{ ... }}
  resizeMode="cover"
/>
```

**Depois**:
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: '...' }}
  style={{ ... }}
  contentFit="cover"
  transition={200}
/>
```

**Arquivos específicos**:
1. `src/screens/Onboarding/OnboardingStep1.tsx` - linha 2
2. `src/screens/FeedScreen.tsx` - linha 2
3. `src/screens/CommunityScreen.tsx` - linha 2
4. `src/components/Logo.tsx` - linha 2 (usar `require()` para assets locais)
5. `src/components/ContentCard.tsx` - linha 7
6. `src/components/Avatar.tsx` - linha 2
7. `src/screens/MundoNathScreen.tsx` - linha 7
8. `src/screens/DiaryScreen.tsx` - linha 151

### Tarefa 3.1: Tratamento de Erros Storage

**Arquivo**: `src/screens/MundoNathScreen.tsx`

**Código Atual (linhas 45-57)**:
```typescript
const loadUser = async () => {
  try {
    const savedUser = await AsyncStorage.getItem('nath_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // ❌ Sem try-catch no parse
    } else {
      setUser({ name: 'Mãe' });
    }
  } catch (e) {
    console.error('Error loading user', e);
  }
};
```

**Código Corrigido**:
```typescript
const loadUser = async () => {
  try {
    const savedUser = await AsyncStorage.getItem('nath_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (parseError) {
        console.error('Erro ao fazer parse do usuário:', parseError);
        // Dados corrompidos, usar default
        setUser({ name: 'Mãe' });
        // Opcional: limpar dados corrompidos
        await AsyncStorage.removeItem('nath_user');
      }
    } else {
      setUser({ name: 'Mãe' });
    }
  } catch (e) {
    console.error('Error loading user', e);
    // Fallback seguro
    setUser({ name: 'Mãe' });
  }
};
```

## ✅ Checklist de Validação por Tarefa

### Tarefa 1.3 (Race Condition)
- [ ] `checkOnboarding()` está dentro de função async
- [ ] `await` usado corretamente
- [ ] Loading state sincronizado
- [ ] Testado: onboarding não pula steps

### Tarefa 1.2 (AudioPlayer)
- [ ] `expo-av` instalado
- [ ] Sound object criado e gerenciado
- [ ] Play/pause funcionando
- [ ] Progresso atualizado em tempo real
- [ ] Cleanup no unmount

### Tarefa 2.1-2.3 (Listas)
- [ ] FlashList/FlatList importado
- [ ] `estimatedItemSize` definido
- [ ] `keyExtractor` implementado
- [ ] Performance: 60 FPS em scroll
- [ ] Sem warnings no console

### Tarefa 2.4 (expo-image)
- [ ] `expo-image` instalado
- [ ] Todos os imports atualizados
- [ ] `resizeMode` → `contentFit`
- [ ] Imagens carregando corretamente
- [ ] Cache funcionando

### Tarefa 3.1 (Error Handling)
- [ ] Try-catch em todos os JSON.parse
- [ ] Fallback para dados corrompidos
- [ ] Logging adequado
- [ ] App não quebra com dados inválidos

## 📝 Ordem de Execução Recomendada

1. **Instalar dependências** (2.4)
   ```bash
   expo install expo-image expo-av
   ```

2. **Corrigir race condition** (1.3) - Rápido, alto impacto

3. **Migrar expo-image** (2.4) - Substituições simples

4. **Otimizar listas** (2.1, 2.2, 2.3) - Performance

5. **Implementar AudioPlayer** (1.2) - Mais complexo

6. **Melhorar error handling** (3.1) - Qualidade

7. **Audit SafeAreaView** (3.2) - Verificação final

## 🚨 Pontos de Atenção

1. **expo-image**: `resizeMode` vira `contentFit`, mas valores são diferentes:
   - `cover` → `cover` (igual)
   - `contain` → `contain` (igual)
   - `stretch` → `fill`

2. **FlashList horizontal**: Precisa de `estimatedItemSize` e `keyExtractor`

3. **AudioPlayer**: Lembrar de fazer `unloadAsync()` no cleanup

4. **Race condition**: Toda lógica async deve estar dentro de função async e usar await

5. **Error handling**: Sempre ter fallback para não quebrar o app

## 📦 Dependências Necessárias

```json
{
  "expo-image": "~1.14.0",
  "expo-av": "~15.0.1"
}
```

**Comando de instalação**:
```bash
expo install expo-image expo-av
```

