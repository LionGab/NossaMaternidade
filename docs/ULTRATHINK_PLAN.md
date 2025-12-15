# 🎯 ULTRATHINK PLAN - Store-Ready + Premium Polish

**Data**: 2025-12-14
**Branch**: `feature/store-ready-premium-polish`
**Baseline**: Ver [ULTRATHINK_BASELINE.md](./ULTRATHINK_BASELINE.md)

---

## 🎬 EXECUTIVE SUMMARY

### Objetivo
Transformar "Nossa Maternidade" em app **store-ready** com padrão de credibilidade (influenciadora 10M) e **sistema Premium estilo Flo** (paywall + IAP + gating).

### Escopo Total
- **5 etapas principais** (0-4)
- **~75 tarefas** distribuídas
- **Tempo estimado**: 2-3 dias de desenvolvimento intensivo

### Resultado Esperado
- ✅ 0 telas "Em breve"
- ✅ 0 botões sem ação
- ✅ Premium/IAP funcional (RevenueCat)
- ✅ Compliance stores (iOS + Android)
- ✅ Testes básicos implementados
- ✅ Build passa sem erros

---

## 📊 VARREDURA COMPLETA - "O QUE FALTA"

### 🔍 ComingSoon Navigation (23 ocorrências)

**Arquivos com navegação para ComingSoon**:

1. **AssistantScreen.tsx** (3 ocorrências):
   - Linha 268: Mensagem de voz → `"Em breve você poderá enviar mensagens de voz..."`
   - Linha 289: Anexos (foto/documentos) → `"Em breve você poderá enviar fotos..."`
   - Linha 951: accessibilityLabel "Mensagem de voz (em breve)"

2. **HomeScreen.tsx** (1 ocorrência):
   - Linha 174: Personalizar notificações → `"Em breve você poderá personalizar suas notificações..."`

3. **MyCareScreen.tsx** (8 ocorrências):
   - Linha 134: Exercícios de respiração (JÁ EXISTE BreathingExerciseScreen!)
   - Linha 143: Sons relaxantes (JÁ EXISTE RestSoundsScreen!)
   - Linha 160: Técnicas de alívio ansiedade
   - Linha 165: Sono do bebê
   - Linha 170: Amamentação
   - Linha 175: Autocuidado
   - Linha 182: Outros...

4. **CommunityScreen.tsx** (2 ocorrências):
   - Linha 131: Participar de grupos
   - Linha 143: Criar grupo

5. **NewPostScreen.tsx** (2 ocorrências):
   - Linha 36: Galeria de fotos
   - Linha 46: Tirar foto

6. **ProfileScreen.tsx** (5 ocorrências):
   - Linha 43: Configurações gerais
   - Linha 57: Editar perfil
   - Linha 62: Notificações
   - Linha 67: Privacidade
   - Linha 72: Ajuda
   - Linha 84: (outro ComingSoon)

### 🎨 Botões com onPress vazio (22 arquivos)

**Arquivos identificados** (precisam revisão manual):
- ProfileScreen.tsx
- MyCareScreen.tsx
- NewPostScreen.tsx
- LoginScreen.tsx (provavelmente ok - é um template)
- CommunityScreen.tsx
- HomeScreen.tsx
- AssistantScreen.tsx
- HabitsScreen.tsx
- CycleTrackerScreen.tsx
- DailyLogScreen.tsx
- AffirmationsScreen.tsx
- OnboardingScreen.tsx
- NathIAOnboardingScreen.tsx
- RestSoundsScreen.tsx
- PaywallScreen.tsx
- MaeValenteProgressScreen.tsx
- LegalScreen.tsx
- HabitsEnhancedScreen.tsx
- BreathingExerciseScreen.tsx
- MainTabNavigator.tsx
- CommunityComposer.tsx
- DailyCheckIn.tsx

### 📝 TODOs Encontrados (3 ocorrências)

1. `logger.ts:67` - TODO: Integrar com Sentry
2. `logger.ts:69` - TODO: Enviar para serviço de monitoring
3. `colors.ts:5` - TODO: Migrar imports para design-system.ts

---

## 🗺️ PLANO DE EXECUÇÃO DETALHADO

---

## ⚙️ ETAPA 0: SETUP & PREPARAÇÃO (30 min)

### 0.1 Corrigir Lint Error Crítico ⚡
**Arquivo**: `src/screens/AssistantScreen.tsx:298`
**Erro**: Component definition missing display name

```typescript
// ANTES (linha ~298)
const renderMessage = ({item}: {item: Message}) => ...

// DEPOIS
const MessageItem = React.memo(({item}: {item: Message}) => {
  return (...)
});
MessageItem.displayName = 'MessageItem';
```

**Critério**: `bun run lint` deve ter 0 erros.

---

### 0.2 Limpar Imports Não Usados (15 min)
**Comando**: `bun run lint --fix`
**Alvo**: Reduzir 68 warnings para <10

**Files prioritários**:
- database.ts (9 warnings)
- elevenlabs.ts (5 warnings)
- AssistantScreen.tsx
- HabitsScreen.tsx (5 warnings de imports Reanimated)

---

### 0.3 Criar Scripts Faltantes (10 min)

**Arquivo**: `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "validate": "bun run typecheck && bun run lint",
    "diagnose:production": "bun run validate && bun run check-build-ready"
  }
}
```

---

### 0.4 Configurar Jest/Testing Library (20 min)

**Instalar**:
```bash
bun add -D jest @testing-library/react-native @testing-library/jest-native jest-expo @types/jest
```

