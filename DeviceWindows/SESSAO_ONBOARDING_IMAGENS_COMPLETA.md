# 📚 Documentação Completa: Onboarding "Jornada da Nath" + Download de Imagens

## 🎯 Contexto da Sessão

Esta sessão focou em:

1. **Implementação completa** do onboarding narrativo "Jornada da Nath" (8 telas)
2. **Tentativa de download automático** de imagens do Instagram da Nathália Valente
3. **Documentação e organização** de assets para o onboarding

---

## 📋 PARTE 1: Implementação do Onboarding "Jornada da Nath"

### O que foi criado

#### **8 Telas de Onboarding**

1. **OnboardingWelcome** (`src/screens/onboarding/OnboardingWelcome.tsx`)
   - Vídeo de boas-vindas (15s)
   - Overlay com texto "Vem comigo? Me conta onde você está"
   - Botão "Começar →" aparece após 8s (animado)
   - Botão "Pular" no canto superior direito
   - Progresso: 0%

2. **OnboardingStage** (`src/screens/onboarding/OnboardingStage.tsx`)
   - Timeline vertical com 6 cards de estágio
   - Seleção única com feedback visual
   - Progresso: 14%

3. **OnboardingDate** (`src/screens/onboarding/OnboardingDate.tsx`)
   - Date picker com lógica condicional baseada no estágio
   - Validações específicas por estágio
   - Progresso: 28%

4. **OnboardingConcerns** (`src/screens/onboarding/OnboardingConcerns.tsx`)
   - Grid 2 colunas com 8 cards de preocupações
   - Multi-seleção (máximo 3)
   - Contador "X/3 selecionados"
   - Progresso: 42%

5. **OnboardingEmotionalState** (`src/screens/onboarding/OnboardingEmotionalState.tsx`)
   - Vídeo curto + 5 opções verticais
   - Seleção única
   - Define flag `needsExtraCare` (influencia paywall e tom da NathIA)
   - Progresso: 57%

6. **OnboardingCheckIn** (`src/screens/onboarding/OnboardingCheckIn.tsx`)
   - Toggle para check-in diário
   - Time picker aparece se habilitado
   - Progresso: 71%

7. **OnboardingSeason** (`src/screens/onboarding/OnboardingSeason.tsx`)
   - Seleção de temporada (4 opções pré-definidas ou custom)
   - Preview do ShareableCard
   - Progresso: 85%

8. **OnboardingSummary** (`src/screens/onboarding/OnboardingSummary.tsx`)
   - Resumo personalizado baseado em todas as respostas
   - 5 cards informativos dinâmicos
   - Progresso: 100%

9. **OnboardingPaywall** (`src/screens/onboarding/OnboardingPaywall.tsx`)
   - Vídeo explicando preço
   - Cards de planos (Trial 7 dias + R$ 34,90/mês)
   - Banner especial se `needsExtraCare = true`
   - Integração RevenueCat (planejada)

#### **Componentes Reutilizáveis**

- **ProgressBar** (`src/components/onboarding/ProgressBar.tsx`)
  - Barra de progresso animada (0-100%)
  - Usa React Native Reanimated

- **VideoPlayer** (`src/components/onboarding/VideoPlayer.tsx`)
  - Player de vídeo usando Expo AV
  - Auto-play, mute, loading state

- **StageCard** (`src/components/onboarding/StageCard.tsx`)
  - Card para exibir estágios da jornada

- **ConcernCard** (`src/components/onboarding/ConcernCard.tsx`)
  - Card para preocupações (multi-select)

- **ShareableCard** (`src/components/onboarding/ShareableCard.tsx`)
  - Card compartilhável com nome da temporada

#### **State Management**

- **Store Zustand** (`src/state/nath-journey-onboarding-store.ts`)
  - Persistido com AsyncStorage
  - Gerencia todo o estado do onboarding
  - Flag `isComplete` para controle de navegação

#### **Types TypeScript**

- **Types** (`src/types/nath-journey-onboarding.types.ts`)
  - `OnboardingStage` (enum: TENTANTE, GRAVIDA_T1/T2/T3, PUERPERIO, MAE_RECENTE)
  - `OnboardingConcern` (enum: 8 preocupações)
  - `EmotionalState` (enum: 5 estados)
  - `OnboardingData` (interface completa)

#### **Configuração**

- **Dados Mock** (`src/config/nath-journey-onboarding-data.ts`)
  - Cards de estágio, preocupações, estados emocionais
  - Placeholders temporários (Unsplash)

#### **API Service**

- **Onboarding Service** (`src/api/onboarding-service.ts`)
  - Função `saveOnboardingData()` para salvar no Supabase
  - Upsert (atualiza se existe, cria se não existe)

