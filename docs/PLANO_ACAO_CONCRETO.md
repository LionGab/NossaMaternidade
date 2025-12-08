# 🎯 PLANO DE AÇÃO CONCRETO - Nossa Maternidade

**Data Início:** 08/12/2025  
**Objetivo:** App pronto para publicação nas lojas  
**Prazo:** 3-4 semanas  

---

## 📊 VISÃO GERAL

| Fase | Duração | Status | Bloqueadores |
|------|---------|--------|--------------|
| **Fase 1: Setup Básico** | 2-3 dias | ⏳ Pendente | Dependências, .env |
| **Fase 2: Backend & IA** | 3-4 dias | ⏳ Pendente | Supabase, Guardrails |
| **Fase 3: Build & Testes** | 4-5 dias | ⏳ Pendente | EAS, Screenshots |
| **Fase 4: Publicação** | 2-3 dias | ⏳ Pendente | Lojas, Documentos |

**Total:** 11-15 dias úteis (2-3 semanas)

---

## 🚀 FASE 1: SETUP BÁSICO (Dias 1-3)

### ✅ DIA 1: Instalação e Configuração Inicial

#### Tarefa 1.1: Instalar Dependências
```bash
# Comando
npm install

# Tempo estimado: 10-15 minutos
# Verificação:
test -d node_modules && echo "✅ OK" || echo "❌ Erro"
```

**Checkpoint:**
- [ ] `node_modules/` existe
- [ ] Sem erros de instalação

---

#### Tarefa 1.2: Criar Arquivo .env
```bash
# Comando
cp .env.example .env

# Editar .env e adicionar:
cat > .env << 'EOF'
# Supabase (OBRIGATÓRIO)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Gemini AI (OBRIGATÓRIO)
EXPO_PUBLIC_GEMINI_API_KEY=AIza...

# OpenAI (Opcional - Fallback)
EXPO_PUBLIC_OPENAI_API_KEY=sk-...

# Claude (Opcional - Fallback)
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...

# Sentry (Opcional mas recomendado)
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# OneSignal (Opcional)
EXPO_PUBLIC_ONESIGNAL_APP_ID=xxxxx
EOF
```

**Ações necessárias:**
1. Criar conta Supabase: https://supabase.com
2. Criar projeto Supabase
3. Obter URL e Anon Key do dashboard
4. Criar chave Gemini: https://makersuite.google.com/app/apikey

**Tempo estimado:** 30-60 minutos (depende de criar contas)

**Checkpoint:**
- [ ] Arquivo `.env` criado
- [ ] Todas as variáveis obrigatórias preenchidas
- [ ] Supabase URL válida (testar no navegador)

---

#### Tarefa 1.3: Verificar TypeScript
```bash
# Comando
npm run type-check

# Se houver erros, corrigir um por um
# Tempo estimado: 1-2 horas (depende de quantos erros)
```

**Checkpoint:**
- [ ] `npm run type-check` retorna 0 erros
- [ ] Todos os erros TypeScript corrigidos

---

#### Tarefa 1.4: Testar App Localmente
```bash
# Comando
npm start

# Escanear QR code com Expo Go
# Testar funcionalidades básicas
```

**Checkpoint:**
- [ ] App abre no Expo Go
- [ ] Sem crashes iniciais
- [ ] Navegação básica funciona

---

### ✅ DIA 2: Correções de Código

#### Tarefa 2.1: Substituir console.log (Prioridade Alta)

**Arquivos a corrigir (ordem de prioridade):**
1. `src/components/atoms/ChatBubble.tsx`
2. `src/agents/health/checks/QualityChecks.ts`
3. `src/polyfills.ts`

**Comando para encontrar todos:**
```bash
grep -r "console\.log\|console\.error\|console\.warn" src/ --include="*.ts" --include="*.tsx" | grep -v "logger.ts" | grep -v "README.md"
```