**Criar**: `jest.config.js`
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
```

**Criar**: `jest.setup.js`
```javascript
import '@testing-library/jest-native/extend-expect';
```

---

## 🎨 ETAPA 1: POLISH TOTAL UX/UI (4-6h)

### 1.1 Eliminar TODAS as navegações "ComingSoon" (2h)

#### 1.1.1 MyCareScreen - Conectar Telas Existentes
**Arquivo**: `src/screens/MyCareScreen.tsx`

**Mudanças**:
- Linha 134: `navigation.navigate("BreathingExercise")` (tela JÁ EXISTE!)
- Linha 143: `navigation.navigate("RestSounds")` (tela JÁ EXISTE!)

**Implementar telas restantes**:
- [ ] `AnxietyReliefScreen` (linha 160) - ou redirecionar para BreathingExercise
- [ ] `BabySleepScreen` (linha 165) - ou redirecionar para RestSounds
- [ ] `BreastfeedingScreen` (linha 170) - ou redirecionar para Community com filtro
- [ ] `SelfCareScreen` (linha 175) - ou redirecionar para Affirmations

**Decisão**: Implementar básico ou redirecionar inteligentemente?
- **Sugestão**: Redirecionar para telas existentes + avisar "Em desenvolvimento"
- BreathingExercise = ajuda ansiedade + sono bebê
- RestSounds = meditação + sono
- Community = amamentação (grupo)
- Affirmations = autocuidado

---

#### 1.1.2 AssistantScreen - Remover/Adaptar Features
**Arquivo**: `src/screens/AssistantScreen.tsx`

**Opção A** (Recomendado): Esconder botões "Em breve"
```typescript
// Linha ~950: Remover botão de voz completamente (ou mover para Premium)
// Linha ~289: Remover botão de anexos (ou mover para Premium)
```

**Opção B**: Implementar features básicas
- Voice: Integrar `src/hooks/useVoice.ts` (já existe!)
- Anexos: Usar `expo-image-picker` (simples)

**Decisão assumida**: **Opção A** - Remover botões temporariamente, implementar em v2.

---

#### 1.1.3 CommunityScreen - Grupos
**Arquivo**: `src/screens/CommunityScreen.tsx`

**Opções**:
- Implementar grupos básicos (CRUD no Supabase)
- OU remover botões "Participar" e "Criar grupo" por enquanto

**Decisão assumida**: Remover botões, adicionar na v2.

---

#### 1.1.4 NewPostScreen - Upload de Imagem
**Arquivo**: `src/screens/NewPostScreen.tsx`

**Implementação Rápida**:
```typescript
import * as ImagePicker from 'expo-image-picker';

const handlePickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};

const handleTakePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};
```

**Tempo**: 30 min (implementar + upload para Supabase Storage)

---

#### 1.1.5 ProfileScreen - Settings
**Arquivo**: `src/screens/ProfileScreen.tsx`

**Opção A**: Implementar SettingsScreen básica
**Opção B**: Remover botões

**Decisão assumida**: Criar `SettingsScreen.tsx` básica (15 min):
- Notificações (toggle simples)
- Tema (dark/light/auto)
- Idioma (português fixo)
- Logout
- Delete Account

---

#### 1.1.6 HomeScreen - Notificações
**Arquivo**: `src/screens/HomeScreen.tsx`

**Linha 174**: Conectar com SettingsScreen ou remover botão.

---

### 1.2 Criar Componentes Padrão (1h)

#### 1.2.1 ScreenLayout Component
**Arquivo**: `src/components/layout/ScreenLayout.tsx`

```typescript
interface ScreenLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerRight?: React.ReactNode;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  emptyState?: React.ReactNode;
  showEmpty?: boolean;
}

export function ScreenLayout({...}: ScreenLayoutProps) {
  // Renderiza: header + loading skeleton + error + empty state + children
}
```

---

#### 1.2.2 EmptyState Component
**Arquivo**: `src/components/ui/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon: string; // Ionicons name
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

---

#### 1.2.3 LoadingSkeleton Components
**Arquivo**: `src/components/ui/Skeletons.tsx`

```typescript
export function PostSkeleton() { ... }
export function ChatMessageSkeleton() { ... }
export function CardSkeleton() { ... }
```

---

#### 1.2.4 ErrorState Component
**Arquivo**: `src/components/ui/ErrorState.tsx`

```typescript
interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}
```

---

### 1.3 Aplicar Polish em Telas Principais (2h)

#### Telas prioritárias:
1. **HomeScreen** - CTA principal + 2 secundários, sem poluição
2. **AssistantScreen** (NathIA) - Sugestões contextuais, primeira conversa
3. **CommunityScreen** - Empty state, categorias
4. **MyCareScreen** (Meus Hábitos?) - Progress claro
5. **ProfileScreen** (MãeValente?) - Settings funcional

**Para cada tela**:
- [ ] Aplicar ScreenLayout
- [ ] Loading skeleton
- [ ] Empty state
- [ ] Error state com retry
- [ ] Verificar touch targets 44pt
- [ ] Adicionar accessibilityLabel em CTAs

---

### 1.4 Dark Mode Validation (30 min)

**Testar em**:
- HomeScreen
- AssistantScreen
- CommunityScreen
- ProfileScreen
- Settings

**Verificar**:
- Cores do design-system.ts (COLORS vs COLORS_DARK)
- Contraste adequado
- Borders visíveis

---

### 1.5 Checklist Etapa 1 ✅

- [ ] 0 navegações para "ComingSoon"
- [ ] 0 botões sem ação real
- [ ] 0 cores hardcoded (usar design-system.ts)
- [ ] ScreenLayout criado e aplicado em 5+ telas
- [ ] Empty states em 5+ telas
- [ ] Loading skeletons em 3+ telas
- [ ] Error states com retry em 3+ telas
- [ ] Dark mode ok em 5+ telas
- [ ] Touch targets 44pt verificados
- [ ] accessibilityLabel em CTAs principais

---

## 💎 ETAPA 2: PREMIUM/IAP (ESTILO FLO) (6-8h)

### 2.1 Instalar e Configurar RevenueCat (1h)

