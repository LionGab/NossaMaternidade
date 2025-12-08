# 🔴 ERROS E PROBLEMAS ENCONTRADOS

**Data:** 08/12/2025  
**Status:** Análise Completa do Repositório

---

## 🚨 BLOQUEADORES CRÍTICOS (Impedem Execução)

### 1. ❌ Dependências Não Instaladas

**Erro:**
```
❌ node_modules NÃO existe - precisa npm install
❌ tsc: not found (TypeScript não disponível)
❌ dotenv: Cannot find module (script de validação quebra)
```

**Solução:**
```bash
npm install
```

**Impacto:** Nada funciona sem isso.

---

### 2. ❌ Arquivo .env Não Existe

**Erro:**
```
❌ .env NÃO existe
```

**Solução:**
```bash
# Copiar template
cp .env.example .env

# Editar .env e adicionar:
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_GEMINI_API_KEY=AIza...
EXPO_PUBLIC_OPENAI_API_KEY=sk-... (opcional)
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-... (opcional)
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx (opcional)
```

**Impacto:** App não consegue conectar ao backend/IA.

---

### 3. ❌ Configuração EAS Incompleta

**Erro encontrado em `eas.json`:**
```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",  // ❌ PLACEHOLDER
        "appleTeamId": "YOUR_APPLE_TEAM_ID"          // ❌ PLACEHOLDER
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json"  // ❌ Arquivo não existe
      }
    }
  }
}
```

**Solução:**
1. **iOS:**
   - Criar conta Apple Developer ($99/ano)
   - Criar app no App Store Connect
   - Obter `ascAppId` e `appleTeamId`
   - Substituir placeholders no `eas.json`

2. **Android:**
   - Criar conta Google Play Developer ($25)
   - Criar Service Account no Google Cloud
   - Baixar JSON key → `google-play-service-account.json`
   - **NUNCA commitar este arquivo!** (adicionar ao .gitignore)

**Impacto:** Não consegue submeter para as lojas.

---

## 🟡 PROBLEMAS IMPORTANTES (Afetam Qualidade)

### 4. ⚠️ Console.log em 15 Arquivos

**Encontrado:**
- 98 ocorrências de `console.log/error/warn` em 15 arquivos
- Arquivos principais:
  - `src/components/atoms/ChatBubble.tsx` (1)
  - `src/agents/examples/AdvancedToolUseExamples.ts` (2)
  - `src/agents/health/checks/QualityChecks.ts` (1)
  - `src/polyfills.ts` (3)
  - Scripts MCP (aceitável, mas pode melhorar)

**Solução:**
```typescript
// ❌ ANTES
console.log('User logged in', userId);

// ✅ DEPOIS
import { logger } from '@/utils/logger';
logger.info('User logged in', { userId });
```

**Impacto:** Logs não estruturados, sem integração Sentry.

---

### 5. ⚠️ Screenshots Faltando

**Erro:**
```
❌ ios-screenshots/ não existe
❌ android-screenshots/ não existe
```

**Solução:**
```bash
# Criar pastas
mkdir -p ios-screenshots/6.5-inch
mkdir -p android-screenshots/phone

# Capturar screenshots:
# - iPhone 14 Pro Max: 1284 × 2778 px
# - Android Phone: 1080 × 1920 px
# Mínimo 3 screenshots por plataforma
```

**Impacto:** Não consegue publicar nas lojas (obrigatório).

---

### 6. ⚠️ Guardrails de IA Não Implementados

**Problema:** Não encontrado arquivo de guardrails:
- `src/ai/guardrails/maternalGuardrails.ts` - **NÃO EXISTE**

**O que falta:**
- Detecção de crise emocional
- Disclaimer médico automático
- Rate limiting de mensagens IA
- Moderação de conteúdo comunidade

**Impacto:** Risco de respostas inadequadas da IA, possível rejeição nas lojas.

---

### 7. ⚠️ TypeScript Errors (Não Verificado)

**Problema:** Não foi possível verificar erros TypeScript porque `tsc` não está disponível.

**Solução:**
```bash
npm install  # Instalar dependências primeiro
npm run type-check  # Depois verificar erros
```

**Impacto:** Pode haver erros de tipo que causam bugs em runtime.

---

## 🟢 MELHORIAS RECOMENDADAS (Não Bloqueadores)

### 8. 📊 Cores Hardcoded (602 ocorrências)

**Status:** Funciona, mas dificulta manutenção.

**Solução:**
```bash
# Usar script de migração (quando estiver pronto)
node scripts/migrate-hardcoded-colors.js --all
```

**Impacto:** Dificulta dark mode consistente, manutenção.

---

### 9. 📝 Documentos Legais (URLs Públicas)

**Status:** Arquivos existem localmente (`docs/PRIVACY_POLICY.md`), mas precisam estar públicos.

**O que falta:**
- Privacy Policy em URL pública (ex: `https://nossamaternidade.com.br/privacy`)
- Terms of Service em URL pública (ex: `https://nossamaternidade.com.br/terms`)

**Impacto:** Lojas podem rejeitar sem URLs públicas.

---

## 📋 RESUMO DE ERROS

| Categoria | Quantidade | Status |
|-----------|-----------|--------|
| **🔴 Bloqueadores Críticos** | 3 | ❌ Precisam correção imediata |
| **🟡 Problemas Importantes** | 4 | ⚠️ Afetam qualidade |
| **🟢 Melhorias** | 2 | 💡 Recomendado |

---

## 🚀 AÇÕES IMEDIATAS (Ordem de Prioridade)

### HOJE (Crítico):

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Criar arquivo .env:**
   ```bash
   cp .env.example .env
   # Editar e adicionar credenciais
   ```

3. **Verificar erros TypeScript:**
   ```bash
   npm run type-check
   # Corrigir erros encontrados
   ```

### ESTA SEMANA (Importante):

4. **Configurar EAS:**
   - Criar contas Apple/Google Developer
   - Configurar credenciais no `eas.json`

5. **Implementar guardrails IA:**
   - Criar `src/ai/guardrails/maternalGuardrails.ts`
   - Implementar detecção de crise
   - Adicionar disclaimer médico

6. **Substituir console.log:**
   - Priorizar arquivos de produção
   - Usar logger centralizado

### PRÓXIMA SEMANA (Antes de Publicar):

7. **Criar screenshots:**
   - Capturar em simuladores
   - Organizar por tamanho/dispositivo

8. **Publicar documentos legais:**
   - Hospedar Privacy Policy e Terms
   - Adicionar URLs no app.config.js

---

## ✅ CHECKLIST RÁPIDO

Execute este checklist para verificar o que está faltando:

```bash
# 1. Dependências instaladas?
test -d node_modules && echo "✅" || echo "❌ npm install"

# 2. .env existe?
test -f .env && echo "✅" || echo "❌ Criar .env"

# 3. TypeScript funciona?
npm run type-check 2>&1 | grep -q "error TS" && echo "❌ Erros encontrados" || echo "✅"

# 4. Screenshots existem?
test -d ios-screenshots && echo "✅" || echo "❌ Criar screenshots iOS"
test -d android-screenshots && echo "✅" || echo "❌ Criar screenshots Android"

# 5. Guardrails implementados?
test -f src/ai/guardrails/maternalGuardrails.ts && echo "✅" || echo "❌ Implementar guardrails"
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Execute:** `npm install`
2. **Crie:** `.env` com credenciais
3. **Verifique:** `npm run type-check`
4. **Leia:** `docs/GUIA_PRODUCAO_BRUTAL_2025.md` para guia completo
5. **Siga:** Checklist semana a semana no guia

---

**Última atualização:** 08/12/2025