**Substituição:**
```typescript
// ❌ ANTES
console.log('Mensagem', data);

// ✅ DEPOIS
import { logger } from '@/utils/logger';
logger.info('Mensagem', { data });
```

**Tempo estimado:** 2-3 horas

**Checkpoint:**
- [ ] Arquivos de produção sem console.log
- [ ] Scripts MCP podem manter (são aceitáveis)

---

#### Tarefa 2.2: Corrigir Erros TypeScript Encontrados

**Processo:**
1. Executar `npm run type-check`
2. Listar todos os erros
3. Corrigir um por um, começando pelos mais críticos

**Tempo estimado:** 2-4 horas (depende de quantos erros)

**Checkpoint:**
- [ ] Zero erros TypeScript
- [ ] Código compila sem warnings críticos

---

### ✅ DIA 3: Validação e Preparação

#### Tarefa 3.1: Executar Validação Completa
```bash
# Comando
npm run validate:production

# Deve passar todos os checks críticos
```

**Checkpoint:**
- [ ] Validação passa (ou apenas warnings não-críticos)
- [ ] Todos os bloqueadores resolvidos

---

#### Tarefa 3.2: Testar Conexão Supabase
```bash
# Criar script de teste rápido
cat > scripts/test-supabase-connection.js << 'EOF'
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Testar conexão
supabase.from('profiles').select('count').limit(1)
  .then(() => console.log('✅ Conexão Supabase OK'))
  .catch(err => {
    console.error('❌ Erro na conexão:', err.message);
    process.exit(1);
  });
EOF

node scripts/test-supabase-connection.js
```

**Checkpoint:**
- [ ] Conexão Supabase funciona
- [ ] Tabelas existem (ou erro esperado se ainda não criadas)

---

## 🔧 FASE 2: BACKEND & IA (Dias 4-7)

### ✅ DIA 4: Configurar Supabase

#### Tarefa 4.1: Aplicar Schema do Banco

**Opção A: Via Supabase Dashboard (Recomendado)**
1. Acessar: https://supabase.com/dashboard
2. Selecionar projeto
3. Ir em: SQL Editor
4. Executar: `supabase/migrations/*.sql` (um por um, na ordem)

**Opção B: Via CLI**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link projeto
supabase link --project-ref YOUR_PROJECT_REF

# Aplicar migrations
supabase db push
```

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] Todas as tabelas criadas
- [ ] RLS (Row Level Security) habilitado
- [ ] Policies básicas criadas

---

#### Tarefa 4.2: Configurar Storage Buckets

**No Supabase Dashboard:**
1. Ir em: Storage
2. Criar buckets:
   - `avatars` (público)
   - `posts` (público)
   - `content` (público)
   - `private-uploads` (privado)

**Configurar políticas:**
```sql
-- Exemplo: avatars (público, leitura)
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Tempo estimado:** 30 minutos

**Checkpoint:**
- [ ] 4 buckets criados
- [ ] Políticas de acesso configuradas

---

#### Tarefa 4.3: Configurar RLS Policies

**Criar policies para cada tabela:**
```sql
-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Repetir para: chat_messages, habits, community_posts, comments
```

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] RLS habilitado em todas as tabelas
- [ ] Policies básicas criadas
- [ ] Testar: usuário A não vê dados de usuário B

---

### ✅ DIA 5: Implementar Guardrails de IA

#### Tarefa 5.1: Criar Sistema de Guardrails

**Criar arquivo:** `src/ai/guardrails/maternalGuardrails.ts`

```typescript
export const MATERNAL_GUARDRAILS = {
  crisisKeywords: [
    'suicídio', 'suicidar', 'me matar', 'acabar com tudo',
    'não aguento mais', 'querer morrer', 'sem esperança'
  ],
  
  medicalKeywords: [
    'diagnóstico', 'tratamento', 'medicamento', 'receita',
    'sintoma grave', 'emergência', 'hospital'
  ],
  
  crisisResponse: `⚠️ Entendo que você está passando por um momento difícil.
    
