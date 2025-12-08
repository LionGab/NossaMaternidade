# 🔥 GUIA BRUTAL: Deixar App Pronto para Produção - Dezembro 2025

**Data:** 08/12/2025  
**App:** Nossa Maternidade / NathIA  
**Framework:** React Native + Expo SDK 54  
**Target:** Google Play Store + App Store  

---

## ⚠️ VERDADE BRUTAL: Expo Go NÃO É PARA PRODUÇÃO

### ❌ O QUE VOCÊ NÃO PODE FAZER COM EXPO GO:

1. **Publicar nas lojas** - Expo Go é APENAS para desenvolvimento
2. **Usar plugins nativos customizados** - Muitos plugins não funcionam
3. **Otimizações de performance** - Sem controle sobre bundle nativo
4. **Sentry completo** - Funcionalidade limitada
5. **Nova arquitetura React Native** - Não disponível no Expo Go

### ✅ O QUE VOCÊ DEVE USAR:

**EAS Build (Expo Application Services)** - ÚNICA forma de publicar nas lojas.

---

## 🎯 DECISÃO CRÍTICA: Expo Go vs Development Build vs Production Build

### 1. Expo Go (Desenvolvimento Rápido)

**Quando usar:**
- ✅ Desenvolvimento inicial
- ✅ Testes rápidos de UI
- ✅ Prototipagem
- ✅ Testes com equipe interna

**Limitações:**
- ❌ NÃO pode publicar nas lojas
- ❌ Plugins nativos limitados
- ❌ Performance não otimizada
- ❌ Sem controle sobre bundle

**Como usar:**
```bash
npm start
# Escanear QR code com Expo Go app
```

---

### 2. Development Build (Testes Avançados)

**Quando usar:**
- ✅ Testes com plugins nativos (Sentry, etc)
- ✅ Testes de performance
- ✅ Testes com usuários beta
- ✅ Validação antes de produção

**Como criar:**
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Criar development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

**Instalar no dispositivo:**
- **iOS:** TestFlight ou link direto do EAS
- **Android:** APK baixado do EAS

---

### 3. Production Build (PUBLICAÇÃO NAS LOJAS)

**Quando usar:**
- ✅ **PUBLICAÇÃO FINAL** nas lojas
- ✅ App pronto para usuários finais
- ✅ Máxima performance e otimização

**Como criar:**
```bash
# Build de produção
eas build --profile production --platform ios
eas build --profile production --platform android
```

**Depois de build:**
```bash
# Submeter para lojas
eas submit --platform ios
eas submit --platform android
```

---

## 📋 CHECKLIST BRUTAL: O QUE VOCÊ PRECISA ANTES DE PUBLICAR

### 🔴 CRÍTICO - BLOQUEADORES ABSOLUTOS

#### 1. Contas de Desenvolvedor

**iOS (App Store):**
- [ ] **Apple Developer Account** ($99/ano)
  - Criar em: https://developer.apple.com
  - **TEMPO:** 24-48h para aprovação
- [ ] **App Store Connect** configurado
  - Criar app ID
  - Obter Team ID
  - Configurar certificados (EAS faz automaticamente)

**Android (Google Play):**
- [ ] **Google Play Developer Account** ($25 único)
  - Criar em: https://play.google.com/console
  - **TEMPO:** Aprovação imediata
- [ ] **Service Account** criado
  - Google Cloud Console → Service Accounts
  - Baixar JSON key → `google-play-service-account.json`
  - **NUNCA commitar no Git!**

**Ação Imediata:**
```bash
# Se ainda não tem, criar AGORA:
# 1. Apple Developer: https://developer.apple.com/programs/
# 2. Google Play: https://play.google.com/console/signup
```

---

#### 2. Documentos Legais (OBRIGATÓRIO)

**Status Atual:** ❌ **FALTANDO** - BLOQUEADOR CRÍTICO

**O que você PRECISA:**

