# 🔒 Segurança e LGPD - Nossa Maternidade

> Guia de compliance e segurança para o app

---

## 1. Visão Geral

O app Nossa Maternidade lida com **dados sensíveis** de mães brasileiras, incluindo:

- Informações pessoais (nome, email, foto)
- Dados de saúde (humor, sono, amamentação)
- Conversas privadas com IA
- Conteúdo de comunidade

**Compliance obrigatório:**
- LGPD (Lei Geral de Proteção de Dados) - Brasil
- App Store Review Guidelines - Apple
- Google Play Developer Policy - Google

---

## 2. LGPD (Lei 13.709/2018)

### Princípios Aplicados

| Princípio | Como Aplicamos |
|-----------|----------------|
| **Finalidade** | Dados coletados apenas para funcionamento do app |
| **Adequação** | Só coletamos o necessário |
| **Necessidade** | Mínimo de dados possível |
| **Livre acesso** | Usuária pode ver seus dados |
| **Qualidade** | Dados atualizados e precisos |
| **Transparência** | Política de privacidade clara |
| **Segurança** | Criptografia, RLS, backups |
| **Prevenção** | Monitoramento de acessos |
| **Não discriminação** | Sem tratamento discriminatório |
| **Responsabilização** | Logs de auditoria |

### Direitos do Titular (Implementados)

| Direito | Implementação |
|---------|---------------|
| **Acesso** | Endpoint `/api/user/data-export` |
| **Correção** | Tela de perfil editável |
| **Exclusão** | Botão "Deletar conta" |
| **Portabilidade** | Export em JSON |
| **Revogação** | Gestão de consentimentos |

### Bases Legais Utilizadas

```typescript
// Consentimento (principal)
const CONSENT_TYPES = {
  data_processing: {
    description: 'Processamento de dados para funcionamento do app',
    required: true,
    legalBasis: 'consent',
  },
  ai_processing: {
    description: 'Uso de IA para análise e respostas',
    required: true,
    legalBasis: 'consent',
  },
  analytics: {
    description: 'Análise de uso para melhorias',
    required: false,
    legalBasis: 'legitimate_interest',
  },
  marketing: {
    description: 'Comunicações promocionais',
    required: false,
    legalBasis: 'consent',
  },
};
```

---

## 3. Segurança de Dados

### Criptografia

| Camada | Tecnologia |
|--------|------------|
| **Trânsito** | TLS 1.3 (HTTPS) |
| **Repouso** | AES-256 (Supabase) |
| **Tokens** | expo-secure-store (iOS Keychain / Android Keystore) |
| **Senhas** | bcrypt (via Supabase Auth) |

### Row Level Security (RLS)

```sql
-- Cada usuária só acessa seus próprios dados
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Moderadores têm acesso expandido (com log)
CREATE POLICY "Moderators can view all crisis interventions"
  ON crisis_interventions FOR SELECT
  TO authenticated
  USING (is_moderator());
```

### Tabelas e Políticas

| Tabela | Política |
|--------|----------|
| `profiles` | Usuária lê/escreve próprio perfil |
| `chat_sessions` | Usuária lê/escreve próprias sessões |
| `chat_messages` | Usuária lê/escreve próprias mensagens |
| `habits` | Usuária lê/escreve próprios hábitos |
| `habit_logs` | Usuária lê/escreve próprios logs |
| `community_posts` | Leitura pública (aprovados), escrita própria |
| `crisis_interventions` | Usuária lê próprias, moderadores leem todas |
| `user_consents` | Append-only (sem delete/update por usuária) |

---

## 4. Autenticação

### Métodos Suportados

```typescript
// src/services/authService.ts

// Email + Senha
await supabase.auth.signUp({ email, password });

// Magic Link (sem senha)
await supabase.auth.signInWithOtp({ email });

// OAuth (Google, Apple)
await supabase.auth.signInWithOAuth({ provider: 'google' });
await supabase.auth.signInWithOAuth({ provider: 'apple' });
```

### Refresh de Tokens

```typescript
// Tokens são automaticamente refreshed pelo Supabase
// Mas implementamos verificação adicional:

export async function ensureValidSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return null;
  
  // Verifica se token expira em menos de 5 minutos
  const expiresAt = session.expires_at ?? 0;
  const now = Math.floor(Date.now() / 1000);
  
  if (expiresAt - now < 300) {
    const { data } = await supabase.auth.refreshSession();
    return data.session;
  }
  
  return session;
}
```