Este app oferece suporte emocional, mas não substitui ajuda profissional.

Se você está em crise, procure ajuda imediata:
- CVV (Centro de Valorização da Vida): 188
- SAMU: 192
- Emergência: 190

Você não está sozinha. 💙`,
  
  medicalDisclaimer: `⚠️ IMPORTANTE: Esta resposta é apenas informativa e não 
constitui diagnóstico ou tratamento médico.

Sempre consulte um profissional de saúde qualificado.`,
};

export const detectCrisis = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return MATERNAL_GUARDRAILS.crisisKeywords.some(keyword => 
    lowerText.includes(keyword)
  );
};

export const detectMedical = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return MATERNAL_GUARDRAILS.medicalKeywords.some(keyword => 
    lowerText.includes(keyword)
  );
};
```

**Tempo estimado:** 2 horas

**Checkpoint:**
- [ ] Arquivo criado
- [ ] Funções de detecção implementadas
- [ ] Respostas automáticas definidas

---

#### Tarefa 5.2: Integrar Guardrails no Chat Service

**Modificar:** `src/services/chatService.ts`

```typescript
import { detectCrisis, detectMedical, MATERNAL_GUARDRAILS } from '@/ai/guardrails/maternalGuardrails';

// No método sendMessage, antes de chamar IA:
if (detectCrisis(message.content)) {
  return {
    ...message,
    content: MATERNAL_GUARDRAILS.crisisResponse,
    metadata: { isCrisisResponse: true }
  };
}

// Após resposta da IA:
if (detectMedical(aiResponse)) {
  aiResponse += '\n\n' + MATERNAL_GUARDRAILS.medicalDisclaimer;
}
```

**Tempo estimado:** 1 hora

**Checkpoint:**
- [ ] Guardrails integrados
- [ ] Testar: mensagem com palavra-chave de crise
- [ ] Verificar resposta automática

---

#### Tarefa 5.3: Implementar Rate Limiting

**Criar:** `supabase/functions/rate-limit/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { userId, action } = await req.json();
  
  // Rate limit: 20 mensagens IA por hora
  if (action === 'chat_message') {
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());
    
    if (recentMessages && recentMessages.length >= 20) {
      return new Response(
        JSON.stringify({ error: 'Limite de mensagens excedido. Tente novamente em 1 hora.' }),
        { status: 429 }
      );
    }
  }
  
  return new Response(JSON.stringify({ allowed: true }), { status: 200 });
});
```

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] Edge Function criada
- [ ] Rate limiting funcionando
- [ ] Testar: enviar 21 mensagens em 1 hora

---

### ✅ DIA 6: Moderação de Conteúdo

#### Tarefa 6.1: Criar Serviço de Moderação

**Criar:** `src/services/communityModerationService.ts`

```typescript
import { logger } from '@/utils/logger';

const OFFENSIVE_WORDS = [
  // Lista de palavras ofensivas (adicionar conforme necessário)
];

export const moderateContent = async (text: string): Promise<{
  approved: boolean;
  reason?: string;
}> => {
  // 1. Filtro básico
  const lowerText = text.toLowerCase();
  const hasOffensive = OFFENSIVE_WORDS.some(word => 
    lowerText.includes(word)
  );
  
  if (hasOffensive) {
    return { approved: false, reason: 'Conteúdo ofensivo detectado' };
  }
  
  // 2. OpenAI Moderation API (se configurado)
  if (process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      });
      
      const data = await response.json();
      if (data.results[0].flagged) {
        return { approved: false, reason: 'Conteúdo viola políticas' };
      }
    } catch (error) {
      logger.warn('Erro ao moderar conteúdo', error);
      // Continuar se moderação falhar (fail-safe)
    }
  }
  
  return { approved: true };
};
```

**Tempo estimado:** 2 horas

**Checkpoint:**
- [ ] Serviço criado
- [ ] Filtro básico funcionando
- [ ] Integração OpenAI (se disponível)