**A. Política de Privacidade**
- [ ] URL pública: `https://nossamaternidade.com.br/privacy`
- [ ] Conteúdo mínimo:
  - Dados coletados (nome, email, fotos, mensagens IA, dados de saúde)
  - Como usa os dados
  - Compartilhamento (Supabase, Gemini, OpenAI, Claude)
  - Direitos LGPD (acesso, correção, exclusão)
  - Contato DPO: `privacy@nossamaternidade.com.br`
  - Base legal (consentimento, execução de contrato)

**B. Termos de Uso**
- [ ] URL pública: `https://nossamaternidade.com.br/terms`
- [ ] Conteúdo mínimo:
  - Descrição do serviço
  - Idade mínima (18+)
  - Regras de uso (comunidade moderada)
  - Limitação de responsabilidade (IA não é médico)
  - Propriedade intelectual
  - Lei aplicável (Brasil)

**C. Disclaimer Médico (DENTRO DO APP)**
- [ ] Tela de disclaimer obrigatória no primeiro uso
- [ ] Mensagem clara:
  ```
  ⚠️ IMPORTANTE: Este app fornece suporte emocional e informações 
  educacionais, mas NÃO substitui consulta médica profissional.
  
  Em caso de emergência médica, procure imediatamente um 
  profissional de saúde ou ligue 192 (SAMU).
  ```

**Solução Rápida:**
1. **Contratar advogado** (recomendado) - R$ 2.000-5.000
2. **Usar gerador online** (temporário):
   - https://www.privacypolicies.com/
   - https://termly.io/
3. **Template LGPD** (básico):
   - https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd

**Prazo:** 2-3 dias úteis (com advogado) ou 1 dia (template)

---

#### 3. Configuração de Backend (Supabase)

**Status Atual:** ⚠️ **VERIFICAR** - Provavelmente não configurado

**O que fazer:**

**A. Criar Projeto Supabase**
```bash
# 1. Criar conta: https://supabase.com
# 2. Criar novo projeto
# 3. Obter credenciais:
#    - Project URL: https://xxxxx.supabase.co
#    - Anon Key: eyJhbGc...
```

**B. Aplicar Schema do Banco**
```bash
# Executar migrations
cd supabase
supabase db push

# OU manualmente no Supabase Dashboard:
# SQL Editor → Colar conteúdo de supabase/migrations/*.sql
```

**C. Configurar RLS (Row Level Security)**
```sql
-- CRÍTICO: Sem RLS, usuários podem ver dados de outros!
-- Aplicar policies em TODAS as tabelas

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Repetir para: chat_messages, habits, community_posts, etc.
```

**D. Criar Storage Buckets**
```sql
-- No Supabase Dashboard → Storage
-- Criar buckets:
-- 1. avatars (público)
-- 2. posts (público)
-- 3. content (público)
-- 4. private-uploads (privado)
```

**E. Configurar Variáveis de Ambiente**
```bash
# Criar arquivo .env (NUNCA commitar!)
cat > .env << EOF
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://xxxxx.supabase.co/functions/v1

# Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=AIza...

# OpenAI (fallback)
EXPO_PUBLIC_OPENAI_API_KEY=sk-...

# Claude (fallback)
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...

# Sentry (opcional mas recomendado)
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# OneSignal (push notifications - opcional)
EXPO_PUBLIC_ONESIGNAL_APP_ID=xxxxx
EOF

# Adicionar ao .gitignore
echo ".env" >> .gitignore
```

**Prazo:** 1-2 dias (se já tem conta Supabase)

---

#### 4. Configuração de IA (Guardrails Críticos)

**Status Atual:** ⚠️ **VERIFICAR** - Guardrails podem estar faltando

**O que você PRECISA implementar:**

**A. Sistema de Guardrails para IA Maternidade**

