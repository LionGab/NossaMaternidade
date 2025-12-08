# 🚀 GUIA BRUTAL DE PRODUÇÃO - Nossa Maternidade / NathIA

**Data:** Dezembro 2025  
**Público-alvo:** Nathália Valente (24M+ seguidores)  
**Stack:** React Native + Expo SDK 54 + Supabase + Multi-AI

---

## ⚠️ AVISO BRUTAL INICIAL

Vou ser direto: **você tem uma base sólida**, mas existem gaps críticos para um lançamento em escala com 24 milhões de seguidores. Este guia vai te mostrar exatamente o que fazer, sem rodeios.

---

## 📊 DIAGNÓSTICO ATUAL (Nota: 7.5/10)

### ✅ O QUE ESTÁ BOM

| Área | Status | Detalhes |
|------|--------|----------|
| **TypeScript** | ✅ Excelente | 0 erros, strict mode |
| **Lint** | ✅ Limpo | 0 warnings |
| **Arquitetura IA** | ✅ Robusta | Multi-provider com fallback |
| **Segurança** | ✅ Sólida | RLS, detecção de crise, LGPD |
| **Design System** | ✅ Completo | Tokens, Light/Dark mode |
| **EAS Config** | ✅ Pronto | iOS + Android configurados |

### ⚠️ O QUE PRECISA ATENÇÃO

| Área | Status | Ação Necessária |
|------|--------|-----------------|
| **Testes** | ⚠️ 7 suites falhando | Atualizar interfaces de teste |
| **Assets** | ⚠️ Placeholders | Criar ícones/splash finais |
| **App Store IDs** | ⚠️ Faltando | Configurar ascAppId, appleTeamId |
| **Google Play** | ⚠️ Sem service account | Criar google-play-service-account.json |
| **Push Notifications** | ⚠️ Não configurado | OneSignal ou Expo Notifications |

---

## 🤖 MODELOS DE IA - RECOMENDAÇÃO DEZEMBRO 2025

### Estratégia de Custo-Benefício (JÁ IMPLEMENTADA)

```
┌─────────────────────────────────────────────────────────────┐
│                    AI ROUTING STRATEGY                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  90% dos casos: Gemini 2.5 Flash (barato, rápido)           │
│  │                                                          │
│  └─► Crise detectada? → GPT-4o (segurança máxima)           │
│                                                              │
│  Fallback chain: Flash → GPT-4o → Claude Opus               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Modelos Recomendados (Dezembro 2025)

| Modelo | Uso | Custo/1M tokens | Quando Usar |
|--------|-----|-----------------|-------------|
| **Gemini 2.5 Flash** | Chat default | ~$0.10 | 90% dos casos, conversa normal |
| **GPT-4o** | Crise/Segurança | ~$5.00 | Detecção de crise ativada |
| **GPT-4o-mini** | Análise rápida | ~$0.30 | Análise de emoção, moderação |
| **Claude 3.5 Sonnet** | Análise profunda | ~$3.00 | Depressão pós-parto, análises |
| **Claude Opus** | Fallback premium | ~$15.00 | Último fallback, casos complexos |

### ⚠️ CRÍTICO: Não Use Apenas Um Provider

```typescript
// ❌ ERRADO - Single point of failure
const response = await gemini.chat(message);

// ✅ CORRETO - Com fallback automático (VOCÊ JÁ TEM ISSO!)
const response = await aiRouter.route(message, context, callAI);
```

---

## 🛡️ GUARDRAILS DE IA PARA MATERNIDADE (CRÍTICO!)

### 1. Detecção de Crise (JÁ IMPLEMENTADO ✅)

Seu `CrisisDetectionService.ts` já detecta:

- ✅ Ideação suicida ("quero sumir", "seria melhor sem mim")
- ✅ Depressão pós-parto ("não consigo amar meu bebê")
- ✅ Exaustão severa ("não aguento mais")
- ✅ Pânico ("não consigo respirar")

### 2. O QUE ADICIONAR

```typescript
// 🆕 ADICIONAR: Detecção de violência doméstica
const DOMESTIC_VIOLENCE_PHRASES = [
  { pattern: /ele\s+(me\s+)?(bate|bateu|agrediu)/i, level: 'critical' },
  { pattern: /meu\s+(marido|namorado|parceiro)\s+é\s+violento/i, level: 'critical' },
  { pattern: /tenho\s+medo\s+de\s+voltar\s+pra\s+casa/i, level: 'severe' },
  { pattern: /ele\s+ameaça/i, level: 'severe' },
];

