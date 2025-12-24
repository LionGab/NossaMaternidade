# RevenueCat - Guia de Uso

> ✅ **RevenueCat já está 100% implementado no projeto!**
> Este guia mostra como usar a integração existente.

---

## 📦 Arquivos Principais

| Arquivo | Propósito |
|---------|-----------|
| `src/services/revenuecat.ts` | Serviço principal (271 linhas) |
| `src/state/premium-store.ts` | Zustand store com persistência |
| `src/types/premium.ts` | Tipos TypeScript |
| `App.tsx` (linhas 90-122) | Inicialização automática |

---

## 🚀 Como Usar

### 1. Verificar Status Premium (Recomendado)

Use os **seletores otimizados** do Zustand:

```typescript
import {
  useIsPremium,
  useHasVoiceAccess,
  usePremiumLoading,
  useSubscriptionDetails,
} from '@/state/premium-store';

function MyComponent() {
  const isPremium = useIsPremium();
  const hasVoice = useHasVoiceAccess();
  const isLoading = usePremiumLoading();
  const subscription = useSubscriptionDetails();

  if (isLoading) return <Spinner />;
  if (!isPremium) return <PaywallScreen />;

  return <PremiumContent />;
}
```

### 2. Acessar o Store Completo

Se precisar de múltiplos valores ou ações:

```typescript
import { usePremiumStore } from '@/state/premium-store';

function MyScreen() {
  const {
    isPremium,
    isLoading,
    subscription,
    checkPremiumStatus,
    syncWithRevenueCat,
  } = usePremiumStore();

  // Refresh manual
  const handleRefresh = async () => {
    await syncWithRevenueCat();
  };

  return (
    <View>
      <Text>Status: {isPremium ? 'Premium' : 'Free'}</Text>
      <Text>Plano: {subscription.period || 'N/A'}</Text>
      <Button title="Atualizar" onPress={handleRefresh} />
    </View>
  );
}
```

### 3. Comprar Assinatura

```typescript
import * as RevenueCat from '@/services/revenuecat';
import { usePremiumStore } from '@/state/premium-store';

async function handlePurchase() {
  const syncWithRevenueCat = usePremiumStore.getState().syncWithRevenueCat;

  try {
    // 1. Obter offerings
    const offering = await RevenueCat.getOfferings();
    if (!offering) throw new Error('No offerings available');

    // 2. Selecionar pacote (monthly ou annual)
    const package = offering.monthly; // ou offering.annual

    // 3. Comprar
    const result = await RevenueCat.purchasePackage(package);

    if (result.success) {
      // 4. Sincronizar estado
      await syncWithRevenueCat();
      Alert.alert('Sucesso!', 'Assinatura ativada 🎉');
    } else if (result.error !== 'cancelled') {
      Alert.alert('Erro', result.error || 'Falha na compra');
    }
  } catch (err) {
    console.error('Purchase error:', err);
  }
}
```

### 4. Restaurar Compras

```typescript
import * as RevenueCat from '@/services/revenuecat';
import { usePremiumStore } from '@/state/premium-store';

async function handleRestore() {
  const syncWithRevenueCat = usePremiumStore.getState().syncWithRevenueCat;

  try {
    const result = await RevenueCat.restorePurchases();

    if (result.success) {
      await syncWithRevenueCat();
      Alert.alert('Sucesso!', 'Compras restauradas');
    } else {
      Alert.alert('Aviso', 'Nenhuma compra encontrada');
    }
  } catch (err) {
    console.error('Restore error:', err);
  }
}
```

### 5. Login de Usuário

```typescript
import * as RevenueCat from '@/services/revenuecat';

useEffect(() => {
  if (user?.id) {
    RevenueCat.loginUser(user.id);
  }
}, [user?.id]);
```

---

## 🎨 Exemplo: Tela de Paywall Completa

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import * as RevenueCat from '@/services/revenuecat';
import { usePremiumStore } from '@/state/premium-store';
import { Ionicons } from '@expo/vector-icons';

