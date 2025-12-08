# 🔥 Guia de Produção BRUTAL - Nossa Maternidade 2025

> Análise honesta e sem rodeios do estado do projeto

---

## 1. Contexto Rápido

| Item | Valor |
|------|-------|
| **Projeto** | App maternal NathIA |
| **Stack** | Expo 54, React Native, TypeScript |
| **Backend** | Supabase (auth, storage, RLS) |
| **IA** | Multi-provider (Gemini → GPT-4o → Claude) |
| **Design** | NativeWind + Flo Design System (Azul & Rosa) |

---

## 2. O que está EXCELENTE

| Área | Status | Detalhe |
|------|--------|---------|
| **TypeScript** | ✅ 0 erros | strict mode ativo |
| **Lint** | ✅ 0 warnings | ESLint configurado |
| **Zero @ts-ignore** | ✅ | Código limpo |
| **Design System** | ✅ | Tokens bem estruturados |
| **Logger centralizado** | ✅ | `src/utils/logger.ts` |
| **Arquitetura IA** | ✅ | Multi-provider + circuit breaker |
| **Detecção de crise** | ✅ | Ideação suicida, depressão |
| **RLS Supabase** | ✅ | Todas as tabelas protegidas |
| **EAS configurado** | ✅ | iOS e Android prontos |

---

## 3. Diagnóstico BRUTAL - O que precisa corrigir

### 🔴 CRÍTICO

#### 3.1 Roteador de IA parado
- `chatService` ignora `aiRouter`
- Finge streaming com `setTimeout`
- Sem fallback real e sem métricas de custo
- Guardrails de crise não acionam os modelos corretos

**Solução:**
```typescript
// Integrar chatService.sendMessageWithAI ao aiRouter.route
// Gemini 2.5 Flash padrão, GPT-4o crise, Claude fallback
```

#### 3.2 CI complacente
- `lint`, `type-check` e `test` usam `continue-on-error`
- Build quebrado chega ao PR
- `jest.config.js` impede execução de testes

**Solução:**
- Remover `continue-on-error` do `ci.yml`
- Ajustar `jest.config.js` para `testMatch: ['**/__tests__/**/*.test.[jt]s?(x)']`

#### 3.3 Testes falhando
- 7 suites de teste falhando
- **NÃO LANCE COM TESTES QUEBRADOS**

### 🟡 MÉDIO

#### 3.4 Cores Hardcoded (602 ocorrências)
- Muitos arquivos usam hex hardcoded (`#FFFFFF`, `#E91E63`)
- Dificulta dark mode consistente

**Arquivos principais:**
- `src/components/features/home/*`
- `src/screens/HomeScreen.tsx`
- `src/navigation/index.tsx`

#### 3.5 Console.log em produção (15 arquivos)
- Usar `logger.info/debug/error` ao invés de `console.log`

#### 3.6 Home/Chat monolíticos
- ~1k linhas cada
- `useEffect` chamando services direto
- Zero React Query
- Regras de negócio e UI misturadas

### 🟢 BAIXO

#### 3.7 Assets externos
- Imagens críticas no Imgur
- Migrar para Supabase Storage

#### 3.8 Timezone
- Data de sono/check-in em UTC
- Ajustar para timezone da usuária

---

## 4. Plano de Ataque (4 semanas)

### Semana 0-1: Estabilizar
| Task | Prioridade |
|------|-----------|
| Corrigir CI + Jest | 🔴 |
| Ligar `aiRouter` | 🔴 |
| Revisar guardrails de crise | 🔴 |
| Corrigir testes falhando | 🔴 |

### Semana 1-2: Refatorar
| Task | Prioridade |
|------|-----------|
| Refatorar Home/Chat em hooks React Query | 🟡 |
| Migrar assets críticos | 🟡 |
| Ajustar timezone | 🟡 |
| Migrar cores hardcoded | 🟡 |

### Semana 2-3: Preparar
| Task | Prioridade |
|------|-----------|
| Sincronizar Wellness com Supabase | 🟡 |
| Completar testes faltantes | 🟡 |
| Gerar builds EAS preview | 🟡 |

### Semana 3-4: Lançar
| Task | Prioridade |
|------|-----------|
| Beta fechado (50-100 mães) | 🟢 |
| Screenshots finais | 🟢 |
| Submissão App Store / Play Store | 🟢 |

---

## 5. Modelos de IA e Custos (Dez/2025)

| Caso | Modelo | Custo | % Uso |
|------|--------|-------|-------|
| Chat normal | Gemini 2.5 Flash | $0.10/1M tokens | 90% |
| Crise emocional | GPT-4o | $5/1M tokens | 5% |
| Análise profunda | Claude 3.5 Sonnet | $3/1M tokens | 5% |

**Estimativa 100k usuárias/mês:** US$350-600

---

## 6. ALERTA ESPECIAL - Escala Nathália

Com **24 milhões de seguidores**, um bug no dia do lançamento pode:

| Risco | Impacto |
|-------|---------|
| Bug viral | Meme negativo |
| Crash em massa | Reviews 1 estrela |
| IA errada em crise | Processo judicial |

### Recomendação:
```
Soft launch com 500-1000 pessoas ANTES do anúncio oficial da Nathália
```

---

## 7. Comandos Úteis

```bash
# Verificar erros TypeScript
npm run type-check

# Lint
npm run lint

# Testes
npm run test

# Build preview
eas build --profile preview --platform all

# Validar produção
npm run validate:production
```

---

## 8. Métricas de Qualidade

### Atual
| Métrica | Valor |
|---------|-------|
| TypeScript Strict | ✅ Ativo |
| Cores Hardcoded | ⚠️ 602 |
| Console.log | ⚠️ 15 arquivos |
| Zero @ts-ignore | ✅ Sim |
| Testes | ⚠️ 7 falhando |
| Componentes >300 linhas | ⚠️ HomeScreen |

### Meta
| Métrica | Valor |
|---------|-------|
| Cores Hardcoded | < 50 |
| Console.log | 0 |
| Testes | 60%+ cobertura |
| Componentes | Todos < 300 linhas |

---

*Relatório criado em 08/12/2025*
*Baseado em: GPT-5.1 CODEX HIGH + Gemini PRO Analysis*