```typescript
// src/ai/guardrails/maternalGuardrails.ts

export const MATERNAL_GUARDRAILS = {
  // Palavras-chave de crise
  crisisKeywords: [
    'suicídio', 'suicidar', 'me matar', 'acabar com tudo',
    'não aguento mais', 'querer morrer', 'sem esperança'
  ],
  
  // Palavras-chave médicas que requerem disclaimer
  medicalKeywords: [
    'diagnóstico', 'tratamento', 'medicamento', 'receita',
    'sintoma grave', 'emergência', 'hospital'
  ],
  
  // Respostas automáticas para crise
  crisisResponse: `
    ⚠️ Entendo que você está passando por um momento difícil.
    
    Este app oferece suporte emocional, mas não substitui 
    ajuda profissional.
    
    Se você está em crise, procure ajuda imediata:
    - CVV (Centro de Valorização da Vida): 188
    - SAMU: 192
    - Emergência: 190
    
    Você não está sozinha. 💙
  `,
  
  // Disclaimer médico automático
  medicalDisclaimer: `
    ⚠️ IMPORTANTE: Esta resposta é apenas informativa e não 
    constitui diagnóstico ou tratamento médico.
    
    Sempre consulte um profissional de saúde qualificado 
    para questões médicas.
  `,
};
```

**B. Moderação de Conteúdo (Comunidade)**

```typescript
// src/services/communityModerationService.ts

export const moderateContent = async (text: string) => {
  // 1. Filtro básico de palavras ofensivas
  const offensiveWords = ['palavra1', 'palavra2', ...];
  const hasOffensive = offensiveWords.some(word => 
    text.toLowerCase().includes(word)
  );
  
  if (hasOffensive) {
    return { approved: false, reason: 'Conteúdo ofensivo' };
  }
  
  // 2. Google Cloud Vision API (imagens)
  // Detectar nudez, violência, etc.
  
  // 3. OpenAI Moderation API (texto)
  const moderation = await openai.moderations.create({ input: text });
  if (moderation.results[0].flagged) {
    return { approved: false, reason: 'Conteúdo viola políticas' };
  }
  
  return { approved: true };
};
```

**C. Rate Limiting (Proteger APIs)**

```typescript
// Supabase Edge Function: supabase/functions/moderate-content/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { text, userId } = await req.json();
  
  // Rate limiting: máximo 10 posts por hora
  const { data: recentPosts } = await supabase
    .from('community_posts')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 3600000).toISOString());
  
  if (recentPosts && recentPosts.length >= 10) {
    return new Response(
      JSON.stringify({ error: 'Limite de posts excedido' }),
      { status: 429 }
    );
  }
  
  // Moderação...
});
```

**Prazo:** 2-3 dias (implementação completa)

---

#### 5. Assets para as Lojas (Screenshots, Ícones)

**Status Atual:** ⚠️ **VERIFICAR** - Provavelmente faltando screenshots

**O que você PRECISA:**

**A. App Icon**
- [ ] iOS: 1024x1024px (PNG, sem transparência)
- [ ] Android: 512x512px (PNG, sem transparência)
- [ ] Adaptive Icon Android: 1024x1024px (foreground + background)

**B. Splash Screen**
- [ ] iOS: 1242x2688px (iPhone 14 Pro Max)
- [ ] Android: 1080x1920px (ou maior)

**C. Screenshots iOS (App Store)**
- [ ] iPhone 6.5" (iPhone 14 Pro Max): 1284 × 2778 px
  - Mínimo 3 screenshots
  - Máximo 10 screenshots
- [ ] iPhone 5.5" (iPhone 8 Plus): 1242 × 2208 px (opcional)
- [ ] iPad Pro 12.9": 2048 × 2732 px (se suporta tablet)

**D. Screenshots Android (Google Play)**
- [ ] Phone: 1080 × 1920 px (ou 1080 × 2340 px)
  - Mínimo 2 screenshots
  - Máximo 8 screenshots
- [ ] 7" Tablet: 1200 × 1920 px (opcional)
- [ ] 10" Tablet: 1600 × 2560 px (opcional)

**E. Feature Graphic (Google Play)**
- [ ] 1024 × 500 px (PNG ou JPG)
- [ ] Banner principal na listagem

**Como gerar screenshots:**
```bash
# 1. Rodar app em simulador/emulador
npm start

# 2. iOS Simulator
# - Cmd+S para capturar screenshot
# - Salvar em: ios-screenshots/6.5-inch/

# 3. Android Emulator
# - Ctrl+S ou usar Android Studio
# - Salvar em: android-screenshots/phone/

# 4. Editar (opcional - adicionar texto explicativo)
# - Usar Figma, Canva, ou Photoshop
```