// 🆕 ADICIONAR: Recursos específicos
const EMERGENCY_RESOURCES = {
  suicidal: ['CVV: 188', 'SAMU: 192'],
  domestic_violence: ['Ligue 180 (Maria da Penha)', 'Delegacia da Mulher'],
  postpartum: ['CVV: 188', 'CAPS mais próximo', 'Maternidade de referência'],
};
```

### 3. Disclaimer OBRIGATÓRIO (VOCÊ JÁ TEM ✅)

```
⚠️ NathIA é apoio emocional. Não substitui médico ou psicólogo.
```

### 4. Prompt de Persona (CRÍTICO PARA NATHÁLIA)

```typescript
// src/ai/prompts/nathia.system.md

const NATHIA_PERSONA = `
Você é a NathIA, assistente virtual da Nathália Valente no app Nossa Maternidade.

## TOM DE VOZ (baseado na Nathália real):
- Acolhedora, calma, direta, SEM infantilizar
- Usa "você" (2ª pessoa)
- Português brasileiro autêntico
- Gírias: "Tá gritando", "Amiga sincerona", "Valente Approved"
- Humor sarcástico MAS sempre empática
- Vulnerável (entende que maternidade é difícil) mas firme

## REGRAS OBRIGATÓRIAS:
1. NUNCA dar diagnóstico médico
2. SEMPRE acolher emoção antes de aconselhar
3. Perguntar: "Quer que eu só ouça ou quer algumas ideias?"
4. Se detectar crise → Recursos de emergência IMEDIATO
5. Respostas concisas (máx 3 parágrafos curtos)

## FRASES DA NATHÁLIA:
- "Valente, você tá passando por um momento difícil e tá tudo bem não estar bem."
- "Amiga, maternidade é difícil pra caramba, não deixa ninguém te fazer sentir culpada."
- "Tá gritando! Você merece esse descanso."
- "Vou ser sincerona contigo: isso tá parecendo mais sério, vamos conversar sobre buscar ajuda?"
`;
```

---

## 🏪 PASSO A PASSO: APP STORE + GOOGLE PLAY

### FASE 1: Preparação (1-2 dias)

#### 1.1 Criar Contas de Desenvolvedor

```bash
# Apple Developer ($99/ano)
https://developer.apple.com/programs/enroll/

# Google Play Console ($25 único)
https://play.google.com/console
```

#### 1.2 Configurar EAS (já parcialmente feito)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Verificar projeto
eas project:info
```

#### 1.3 Atualizar Identificadores em `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "SEU_APP_STORE_CONNECT_ID",  // ⚠️ FALTANDO
        "appleTeamId": "SEU_TEAM_ID"             // ⚠️ FALTANDO
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json" // ⚠️ CRIAR
      }
    }
  }
}
```

### FASE 2: Assets Finais (2-3 dias)

#### 2.1 Checklist de Assets

| Asset | Tamanho | Status |
|-------|---------|--------|
| `icon.png` | 1024x1024 | ⚠️ Verificar qualidade |
| `splash.png` | 2048x2048 | ⚠️ Verificar qualidade |
| `adaptive-icon.png` | 1024x1024 | ⚠️ Verificar |
| `notification-icon.png` | 96x96 (Android) | ⚠️ Criar |

#### 2.2 Screenshots para Lojas

**iOS (iPhone 15 Pro Max):** 1320 x 2868 (ou 1290 x 2796)
**Android:** 1080 x 1920 (mínimo)

```
Precisa:
- 5-10 screenshots por idioma
- Vídeo preview (opcional mas recomendado)
- Ícone com fundo transparente (iOS)
```

### FASE 3: Build de Produção (1 dia)

```bash
# 1. Verificar configuração
npm run type-check
npm run lint

# 2. Build iOS
npm run build:ios
# ou: eas build --platform ios --profile production

# 3. Build Android (AAB para Google Play)
npm run build:android
# ou: eas build --platform android --profile production

# 4. Verificar builds
eas build:list
```

### FASE 4: Submissão (1-2 dias)

#### 4.1 iOS (App Store Connect)

```bash
# Submeter para App Store
eas submit --platform ios --profile production