#### 2.1.1 Instalar SDK
```bash
bun add react-native-purchases
```

#### 2.1.2 Configurar iOS
**Arquivo**: `ios/Podfile` (se necessário)
```ruby
pod 'RevenueCat', :git => 'https://github.com/RevenueCat/purchases-ios.git'
```

Rodar:
```bash
cd ios && pod install && cd ..
```

#### 2.1.3 Configurar Android
**Arquivo**: `android/app/build.gradle` (verificar se auto-link funciona)

#### 2.1.4 Obter API Keys
1. Criar conta em https://www.revenuecat.com
2. Criar app "Nossa Maternidade"
3. Obter:
   - iOS API Key
   - Android API Key
4. Configurar produtos:
   - **Monthly**: `nossa_premium_monthly` ($9.90/mês ou similar)
   - **Annual**: `nossa_premium_annual` ($99.90/ano, economiza ~17%)

#### 2.1.5 Configurar EAS Secrets
```bash
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "..."
```

---

### 2.2 Criar Billing Service (2h)

**Arquivo**: `src/services/billing/billingService.ts`

```typescript
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
  PurchasesOffering,
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { logger } from '../../utils/logger';

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '';

export const billingService = {
  /**
   * Inicializar RevenueCat (chamar no App.tsx)
   */
  async initialize(userId?: string): Promise<{ data: boolean; error: Error | null }> {
    try {
      const apiKey = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;

      if (!apiKey) {
        throw new Error('RevenueCat API key not configured');
      }

      await Purchases.configure({ apiKey });

      if (userId) {
        await Purchases.logIn(userId);
      }

      logger.info('RevenueCat initialized', 'Billing', { userId });
      return { data: true, error: null };
    } catch (error) {
      logger.error('Failed to initialize RevenueCat', 'Billing', error as Error);
      return { data: false, error: error as Error };
    }
  },

  /**
   * Obter info do customer (isPremium, expiration, etc)
   */
  async getCustomerInfo(): Promise<{ data: CustomerInfo | null; error: Error | null }> {
    try {
      const info = await Purchases.getCustomerInfo();
      logger.info('Customer info retrieved', 'Billing', {
        isPremium: info.entitlements.active['premium'] !== undefined,
      });
      return { data: info, error: null };
    } catch (error) {
      logger.error('Failed to get customer info', 'Billing', error as Error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Obter offerings (produtos disponíveis)
   */
  async getOfferings(): Promise<{ data: PurchasesOffering | null; error: Error | null }> {
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;

      if (!current) {
        throw new Error('No offerings available');
      }

      logger.info('Offerings retrieved', 'Billing', {
        packagesCount: current.availablePackages.length,
      });
      return { data: current, error: null };
    } catch (error) {
      logger.error('Failed to get offerings', 'Billing', error as Error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Comprar um package
   */
  async purchase(pkg: PurchasesPackage): Promise<{ data: CustomerInfo | null; error: Error | null }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);

      logger.info('Purchase successful', 'Billing', {
        packageId: pkg.identifier,
        isPremium: customerInfo.entitlements.active['premium'] !== undefined,
      });

      return { data: customerInfo, error: null };
    } catch (error) {
      logger.error('Purchase failed', 'Billing', error as Error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Restaurar compras
   */
  async restorePurchases(): Promise<{ data: CustomerInfo | null; error: Error | null }> {
    try {
      const info = await Purchases.restorePurchases();

      logger.info('Purchases restored', 'Billing', {
        isPremium: info.entitlements.active['premium'] !== undefined,
      });

      return { data: info, error: null };
    } catch (error) {
      logger.error('Failed to restore purchases', 'Billing', error as Error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Abrir manage subscriptions (deep link para stores)
   */
  openManageSubscriptions(): void {
    try {
      // iOS: Settings app
      // Android: Play Store subscriptions
      Purchases.showManagementInterface();
      logger.info('Opened manage subscriptions', 'Billing');
    } catch (error) {
      logger.error('Failed to open manage subscriptions', 'Billing', error as Error);
    }
  },
};
```

---

### 2.3 Criar usePremium Hook (30 min)

**Arquivo**: `src/hooks/usePremium.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { billingService } from '../services/billing/billingService';
import { logger } from '../utils/logger';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);

  const checkPremiumStatus = useCallback(async () => {
    // Cache de 10 minutos
    if (lastCheckedAt && Date.now() - lastCheckedAt.getTime() < 10 * 60 * 1000) {
      return;
    }

    setIsLoading(true);
    const { data, error } = await billingService.getCustomerInfo();

    if (data && !error) {
      const premium = data.entitlements.active['premium'] !== undefined;
      setIsPremium(premium);
      setLastCheckedAt(new Date());
    } else {
      logger.warn('Failed to check premium status', 'usePremium');
    }

    setIsLoading(false);
  }, [lastCheckedAt]);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  return {
    isPremium,
    isLoading,
    refresh: checkPremiumStatus,
  };
}
```

---

### 2.4 Completar PaywallScreen (2h)

**Arquivo**: `src/screens/PaywallScreen.tsx` (já existe parcialmente)

**Features necessárias**:
- [ ] Título: "Desbloqueie o Premium"
- [ ] Lista de benefícios (3-6 bullets com ícones)
- [ ] Planos (Monthly/Annual) com seleção
- [ ] Destaque "Economize 17%" no anual
- [ ] CTA fixo: "Começar agora"
- [ ] Link: "Restaurar compras"
- [ ] Link: "Gerenciar assinatura"
- [ ] Rodapé: Termos, Privacidade, Disclaimer médico
- [ ] Loading states durante purchase
- [ ] Error handling user-friendly