export function PaywallScreen({ navigation }) {
  const [offering, setOffering] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const syncWithRevenueCat = usePremiumStore((s) => s.syncWithRevenueCat);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const current = await RevenueCat.getOfferings();
      setOffering(current);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os planos');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (pkg) => {
    setIsPurchasing(true);
    try {
      const result = await RevenueCat.purchasePackage(pkg);

      if (result.success) {
        await syncWithRevenueCat();
        Alert.alert('Sucesso!', 'Bem-vindo ao Premium! 🎉', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else if (result.error !== 'cancelled') {
        Alert.alert('Erro', result.error);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const monthlyPkg = offering?.monthly;
  const annualPkg = offering?.annual;

  return (
    <View className="flex-1 bg-neutral-50 p-6">
      {/* Header */}
      <View className="items-center mb-8">
        <Ionicons name="sparkles" size={64} color="#FB7185" />
        <Text className="mt-4 text-3xl font-bold text-neutral-900">
          Acesso Premium
        </Text>
      </View>

      {/* Features */}
      {['Chat ilimitado', 'Sem anúncios', 'Conteúdo exclusivo'].map((feature, i) => (
        <View key={i} className="mb-3 flex-row items-center">
          <Ionicons name="checkmark-circle" size={24} color="#5B8FB9" />
          <Text className="ml-3 text-neutral-900">{feature}</Text>
        </View>
      ))}

      {/* Packages */}
      {annualPkg && (
        <Pressable
          onPress={() => handlePurchase(annualPkg)}
          disabled={isPurchasing}
          className="mt-6 rounded-2xl bg-brand-accent p-4"
        >
          <Text className="text-lg font-bold text-white">
            Anual - {annualPkg.product.priceString}
          </Text>
          <Text className="text-white/80">Economize 20%</Text>
        </Pressable>
      )}

      {monthlyPkg && (
        <Pressable
          onPress={() => handlePurchase(monthlyPkg)}
          disabled={isPurchasing}
          className="mt-4 rounded-2xl border-2 border-neutral-200 bg-white p-4"
        >
          <Text className="text-lg font-bold text-neutral-900">
            Mensal - {monthlyPkg.product.priceString}
          </Text>
        </Pressable>
      )}

      {isPurchasing && (
        <View className="mt-4">
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}
```

---

## 🔧 Funções Disponíveis

### `src/services/revenuecat.ts`

| Função | Retorno | Descrição |
|--------|---------|-----------|
| `initializePurchases(userId?)` | `Promise<void>` | Inicializa SDK (automático no App.tsx) |
| `getOfferings()` | `Promise<Offering \| null>` | Obtém pacotes disponíveis |
| `getPackages()` | `Promise<Package[]>` | Lista todos os pacotes |
| `purchasePackage(pkg)` | `Promise<{success, customerInfo, error}>` | Compra um pacote |
| `restorePurchases()` | `Promise<{success, customerInfo, error}>` | Restaura compras |
| `checkPremiumStatus()` | `Promise<boolean>` | Verifica se usuário é premium |
| `getCustomerInfo()` | `Promise<CustomerInfo \| null>` | Obtém info do cliente |
| `loginUser(userId)` | `Promise<void>` | Login com user ID |
| `logoutUser()` | `Promise<void>` | Logout |
| `formatPrice(priceString)` | `string` | Formata preço |
| `calculateSavingsPercent(monthly, yearly)` | `number` | Calcula % de economia |
| `getTrialInfo(pkg)` | `{hasTrialPeriod, trialDays}` | Info de trial |

### `src/state/premium-store.ts`

| Seletor | Retorno | Descrição |
|---------|---------|-----------|
| `useIsPremium()` | `boolean` | Se usuário é premium |
| `useHasVoiceAccess()` | `boolean` | Se tem acesso a voz |
| `useHasPremiumScreensAccess()` | `boolean` | Se tem acesso a telas premium |
| `usePremiumLoading()` | `boolean` | Se está carregando |
| `useSubscriptionDetails()` | `SubscriptionDetails` | Detalhes da assinatura |

| Ação | Retorno | Descrição |
|------|---------|-----------|
| `checkPremiumStatus()` | `Promise<boolean>` | Verifica status premium |
| `syncWithRevenueCat()` | `Promise<void>` | Sincroniza com RevenueCat |
| `debugTogglePremium()` | `void` | Toggle premium (dev only) |

---

## 🐛 Debug Mode

Em desenvolvimento, você pode alternar premium manualmente:

```typescript
import { usePremiumStore } from '@/state/premium-store';

// No console ou componente de debug
usePremiumStore.getState().debugTogglePremium();
```

---

## 📝 Variáveis de Ambiente

Configure no `.env.local`:

```bash
# RevenueCat API Keys
EXPO_PUBLIC_RC_IOS_KEY=appl_xxxxxxxxxx
EXPO_PUBLIC_RC_ANDROID_KEY=goog_xxxxxxxxxx
```

E no `app.config.js`:

```javascript
extra: {
  revenueCatIosKey: process.env.EXPO_PUBLIC_RC_IOS_KEY,
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
}
```

---

## ⚠️ Importante

1. **Expo Go**: RevenueCat não funciona no Expo Go. Use Dev Client.
2. **Web**: RevenueCat não suporta web (iOS/Android apenas).
3. **Inicialização**: Já acontece automaticamente no `App.tsx`.
4. **Persistência**: Estado premium é persistido no AsyncStorage.

---

## 📚 Recursos

- [RevenueCat Dashboard](https://app.revenuecat.com)
- [Documentação RevenueCat](https://docs.revenuecat.com)
- [SDK React Native](https://github.com/RevenueCat/react-native-purchases)

---

**Última atualização**: 24 de dezembro de 2024