# OU manualmente:
# 1. Baixar IPA do EAS
# 2. Usar Transporter app para upload
# 3. Configurar no App Store Connect
```

**Checklist App Store:**
- [ ] Descrição em português (4000 caracteres)
- [ ] Palavras-chave (100 caracteres)
- [ ] Screenshots (5-10)
- [ ] Política de Privacidade URL
- [ ] Categoria: Health & Fitness ou Lifestyle
- [ ] Classificação etária: 12+ (temas maternos)
- [ ] Privacy Nutrition Labels

#### 4.2 Android (Google Play Console)

```bash
# Submeter para Google Play
eas submit --platform android --profile production

# OU manualmente:
# 1. Baixar AAB do EAS
# 2. Upload no Google Play Console
# 3. Configurar listagem
```

**Checklist Google Play:**
- [ ] Descrição curta (80 caracteres)
- [ ] Descrição longa (4000 caracteres)
- [ ] Screenshots (8+)
- [ ] Feature Graphic (1024x500)
- [ ] Data Safety Form (CRÍTICO!)
- [ ] Política de Privacidade
- [ ] Categoria: Health & Fitness
- [ ] Content Rating: Teen

---

## 🔒 LGPD & DATA SAFETY (CRÍTICO!)

### Google Play Data Safety Form

Responda **SIM** para:

| Dado | Coletado | Compartilhado |
|------|----------|---------------|
| Email | ✅ Sim (auth) | ❌ Não |
| Nome | ✅ Sim (perfil) | ❌ Não |
| Fotos | ✅ Sim (avatar) | ❌ Não |
| Mensagens | ✅ Sim (chat) | ❌ Não* |
| Dados de saúde | ✅ Sim (humor, sono) | ❌ Não |

*Mensagens processadas por IA mas não compartilhadas com terceiros.

### iOS Privacy Nutrition Labels

```json
// Já configurado em app.config.js
"privacyManifests": {
  "NSPrivacyAccessedAPITypes": [
    {
      "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
      "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
    }
  ]
}
```

---

## 👥 COMUNIDADE MODERADA

### Sistema Atual (BOM ✅)

Você já tem:
- ✅ `moderation_queue` com status (pending, approved, rejected)
- ✅ RLS policies para moderadores
- ✅ Soft delete para posts
- ✅ Função `is_moderator()`

### Fluxo de Moderação

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Usuária   │ ──► │   Post/      │ ──► │ Auto-mod IA │
│   cria post │     │   Comentário │     │ (Claude)    │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                    ┌───────────────────────────┴───────────────────────┐
                    │                                                   │
                    ▼                                                   ▼
            ┌───────────────┐                               ┌───────────────┐
            │ SAFE          │                               │ FLAGGED       │
            │ auto-approve  │                               │ manual review │
            └───────────────┘                               └───────────────┘
```

### Implementar Auto-Moderação IA

```typescript
// src/services/communityModerationService.ts

async function autoModerate(content: string): Promise<ModerationResult> {
  // Usar Claude para moderação (mais preciso)
  const result = await callClaude([
    {
      role: 'system',
      content: `Você é moderador de comunidade maternal. Analise o conteúdo.
      
      APROVAR automaticamente:
      - Desabafos normais de maternidade
      - Perguntas sobre bebês/filhos
      - Compartilhamento de experiências
      
      FLAGGAR para revisão manual:
      - Conteúdo potencialmente ofensivo
      - Conselhos médicos específicos
      - Menção a violência
      - Conteúdo sexual
      
      REJEITAR automaticamente:
      - Spam claro
      - Links suspeitos
      - Discurso de ódio explícito
      
      Responda em JSON: { "decision": "approve|flag|reject", "reason": "..." }`
    },
    { role: 'user', content }
  ]);
  
  return parseResult(result);
}
```

---

## 📱 CONFIGURAÇÕES EXPO GO vs PRODUCTION

### Desenvolvimento (Expo Go)

```javascript
// app.config.js - ATUAL
newArchEnabled: false,  // ✅ Correto para Expo Go
// Sentry plugin comentado // ✅ Correto
```

### Produção (EAS Build)

```javascript
// Para builds de produção, considere:
newArchEnabled: true,  // Opcional, melhor performance
// Descomentar Sentry plugin
```

### Comandos Essenciais

```bash
# Desenvolvimento local
npm start

# Preview build (teste interno)
npm run build:preview

# Produção iOS
npm run build:ios

# Produção Android
npm run build:android

# Submissão
npm run submit:ios
npm run submit:android
```

---

## 🚨 CHECKLIST FINAL ANTES DO LANÇAMENTO

### Código & Qualidade