**Integração**:
```typescript
const {isPremium} = usePremium();
const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
const [purchasing, setPurchasing] = useState(false);

useEffect(() => {
  loadOfferings();
}, []);

const loadOfferings = async () => {
  const {data} = await billingService.getOfferings();
  if (data) {
    setOfferings(data);
    setSelectedPackage(data.annual || data.monthly); // Default: annual
  }
};

const handlePurchase = async () => {
  if (!selectedPackage) return;
  setPurchasing(true);
  const {data, error} = await billingService.purchase(selectedPackage);
  setPurchasing(false);

  if (data && !error) {
    navigation.goBack(); // Fecha paywall
  } else {
    // Mostrar erro
  }
};

const handleRestore = async () => {
  const {data, error} = await billingService.restorePurchases();
  if (data?.entitlements.active['premium']) {
    navigation.goBack();
  }
};
```

---

### 2.5 Implementar PremiumGate (1h)

**Arquivo**: `src/components/PremiumGate.tsx` (já existe parcialmente)

**Melhorias necessárias**:
```typescript
interface PremiumGateProps {
  children: React.ReactNode;
  feature: string; // "voice_nathia" | "mundo_nath_premium" | "insights"
  previewContent?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PremiumGate({children, feature, previewContent, fallback}: PremiumGateProps) {
  const {isPremium, isLoading} = usePremium();
  const navigation = useNavigation();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isPremium) {
    return <>{children}</>;
  }

  // Free user: mostra preview + CTA
  return (
    <View>
      {previewContent}
      <Pressable
        onPress={() => navigation.navigate('Paywall', {source: feature})}
      >
        <Text>🔒 Assinar Premium para Desbloquear</Text>
      </Pressable>
      {fallback}
    </View>
  );
}
```

---

### 2.6 Aplicar Gating em Features (1h)

#### 2.6.1 NathIA - Limites de Mensagens
**Arquivo**: `src/screens/AssistantScreen.tsx`

```typescript
const MAX_MESSAGES_FREE = 20; // por dia

const {isPremium} = usePremium();
const messagesCount = useChatStore(s => {
  const today = new Date().toISOString().split('T')[0];
  const currentConv = s.conversations.find(c => c.id === s.currentConversationId);
  return currentConv?.messages.filter(m => m.createdAt.startsWith(today)).length || 0;
});

const canSendMessage = isPremium || messagesCount < MAX_MESSAGES_FREE;

// No handleSend:
if (!canSendMessage) {
  navigation.navigate('Paywall', {source: 'nathia_limit'});
  return;
}
```

#### 2.6.2 MundoNath - Conteúdos Premium
**Arquivo**: `src/screens/CommunityScreen.tsx` (ou criar MundoNathScreen?)

Envolver posts premium com:
```typescript
<PremiumGate
  feature="mundo_nath_premium"
  previewContent={<PostPreview post={post} />}
>
  <PostFull post={post} />
</PremiumGate>
```

#### 2.6.3 Insights/Relatórios (se existir)
Similar ao acima.

---

### 2.7 Analytics de Premium (30 min)

**Arquivo**: `src/services/analytics/premiumAnalytics.ts`

```typescript
export const premiumAnalytics = {
  trackPaywallViewed(source: string) {
    logger.info('Paywall viewed', 'Analytics', {source});
    // Integrar com analytics provider (Firebase, Amplitude, etc)
  },

  trackPlanSelected(plan: 'monthly' | 'annual') {
    logger.info('Plan selected', 'Analytics', {plan});
  },

  trackPurchaseSuccess(plan: string, price: number) {
    logger.info('Purchase success', 'Analytics', {plan, price});
  },

  trackPurchaseFailed(error: Error) {
    logger.error('Purchase failed', 'Analytics', error);
  },

  trackRestoreSuccess() {
    logger.info('Restore success', 'Analytics');
  },

  trackManageSubscriptionOpened() {
    logger.info('Manage subscription opened', 'Analytics');
  },
};
```

Integrar no PaywallScreen em todos os eventos.

---

### 2.8 Checklist Etapa 2 ✅

- [ ] RevenueCat instalado e configurado
- [ ] API keys em EAS secrets
- [ ] billingService completo ({data, error} pattern)
- [ ] usePremium hook funcional
- [ ] PaywallScreen Flo-like (benefícios, planos, CTAs)
- [ ] Restore purchases funciona
- [ ] Manage subscriptions abre store
- [ ] PremiumGate implementado e testado
- [ ] Gating aplicado em NathIA (limites)
- [ ] Gating aplicado em MundoNath (conteúdos)
- [ ] Analytics de Premium disparando eventos
- [ ] Build iOS e Android não quebram
- [ ] isPremium muda após compra/restore
- [ ] App útil no free (sem travar)

---

## 🛡️ ETAPA 3: COMPLIANCE STORES (3-4h)

### 3.1 Consentimento de IA (1h)

#### 3.1.1 Criar AIConsentModal
**Arquivo**: `src/components/modals/AIConsentModal.tsx`

```typescript
interface AIConsentModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function AIConsentModal({visible, onAccept, onDecline}: AIConsentModalProps) {
  return (
    <Modal visible={visible} animationType="fade">
      <View>
        <Text>🤖 Inteligência Artificial</Text>
        <Text>A NathIA usa IA para responder suas perguntas.</Text>

        <Text>O que é enviado:</Text>
        <Text>• Suas mensagens</Text>
        <Text>• Contexto da conversa</Text>

        <Text>O que NÃO é enviado:</Text>
        <Text>• Dados pessoais identificáveis</Text>
        <Text>• Informações de saúde fora do chat</Text>

        <Text>Seus dados são protegidos e criptografados.</Text>

        <Pressable onPress={() => navigation.navigate('Legal')}>
          <Text>Ver Política de Privacidade</Text>
        </Pressable>

        <Pressable onPress={onAccept}>
          <Text>Aceitar e Continuar</Text>
        </Pressable>

        <Pressable onPress={onDecline}>
          <Text>Recusar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
```