#### **Navegação**

- **RootNavigator** (`src/navigation/RootNavigator.tsx`)
  - Integrado no fluxo de autenticação
  - Ordem: Login → NotificationPermission → **NathJourneyOnboarding** → Onboarding → NathIAOnboarding → MainApp
  - Controle via `isNathJourneyOnboardingComplete`

#### **Supabase Migration**

- **Migration** (`supabase/migrations/028_nath_journey_onboarding.sql`)
  - Tabela `user_onboarding` com todos os campos
  - ENUMs para stage, concern, emotional_state
  - RLS policies (insert, select, update)
  - Constraints de validação

---

## 📋 PARTE 2: Tentativa de Download de Imagens do Instagram

### Objetivo

Baixar automaticamente imagens do perfil @nathaliavalente para usar no onboarding.

### Desafios Encontrados

1. **Instagram bloqueia downloads sem autenticação**
   - Requer login para acessar conteúdo completo
   - URLs de imagens têm tokens que expiram rapidamente

2. **Proteções anti-scraping**
   - Não é possível extrair URLs diretas das imagens
   - JavaScript carrega imagens dinamicamente

3. **Screenshots capturados**
   - `post-paris-thales-full.png` - Post "Chegamos em Paris"
   - `post-thales-aviao-full.png` - Post "1ª vez do Thales em um avião"
   - Localização: `.playwright-mcp/`

### O que foi feito

1. **Navegação no Instagram**
   - Acessei perfil @nathaliavalente
   - Identifiquei posts relevantes para cada etapa
   - Criei mapeamento detalhado

2. **Documentação criada**
   - `docs/ONBOARDING_ASSETS_MAPPING.md` - Mapeamento completo com URLs
   - `docs/DOWNLOAD_IMAGES_INSTRUCTIONS.md` - Instruções passo a passo
   - `docs/IMAGENS_STATUS.md` - Status atual e próximos passos

3. **Scripts criados**
   - `scripts/download-instagram-images.js` - Lista URLs e verifica downloads
   - `scripts/download-instagram-direct.js` - Tentativa de download direto
   - `scripts/extract-images-from-screenshots.js` - Processa screenshots

### Posts Identificados

#### **Posts com Thales (PUERPERIO / MAE_RECENTE)**

1. **Post: Chegamos em Paris**
   - URL: `https://www.instagram.com/nathaliavalente/p/DSchB9Pjnz3/`
   - Sugestão: `stage-puerperio.jpg` ou `stage-mae-recente.jpg`
   - Descrição: Nathália com Thales em Paris, Torre Eiffel ao fundo

2. **Post: 1ª vez do Thales em um avião**
   - URL: `https://www.instagram.com/nathaliavalente/p/DSaNWCrjvD7/`
   - Sugestão: `checkin-nath-thales.jpg`
   - Descrição: Nathália segurando Thales no avião

3. **Post: Thales e Zuzu**
   - URL: `https://www.instagram.com/nathaliavalente/p/DSTJIo3koYr/`
   - Sugestão: `stage-mae-recente.jpg`
   - Descrição: Família com Thales e Zuzu

#### **Posts de Paris (GRAVIDA / TENTANTE)**

- Vários posts com Torre Eiffel
- Podem ser usados para estágios anteriores
- Ver `docs/ONBOARDING_ASSETS_MAPPING.md` para lista completa

### Estrutura de Arquivos Esperada

```
assets/onboarding/
├── images/
│   ├── stage-tentante.jpg
│   ├── stage-gravida-t1.jpg
│   ├── stage-gravida-t2.jpg
│   ├── stage-gravida-t3.jpg
│   ├── stage-puerperio.jpg
│   ├── stage-mae-recente.jpg
│   ├── concern-ansiedade-medo.jpg
│   ├── concern-falta-informacao.jpg
│   ├── concern-sintomas-fisicos.jpg
│   ├── concern-mudancas-corpo.jpg
│   ├── concern-relacionamento.jpg
│   ├── concern-trabalho-maternidade.jpg
│   ├── concern-solidao.jpg
│   ├── concern-financas.jpg
│   └── nath-profile-small.jpg
└── videos/
    ├── welcome.mp4 (15s)
    ├── emotional-state.mp4 (10s)
    └── paywall.mp4 (15s)
```

---

## 🖥️ INSTRUÇÕES PARA WINDOWS

### Setup Inicial

1. **Clonar repositório**

   ```bash
   git clone <repo-url>
   cd NossaMaternidade
   ```

2. **Instalar dependências**

   ```bash
   npm install
   # ou
   bun install
   ```

