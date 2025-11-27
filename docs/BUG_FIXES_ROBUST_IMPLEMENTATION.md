# 🛠️ Plano de Correção de Bugs - Implementação Robusta

**Data:** 2025-01-27  
**Objetivo:** Tornar o app robusto, eliminando todos os bugs visuais e funcionais

---

## 🔴 Bugs Críticos Identificados

### 1. Shadow Props Deprecated no Web
**Erro:** `"shadow*" style props are deprecated. Use "boxShadow"`  
**Impacto:** Warnings no console, possível quebra visual  
**Arquivos Afetados:** 14 arquivos

### 2. useNativeDriver Não Suportado no Web
**Erro:** `useNativeDriver is not supported because the native animated module is missing`  
**Impacto:** Animações podem não funcionar corretamente no web  
**Arquivos Afetados:** 10 arquivos

### 3. Renderização de Componentes com Estilos Inválidos
**Problema:** Componentes renderizando `[Object]` em vez de conteúdo  
**Exemplo:** `<View style="[Object]" children="[Object]">Começar!</View>`  
**Impacto:** UI quebrada, experiência ruim

### 4. Acesso a Propriedades Undefined
**Erro:** `Cannot read properties of undefined (reading 'orange')`  
**Status:** ✅ Já corrigido com fallback seguro

### 5. Múltiplas Instâncias GoTrueClient
**Aviso:** Múltiplas instâncias do Supabase Auth  
**Impacto:** Possível comportamento indefinido

---

## 🎯 Soluções Robustas

### 1. Sistema de Shadows Universal

**Problema:** `Shadows` tokens já têm lógica para web, mas alguns componentes usam shadow props diretamente.

**Solução:** Criar helper universal que sempre retorna o formato correto.

```typescript
// src/utils/shadowHelper.ts
import { Platform, ViewStyle } from 'react-native';

export function getShadowStyle(
  offset: { width: number; height: number },
  opacity: number,
  radius: number,
  elevation: number,
  color?: string
): ViewStyle {
  if (Platform.OS === 'web') {
    const { width: x, height: y } = offset;
    const shadowColor = color || `rgba(0, 0, 0, ${opacity})`;
    return {
      boxShadow: `${x}px ${y}px ${radius}px 0px ${shadowColor}`,
    };
  }

  return {
    shadowColor: color || '#000',
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}
```

**Aplicar em:** Todos os componentes que usam shadows diretamente.

---

### 2. Sistema de Animações Cross-Platform

**Problema:** `useNativeDriver` não funciona no web.

**Solução:** Detectar plataforma e ajustar automaticamente.

```typescript
// src/utils/animationHelper.ts
import { Platform } from 'react-native';

export function getAnimationConfig(useNativeDriver?: boolean) {
  // No web, sempre false
  if (Platform.OS === 'web') {
    return { useNativeDriver: false };
  }
  
  // No mobile, usar o valor fornecido ou true por padrão
  return { useNativeDriver: useNativeDriver ?? true };
}
```

**Aplicar em:** Todos os componentes com Animated.

---

### 3. Componente de Renderização Segura

**Problema:** Componentes renderizando `[Object]` quando há erros de estilo.

**Solução:** Criar wrapper que valida e sanitiza props antes de renderizar.

```typescript
// src/components/primitives/SafeView.tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { logger } from '@/utils/logger';

export function SafeView({ style, children, ...props }: ViewProps) {
  // Validar e sanitizar style
  const safeStyle = React.useMemo(() => {
    try {
      if (!style) return undefined;
      
      // Se for array, flatten e validar
      if (Array.isArray(style)) {
        const flattened = StyleSheet.flatten(style);
        return flattened;
      }
      
      return style;
    } catch (error) {
      logger.warn('[SafeView] Erro ao processar style', error);
      return undefined;
    }
  }, [style]);

  // Validar children
  const safeChildren = React.useMemo(() => {
    if (children === null || children === undefined) {
      return null;
    }
    
    // Se children é um objeto inválido, retornar null
    if (typeof children === 'object' && !React.isValidElement(children)) {
      logger.warn('[SafeView] Children inválido detectado');
      return null;
    }
    
    return children;
  }, [children]);

  return (
    <View style={safeStyle} {...props}>
      {safeChildren}
    </View>
  );
}
```

---

### 4. Error Boundary Melhorado

**Melhorias:**
- Fallback visual mais robusto
- Recuperação automática quando possível
- Logging estruturado
- Integração com analytics

```typescript
// Melhorias no ErrorBoundary existente:
// 1. Adicionar retry automático para erros não-críticos
// 2. Fallback por tipo de erro
// 3. Estado de loading durante recuperação
```

---

### 5. Validação de Props em Tempo de Execução

**Solução:** Criar validadores para props críticas.

```typescript
// src/utils/propValidators.ts
export function validateColor(color: unknown): string {
  if (typeof color === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return color;
  }
  
  logger.warn('[validateColor] Cor inválida, usando fallback', { color });
  return '#000000'; // Fallback seguro
}

export function validateSpacing(spacing: unknown): number {
  if (typeof spacing === 'number' && spacing >= 0) {
    return spacing;
  }
  
  logger.warn('[validateSpacing] Spacing inválido, usando fallback', { spacing });
  return 0;
}
```

---

## 📋 Checklist de Implementação

### Fase 1: Correções Críticas Imediatas

- [ ] **Criar `shadowHelper.ts`** - Helper universal para shadows
- [ ] **Criar `animationHelper.ts`** - Helper para animações cross-platform
- [ ] **Atualizar `tokens.ts`** - Garantir que Shadows sempre retorna formato correto
- [ ] **Corrigir todos os usos diretos de shadow props** - Substituir por helper
- [ ] **Corrigir todos os `useNativeDriver`** - Usar helper que detecta plataforma

### Fase 2: Componentes Robustos

- [ ] **Criar `SafeView.tsx`** - Wrapper seguro para View
- [ ] **Criar `SafeText.tsx`** - Wrapper seguro para Text
- [ ] **Atualizar `HapticButton.tsx`** - Adicionar validações e fallbacks
- [ ] **Atualizar `MaternalCard.tsx`** - Já tem fallback, adicionar mais validações
- [ ] **Atualizar `Box.tsx`** - Validar props antes de renderizar

### Fase 3: Error Handling

- [ ] **Melhorar `ErrorBoundary.tsx`** - Adicionar retry automático
- [ ] **Criar error boundaries por tela** - Capturar erros mais granularmente
- [ ] **Adicionar fallbacks visuais** - Placeholders quando dados não carregam
- [ ] **Melhorar logging** - Estruturar logs para debug

### Fase 4: Validação e Testes

- [ ] **Criar testes para helpers** - Validar comportamento cross-platform
- [ ] **Testar em web** - Verificar que não há warnings
- [ ] **Testar em mobile** - Verificar que animações funcionam
- [ ] **Testar error scenarios** - Simular erros e verificar fallbacks

---

## 🚀 Implementação Imediata

Vou começar implementando as correções mais críticas:

1. **Shadow Helper Universal**
2. **Animation Helper Cross-Platform**
3. **SafeView Component**
4. **Correções nos componentes principais**