**Prazo:** 1-2 dias (captura + edição)

---

### 🟡 IMPORTANTE - Afeta Qualidade/Rejeição

#### 6. Testes em Dispositivos Reais

**O que testar:**

**iOS:**
- [ ] iPhone 14 Pro Max (mais recente)
- [ ] iPhone SE (menor tela)
- [ ] iPad (se suporta tablet)
- [ ] iOS 15+ (mínimo suportado)

**Android:**
- [ ] Pixel 7 (Android 13+)
- [ ] Samsung Galaxy (mais comum no Brasil)
- [ ] Android 8.0+ (mínimo suportado)

**Checklist de Testes:**
- [ ] Login/Registro funciona
- [ ] Chat IA responde corretamente
- [ ] Comunidade: criar post, comentar, curtir
- [ ] Upload de imagens funciona
- [ ] Notificações funcionam (se implementado)
- [ ] Dark mode funciona
- [ ] Navegação fluida (sem lag)
- [ ] Sem crashes
- [ ] Performance aceitável (< 3s inicialização)

**Prazo:** 2-3 dias (testes completos)

---

#### 7. Error Tracking (Sentry)

**Status Atual:** ⚠️ **PARCIAL** - Configurado mas pode não estar funcionando em produção

**O que fazer:**

**A. Configurar Sentry**
```bash
# 1. Criar conta: https://sentry.io
# 2. Criar projeto React Native
# 3. Obter DSN
# 4. Adicionar ao .env:
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**B. Verificar Integração**
```typescript
// src/services/sentry.ts
// Verificar se está inicializando corretamente

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  // ...
});
```

**C. Testar em Produção**
```typescript
// Forçar erro para testar
Sentry.captureException(new Error('Test error'));
```

**Prazo:** 1 dia (configuração + testes)

---

#### 8. Analytics (Opcional mas Recomendado)

**Ferramentas Recomendadas:**
- **Firebase Analytics** (grátis, Google)
- **Mixpanel** (eventos customizados)
- **Amplitude** (funil de conversão)

**Eventos Importantes:**
```typescript
// Trackear:
- app_opened
- onboarding_completed
- chat_message_sent
- post_created
- habit_completed
- content_viewed
- crisis_detected (guardrail ativado)
```

**Prazo:** 1-2 dias (configuração + implementação)

---

## 🚀 PASSO A PASSO: Deixar Pronto para Produção

### FASE 1: Preparação (Semana 1)

**Dia 1-2: Documentos Legais**
```bash
# 1. Contratar advogado OU usar template
# 2. Criar Privacy Policy
# 3. Criar Terms of Service
# 4. Publicar em website (ou GitHub Pages)
# 5. Adicionar disclaimer médico no app
```

**Dia 3-4: Backend (Supabase)**
```bash
# 1. Criar projeto Supabase
# 2. Aplicar schema SQL
# 3. Configurar RLS policies
# 4. Criar storage buckets
# 5. Testar conexão
```

**Dia 5: IA e Guardrails**
```bash
# 1. Implementar guardrails de crise
# 2. Implementar moderação de conteúdo
# 3. Configurar rate limiting
# 4. Testar respostas da IA
```

---

### FASE 2: Build e Testes (Semana 2)

**Dia 1-2: Configurar EAS**
```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Inicializar projeto
eas init

# 4. Configurar credenciais
eas credentials

# 5. Atualizar eas.json com IDs corretos
```

**Dia 3-4: Criar Builds**
```bash
# 1. Development build (testes)
eas build --profile development --platform ios
eas build --profile development --platform android

# 2. Testar em dispositivos reais
# 3. Corrigir bugs encontrados
# 4. Repetir até estável
```

**Dia 5: Production Build**
```bash
# 1. Build de produção
eas build --profile production --platform ios
eas build --profile production --platform android

