# 🎯 ULTRATHINK BASELINE - Nossa Maternidade

**Data**: 2025-12-14
**Branch**: `feature/store-ready-premium-polish`
**Objetivo**: Transformar app em "store-ready" com Premium (estilo Flo)

---

## 📊 BASELINE EXECUTADO

### 1. TypeScript Type Check ✅
**Comando**: `bun run typecheck` (tsc --noEmit)
**Resultado**: **✅ PASSOU** (0 erros no código do app)

**Nota**: Erros da Edge Function (supabase/functions/ai/index.ts) são esperados - usa Deno, não Node.

---

### 2. ESLint ⚠️
**Comando**: `bun run lint` (expo lint)
**Resultado**: **⚠️ 1 erro + 68 warnings**

#### Erro Crítico:
```
src/screens/AssistantScreen.tsx:298:23
  error: Component definition is missing display name (react/display-name)
```

#### Warnings Principais:
- **Unused variables**: 68 warnings (imports não usados, variáveis declaradas mas não usadas)
- **Array<T> syntax**: 11 warnings (usar `T[]` ao invés de `Array<T>`)
- **Missing dependencies em useEffect**: 6 warnings
- **Import order**: 2 warnings

**Categorias**:
- Unused imports/variables: ~50 warnings
- React hooks deps: ~6 warnings
- Array syntax: ~11 warnings
- Outros: ~1 warning

---

### 3. Build Readiness Check ⚠️
**Comando**: `bun run check-build-ready`
**Resultado**: **⚠️ Script com issue**

**✅ Validações que passaram**:
- eas.json encontrado
- app.json encontrado
- bundleIdentifier iOS configurado
- package Android configurado
- Ícone do app encontrado
- Splash screen encontrado

**❌ Issue identificado**:
- Script tenta usar `npx tsc` (não disponível no PATH correto)
- Solução: usar `bunx tsc` ou `bun run typecheck`

---

### 4. Tests ❌
**Comando**: Não existe script de teste configurado
**Resultado**: **❌ NÃO EXISTE**

**Nota**: Precisaremos adicionar testes para:
- billingService (Premium/IAP)
- usePremium hook
- PremiumGate component

---

### 5. Validate & Diagnose ❌
**Comando**: `npm run validate` e `npm run diagnose:production`
**Resultado**: **❌ Scripts não existem no package.json**

**Ação**: Criar esses scripts ou adaptar conforme necessário

---

## 📁 ESTRUTURA ATUAL DO PROJETO

### Navegação (Tabs)
```
MainTabs (Bottom Tab Navigator)
├── Home         → HomeScreen
├── Ciclo        → CycleTrackerScreen
├── NathIA       → AssistantScreen (AI chat)
├── Comunidade   → CommunityScreen
└── Meus Cuidados → MyCareScreen
```

### Modal Screens
```
RootNavigator (Native Stack)
├── Login, NotificationPermission, NathIAOnboarding
└── Modals:
    ├── PostDetail, NewPost
    ├── DailyLog, Affirmations, Habits
    ├── BreathingExercise, RestSounds
    ├── HabitsEnhanced, MaeValenteProgress
    └── Paywall, ComingSoon, Legal
```

### Features Implementados
- ✅ Auth (Login/Logout com Supabase)
- ✅ AI Chat (Claude Sonnet 4.5 + Gemini + fallback OpenAI)
- ✅ Cycle Tracker (calendário menstrual)
- ✅ Community Feed (posts, likes, comments)
- ✅ Habits Tracking (8 hábitos pré-definidos)
- ✅ Affirmations (afirmações diárias)
- ✅ Breathing Exercises
- ✅ Rest Sounds
- ⚠️ Paywall Screen (existe mas sem RevenueCat integrado)
- ⚠️ Premium Gating (parcialmente implementado)

### State Management (Zustand)
- ✅ `useAppStore` (user, auth, onboarding)
- ✅ `useCommunityStore` (posts, groups)
- ✅ `useChatStore` (conversas AI, termos aceitos)
- ✅ `useCycleStore` (período, logs diários)
- ✅ `useAffirmationsStore` (favoritos, hoje)
- ✅ `useHabitsStore` (hábitos, streaks)
- ✅ `useCheckInStore` (mood, energy, sleep)
- ⚠️ `usePremiumStore` (existe mas não integrado com RevenueCat)
- ⚠️ `useNathIAOnboardingStore` (existe para onboarding da NathIA)

### AI Service Architecture
- ✅ Edge Function deployada (`supabase/functions/ai/index.ts`)
- ✅ Client wrapper seguro (`src/api/ai-service.ts`)
- ✅ JWT obrigatório, API keys no backend
- ✅ Rate limiting (20 req/min)
- ✅ Roteamento Claude/Gemini/OpenAI
- ✅ Grounding com Google Search (perguntas médicas)
- ✅ Citations quando aplicável