#### 3.1.2 Integrar no AssistantScreen
**Arquivo**: `src/screens/AssistantScreen.tsx`

```typescript
const hasAcceptedAITerms = useChatStore(s => s.hasAcceptedAITerms);
const acceptAITerms = useChatStore(s => s.acceptAITerms);
const [showConsent, setShowConsent] = useState(!hasAcceptedAITerms);

// No handleSend:
if (!hasAcceptedAITerms) {
  setShowConsent(true);
  return;
}

// Renderizar modal:
<AIConsentModal
  visible={showConsent}
  onAccept={() => {
    acceptAITerms();
    setShowConsent(false);
  }}
  onDecline={() => {
    navigation.goBack();
  }}
/>
```

---

### 3.2 Legal & Privacidade (1h)

#### 3.2.1 Completar LegalScreen
**Arquivo**: `src/screens/LegalScreen.tsx` (já existe)

**Verificar**:
- [ ] Links para Privacy Policy (funcional)
- [ ] Links para Terms of Service (funcional)
- [ ] AI Disclaimer claramente visível
- [ ] Contato/Support visível

**Adicionar**:
```typescript
<Pressable onPress={() => Linking.openURL('mailto:suporte@nossamaternidade.com')}>
  <Text>Contato: suporte@nossamaternidade.com</Text>
</Pressable>
```

---

### 3.3 Delete Account (1h)

#### 3.3.1 Criar DeleteAccountScreen
**Arquivo**: `src/screens/DeleteAccountScreen.tsx`

```typescript
export function DeleteAccountScreen() {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const user = useAppStore(s => s.user);
  const clearUser = useAppStore(s => s.clearUser);

  const handleDelete = async () => {
    setDeleting(true);

    // Chamar Edge Function ou API para deletar account
    const {error} = await supabase.functions.invoke('delete-account', {
      body: {userId: user?.id},
    });

    setDeleting(false);

    if (!error) {
      clearUser();
      // Navegar para tela de login
    }
  };

  return (
    <View>
      {!confirming ? (
        <>
          <Text>⚠️ Deletar Conta</Text>
          <Text>Isso irá remover permanentemente:</Text>
          <Text>• Seus dados pessoais</Text>
          <Text>• Histórico de conversas</Text>
          <Text>• Posts e comentários</Text>
          <Text>• Hábitos e progresso</Text>

          <Pressable onPress={() => setConfirming(true)}>
            <Text>Continuar</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text>Tem certeza?</Text>
          <Text>Esta ação não pode ser desfeita.</Text>

          <Pressable onPress={handleDelete} disabled={deleting}>
            <Text>{deleting ? 'Deletando...' : 'Sim, deletar minha conta'}</Text>
          </Pressable>

          <Pressable onPress={() => setConfirming(false)}>
            <Text>Cancelar</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
```

#### 3.3.2 Adicionar Link no ProfileScreen/SettingsScreen
```typescript
<Pressable onPress={() => navigation.navigate('DeleteAccount')}>
  <Text>Deletar Conta</Text>
</Pressable>
```

#### 3.3.3 Criar Edge Function de Delete
**Arquivo**: `supabase/functions/delete-account/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(...);

  // Verificar JWT
  const authHeader = req.headers.get('Authorization');
  const {data: {user}} = await supabase.auth.getUser(authHeader?.split(' ')[1]);

  if (!user) {
    return new Response(JSON.stringify({error: 'Unauthorized'}), {status: 401});
  }

  try {
    // Deletar dados do usuário (RLS garante que só deleta próprios dados)
    await supabase.from('users').delete().eq('id', user.id);
    await supabase.from('posts').delete().eq('user_id', user.id);
    await supabase.from('comments').delete().eq('user_id', user.id);
    // ... outros dados

    // Deletar auth user
    await supabase.auth.admin.deleteUser(user.id);

    return new Response(JSON.stringify({success: true}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({error: error.message}), {status: 500});
  }
});
```

Deploy:
```bash
supabase functions deploy delete-account
```

---

### 3.4 Data Safety/Privacy Manifest (30 min)

#### 3.4.1 Verificar app.json
**Arquivo**: `app.json`

**iOS Privacy Manifest** (já deve existir):
```json
{
  "expo": {
    "ios": {
      "privacyManifests": {
        "NSPrivacyAccessedAPITypes": [
          {
            "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
            "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
          }
        ],
        "NSPrivacyCollectedDataTypes": [
          {
            "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeHealthData",
            "NSPrivacyCollectedDataTypeLinked": false,
            "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAppFunctionality"]
          }
        ]
      }
    }
  }
}
```

**Android**: Verificar `android/app/src/main/AndroidManifest.xml` (permissões desnecessárias)

---

### 3.5 Checklist Etapa 3 ✅

- [ ] AIConsentModal criado e integrado
- [ ] Consentimento obrigatório antes do primeiro chat
- [ ] Links legais funcionais (Privacy, Terms, AI Disclaimer)
- [ ] DeleteAccountScreen criado
- [ ] Delete account visível em Settings
- [ ] Edge Function delete-account deployada e testada
- [ ] Privacy Manifest iOS correto
- [ ] Android permissions mínimas
- [ ] diagnose:production passa sem falhas críticas

---

## 🧪 ETAPA 4: TESTES (2-3h)

### 4.1 Testes Unitários - billingService (1h)

**Arquivo**: `src/services/billing/__tests__/billingService.test.ts`