---

#### Tarefa 6.2: Integrar Moderação no Community Service

**Modificar:** `src/services/communityService.ts`

```typescript
import { moderateContent } from './communityModerationService';

// No método createPost:
const moderation = await moderateContent(content);
if (!moderation.approved) {
  throw new Error(moderation.reason || 'Conteúdo não aprovado');
}
```

**Tempo estimado:** 30 minutos

**Checkpoint:**
- [ ] Moderação integrada
- [ ] Testar: post com palavra ofensiva
- [ ] Verificar rejeição

---

### ✅ DIA 7: Testes e Validação

#### Tarefa 7.1: Testar Fluxo Completo

**Checklist de testes:**
- [ ] Login/Registro funciona
- [ ] Chat IA responde (com guardrails)
- [ ] Criar post na comunidade (com moderação)
- [ ] Upload de imagem funciona
- [ ] Hábitos funcionam
- [ ] Sem crashes

**Tempo estimado:** 2-3 horas

**Checkpoint:**
- [ ] Todos os fluxos principais funcionando
- [ ] Guardrails ativando corretamente
- [ ] Moderação funcionando

---

## 📱 FASE 3: BUILD & TESTES (Dias 8-12)

### ✅ DIA 8: Configurar EAS

#### Tarefa 8.1: Criar Contas de Desenvolvedor

**iOS:**
1. Acessar: https://developer.apple.com/programs/
2. Criar conta ($99/ano)
3. Aguardar aprovação (24-48h)

**Android:**
1. Acessar: https://play.google.com/console/signup
2. Criar conta ($25 único)
3. Aprovação imediata

**Tempo estimado:** 1 hora (criação) + espera aprovação

**Checkpoint:**
- [ ] Conta Apple criada (aguardando aprovação)
- [ ] Conta Google criada e aprovada

---

#### Tarefa 8.2: Configurar EAS CLI

```bash
# Instalar
npm install -g eas-cli

# Login
eas login

# Inicializar projeto
eas init

# Configurar credenciais
eas credentials
```

**Tempo estimado:** 30 minutos

**Checkpoint:**
- [ ] EAS CLI instalado
- [ ] Logado na conta
- [ ] Projeto inicializado

---

#### Tarefa 8.3: Atualizar eas.json