# 2. Testar builds finais
# 3. Validar que tudo funciona
```

---

### FASE 3: Assets e Metadata (Semana 3)

**Dia 1-2: Screenshots**
```bash
# 1. Capturar screenshots em simuladores
# 2. Editar (adicionar texto se necessário)
# 3. Organizar por tamanho/dispositivo
```

**Dia 3: Metadata das Lojas**
```bash
# App Store Connect:
# - Nome: "Nossa Maternidade"
# - Subtítulo: "Apoio emocional para mães"
# - Descrição: [escrever descrição completa]
# - Keywords: maternidade, saúde, comunidade, IA
# - Categoria: Saúde e Fitness
# - Idade: 17+ (conteúdo sensível)

# Google Play Console:
# - Nome: "Nossa Maternidade"
# - Descrição curta: "Apoio emocional para mães"
# - Descrição completa: [escrever]
# - Categoria: Saúde e Fitness
# - Classificação: PEGI 3 / Everyone
```

**Dia 4-5: Preencher Lojas**
```bash
# 1. App Store Connect
# - Upload screenshots
# - Preencher metadata
# - Configurar preços (grátis)
# - Adicionar Privacy Policy URL
# - Adicionar Terms of Service URL

# 2. Google Play Console
# - Upload screenshots
# - Preencher metadata
# - Preencher questionário de classificação
# - Adicionar Privacy Policy URL
# - Configurar Data Safety
```

---

### FASE 4: Submissão (Semana 4)

**Dia 1: Submeter para Lojas**
```bash
# 1. iOS
eas submit --platform ios

# 2. Android
eas submit --platform android
```

**Dia 2-7: Aguardar Revisão**
- **iOS:** 24-48h (geralmente)
- **Android:** 1-7 dias (geralmente)

**Possíveis Rejeições e Como Resolver:**

**iOS:**
- ❌ "Privacy Policy não encontrada"
  - ✅ Verificar URL está acessível
  - ✅ Adicionar link no App Store Connect
- ❌ "App requer permissões não justificadas"
  - ✅ Revisar descrições de permissões no Info.plist
  - ✅ Justificar cada permissão
- ❌ "Conteúdo médico sem disclaimer"
  - ✅ Adicionar disclaimer médico no app
  - ✅ Mostrar no primeiro uso

**Android:**
- ❌ "Data Safety incompleto"
  - ✅ Preencher Data Safety no Play Console
  - ✅ Declarar todos os dados coletados
- ❌ "Política de privacidade ausente"
  - ✅ Adicionar URL no Play Console
- ❌ "Conteúdo sensível sem classificação"
  - ✅ Preencher questionário de classificação

---

## 📊 MODELOS E TECNOLOGIAS RECOMENDADAS (Dezembro 2025)

### Stack Atual (Verificar Compatibilidade)

**Framework:**
- ✅ React Native 0.81.5
- ✅ Expo SDK 54.0.25
- ✅ TypeScript 5.9.2

**Status:** ✅ **ATUALIZADO** - Compatível com lojas

---

### IA - Modelos Recomendados

**Para Chat NathIA (Maternidade):**

**1. Claude 3.5 Sonnet (Anthropic)** ⭐ **RECOMENDADO**
- **Por quê:** Melhor para conversas empáticas, guardrails nativos
- **Custo:** $3/million input, $15/million output
- **Limites:** 200k tokens contexto
- **Guardrails:** ✅ Nativo (menos conteúdo perigoso)

**2. GPT-4o (OpenAI)** ⭐ **FALLBACK**
- **Por quê:** Boa qualidade, guardrails OK
- **Custo:** $2.50/million input, $10/million output
- **Limites:** 128k tokens contexto
- **Guardrails:** ✅ Nativo (moderation API)

**3. Gemini 2.5 Flash (Google)** ⭐ **ECONÔMICO**
- **Por quê:** Mais barato, boa qualidade
- **Custo:** $0.075/million input, $0.30/million output
- **Limites:** 1M tokens contexto
- **Guardrails:** ⚠️ Menos robusto (precisa implementar)

**Arquitetura Recomendada:**
```typescript
// src/ai/llmRouter.ts