3. **Verificar estrutura**
   ```bash
   # Verificar se pastas existem
   dir src\screens\onboarding
   dir src\components\onboarding
   dir assets\onboarding
   ```

### Comandos Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia Expo dev server
npm run ios            # iOS (requer Mac)
npm run android        # Android
npm run web            # Web browser

# Qualidade
npm run quality-gate   # Typecheck + lint + build check
npm run typecheck      # TypeScript
npm run lint           # ESLint
npm run lint:fix       # Auto-fix lint

# Limpeza
npm run clean          # Limpa cache
npm run clean:all      # Limpa tudo (inclui node_modules)
```

### Download Manual de Imagens (Windows)

#### Método 1: Via Navegador

1. Abra cada URL de `docs/ONBOARDING_ASSETS_MAPPING.md`
2. Faça login no Instagram
3. Clique com botão direito na imagem
4. Selecione "Salvar imagem como..."
5. Salve em `assets\onboarding\images\` com o nome correto

#### Método 2: Usar Screenshots Temporários

```bash
# Copiar screenshots (se existirem)
copy .playwright-mcp\post-paris-thales-full.png assets\onboarding\images\stage-puerperio.jpg
copy .playwright-mcp\post-thales-aviao-full.png assets\onboarding\images\stage-mae-recente.jpg
```

#### Método 3: Usar Script Node.js

```bash
# Executar script de verificação
node scripts\download-instagram-images.js

# Verificar quais imagens já foram baixadas
dir assets\onboarding\images
```

### Verificação de Integração

1. **Verificar navegação**
   - Abrir `src/navigation/RootNavigator.tsx`
   - Confirmar que `OnboardingStack` está integrado
   - Verificar ordem: Login → NotificationPermission → **NathJourneyOnboarding** → ...

2. **Verificar store**
   - Abrir `src/state/nath-journey-onboarding-store.ts`
   - Confirmar persistência com AsyncStorage
   - Verificar flag `isComplete`

3. **Verificar tipos**
   - Abrir `src/types/nath-journey-onboarding.types.ts`
   - Confirmar que todos os tipos estão definidos

4. **Testar fluxo**
   ```bash
   npm start
   # Navegar pelo onboarding completo
   # Verificar se dados são salvos no Supabase
   ```

### Troubleshooting Windows

#### Problema: Scripts não executam

**Solução:**

```bash
# Usar Git Bash ou PowerShell
# Para scripts .sh, usar Git Bash
bash scripts/quality-gate.sh

# Para scripts .js, usar Node diretamente
node scripts/download-instagram-images.js
```

#### Problema: Paths com barras invertidas

**Solução:**

- O código usa paths Unix (`/`) que funcionam no Windows também
- Se necessário, usar `path.join()` do Node.js

#### Problema: LightningCSS no Windows

**Solução:**

- Script `scripts/fix-lightningcss.js` roda automaticamente no `postinstall`
- Se falhar, executar manualmente:
  ```bash
  node scripts/fix-lightningcss.js
  ```

---

## 📁 Arquivos Criados/Modificados Nesta Sessão

### Novos Arquivos

```
src/
├── screens/onboarding/
│   ├── OnboardingWelcome.tsx
│   ├── OnboardingStage.tsx
│   ├── OnboardingDate.tsx
│   ├── OnboardingConcerns.tsx
│   ├── OnboardingEmotionalState.tsx
│   ├── OnboardingCheckIn.tsx
│   ├── OnboardingSeason.tsx
│   ├── OnboardingSummary.tsx
│   └── OnboardingPaywall.tsx
├── components/onboarding/
│   ├── ProgressBar.tsx
│   ├── VideoPlayer.tsx
│   ├── StageCard.tsx
│   ├── ConcernCard.tsx
│   ├── ShareableCard.tsx
│   └── index.ts
├── state/
│   └── nath-journey-onboarding-store.ts
├── types/
│   └── nath-journey-onboarding.types.ts
├── config/
│   └── nath-journey-onboarding-data.ts
└── api/
    └── onboarding-service.ts

supabase/migrations/
└── 028_nath_journey_onboarding.sql

scripts/
├── download-instagram-images.js
├── download-instagram-direct.js
└── extract-images-from-screenshots.js

docs/
├── NATH_JOURNEY_ONBOARDING.md
├── ONBOARDING_ASSETS_MAPPING.md
├── DOWNLOAD_IMAGES_INSTRUCTIONS.md
└── IMAGENS_STATUS.md
```

### Arquivos Modificados

```
src/
├── navigation/
│   └── RootNavigator.tsx          # Adicionado OnboardingStack
└── types/
    └── navigation.ts              # Adicionado OnboardingStackParamList