**Editar:** `eas.json`

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "SEU_APP_ID_AQUI",  // Obter do App Store Connect
        "appleTeamId": "SEU_TEAM_ID_AQUI"  // Obter do Apple Developer
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json"
      }
    }
  }
}
```

**Para obter IDs:**
- `ascAppId`: App Store Connect → App → App Information → Apple ID
- `appleTeamId`: Apple Developer → Membership → Team ID

**Tempo estimado:** 30 minutos

**Checkpoint:**
- [ ] `eas.json` atualizado
- [ ] IDs corretos preenchidos

---

#### Tarefa 8.4: Criar Service Account Google Play

**Passos:**
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Criar Service Account
3. Dar permissão: "Service Account User" + "Play Console Admin"
4. Baixar JSON key
5. Salvar como: `google-play-service-account.json`
6. **Adicionar ao .gitignore!**

**Tempo estimado:** 30 minutos

**Checkpoint:**
- [ ] Service Account criado
- [ ] JSON key baixado
- [ ] Arquivo no .gitignore

---

### ✅ DIA 9: Criar Screenshots

#### Tarefa 9.1: Preparar Ambiente

```bash
# Criar pastas
mkdir -p ios-screenshots/6.5-inch
mkdir -p ios-screenshots/5.5-inch
mkdir -p android-screenshots/phone
```

**Tempo estimado:** 5 minutos

---

#### Tarefa 9.2: Capturar Screenshots iOS

**iPhone 14 Pro Max (6.5"):**
- Tamanho: 1284 × 2778 px
- Simulador: Xcode → iPhone 14 Pro Max
- Telas a capturar:
  1. Onboarding
  2. Home
  3. Chat IA
  4. Comunidade
  5. Hábitos

**Comando:**
```bash
# No simulador iOS
# Cmd+S para capturar
# Salvar em: ios-screenshots/6.5-inch/
```

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] Mínimo 3 screenshots capturados
- [ ] Qualidade boa (sem elementos de debug)

---

#### Tarefa 9.3: Capturar Screenshots Android

**Phone (1080 × 1920 px ou 1080 × 2340 px):**
- Emulador: Android Studio
- Mesmas telas do iOS

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] Mínimo 2 screenshots capturados
- [ ] Qualidade boa

---

#### Tarefa 9.4: Criar Feature Graphic (Google Play)

**Tamanho:** 1024 × 500 px

**Ferramentas:**
- Figma (grátis)
- Canva (grátis)
- Photoshop

**Conteúdo sugerido:**
- Logo do app
- Texto: "Nossa Maternidade - Apoio emocional para mães"
- Cores do design system

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] Feature graphic criado
- [ ] Salvo em: `android-screenshots/feature-graphic.png`

---

### ✅ DIA 10: Development Build

#### Tarefa 10.1: Criar Development Build

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

**Tempo estimado:** 30-60 minutos por build (processamento na nuvem)

**Checkpoint:**
- [ ] Builds criados com sucesso
- [ ] Links de download disponíveis

---

#### Tarefa 10.2: Instalar e Testar

**iOS:**
- Baixar do EAS
- Instalar via TestFlight ou link direto
- Testar em dispositivo real

**Android:**
- Baixar APK do EAS
- Instalar manualmente
- Testar em dispositivo real

**Checklist de testes:**
- [ ] Login funciona
- [ ] Chat IA funciona
- [ ] Comunidade funciona
- [ ] Upload de imagens funciona
- [ ] Notificações (se implementado)
- [ ] Dark mode funciona
- [ ] Sem crashes
- [ ] Performance aceitável

**Tempo estimado:** 2-3 horas

**Checkpoint:**
- [ ] Todos os testes passando
- [ ] Bugs críticos corrigidos

---

### ✅ DIA 11: Production Build

#### Tarefa 11.1: Preparar para Produção

```bash
# Validar tudo antes
npm run validate:production
npm run type-check
npm run lint
npm test
```

**Checkpoint:**
- [ ] Todas as validações passando
- [ ] Zero erros críticos

---

#### Tarefa 11.2: Criar Production Build

```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

**Tempo estimado:** 1-2 horas por build

**Checkpoint:**
- [ ] Builds de produção criados
- [ ] Versões corretas (1.0.0)

---

#### Tarefa 11.3: Testar Production Builds

**Testar os mesmos itens do development build**

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] Tudo funcionando
- [ ] Pronto para submeter

---

## 🚀 FASE 4: PUBLICAÇÃO (Dias 13-15)

### ✅ DIA 13: Preparar Metadata

#### Tarefa 13.1: App Store Connect

**Preencher:**
- Nome: "Nossa Maternidade"
- Subtítulo: "Apoio emocional para mães"
- Descrição: [escrever descrição completa]
- Keywords: maternidade, saúde, comunidade, IA
- Categoria: Saúde e Fitness
- Idade: 17+
- Privacy Policy URL: https://nossamaternidade.com.br/privacy
- Terms of Service URL: https://nossamaternidade.com.br/terms

**Upload:**
- Screenshots (mínimo 3)
- App Preview (opcional)

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] Metadata completa
- [ ] Screenshots uploadados

---

#### Tarefa 13.2: Google Play Console

**Preencher:**
- Nome: "Nossa Maternidade"
- Descrição curta: "Apoio emocional para mães"
- Descrição completa: [escrever]
- Categoria: Saúde e Fitness
- Classificação: Preencher questionário
- Privacy Policy URL: https://nossamaternidade.com.br/privacy

**Upload:**
- Screenshots (mínimo 2)
- Feature Graphic (1024 × 500 px)