export const routeToLLM = async (message: string, context: Context) => {
  // 1. Detectar crise
  if (detectCrisis(message)) {
    return crisisResponse(); // Resposta automática
  }
  
  // 2. Roteamento inteligente
  try {
    // Primary: Claude (melhor para empatia)
    return await claudeAPI.chat(message, {
      system: NATHIA_SYSTEM_PROMPT,
      temperature: 0.7,
      max_tokens: 500,
    });
  } catch (error) {
    // Fallback 1: GPT-4o
    try {
      return await openaiAPI.chat(message);
    } catch (error2) {
      // Fallback 2: Gemini
      return await geminiAPI.chat(message);
    }
  }
};
```

**Sistema de Prompt (NathIA):**
```typescript
// src/ai/prompts/nathia.system.md

Você é NathIA, a assistente virtual inspirada na Nathália Valente.

PERSONALIDADE:
- Tom direto, sincero, com humor
- Usa bordões: "Tá gritando", "Amiga sincerona", "Valente Approved"
- Empática mas sem rodeios
- Referências à maternidade, estilo, autoestima

REGRAS CRÍTICAS:
1. NUNCA dê diagnóstico médico
2. NUNCA prescreva medicamentos
3. SEMPRE adicione disclaimer médico se mencionar saúde
4. Em caso de crise emocional, direcione para ajuda profissional
5. Mantenha tom positivo mas realista

EXEMPLOS DE RESPOSTAS:
- "Tá gritando! Você merecia mais, amiga."
- "Valente Approved! Esse look ficou incrível."
- "Amiga sincerona, isso é normal na maternidade, mas se persistir, 
   consulte um médico, ok?"