### Design System
- ✅ `src/theme/design-system.ts` - Sistema completo
- ✅ `src/utils/colors.ts` - Re-exporta design-system (compatibilidade)
- ✅ COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, GRADIENTS
- ✅ Suporte a dark mode (COLORS_DARK)
- ✅ Logger centralizado (`src/utils/logger.ts`)
- ✅ ErrorBoundary global

---

## 🔍 ÁREAS QUE PRECISAM DE ATENÇÃO

### 1. Lint Errors/Warnings (Prioridade Alta)
- [ ] Fixar erro de display name no AssistantScreen.tsx:298
- [ ] Limpar imports não usados (~50 warnings)
- [ ] Corrigir syntax de Array<T> para T[] (~11 warnings)
- [ ] Revisar dependências de useEffect (~6 warnings)

### 2. Premium/IAP (Prioridade Crítica)
- [ ] Integrar RevenueCat SDK (react-native-purchases)
- [ ] Criar billingService completo
- [ ] Implementar usePremium hook
- [ ] Completar PremiumGate component
- [ ] Configurar offerings/packages
- [ ] Implementar restore purchases
- [ ] Adicionar deep links para manage subscription

### 3. Telas "ComingSoon" (Prioridade Alta)
- [ ] Identificar telas/botões que navegam para ComingSoonScreen
- [ ] Decidir: implementar ou remover?
- [ ] MundoNath: parece ser tab "Comunidade" atual ou precisa ser novo?

### 4. Compliance & Legal (Prioridade Alta)
- [ ] Consentimento AI (modal antes do primeiro chat)
- [ ] Links funcionais: Privacy, Terms, AI Disclaimer
- [ ] Delete account acessível e funcional
- [ ] Verificar Data Safety/Privacy Manifest

### 5. UX/UI Polish (Prioridade Média)
- [ ] Empty states para todas as telas
- [ ] Loading skeletons consistentes
- [ ] Error states com retry
- [ ] Touch targets 44pt em todos os CTAs
- [ ] accessibilityLabel em elementos principais
- [ ] Dark mode validado em todas as telas

### 6. Navegação & Botões (Prioridade Alta)
- [ ] Scan por `onPress={() => {}}` (botões sem ação)
- [ ] Verificar todas as rotas e navegações
- [ ] Garantir que não há botões "mortos"

### 7. Testes (Prioridade Média)
- [ ] Adicionar jest/testing-library
- [ ] Testes unitários para billingService
- [ ] Testes para usePremium
- [ ] Testes para PremiumGate
- [ ] Snapshot tests para telas críticas

---

## 📋 CHECKLIST PRÉ-IMPLEMENTAÇÃO

### Decisões Técnicas Assumidas
- ✅ RevenueCat para IAP (não Stripe)
- ✅ Manter design-system.ts (deletar/deprecar colors.ts)
- ✅ Tabs: Home | NathIA | MundoNath | Meus Hábitos | MãeValente
  - **Nota**: Precisa validar se "Ciclo" e "Comunidade" viram "MundoNath" ou se mantém
- ✅ Logger para todos os logs (substituir console.*)
- ✅ Provider padrão AI: Claude (melhor persona)
- ✅ Limites free/premium configuráveis

### Próximos Passos Imediatos
1. Criar ULTRATHINK_PLAN.md detalhado
2. Fazer varredura completa do app (telas, botões, navegação)
3. Fixar erro de lint crítico
4. Começar implementação Premium/IAP

---

## 🎯 MÉTRICAS DE SUCESSO

### Build & Quality
- [ ] `bun run typecheck` - 0 erros
- [ ] `bun run lint` - 0 erros, <10 warnings
- [ ] `bun run test` - 100% passing (quando implementado)
- [ ] `bun run check-build-ready` - tudo verde

### UX/UI
- [ ] 0 telas "Em breve"
- [ ] 0 botões sem ação
- [ ] 0 cores hardcoded
- [ ] Dark mode funcionando 100%
- [ ] Acessibilidade básica ok

### Premium
- [ ] RevenueCat integrado e funcional
- [ ] Paywall abre corretamente
- [ ] Restore purchases funciona
- [ ] isPremium muda após compra
- [ ] Gating aplicado em features premium

### Compliance
- [ ] Consentimento AI implementado
- [ ] Links legais funcionais
- [ ] Delete account visível
- [ ] Data Safety correto

---

**Status**: 📝 Baseline concluído - Próximo: Varredura e Planning