### Armazenamento Seguro

```typescript
// ✅ CORRETO: SecureStore para tokens
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

// Supabase usa este storage
const supabase = createClient(url, anonKey, {
  auth: { storage: secureStorage },
});
```

---

## 5. Detecção de Crise

### Sistema Implementado

```typescript
// src/ai/moderation/CrisisDetectionService.ts

export type CrisisLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'critical';

// Detecta automaticamente em TODA mensagem
const crisisCheck = CrisisDetectionService.detectCrisisSync(userMessage);

if (crisisCheck.isCrisis) {
  // 1. Usa modelo mais seguro (GPT-4o)
  // 2. Mostra recursos de emergência
  // 3. Registra intervenção para follow-up
}
```

### Padrões Detectados

| Nível | Exemplos |
|-------|----------|
| **Crítico** | "quero morrer", "vou me matar", "seria melhor sem mim" |
| **Severo** | "não aguento mais", "quero sumir", "não consigo amar meu bebê" |
| **Moderado** | "tô no limite", "me arrependo de ser mãe", "vou enlouquecer" |

### Recursos Mostrados

```typescript
const EMERGENCY_RESOURCES = {
  suicidal: ['CVV: 188 (24h)', 'SAMU: 192'],
  domestic_violence: ['Ligue 180', 'Delegacia da Mulher'],
  postpartum: ['CVV: 188', 'CAPS', 'Maternidade de referência'],
};
```

### Follow-up

```sql
-- Tabela de intervenções para acompanhamento
CREATE TABLE crisis_interventions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  level TEXT NOT NULL,
  types TEXT[] NOT NULL,
  user_message TEXT,
  resources_shown TEXT[],
  follow_up_needed BOOLEAN DEFAULT TRUE,
  follow_up_at TIMESTAMPTZ,
  outcome TEXT, -- 'contacted_cvv', 'continued_chat', etc
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Moderação de Conteúdo

### Fluxo de Moderação

```
Usuária cria post
       │
       ▼
┌─────────────────┐
│ Auto-moderação  │ ← Claude API analisa conteúdo
│ (IA)            │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  SAFE     FLAGGED
    │         │
    ▼         ▼
Auto-    Fila de
approve  moderação
    │         │
    ▼         ▼
Publicado  Moderador
           revisa
```

### Categorias de Conteúdo

| Categoria | Ação |
|-----------|------|
| **Normal** | Auto-approve |
| **Sensível** | Aviso antes de exibir |
| **Médico** | Flag para revisão |
| **Ofensivo** | Rejeitar automaticamente |
| **Violência** | Rejeitar + notificar |
| **Spam** | Rejeitar silenciosamente |

---

## 7. API Keys e Secrets

### Onde Ficam

| Secret | Local | Acesso |
|--------|-------|--------|
| `SUPABASE_URL` | `.env` / EAS Secrets | Público (anon) |
| `SUPABASE_ANON_KEY` | `.env` / EAS Secrets | Público (RLS protege) |
| `SUPABASE_SERVICE_KEY` | Supabase Edge Functions | Apenas servidor |
| `GEMINI_API_KEY` | Supabase Edge Functions | Apenas servidor |
| `OPENAI_API_KEY` | Supabase Edge Functions | Apenas servidor |
| `ANTHROPIC_API_KEY` | Supabase Edge Functions | Apenas servidor |

### Por Que Não no App?

```typescript
// ❌ NUNCA fazer isso
const GEMINI_KEY = 'AIzaSy...'; // Exposta no bundle!