```

---

## 🔑 Pontos Importantes

### Design System

- **Cores**: Usar `Tokens.*` de `src/theme/tokens.ts` (Calm FemTech preset)
- **Nunca hardcodar cores**: Proibido `#xxx`, `rgba()`, `'white'`, `'black'`
- **Overlays**: Usar `Tokens.overlay.*`
- **Shadows**: Usar `Tokens.neutral[900]` como `shadowColor`

### TypeScript

- **Strict mode**: Zero `any` types
- **Sem `@ts-ignore`**: Proibido sem justificativa explícita
- **Tipos de imagem**: Suporta `number | { uri: string }`

### Logging

- **Usar `logger.*`**: Nunca `console.log`
- **Padrão**: `logger.info('mensagem', 'contexto', metadata?)`

### Performance

- **Listas**: Usar `FlatList` ou `FlashList` (nunca `ScrollView + map()`)
- **Memoização**: Usar `React.memo()` quando necessário

### Estado

- **Zustand selectors**: Usar selectores individuais

  ```typescript
  // ✅ BOM
  const user = useAppStore((s) => s.user);

  // ❌ RUIM (cria nova ref)
  const { user } = useAppStore((s) => ({ user: s.user }));
  ```

---

## 🚀 Próximos Passos

### Curto Prazo

1. **Obter imagens reais**
   - Download manual ou solicitar à Nathália
   - Substituir placeholders em `nath-journey-onboarding-data.ts`

2. **Obter vídeos reais**
   - Vídeo de boas-vindas (15s)
   - Vídeo estado emocional (10s)
   - Vídeo paywall (15s)

3. **Integrar RevenueCat**
   - Implementar paywall em `OnboardingPaywall.tsx`
   - Testar compras

4. **Adicionar analytics**
   - Eventos em cada tela
   - Tracking de conversão

### Médio Prazo

1. **Testes**
   - Testes unitários dos componentes
   - Testes de integração do fluxo completo

2. **Otimizações**
   - Lazy loading de vídeos
   - Otimização de imagens

3. **Acessibilidade**
   - Verificar WCAG AAA
   - Adicionar `accessibilityLabel` em todos os elementos

---

## 📝 Notas Técnicas

### Navegação

O onboarding está integrado no `RootNavigator` com a seguinte ordem:

```
Login
  ↓
NotificationPermission
  ↓
NathJourneyOnboarding (NOVO - 8 telas)
  ↓
Onboarding (antigo - 6 steps)
  ↓
NathIAOnboarding (5 steps)
  ↓
MainApp
```

### Persistência

- Store Zustand persiste com AsyncStorage
- Dados também salvos no Supabase via `onboarding-service.ts`
- Flag `isComplete` controla navegação

### Validações

- **Datas**: Validação específica por estágio
- **Preocupações**: Máximo 3 seleções
- **Temporada**: 4 opções pré-definidas ou custom

### Flags Especiais

- **`needsExtraCare`**: Definido em `OnboardingEmotionalState`
  - `true` se "Muito ansiosa" ou "Triste/esgotada"
  - Influencia tom da NathIA e comportamento do paywall

---

## 🐛 Problemas Conhecidos

1. **Imagens não baixadas**
   - Instagram bloqueia downloads automáticos
   - Solução: Download manual ou solicitar assets

2. **Placeholders temporários**
   - Usando URLs do Unsplash
   - Substituir quando imagens reais estiverem disponíveis

3. **RevenueCat não integrado**
   - Paywall preparado mas não conectado
   - Implementar quando SDK estiver configurado

---

## 📚 Referências

- **Documentação completa**: `docs/NATH_JOURNEY_ONBOARDING.md`
- **Mapeamento de assets**: `docs/ONBOARDING_ASSETS_MAPPING.md`
- **Instruções de download**: `docs/DOWNLOAD_IMAGES_INSTRUCTIONS.md`
- **Status das imagens**: `docs/IMAGENS_STATUS.md`

---

## ✅ Checklist de Verificação

- [x] 8 telas de onboarding implementadas
- [x] Componentes reutilizáveis criados
- [x] Store Zustand configurado
- [x] Types TypeScript definidos
- [x] Navegação integrada no RootNavigator
- [x] Supabase migration criada
- [x] API service para salvar dados
- [x] Documentação completa criada
- [ ] Imagens reais obtidas (pendente)
- [ ] Vídeos reais obtidos (pendente)
- [ ] RevenueCat integrado (pendente)
- [ ] Analytics implementado (pendente)

---

**Última atualização**: 24 de dezembro de 2024
**Sessão**: Onboarding "Jornada da Nath" + Download de Imagens Instagram
**Status**: Implementação completa, aguardando assets reais
