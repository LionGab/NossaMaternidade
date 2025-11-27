# 🎨 Layout Completo - Nossa Maternidade
## Documento de Referência para Desenvolvimento Mobile (iOS/Android)

**Data**: 2025-11-27  
**Versão**: 1.0  
**Plataforma**: React Native + Expo (iOS App Store + Android Google Play)  
**Status**: ✅ Análise completa do site web de referência (apenas para design/UX)

> ⚠️ **IMPORTANTE**: Este documento é baseado na análise do site web, mas todo o desenvolvimento deve ser feito em **React Native/Expo** para **mobile iOS e Android**. O site web serve apenas como referência visual e de UX.

---

## 📱 ÍNDICE

1. [Fluxo de Onboarding](#fluxo-de-onboarding)
2. [Tela Principal - Home](#tela-principal---home)
3. [MãesValentes - Comunidade](#mãesvalentes---comunidade)
4. [Chat com NathIA](#chat-com-nathia)
5. [Mundo Nath - Conteúdo](#mundo-nath---conteúdo)
6. [Hábitos - Tracking](#hábitos---tracking)
7. [Design System](#design-system)
8. [Padrões de UX](#padrões-de-ux)
9. [Checklist de Implementação](#checklist-de-implementação)

---

## 🚀 FLUXO DE ONBOARDING

### Etapa 1: Boas-vindas
**Layout**: Tela cheia, centralizada
- **Ilustração**: Avatar circular grande (mãe com bebê)
- **Título**: "Oi, que bom que você chegou."
- **Quote**: "Aqui, você não precisa fingir que está tudo bem."
- **Texto**: "Eu sou a MãesValente. Quero criar um espaço seguro para você. Vamos conversar rapidinho?"
- **CTA**: Botão "Começar agora" (com seta →)
- **Progresso**: 1/8 dots (primeiro dot preenchido)

### Etapa 2: Nome
**Layout**: Formulário simples
- **Título**: "Como você gosta de ser chamada?"
- **Subtítulo**: "Quero que nossa conversa seja íntima, como amigas."
- **Input**: Campo de texto "Seu nome ou apelido"
- **CTA**: Botão "Continuar"
- **Progresso**: 2/8 dots
- **Navegação**: Botão voltar (topo esquerdo), toggle tema (topo direito)

### Etapa 3: Estágio da Maternidade
**Layout**: Grid de botões grandes
- **Título**: Pergunta sobre estágio
- **Opções** (4 botões grandes):
  - Tentante
  - Gestante
  - Puérpera (Recém-nascido)
  - Mãe experiente
- **Progresso**: 3/8 dots

### Etapa 4: Emoções
**Layout**: Grid de botões com emojis
- **Título**: Pergunta sobre emoção atual
- **Opções** (5 botões):
  - Ansiosa
  - Cansada
  - Culpada
  - Feliz
  - Confusa
- **Progresso**: 4/8 dots

### Etapa 5: Tópicos de Interesse
**Layout**: Grid de botões (seleção múltipla)
- **Título**: Pergunta sobre preocupações/tópicos
- **Opções** (7 botões, múltipla seleção):
  - Sono do bebê
  - Amamentação
  - Ansiedade/Depressão
  - Relacionamento
  - Volta ao trabalho
  - Solidão
  - Só curiosidade
- **Progresso**: 5/8 dots

### Etapa 6: Rede de Apoio
**Layout**: Botões de seleção única
- **Título**: Pergunta sobre rede de apoio
- **Opções** (3 botões):
  - Tenho, graças a Deus
  - Às vezes/Pouca
  - Me sinto muito sozinha
- **Progresso**: 6/8 dots

### Etapa 7: Necessidades
**Layout**: Cards grandes com ícones
- **Título**: "O que você precisa?"
- **Opções** (4 cards):
  - **Desabafar** - Conversar com alguém que entenda
  - **Aprender** - Dica prática sobre o bebê
  - **Acalmar** - Respirar e diminuir ansiedade
  - **Conectar** - Ver relato de outra mãe
- **Progresso**: 7/8 dots

### Etapa 8: Finalização
**Layout**: Tela de conclusão
- **Título**: "Tudo pronto, [Nome]!"
- **Mensagem**: "Configurei o app para te ajudar com sono do bebê. Seu refúgio está preparado."
- **Checkbox**: Termos de uso/privacidade
- **CTA**: Botão "Entrar na minha casa"
- **Footer**: "Seus dados estão seguros comigo."
- **Progresso**: 8/8 dots (completo)

---

## 🏠 TELA PRINCIPAL - HOME

### Header
- **Saudação**: "Oi, mãe. Tô aqui com você. ❤️"
- **Controles**:
  - Toggle tema (sol/lua) - topo direito
  - Avatar do perfil - topo direito
  - Botão "30s para você" - quick action

### Seção 1: "Hoje eu tô com você"
**Card Grande** (destaque):
- **Ilustração**: Mãe e bebê bocejando (cena de quarto)
- **Label**: "MATERNIDADE REAL" (badge topo)
- **Título**: "Como você dormiu hoje?"
- **Subtítulo**: "Toque para registrar"
- **Ícones**: Lua (top-left), 'T' (bottom-right)
- **Ação**: Abre modal de check-in emocional

### Seção 2: Card Contextual de Ansiedade
**Card Médio** (condicional - aparece quando detecta ansiedade):
- **Ícone**: Vento/respiração (top-left)
- **Título**: "Percebi que você tá mais ansiosa."
- **Subtítulo**: "Quer respirar 1 minuto comigo pra desacelerar?"
- **CTA**: Botão branco "Começar agora →"
- **Cor**: Azul vibrante

### Seção 3: Ações Rápidas
**Grid 2 colunas**:
- **Card 1**: "Como dormiu?"
  - Ícone: Cama
  - Descrição: "Registrar • 2 min"
- **Card 2**: "Conversar"
  - Ícone: Balão de fala com coração
  - Descrição: "Desabafar • 5 min"

### Seção 4: Mundo Nath
- **Header**: "Mundo Nath" + "Ver tudo >"
- **Cards horizontais** (scroll):
  - Card com imagem + título + badge "Nath ❤️"
  - Exemplos:
    - "Como lidar com a culpa materna hoje?" (vídeo)
    - "Meu relato de parto real e sem filtros" (artigo)
    - Mais conteúdo...

### Seção 5: Waitlist
- **Título**: "O app completo vem aí!"
- **Texto**: "Quer ser avisada quando lançarmos todas as novidades que preparamos com carinho?"
- **Form**: Input email + botão "Entrar na lista de espera"

### Navegação Inferior
**5 tabs**:
1. **Início** (Home) - Ícone casa
2. **MãesValentes** (Comunidade) - Ícone pessoas
3. **MãesValente Chat** (Chat IA) - Ícone chat com coração
4. **Mundo Nath** (Conteúdo) - Ícone play
5. **Hábitos** (Tracking) - Ícone checklist

---

## 👥 MÃESVALENTES - COMUNIDADE

### Header
- **Título**: "Histórias Reais"
- **CTA**: Botão "Compartilhe seu momento, mãe..."

### Feed de Posts
**Cards de post**:
- **Avatar**: Foto da mãe (ou anônimo)
- **Conteúdo**: Texto do post
- **Interações**:
  - Likes (número)
  - Comentários (número)
  - Compartilhar (ícone)
- **Exemplos identificados**:
  - "Menina, hoje consegui tomar banho sem chorar ouvindo o bebê..."
  - "Alguém mais sente que perdeu a identidade depois do parto?"
  - "Dica de ouro que funcionou aqui: o chá de camomila..."
  - "Voltando ao trabalho amanhã e o coração tá apertado..."

### Funcionalidades
- Postar (anônimo ou identificado)
- Curtir posts
- Comentar
- Compartilhar
- Filtrar por categoria

---

## 💬 CHAT COM NATHIA

### Header
- **Botão voltar**: Topo esquerdo
- **Título**: "MãesValente Chat"
- **Ação**: Botão "Limpar histórico" (topo direito)

### Sugestões Rápidas
**3 botões de prompt**:
- "Estou sobrecarregada"
- "Medo de não ser boa mãe"
- "Briguei com meu parceiro"

### Área de Chat
- **Input**: "Conta pra mim o que está pegando..."
- **Botão enviar**: Ícone de envio
- **Mensagens**: Bubbles de chat (user/assistant)
- **Typing indicator**: Quando IA está respondendo

### Funcionalidades
- Chat em tempo real
- Histórico de conversas
- Limpar histórico
- Sugestões contextuais
- Moderação automática

---

## 📚 MUNDO NATH - CONTEÚDO

### Header
- **Título**: "Mundo Nath"
- **Subtítulo**: "Série, bastidores e dicas da Nathália."
- **Busca**: Input "Buscar conteúdos..."

### Filtros
**5 botões de filtro**:
- Todo
- Vídeo
- Áudio
- Reel
- Texto

### Seção: Série
**Lista vertical** (episódios):
1. "Primeira noite sem dormir" - 10 min
2. "Quando a culpa bate" - 12 min
3. "A relação mudou?" - 15 min
4. "Rede de apoio" - 08 min
5. "Voltando ao trabalho" - 11 min
6. "O corpo pós-parto" - 14 min [PLAY]
7. "Ritual de encerramento" - 20 min

### Seção: Conteúdo
**Grid de cards**:
- **Card**: Imagem + título + botão "Ver agora"
- **Exemplos**:
  - "Como lidar com a culpa materna hoje?"
  - "Meu relato de parto real e sem filtros"
  - "3 dicas para dormir melhor na gravidez"
  - "Amamentação: O que ninguém te conta"

---

## ✅ HÁBITOS - TRACKING

### Header
- **Título**: "Ferramentas da Nath"

### Cards de Ferramentas
**2 cards grandes**:
1. **Ritual de Abertura**
   - Descrição: "Comece ou termine o dia conectada com você mesma."
   - Tempo: "3 min"

2. **Diário Emocional**
   - Descrição: "Desabafe com a NathIA e receba acolhimento."
   - Tempo: "Livre"

### Botão de Ação
- **CTA**: Botão "Registrar" (grande, destacado)

### Funcionalidades Esperadas
- Tracking de hábitos diários
- Streaks (sequências)
- Estatísticas
- Lembretes
- Conquistas

---

## 🎨 DESIGN SYSTEM

### Cores

#### Light Mode
- **Background principal**: `#F1F5F9` (Cloud)
- **Cards**: `#FFFFFF` (Snow)
- **Primary**: `#FF7A96` (Rosa maternal)
- **Secondary**: `#A78BFA` (Roxo espiritual)
- **Text primary**: `#0F172A` (Charcoal)
- **Text secondary**: `#334155` (Slate)
- **Text tertiary**: `#6B7280` (Silver)

#### Dark Mode
- **Background principal**: `#0F172A` (Slate 900)
- **Cards**: `#1E293B` (Slate 800)
- **Primary**: `#FFA8BC` (Light pink)
- **Secondary**: `#C4B5FD` (Light purple)
- **Text primary**: `#F8FAFC` (White)
- **Text secondary**: `#CBD5E1` (Slate 300)
- **Text tertiary**: `#94A3B8` (Slate 400)

### Tipografia

#### Font Family (Mobile)
- **iOS**: System (SF Pro) - `Platform.select({ ios: 'System' })`
- **Android**: Roboto - `Platform.select({ android: 'Roboto' })`
- **Fallback**: System fonts nativas (não usar Google Fonts no mobile)

#### Tamanhos
- **H1**: 36px (5xl)
- **H2**: 32px (4xl)
- **H3**: 28px (3xl)
- **H4**: 24px (2xl)
- **H5**: 20px (xl)
- **Body**: 16px (base)
- **Small**: 14px (sm)
- **Caption**: 12px (xs)

#### Pesos
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Espaçamento
- **Base**: 4px
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Bordas
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **full**: 9999px (circular)

### Sombras
- **sm**: `{ shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }`
- **md**: `{ shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }`
- **lg**: `{ shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 }`

---

## 📐 PADRÕES DE UX

### Navegação (React Navigation)
- **Bottom tabs**: `@react-navigation/bottom-tabs` (5 tabs principais)
- **Stack navigation**: `@react-navigation/native-stack` para telas internas
- **Back button**: `navigation.goBack()` ou botão customizado
- **Theme toggle**: Sempre no topo direito
- **Progress indicators**: Dots no onboarding (custom component)
- **Deep linking**: Configurado no `app.json` (Expo)
- **Safe areas**: Usar `react-native-safe-area-context` para iOS notch

### Interações (Mobile)
- **Touch targets**: Mínimo 44x44pt (iOS HIG + Material Design)
- **Haptic feedback**: `expo-haptics` em todas as ações
- **Loading states**: `ActivityIndicator` ou skeletons
- **Error states**: `Alert.alert()` ou componentes customizados
- **Empty states**: Ilustrações + mensagens
- **Pull to refresh**: `RefreshControl` nas listas
- **Keyboard avoiding**: `KeyboardAvoidingView` em formulários

### Animações (React Native)
- **Entrance**: `Animated.timing()` - Fade in + slide up (400ms)
- **Transitions**: `react-navigation` transitions (300ms)
- **Error shake**: `Animated.sequence()` - Horizontal shake (200ms)
- **Success**: `Animated.spring()` - Scale bounce (300ms)
- **Performance**: Usar `useNativeDriver: true` sempre que possível

### Acessibilidade (Mobile)
- **Labels**: `accessibilityLabel` em todos os componentes
- **Hints**: `accessibilityHint` para contexto adicional
- **Roles**: `accessibilityRole` (button, text, header, etc)
- **Contraste**: WCAG AAA (4.5:1+) - validar com design tokens
- **VoiceOver/TalkBack**: Suporte completo iOS/Android
- **Dynamic Type**: `allowFontScaling` e `maxFontSizeMultiplier`
- **Touch targets**: Mínimo 44x44pt para acessibilidade

---

## 🐛 CORREÇÕES DE TEXTO NECESSÁRIAS

### Onboarding
1. "Ge tante" → "Gestante"
2. "Puérpera (Recém-na cido)" → "Puérpera (Recém-nascido)"
3. "Confu a" → "Confusa"
4. "An io a" → "Ansiosa"
5. "Can ada" → "Cansada"
6. "An iedade/Depre ão" → "Ansiedade/Depressão"
7. "Só curio idade" → "Só curiosidade"
8. "Tenho, graça  a Deu" → "Tenho, graças a Deus"
9. "À  veze /Pouca" → "Às vezes/Pouca"
10. "Me  into muito  ozinha" → "Me sinto muito sozinha"
11. "De abafar Conver ar" → "Desabafar - Conversar"
12. "Dica  prática   obre" → "Dica prática sobre"
13. "Re pirar e diminuir an iedade" → "Respirar e diminuir ansiedade"
14. "Ver relato  de outra  mãe" → "Ver relato de outra mãe"
15. "Tudo pronto, 5 !" → "Tudo pronto, [Nome]!"
16. "ono do bebê" → "sono do bebê"
17. "refúgio e tá preparado" → "refúgio está preparado"
18. "Entrar na minha ca a" → "Entrar na minha casa"
19. "Seu  dado  e tão  eguro  comigo." → "Seus dados estão seguros comigo."

### Home
20. "Regi trar" → "Registrar"
21. "Conver ar" → "Conversar"
22. "De abafar" → "Desabafar"
23. "Quer  er avi ada" → "Quer ser avisada"
24. "lançarmo  toda  a  novidade" → "lançarmos todas as novidades"
25. "preparamo  com carinho" → "preparamos com carinho"
26. "li ta de e pera" → "lista de espera"

### Comunidade
27. "Compartilhe  eu momento" → "Compartilhe seu momento"
28. "Hi tória  Reai" → "Histórias Reais"
29. "con egui" → "consegui"
30. "depoi  de 3  emana  difícei" → "depois de 3 semanas difíceis"
31. " enti que recuperei" → "senti que recuperei"
32. "mai   ente" → "mais sente"
33. "depoi  do parto" → "depois do parto"
34. "não  ei quem  ou" → "não sei quem sou"
35. "preci ando muito conver ar  obre i o" → "precisando muito conversar sobre isso"
36. " em julgamento" → "sem julgamento"
37. "eguida" → "seguida"
38. "lidaram com a  eparação" → "lidaram com a separação"
39. "con elho  e abraço  virtuai" → "conselho e abraço virtual"

### Chat
40. "E tou  obrecarregada" → "Estou sobrecarregada"
41. "Medo de não  er boa mãe" → "Medo de não ser boa mãe"
42. "Conta pra mim o que está pegando..." → OK (mantém)

### Mundo Nath
43. "ba tidore" → "bastidores"
44. "em dormir" → "sem dormir"
45. "pó -parto" → "pós-parto"
46. " em filtro" → "sem filtros"
47. "dica" → "dicas"

### Hábitos
48. "você me ma" → "você mesma"
49. "De abafe" → "Desabafe"
50. "Regi trar" → "Registrar"

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### OnboardingFlowNew.tsx
- [ ] Etapa 1: Boas-vindas com ilustração
- [ ] Etapa 2: Input de nome
- [ ] Etapa 3: Seleção de estágio (4 opções)
- [ ] Etapa 4: Seleção de emoção (5 opções)
- [ ] Etapa 5: Seleção múltipla de tópicos (7 opções)
- [ ] Etapa 6: Seleção de rede de apoio (3 opções)
- [ ] Etapa 7: Seleção de necessidades (4 opções)
- [ ] Etapa 8: Finalização com checkbox termos
- [ ] Indicadores de progresso (dots)
- [ ] Navegação voltar/avançar
- [ ] Validação de campos
- [ ] Persistência de dados
- [ ] Animações de transição

### HomeScreen.tsx
- [ ] Header com saudação personalizada
- [ ] Card grande de check-in emocional
- [ ] Card contextual de ansiedade (condicional)
- [ ] Cards rápidos (2 colunas)
- [ ] Seção Mundo Nath com scroll horizontal
- [ ] Seção waitlist com formulário
- [ ] Navegação inferior (5 tabs)
- [ ] Pull to refresh
- [ ] Loading states
- [ ] Empty states

### MaesValenteScreen.tsx (Comunidade)
- [ ] Feed de posts
- [ ] Botão criar post
- [ ] Interações (like, comentar, compartilhar)
- [ ] Filtros de categoria
- [ ] Moderação de conteúdo
- [ ] Posts anônimos
- [ ] Infinite scroll

### ChatScreen.tsx
- [ ] Interface de chat
- [ ] Sugestões rápidas (3 botões)
- [ ] Input de mensagem
- [ ] Bubbles de chat
- [ ] Typing indicator
- [ ] Histórico de conversas
- [ ] Limpar histórico
- [ ] Integração com IA

### MundoNathScreen.tsx
- [ ] Header com busca
- [ ] Filtros (5 tipos)
- [ ] Seção série (lista vertical)
- [ ] Seção conteúdo (grid)
- [ ] Player de vídeo/áudio
- [ ] Navegação entre conteúdos
- [ ] Favoritos/bookmarks

### HabitsScreen.tsx
- [ ] Cards de ferramentas
- [ ] Tracking de hábitos
- [ ] Streaks
- [ ] Estatísticas
- [ ] Lembretes
- [ ] Conquistas

### Componentes Necessários
- [ ] MaternalCard (6 variantes)
- [ ] EmotionalPrompt (5 emoções)
- [ ] PostCard (comunidade)
- [ ] ContentCard (Mundo Nath)
- [ ] HabitCard (hábitos)
- [ ] ChatBubble (chat)
- [ ] ProgressIndicator (dots)
- [ ] QuickActionButton

### Funcionalidades
- [ ] Autenticação completa
- [ ] Onboarding completo
- [ ] Check-in emocional
- [ ] Chat com IA
- [ ] Comunidade (posts/comentários)
- [ ] Conteúdo (vídeos/artigos)
- [ ] Tracking de hábitos
- [ ] Notificações push
- [ ] Offline support
- [ ] Sync com Supabase

---

## 📊 ESTATÍSTICAS DA ANÁLISE

- **Telas mapeadas**: 15+
- **Etapas de onboarding**: 8
- **Erros de digitação**: 50
- **Componentes identificados**: 25+
- **Padrões de UX**: 6 categorias
- **Cores no design system**: 20+
- **Tamanhos de tipografia**: 8
- **Espaçamentos**: 7 níveis

---

## 🎯 PRÓXIMOS PASSOS (Mobile iOS/Android)

### 1. Revisar OnboardingFlowNew.tsx
- [ ] Implementar todas as 8 etapas em React Native
- [ ] Usar `ScrollView` ou `FlatList` para navegação
- [ ] Corrigir textos com erros
- [ ] Adicionar validações
- [ ] Integrar com `profileService` para salvar dados
- [ ] Testar em iOS e Android

### 2. Melhorar HomeScreen.tsx
- [ ] Implementar cards identificados (React Native components)
- [ ] Usar `FlatList` ou `ScrollView` para seções
- [ ] Adicionar seções faltantes
- [ ] Integrar com Supabase usando hooks
- [ ] Implementar pull-to-refresh
- [ ] Testar em diferentes tamanhos de tela

### 3. Criar Componentes Mobile
- [ ] `MaternalCard.tsx` (6 variantes) - usar `View`, `Text`, `Image`
- [ ] `PostCard.tsx` - para comunidade
- [ ] `ContentCard.tsx` - para Mundo Nath
- [ ] `HabitCard.tsx` - para hábitos
- [ ] Usar apenas componentes React Native nativos
- [ ] Testar em iOS e Android

### 4. Implementar Funcionalidades Mobile
- [ ] Chat com IA - usar `chatService.ts`
- [ ] Comunidade - usar `communityService.ts`
- [ ] Conteúdo - usar `feedService.ts`
- [ ] Hábitos - usar `habitsService.ts`
- [ ] Notificações push - `expo-notifications`
- [ ] Offline support - `@react-native-async-storage/async-storage`

### 5. Preparação para Stores
- [ ] Configurar `app.json` para iOS e Android
- [ ] Ícones e splash screens (iOS + Android)
- [ ] Configurar EAS Build
- [ ] Testar em dispositivos físicos
- [ ] Preparar screenshots para stores
- [ ] Revisar guidelines App Store e Google Play
- [ ] Configurar privacy policy e termos

### 6. Corrigir Textos
- [ ] Revisar todos os 50 erros identificados
- [ ] Validar em todas as telas mobile
- [ ] Garantir consistência
- [ ] Testar em diferentes idiomas (futuro)

---

**Documento criado em**: 2025-11-27  
**Última atualização**: 2025-11-27  
**Status**: ✅ Completo e pronto para implementação