**Tempo estimado:** 1-2 horas

**Checkpoint:**
- [ ] Metadata completa
- [ ] Assets uploadados

---

### ✅ DIA 14: Submeter para Lojas

#### Tarefa 14.1: Submeter iOS

```bash
eas submit --platform ios --profile production
```

**Ou manualmente:**
1. App Store Connect → App → Versão
2. Upload build do EAS
3. Preencher informações de release
4. Submeter para revisão

**Tempo estimado:** 30 minutos

**Checkpoint:**
- [ ] Build submetido
- [ ] Status: "Waiting for Review"

---

#### Tarefa 14.2: Submeter Android

```bash
eas submit --platform android --profile production
```

**Ou manualmente:**
1. Google Play Console → App → Production
2. Criar release
3. Upload AAB do EAS
4. Preencher release notes
5. Submeter para revisão

**Tempo estimado:** 30 minutos

**Checkpoint:**
- [ ] Build submetido
- [ ] Status: "Under review"

---

### ✅ DIA 15: Aguardar e Responder

#### Tarefa 15.1: Monitorar Status

**iOS:**
- Revisão: 24-48h (geralmente)
- Status em: App Store Connect

**Android:**
- Revisão: 1-7 dias (geralmente)
- Status em: Google Play Console

**Tempo estimado:** Monitoramento contínuo

---

#### Tarefa 15.2: Responder a Rejeições (Se Houver)

**Possíveis rejeições iOS:**
- Privacy Policy não encontrada → Verificar URL
- Permissões não justificadas → Revisar Info.plist
- Conteúdo médico sem disclaimer → Adicionar disclaimer

**Possíveis rejeições Android:**
- Data Safety incompleto → Preencher no Play Console
- Política de privacidade ausente → Adicionar URL

**Tempo estimado:** Variável (depende do problema)

**Checkpoint:**
- [ ] App aprovado OU
- [ ] Rejeição respondida e resubmetido

---

## 📊 CHECKLIST FINAL

### Antes de Submeter:

- [ ] Dependências instaladas
- [ ] .env configurado
- [ ] TypeScript sem erros
- [ ] Backend Supabase configurado
- [ ] Guardrails IA implementados
- [ ] Moderação de conteúdo funcionando
- [ ] Screenshots criados
- [ ] EAS configurado
- [ ] Production builds testados
- [ ] Metadata preenchida
- [ ] Documentos legais publicados (URLs)

### Após Submissão:

- [ ] Status monitorado
- [ ] Pronto para responder rejeições
- [ ] Plano de marketing preparado

---

## 🎯 MÉTRICAS DE SUCESSO

### Fase 1 (Setup):
- ✅ App roda localmente
- ✅ Zero erros TypeScript
- ✅ Validação passa

### Fase 2 (Backend):
- ✅ Supabase funcionando
- ✅ Guardrails ativando
- ✅ Moderação funcionando

### Fase 3 (Build):
- ✅ Builds criados
- ✅ Testes passando
- ✅ Performance OK

### Fase 4 (Publicação):
- ✅ Submetido para lojas
- ✅ Aprovado (ou em revisão)

---

## 🚨 RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Aprovação Apple demorar > 48h | Média | Alto | Submeter cedo, ter metadata perfeita |
| Rejeição por Privacy Policy | Baixa | Crítico | Verificar URL antes de submeter |
| Bugs em produção | Média | Alto | Testes extensivos em development build |
| Guardrails não funcionando | Baixa | Crítico | Testes manuais antes de produção |

---

## 📞 SUPORTE

**Dúvidas técnicas:**
- Consulte: `docs/GUIA_PRODUCAO_BRUTAL_2025.md`
- Execute: `npm run validate:production`

**Problemas:**
- Verificar: `docs/ERROS_E_PROBLEMAS.md`
- Quick fix: `docs/QUICK_FIX.md`

---

**Boa sorte! 🚀**

**Última atualização:** 08/12/2025