```typescript
import { billingService } from '../billingService';
import Purchases from 'react-native-purchases';

jest.mock('react-native-purchases');

describe('billingService', () => {
  describe('initialize', () => {
    it('should configure RevenueCat with correct API key', async () => {
      const {data, error} = await billingService.initialize();
      expect(Purchases.configure).toHaveBeenCalled();
      expect(data).toBe(true);
      expect(error).toBe(null);
    });

    it('should login user if userId provided', async () => {
      await billingService.initialize('user123');
      expect(Purchases.logIn).toHaveBeenCalledWith('user123');
    });
  });

  describe('getCustomerInfo', () => {
    it('should return customer info', async () => {
      const mockInfo = {entitlements: {active: {}}};
      (Purchases.getCustomerInfo as jest.Mock).mockResolvedValue(mockInfo);

      const {data, error} = await billingService.getCustomerInfo();
      expect(data).toEqual(mockInfo);
      expect(error).toBe(null);
    });
  });

  // Mais testes...
});
```

---

### 4.2 Testes Unitários - usePremium (30 min)

**Arquivo**: `src/hooks/__tests__/usePremium.test.ts`

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { usePremium } from '../usePremium';
import { billingService } from '../../services/billing/billingService';

jest.mock('../../services/billing/billingService');

describe('usePremium', () => {
  it('should return isPremium=true when user has active entitlement', async () => {
    (billingService.getCustomerInfo as jest.Mock).mockResolvedValue({
      data: {entitlements: {active: {premium: {}}}},
      error: null,
    });

    const {result} = renderHook(() => usePremium());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isPremium).toBe(true);
  });

  it('should return isPremium=false when no active entitlement', async () => {
    (billingService.getCustomerInfo as jest.Mock).mockResolvedValue({
      data: {entitlements: {active: {}}},
      error: null,
    });

    const {result} = renderHook(() => usePremium());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isPremium).toBe(false);
  });
});
```

---

### 4.3 Testes de Componente - PremiumGate (30 min)

**Arquivo**: `src/components/__tests__/PremiumGate.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PremiumGate } from '../PremiumGate';
import { usePremium } from '../../hooks/usePremium';

jest.mock('../../hooks/usePremium');

describe('PremiumGate', () => {
  it('should render children when isPremium=true', () => {
    (usePremium as jest.Mock).mockReturnValue({isPremium: true, isLoading: false});

    render(
      <PremiumGate feature="test">
        <Text>Premium Content</Text>
      </PremiumGate>
    );

    expect(screen.getByText('Premium Content')).toBeTruthy();
  });

  it('should render preview + CTA when isPremium=false', () => {
    (usePremium as jest.Mock).mockReturnValue({isPremium: false, isLoading: false});

    render(
      <PremiumGate feature="test" previewContent={<Text>Preview</Text>}>
        <Text>Premium Content</Text>
      </PremiumGate>
    );

    expect(screen.getByText('Preview')).toBeTruthy();
    expect(screen.getByText(/Assinar Premium/)).toBeTruthy();
    expect(screen.queryByText('Premium Content')).toBeFalsy();
  });
});
```

---

### 4.4 Snapshot Tests (opcional, 30 min)

**HomeScreen, PaywallScreen, etc**

```typescript
import renderer from 'react-test-renderer';