// ✅ CORRETO: Chamar via Edge Function
const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/chat-ai`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${userToken}` },
  body: JSON.stringify({ message }),
});
// A Edge Function tem a API key, não o app
```

---

## 8. App Store / Google Play Compliance

### Privacy Nutrition Labels (iOS)

```json
// app.config.js
"privacyManifests": {
  "NSPrivacyAccessedAPITypes": [
    {
      "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
      "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
    }
  ]
}
```

### Data Safety Form (Google Play)

| Pergunta | Resposta |
|----------|----------|
| **Coleta email?** | Sim (autenticação) |
| **Coleta nome?** | Sim (perfil) |
| **Coleta fotos?** | Sim (avatar, comunidade) |
| **Coleta localização?** | Opcional (conectar mães próximas) |
| **Dados de saúde?** | Sim (humor, sono, hábitos) |
| **Compartilha com terceiros?** | Não |
| **Dados criptografados?** | Sim |
| **Pode deletar dados?** | Sim |

---

## 9. Logs e Auditoria

### O Que Logamos

```typescript
// Eventos de segurança
logger.info('[Auth] Login bem-sucedido', { userId, method: 'email' });
logger.warn('[Auth] Tentativa de login falhou', { email, reason: 'invalid_password' });
logger.error('[Auth] Múltiplas tentativas falhas', { email, attempts: 5 });

// Eventos de crise
logger.warn('[Crisis] Crise detectada', { userId, level: 'severe', types: ['suicidal'] });
logger.info('[Crisis] Recursos mostrados', { userId, resources: ['CVV'] });

// Eventos de moderação
logger.info('[Moderation] Post aprovado', { postId, moderatorId });
logger.warn('[Moderation] Post rejeitado', { postId, reason: 'offensive' });
```

### O Que NÃO Logamos

- Senhas (nunca, nem hash)
- Tokens de autenticação
- Conteúdo completo de mensagens (apenas IDs)
- Dados pessoais sensíveis

### Retenção

| Tipo de Log | Retenção |
|-------------|----------|
| **Erro** | 90 dias |
| **Segurança** | 1 ano |
| **Auditoria** | 5 anos (LGPD) |

---

## 10. Exclusão de Dados

### Fluxo de "Deletar Conta"

```typescript
// src/services/userDataService.ts

async function deleteUserAccount(userId: string): Promise<void> {
  // 1. Soft delete em todas as tabelas
  await supabase.from('profiles').update({ deleted_at: new Date() }).eq('id', userId);
  await supabase.from('chat_sessions').update({ deleted_at: new Date() }).eq('user_id', userId);
  // ... outras tabelas

  // 2. Anonimizar dados em posts públicos (manter histórico)
  await supabase.from('community_posts')
    .update({ author_name: 'Usuária removida', author_id: null })
    .eq('author_id', userId);

  // 3. Hard delete após 30 dias (LGPD permite retenção temporária)
  // Executado via cron job

  // 4. Deletar conta de autenticação
  await supabase.auth.admin.deleteUser(userId);
}
```

### Export de Dados (Portabilidade)

```typescript
async function exportUserData(userId: string): Promise<UserDataExport> {
  const [profile, sessions, messages, habits, posts] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('chat_sessions').select('*').eq('user_id', userId),
    supabase.from('chat_messages').select('*').eq('user_id', userId),
    supabase.from('habits').select('*').eq('user_id', userId),
    supabase.from('community_posts').select('*').eq('author_id', userId),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    profile: profile.data,
    chatSessions: sessions.data,
    chatMessages: messages.data,
    habits: habits.data,
    communityPosts: posts.data,
  };
}
```

---

## 11. Checklist de Segurança

### Antes do Lançamento

- [x] RLS habilitado em todas as tabelas
- [x] Políticas de RLS testadas
- [x] API keys em variáveis de ambiente
- [x] API keys sensíveis apenas no servidor
- [x] SecureStore para tokens
- [x] Detecção de crise implementada
- [x] Logs de auditoria configurados
- [ ] Política de Privacidade publicada
- [ ] Termos de Uso publicados
- [ ] Data Safety form preenchido (Google)
- [ ] Privacy Nutrition Labels (Apple)
- [ ] Fluxo de exclusão de conta testado

### Monitoramento Contínuo

- [ ] Alertas para tentativas de login suspeitas
- [ ] Alertas para picos de crise
- [ ] Revisão mensal de logs de segurança
- [ ] Backup testado regularmente
- [ ] Vulnerabilidades de dependências (npm audit)

---

## 12. Contato DPO

Para solicitações LGPD, o app deve exibir:

```
Para exercer seus direitos de titular de dados:
📧 Email: privacidade@nossamaternidade.com.br
📱 App: Configurações > Privacidade > Meus Dados
```

---

*Documento criado em Dezembro 2025 para o projeto Nossa Maternidade / NathIA*