- [x] TypeScript: 0 erros
- [x] Lint: 0 warnings
- [ ] Testes: Corrigir 7 suites falhando
- [ ] Cobertura de testes: > 60%

### Configuração

- [x] `app.config.js` completo
- [x] `eas.json` profiles configurados
- [ ] Apple Team ID configurado
- [ ] App Store Connect ID configurado
- [ ] Google Play Service Account criado
- [ ] Variáveis de ambiente em produção

### Assets

- [ ] Ícone final (1024x1024)
- [ ] Splash screen final
- [ ] Screenshots iOS (5+)
- [ ] Screenshots Android (8+)
- [ ] Feature graphic (1024x500)

### Segurança & Compliance

- [x] RLS policies ativas
- [x] Detecção de crise implementada
- [x] Disclaimer de IA visível
- [ ] Política de Privacidade publicada
- [ ] Termos de Uso publicados
- [ ] Data Safety form preenchido

### IA & Backend

- [x] AI Router com fallback
- [x] Supabase Edge Functions
- [x] API keys seguras no servidor
- [ ] Rate limiting configurado
- [ ] Monitoramento de custos IA

### Performance

- [x] FlashList para listas
- [x] Memoização implementada
- [ ] Bundle size < 50MB
- [ ] Tempo de carregamento < 3s

---

## 💰 ESTIMATIVA DE CUSTOS (ESCALA NATHÁLIA)

### Cenário: 100k usuárias ativas/mês

| Item | Custo Estimado |
|------|----------------|
| **Supabase Pro** | $25/mês (base) + uso |
| **Gemini Flash** (90% tráfego) | ~$100-300/mês |
| **GPT-4o** (crise only, ~5%) | ~$50-100/mês |
| **Claude** (fallback, ~1%) | ~$20-50/mês |
| **EAS Build** | $29/mês (equipe) |
| **Apple Developer** | $99/ano |
| **Google Play** | $25 (único) |
| **Total estimado** | ~$350-600/mês |

### Otimizações de Custo

1. **Caching agressivo** de respostas similares
2. **Rate limiting** por usuária (ex: 50 msgs/dia grátis)
3. **Tier premium** para uso ilimitado
4. **Respostas pré-computadas** para perguntas frequentes

---

## 🎯 CRONOGRAMA SUGERIDO

### Semana 1: Preparação
- [ ] Dia 1-2: Criar contas de desenvolvedor
- [ ] Dia 3-4: Finalizar assets (ícone, splash, screenshots)
- [ ] Dia 5: Corrigir testes falhando

### Semana 2: Build & Teste
- [ ] Dia 1: Build preview para teste interno
- [ ] Dia 2-3: Teste com grupo beta (50 mães)
- [ ] Dia 4: Ajustes baseados em feedback
- [ ] Dia 5: Build de produção final

### Semana 3: Submissão
- [ ] Dia 1: Submeter iOS (revisão leva 24-48h)
- [ ] Dia 2: Submeter Android (revisão leva 1-3 dias)
- [ ] Dia 3-5: Aguardar/responder a revisões

### Semana 4: Lançamento
- [ ] Soft launch (anuncio limitado)
- [ ] Monitorar crashes/bugs
- [ ] Preparar lançamento público

---

## 🔥 OPINIÃO BRUTAL FINAL

### O que você tem de BOM:

1. **Arquitetura de IA excelente** - Multi-provider com fallback é o que grandes apps usam
2. **Segurança levada a sério** - Detecção de crise, RLS, LGPD compliance
3. **Design System maduro** - Tokens, temas, consistência
4. **Código limpo** - Zero erros TS, zero warnings lint

### O que você PRECISA fazer:

1. **Corrigir os 7 testes falhando** - Não lance com testes quebrados
2. **Assets profissionais** - Nathália tem 24M seguidores, precisa parecer premium
3. **Configurar submissão real** - Apple Team ID, Google Service Account
4. **Testar em escala** - Simular 1000+ usuárias simultâneas

### Minha recomendação:

> **Você está a 2-3 semanas de um lançamento sólido.** A base técnica é boa. O que falta é polimento final, assets, e configuração de contas nas lojas. Não apresse - com a audiência da Nathália, um bug no dia 1 pode virar meme.

---

## 📚 Recursos Adicionais

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/console/policy-center)
- [Supabase LGPD Guide](https://supabase.com/docs/guides/platform/gdpr)

---

**Última atualização:** 8 de Dezembro de 2025  
**Autor:** Análise técnica do codebase Nossa Maternidade