it('matches snapshot', () => {
  const tree = renderer.create(<HomeScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

---

### 4.5 Checklist Etapa 4 ✅

- [ ] Jest configurado
- [ ] billingService testado (3+ testes)
- [ ] usePremium testado (2+ testes)
- [ ] PremiumGate testado (2+ testes)
- [ ] `bun run test` passa 100%
- [ ] Coverage > 50% em arquivos críticos (billing, premium)

---

## ✅ ETAPA 5: VALIDAÇÃO FINAL & PR (1h)

### 5.1 Rodar Validações Completas

```bash
# Limpar e rebuildar
rm -rf node_modules
bun install

# Validações
bun run typecheck  # 0 erros
bun run lint       # 0 erros, <10 warnings
bun run test       # 100% passing
bun run validate   # tudo verde
bun run diagnose:production  # sem falhas críticas

# Build de teste
bun run check-build-ready
eas build --platform android --profile preview
```

---

### 5.2 Testar Manualmente o Paywall

**Fluxo crítico**:
1. Abrir app → HomeScreen
2. Clicar em feature premium → Paywall abre
3. Selecionar Monthly → Preço exibido corretamente
4. Selecionar Annual → "Economize X%" visível
5. Clicar "Começar agora" → Compra inicia (sandbox)
6. Compra bem-sucedida → Paywall fecha, isPremium=true
7. Feature premium agora acessível
8. Settings → "Gerenciar assinatura" → Abre store
9. Settings → "Restaurar compras" → isPremium restaurado

**Testar Restore**:
1. Desinstalar app
2. Reinstalar
3. Login
4. Settings → "Restaurar compras"
5. isPremium=true

---

### 5.3 Commits Semânticos

```bash
git add .
git commit -m "feat(premium): integra RevenueCat + PaywallScreen estilo Flo"

git add .
git commit -m "refactor(ui): remove ComingSoon, conecta telas existentes"

git add .
git commit -m "feat(compliance): adiciona AIConsentModal + DeleteAccount"

git add .
git commit -m "test(billing): adiciona testes unitários para billingService"

git add .
git commit -m "fix(lint): corrige display name + limpa imports não usados"
```

---

### 5.4 Atualizar ULTRATHINK_PLAN.md

Marcar TODOS os checkboxes como `[x]`.

---

### 5.5 Criar Resumo Final

**Arquivo**: `docs/ULTRATHINK_SUMMARY.md`

```markdown
# 🎉 ULTRATHINK SUMMARY - Store-Ready + Premium

**Data conclusão**: 2025-12-14
**Branch**: feature/store-ready-premium-polish
**Status**: ✅ Completo e pronto para merge

## O QUE FOI FEITO

### 1. Polish UX/UI ✅
- 0 telas "Em breve" (todas conectadas ou removidas)
- 0 botões sem ação
- ScreenLayout, EmptyState, LoadingSkeleton criados
- Aplicados em 5+ telas
- Dark mode validado

### 2. Premium/IAP ✅
- RevenueCat integrado
- billingService completo
- usePremium hook funcional
- PaywallScreen estilo Flo
- PremiumGate aplicado em NathIA + MundoNath
- Restore purchases funciona
- Analytics de Premium

### 3. Compliance ✅
- AIConsentModal obrigatório
- DeleteAccountScreen + Edge Function
- Links legais funcionais
- Privacy Manifest correto

### 4. Testes ✅
- Jest configurado
- billingService testado
- usePremium testado
- PremiumGate testado
- Coverage > 50% em billing

## ONDE MEXEU

**Arquivos criados** (~15):
- src/services/billing/billingService.ts
- src/hooks/usePremium.ts
- src/components/layout/ScreenLayout.tsx
- src/components/ui/EmptyState.tsx
- src/components/ui/LoadingSkeleton.tsx
- src/components/ui/ErrorState.tsx
- src/components/modals/AIConsentModal.tsx
- src/screens/DeleteAccountScreen.tsx
- src/screens/SettingsScreen.tsx
- src/services/analytics/premiumAnalytics.ts
- supabase/functions/delete-account/index.ts
- jest.config.js
- jest.setup.js
- tests/...

**Arquivos modificados** (~20):
- src/screens/AssistantScreen.tsx (AIConsent + Premium limit)
- src/screens/PaywallScreen.tsx (completado)
- src/screens/MyCareScreen.tsx (conectou telas existentes)
- src/screens/CommunityScreen.tsx (removeu "Em breve")
- src/screens/NewPostScreen.tsx (upload de imagem)
- src/screens/ProfileScreen.tsx (Settings link)
- src/screens/HomeScreen.tsx (ajustes navegação)
- src/components/PremiumGate.tsx (melhorado)
- src/navigation/RootNavigator.tsx (novas rotas)
- src/state/premium-store.ts (atualizado)
- src/types/navigation.ts (novas rotas)
- package.json (scripts de teste)
- app.json (verificado)

## COMO TESTAR MANUALMENTE

### Fluxo Premium:
1. App → Feature premium → Paywall abre
2. Selecionar plano → "Começar agora"
3. Compra (sandbox) → Paywall fecha
4. Feature desbloqueada
5. Settings → "Restaurar compras" funciona

### Fluxo Compliance:
1. Primeiro uso NathIA → AIConsent obrigatório
2. Settings → Legal → Links funcionais
3. Settings → Deletar conta → Confirmação + Delete

### Fluxo UX:
1. Navegar todas as telas → 0 "Em breve"
2. Dark mode → Tudo legível
3. Loading states → Skeletons aparecem
4. Empty states → Mensagens empáticas

## RISCOS RESTANTES

### Baixo Risco:
- RevenueCat sandbox pode ter latência
- Primeira compra pode precisar retry
- Delete account é irreversível (aviso claro implementado)

### Médio Risco (para v2):
- Grupos da comunidade não implementados (removido por enquanto)
- Voz da NathIA não implementada (botão escondido)
- Upload de imagem simples (melhorar com compressão)

### Alto Risco (mitigado):
- ✅ Billing errors tratados user-friendly
- ✅ Fallback se RevenueCat offline (app continua útil)
- ✅ RLS garante segurança de dados

## NEXT STEPS

1. Merge para main
2. Deploy staging (EAS build preview)
3. Testar em dispositivos reais
4. Configurar produtos no RevenueCat Dashboard
5. Configurar produtos nas stores (App Store Connect + Play Console)
6. Build production
7. Submit para review

**Tempo estimado**: 1-2 dias após merge
```

---

### 5.6 Criar PR

```bash
git push origin feature/store-ready-premium-polish
```

**Título do PR**:
```
feat: Store-ready + Premium (RevenueCat) + Compliance
```

**Descrição**:
```markdown
## 🎯 Objetivo
Tornar o app "Nossa Maternidade" store-ready com padrão de credibilidade e sistema Premium estilo Flo.

## ✅ O que foi feito

### 1. Polish UX/UI
- ✅ Removido TODAS as navegações "ComingSoon" (23 ocorrências)
- ✅ Conectado telas existentes (BreathingExercise, RestSounds)
- ✅ Criado componentes padrão (ScreenLayout, EmptyState, LoadingSkeleton)
- ✅ Aplicado polish em 5+ telas principais
- ✅ Dark mode validado
- ✅ Acessibilidade básica ok (44pt, labels)

### 2. Premium/IAP
- ✅ RevenueCat integrado (react-native-purchases)
- ✅ billingService completo ({data, error} pattern)
- ✅ usePremium hook funcional (cache 10 min)
- ✅ PaywallScreen estilo Flo (benefícios, planos, CTAs)
- ✅ PremiumGate aplicado (NathIA limits, MundoNath)
- ✅ Restore purchases funciona
- ✅ Manage subscriptions (deep link stores)
- ✅ Analytics de Premium

### 3. Compliance
- ✅ AIConsentModal obrigatório antes do primeiro chat
- ✅ DeleteAccountScreen + Edge Function
- ✅ Links legais funcionais
- ✅ Privacy Manifest verificado

### 4. Testes
- ✅ Jest configurado
- ✅ billingService testado (100% coverage)
- ✅ usePremium testado
- ✅ PremiumGate testado
- ✅ bun run test passa 100%

### 5. Quality
- ✅ Lint: 0 erros (antes: 1 erro + 68 warnings, agora: <10 warnings)
- ✅ TypeCheck: 0 erros
- ✅ Build-ready: tudo verde

## 📊 Métricas

- **Arquivos criados**: 15
- **Arquivos modificados**: 20
- **Linhas adicionadas**: ~3000
- **Linhas removidas**: ~500
- **Test coverage**: 60% em billing/premium

## 🧪 Como testar

Ver [ULTRATHINK_SUMMARY.md](./docs/ULTRATHINK_SUMMARY.md)

## 📋 Checklist

- [x] Baseline executado e documentado
- [x] Polish UX/UI completo
- [x] Premium/IAP funcional
- [x] Compliance implementado
- [x] Testes adicionados
- [x] Validações finais passando
- [x] Documentação atualizada

## 🚀 Next Steps

1. Review + merge
2. Deploy staging
3. Testar em dispositivos reais
4. Configurar produtos RevenueCat
5. Build production
```

---

## 📋 MASTER CHECKLIST COMPLETO

### ETAPA 0: Setup (30 min)
- [ ] Corrigir lint error (AssistantScreen display name)
- [ ] Limpar imports não usados (lint --fix)
- [ ] Criar scripts faltantes (test, validate, diagnose)
- [ ] Configurar Jest + Testing Library

### ETAPA 1: Polish UX/UI (4-6h)
- [ ] Conectar BreathingExercise e RestSounds em MyCareScreen
- [ ] Resolver outras navegações ComingSoon (redirecionar ou implementar)
- [ ] Esconder botões "Em breve" do AssistantScreen
- [ ] Remover/adaptar CommunityScreen (grupos)
- [ ] Implementar upload de imagem no NewPostScreen
- [ ] Criar SettingsScreen básica
- [ ] Criar ScreenLayout component
- [ ] Criar EmptyState component
- [ ] Criar LoadingSkeleton components
- [ ] Criar ErrorState component
- [ ] Aplicar polish em HomeScreen
- [ ] Aplicar polish em AssistantScreen
- [ ] Aplicar polish em CommunityScreen
- [ ] Aplicar polish em MyCareScreen
- [ ] Aplicar polish em ProfileScreen
- [ ] Validar dark mode (5 telas)
- [ ] Verificar touch targets 44pt
- [ ] Adicionar accessibilityLabel em CTAs

### ETAPA 2: Premium/IAP (6-8h)
- [ ] Instalar react-native-purchases
- [ ] Configurar iOS (Podfile)
- [ ] Configurar Android (build.gradle)
- [ ] Criar conta RevenueCat
- [ ] Configurar produtos (Monthly, Annual)
- [ ] Obter API keys (iOS, Android)
- [ ] Configurar EAS secrets
- [ ] Criar billingService completo
- [ ] Criar usePremium hook
- [ ] Completar PaywallScreen
- [ ] Melhorar PremiumGate component
- [ ] Aplicar gating em NathIA (limites)
- [ ] Aplicar gating em MundoNath (conteúdos)
- [ ] Criar premiumAnalytics
- [ ] Integrar analytics no Paywall
- [ ] Testar purchase flow (sandbox)
- [ ] Testar restore purchases
- [ ] Testar manage subscriptions

### ETAPA 3: Compliance (3-4h)
- [ ] Criar AIConsentModal
- [ ] Integrar AIConsent no AssistantScreen
- [ ] Completar LegalScreen (links funcionais)
- [ ] Criar DeleteAccountScreen
- [ ] Criar Edge Function delete-account
- [ ] Deploy Edge Function
- [ ] Adicionar link Delete no Settings
- [ ] Verificar Privacy Manifest iOS
- [ ] Verificar permissões Android
- [ ] Testar fluxo delete account

### ETAPA 4: Testes (2-3h)
- [ ] Configurar Jest + Testing Library
- [ ] Escrever testes billingService (3+)
- [ ] Escrever testes usePremium (2+)
- [ ] Escrever testes PremiumGate (2+)
- [ ] Rodar bun run test (100% passing)
- [ ] Verificar coverage > 50% billing

### ETAPA 5: Validação & PR (1h)
- [ ] Rodar bun run typecheck (0 erros)
- [ ] Rodar bun run lint (0 erros, <10 warnings)
- [ ] Rodar bun run test (100% passing)
- [ ] Rodar bun run validate (tudo verde)
- [ ] Rodar bun run diagnose:production (sem falhas)
- [ ] Testar manualmente Paywall (fluxo completo)
- [ ] Testar manualmente Compliance (AIConsent, Delete)
- [ ] Testar manualmente UX (0 ComingSoon)
- [ ] Commits semânticos
- [ ] Atualizar ULTRATHINK_PLAN.md (marcar todos checkboxes)
- [ ] Criar ULTRATHINK_SUMMARY.md
- [ ] Push branch
- [ ] Criar PR

---

## 📅 TIMELINE ESTIMADO

- **Dia 1 (8h)**:
  - Setup (30min)
  - Polish UX/UI (4-6h)
  - Premium início (2h)

- **Dia 2 (8h)**:
  - Premium conclusão (4-6h)
  - Compliance (3-4h)

- **Dia 3 (4h)**:
  - Testes (2-3h)
  - Validação & PR (1h)

**Total**: 2.5 dias intensivos

---

## 🎯 DECISÕES ASSUMIDAS

1. **RevenueCat** para IAP (não Stripe para conteúdo digital)
2. **design-system.ts** como fonte única de verdade (colors.ts deprecado)
3. **Remover** botões "Em breve" temporariamente (implementar em v2)
4. **Redirecionar** MyCareScreen para telas existentes (inteligente)
5. **Upload simples** de imagem (expo-image-picker, sem compressão avançada por enquanto)
6. **SettingsScreen básica** (toggle notificações, tema, logout, delete)
7. **Grupos** removidos temporariamente (CommunityScreen sem "Criar grupo")
8. **Voice NathIA** movido para v2 (botão escondido)
9. **Limites free**: 20 mensagens/dia na NathIA
10. **Cache premium**: 10 minutos no usePremium

---

**Status atual**: ✅ Plano completo criado - Pronto para execução

**Próximo passo**: Começar Etapa 0 (Setup)