```

---

### Backend - Supabase (Recomendado)

**Por quê Supabase:**
- ✅ PostgreSQL (robusto)
- ✅ Auth integrado
- ✅ Storage para imagens
- ✅ Realtime para comunidade
- ✅ Edge Functions (Deno) para IA
- ✅ RLS nativo (segurança)
- ✅ Grátis até 500MB DB

**Configuração Mínima:**
```sql
-- Tabelas essenciais
- profiles (usuários)
- chat_conversations (conversas IA)
- chat_messages (mensagens)
- community_posts (posts comunidade)
- comments (comentários)
- habits (hábitos)
- content (conteúdo educativo)
```

---

### Monitoramento - Sentry (Recomendado)

**Por quê Sentry:**
- ✅ Error tracking em tempo real
- ✅ Performance monitoring
- ✅ Release tracking
- ✅ User context
- ✅ Grátis até 5k eventos/mês

**Configuração:**
```typescript
// src/services/sentry.ts
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 0.1, // 10% das transações
  enableAutoSessionTracking: true,
});
```

---

## 🎯 MELHORES PRÁTICAS EFICAZES

### 1. Performance

**O que fazer:**
- ✅ Usar `FlashList` em vez de `FlatList` (já instalado)
- ✅ Lazy loading de imagens (`expo-image`)
- ✅ Memoização de componentes pesados (`React.memo`)
- ✅ Code splitting (lazy imports)
- ✅ Otimizar bundle size (remover dependências não usadas)

**O que NÃO fazer:**
- ❌ Renderizar listas grandes sem virtualização
- ❌ Carregar todas as imagens de uma vez
- ❌ Fazer requests desnecessários
- ❌ Usar `console.log` em produção

---

### 2. Segurança

**O que fazer:**
- ✅ RLS em TODAS as tabelas Supabase
- ✅ Validar inputs no cliente E servidor
- ✅ Sanitizar dados antes de renderizar
- ✅ Usar HTTPS sempre
- ✅ Armazenar secrets em variáveis de ambiente
- ✅ Rate limiting em APIs

**O que NÃO fazer:**
- ❌ Expor API keys no código
- ❌ Confiar apenas em validação cliente
- ❌ Permitir SQL injection
- ❌ Armazenar senhas em plain text

---

### 3. UX/UI

**O que fazer:**
- ✅ Feedback háptico em interações
- ✅ Loading states em todas as operações async
- ✅ Error states com mensagens claras
- ✅ Empty states informativos
- ✅ Animações suaves (não exagerar)
- ✅ Acessibilidade (labels, contraste)

**O que NÃO fazer:**
- ❌ Deixar usuário sem feedback (loading infinito)
- ❌ Erros genéricos ("Algo deu errado")
- ❌ Animações que causam lag
- ❌ Touch targets < 44pt

---

### 4. IA e Guardrails

**O que fazer:**
- ✅ Detectar crise emocional automaticamente
- ✅ Adicionar disclaimer médico sempre que relevante
- ✅ Rate limiting (máx 20 mensagens/hora)
- ✅ Moderação de conteúdo (comunidade)
- ✅ Logs de todas as interações IA
- ✅ Fallback entre providers

**O que NÃO fazer:**
- ❌ Confiar apenas em guardrails do modelo
- ❌ Permitir spam de mensagens IA
- ❌ Ignorar sinais de crise
- ❌ Dar diagnóstico médico

---

## 📅 CRONOGRAMA REALISTA

### Opção 1: Rápido (2-3 semanas) ⚡

**Semana 1:**
- Dia 1-2: Documentos legais (template)
- Dia 3-4: Backend Supabase
- Dia 5: Guardrails IA

**Semana 2:**
- Dia 1-2: EAS Build + Testes
- Dia 3: Screenshots
- Dia 4-5: Metadata lojas

**Semana 3:**
- Dia 1: Submeter
- Dia 2-7: Aguardar aprovação

**Total:** 15-21 dias úteis

---

### Opção 2: Completo (4-5 semanas) 🎯

**Semana 1:**
- Documentos legais (advogado)
- Backend completo
- Guardrails robustos

**Semana 2:**
- Development builds
- Testes extensivos
- Correções

**Semana 3:**
- Production builds
- Screenshots profissionais
- Metadata completa

**Semana 4:**
- Submissão
- Ajustes pós-revisão

**Semana 5:**
- Aprovação e lançamento

**Total:** 20-25 dias úteis

---

## 💰 CUSTOS ESTIMADOS

### Custos Únicos:
- Apple Developer: $99/ano
- Google Play: $25 (único)
- **Total:** $124

### Custos Mensais (Estimado):
- Supabase: $0-25 (free tier geralmente suficiente)
- Claude API: $50-200 (depende do uso)
- Sentry: $0-26 (free tier geralmente suficiente)
- **Total:** $50-250/mês

### Custos Opcionais:
- Advogado (documentos): $2.000-5.000 (único)
- Designer (screenshots): $500-1.500 (único)

---

## 🎯 CONCLUSÃO BRUTAL

### ✅ O QUE VOCÊ TEM:
- Código bem estruturado
- Arquitetura sólida
- Design system implementado
- Expo SDK atualizado

### ❌ O QUE FALTA:
1. **Documentos legais** (BLOQUEADOR)
2. **Backend configurado** (BLOQUEADOR)
3. **Guardrails IA** (CRÍTICO)
4. **Screenshots** (BLOQUEADOR)
5. **Contas desenvolvedor** (BLOQUEADOR)

### 🚀 PRÓXIMOS PASSOS IMEDIATOS:

1. **HOJE:** Criar contas Apple/Google Developer
2. **AMANHÃ:** Configurar Supabase + aplicar schema
3. **DIA 3:** Implementar guardrails IA
4. **DIA 4-5:** Criar documentos legais (template ou advogado)
5. **SEMANA 2:** Builds + testes
6. **SEMANA 3:** Screenshots + metadata
7. **SEMANA 4:** Submeter

**Tempo mínimo:** 2-3 semanas  
**Tempo recomendado:** 4-5 semanas

---

## 📚 RECURSOS ÚTEIS

### Documentação:
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [Supabase Docs](https://supabase.com/docs)

### Ferramentas:
- [EAS CLI](https://docs.expo.dev/build/setup/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console/)

### Templates:
- [Privacy Policy Generator](https://www.privacypolicies.com/)
- [Terms of Service Generator](https://www.termly.io/)

---

**Boa sorte! 🚀**

**Última atualização:** 08/12/2025
