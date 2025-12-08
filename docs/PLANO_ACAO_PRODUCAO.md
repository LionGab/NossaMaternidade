# 🎯 PLANO DE AÇÃO - Nossa Maternidade para Produção

> Plano concreto e executável para lançar o app nas lojas

---

## 📊 STATUS ATUAL

| Área | Status | Nota |
|------|--------|------|
| TypeScript | ✅ 0 erros | 10/10 |
| Lint | ✅ 0 warnings | 10/10 |
| Testes | ❌ 7 falhando | 6/10 |
| Arquitetura IA | ✅ Completa | 9/10 |
| Segurança | ✅ RLS + Crise | 9/10 |
| Store Config | ⚠️ IDs faltando | 5/10 |
| Assets | ⚠️ Verificar | 7/10 |

**Estimativa: 2-3 semanas para lançamento**

---

## 🗓️ PLANO POR SEMANA

### SEMANA 1: Correções Técnicas

#### Dia 1-2: Corrigir Testes (CRÍTICO)

**Prioridade 1 - Services:**

```bash
# Arquivos a corrigir:
__tests__/services/authService.test.ts
__tests__/services/habitsService.test.ts
__tests__/services/communityService.test.ts
__tests__/services/diaryService.test.ts
```

| Arquivo | Problema | Ação |
|---------|----------|------|
| `authService.test.ts` | `signInWithOAuth` não existe | Remover teste ou implementar método |
| `habitsService.test.ts` | `logHabit` não existe | Remover teste ou implementar método |
| `communityService.test.ts` | Mocks retornam `false` | Corrigir mocks |
| `diaryService.test.ts` | `getFavorites` retorna `null` | Corrigir mock |

**Prioridade 2 - Agents:**

```bash
# Arquivos a corrigir:
__tests__/agents/MaternalChatAgent.test.ts
__tests__/agents/HabitsAnalysisAgent.streaks.test.ts
__tests__/features/wellness/WellnessContext.streaks.test.tsx
```

| Arquivo | Problema | Ação |
|---------|----------|------|
| `MaternalChatAgent.test.ts` | `getCurrentSession` não existe | Atualizar teste |
| `HabitsAnalysisAgent.streaks.test.ts` | Cálculo de streak errado | Revisar lógica ou expectativa |
| `WellnessContext.streaks.test.tsx` | Filtro de futuro não funciona | Corrigir filtro |

**Comando para verificar:**
```bash
npm test
# Meta: 0 falhas
```

#### Dia 3: Configurar Contas de Desenvolvedor

**Apple Developer Program ($99/ano):**
```
1. Acessar: https://developer.apple.com/programs/enroll/
2. Criar conta com Apple ID
3. Pagar $99
4. Aguardar aprovação (24-48h)
5. Obter: Team ID
```

**Google Play Console ($25 único):**
```
1. Acessar: https://play.google.com/console
2. Criar conta de desenvolvedor
3. Pagar $25
4. Criar app "Nossa Maternidade"
5. Criar Service Account para deploy automático
```

#### Dia 4-5: Configurar EAS

**Atualizar `eas.json`:**

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "PREENCHER_DEPOIS_DE_CRIAR_APP",
        "appleTeamId": "PREENCHER_COM_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json"
      }
    }
  }
}
```

**Criar Service Account Google:**
```
1. Google Cloud Console → IAM → Service Accounts
2. Criar conta com papel "Service Account User"
3. Criar chave JSON
4. Salvar como: ./google-play-service-account.json
5. Adicionar ao .gitignore
```

---

### SEMANA 2: Assets e Preparação

#### Dia 1-2: Assets Finais

**Checklist de Assets:**

| Asset | Tamanho | Arquivo | Status |
|-------|---------|---------|--------|
| Ícone App | 1024x1024 | `assets/icon.png` | ⬜ Verificar |
| Ícone Adaptativo | 1024x1024 | `assets/adaptive-icon.png` | ⬜ Verificar |
| Splash | 2048x2048 | `assets/splash.png` | ⬜ Verificar |
| Notificação | 96x96 | `assets/notification-icon.png` | ⬜ Criar |
| Favicon | 48x48 | `assets/favicon.png` | ⬜ Verificar |

**Screenshots iOS (iPhone 15 Pro Max - 1320x2868):**
```
⬜ 1. Tela de boas-vindas/splash
⬜ 2. Chat com NathIA
⬜ 3. Home com desafios
⬜ 4. Comunidade/Feed
⬜ 5. Perfil/Conquistas
```

**Screenshots Android (1080x1920):**
```
⬜ Mesmas 5 acima
⬜ Feature Graphic (1024x500)
```

#### Dia 3: Textos das Lojas

**App Store (iOS):**

```yaml
Nome: Nossa Maternidade
Subtítulo: Sua companheira de maternidade (30 chars)
Categoria: Health & Fitness
Classificação: 12+

Descrição (4000 chars):
"Nossa Maternidade é o app que toda mãe merecia ter. 

Com a NathIA, sua assistente de IA acolhedora e sem julgamentos, você tem uma companheira 24h para:

💬 Desabafar sobre os desafios da maternidade
🎯 Desafios diários de autocuidado
👥 Comunidade de mães que se apoiam
📊 Acompanhar seu bem-estar emocional

Funcionalidades:
• Chat com IA treinada especialmente para mães
• Detecção de momentos difíceis com recursos de apoio
• Comunidade moderada e segura
• Desafios diários personalizados
• Diário emocional privado
• Modo escuro automático

Desenvolvido com carinho para mães brasileiras. 
LGPD compliant. Seus dados estão seguros.

Não substitui acompanhamento médico ou psicológico."

Palavras-chave (100 chars):
maternidade,mãe,bebê,pós-parto,autocuidado,saúde mental,comunidade,apoio,IA,desafios
```

**Google Play (Android):**

```yaml
Nome: Nossa Maternidade
Descrição curta (80 chars):
Sua companheira de maternidade com IA acolhedora e comunidade de mães

Descrição longa: (mesma do iOS)

Categoria: Health & Fitness > Parenting
```

#### Dia 4-5: Documentos Legais

**Política de Privacidade (URL pública necessária):**
```
⬜ Hospedar em: https://nossamaternidade.com.br/privacidade
⬜ Ou usar: Notion/Google Sites público
⬜ Conteúdo: docs/PRIVACY_POLICY.md (já existe)
```

**Termos de Uso (URL pública necessária):**
```
⬜ Hospedar em: https://nossamaternidade.com.br/termos
⬜ Conteúdo: docs/TERMS_OF_SERVICE.md (já existe)
```

---

### SEMANA 3: Build e Submissão

#### Dia 1: Build de Preview

```bash
# Verificar tudo OK
npm run type-check && npm run lint && npm test

# Build preview para teste interno
eas build --platform all --profile preview

# Aguardar builds (~30-40 min cada)
eas build:list
```

#### Dia 2-3: Teste Beta

**Distribuir para testadores:**
```bash
# iOS: TestFlight
eas submit --platform ios --profile staging

# Android: Internal Testing
eas submit --platform android --profile internal
```

**Grupo de teste:**
```
⬜ 10-50 mães beta testers
⬜ Coletar feedback por 2-3 dias
⬜ Monitorar crashes
⬜ Corrigir bugs críticos
```

#### Dia 4: Build de Produção

```bash
# Build final
eas build --platform all --profile production

# Verificar builds
eas build:list
```

#### Dia 5: Submissão

**iOS:**
```bash
eas submit --platform ios --profile production

# Preencher no App Store Connect:
⬜ Descrição
⬜ Screenshots
⬜ Privacy Nutrition Labels
⬜ Classificação etária
```

**Android:**
```bash
eas submit --platform android --profile production

# Preencher no Google Play Console:
⬜ Listagem da loja
⬜ Data Safety form (CRÍTICO!)
⬜ Content Rating
⬜ Países de distribuição
```

---

### SEMANA 4: Lançamento

#### Dia 1-2: Aguardar Revisão

| Plataforma | Tempo Médio |
|------------|-------------|
| iOS | 24-48 horas |
| Android | 1-3 dias |

**Se rejeitado:**
```
⬜ Ler motivo da rejeição
⬜ Corrigir problema
⬜ Resubmeter
```

#### Dia 3: Soft Launch

```
⬜ Liberar para público
⬜ NÃO fazer anúncio grande ainda
⬜ Monitorar por 24-48h
⬜ Verificar:
   - Crashes
   - Reviews
   - Performance
   - Custos de IA
```

#### Dia 4-5: Lançamento Público

```
⬜ Anúncio da Nathália (coordenar timing)
⬜ Posts em redes sociais
⬜ Monitorar pico de downloads
⬜ Equipe de suporte pronta
⬜ Monitorar custos de IA
```

---

## 📋 CHECKLIST EXECUTIVO

### Semana 1 - Técnico
- [ ] Corrigir 7 testes falhando
- [ ] Criar conta Apple Developer ($99)
- [ ] Criar conta Google Play ($25)
- [ ] Obter Apple Team ID
- [ ] Criar Google Service Account JSON
- [ ] Atualizar `eas.json` com IDs

### Semana 2 - Assets
- [ ] Verificar/criar ícone 1024x1024
- [ ] Criar notification-icon 96x96
- [ ] Criar 5 screenshots iOS
- [ ] Criar 5 screenshots Android
- [ ] Criar Feature Graphic 1024x500
- [ ] Publicar Política de Privacidade
- [ ] Publicar Termos de Uso

### Semana 3 - Build
- [ ] Build preview
- [ ] Teste beta com 10-50 pessoas
- [ ] Corrigir bugs encontrados
- [ ] Build produção
- [ ] Submeter iOS
- [ ] Submeter Android
- [ ] Preencher Data Safety (Google)
- [ ] Preencher Privacy Labels (Apple)

### Semana 4 - Lançamento
- [ ] Aguardar aprovação
- [ ] Soft launch
- [ ] Monitorar 24-48h
- [ ] Lançamento público
- [ ] Anúncio Nathália

---

## 💰 CUSTOS ESTIMADOS

### Setup Inicial (Único)

| Item | Custo |
|------|-------|
| Apple Developer | $99/ano |
| Google Play | $25 único |
| **Total Setup** | **~$125** |

### Mensal (100k usuárias)

| Item | Custo |
|------|-------|
| Supabase Pro | $25+ |
| IA (Gemini/GPT) | $200-400 |
| EAS (opcional) | $29 |
| **Total Mensal** | **~$300-500** |

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Rejeição App Store | Média | Alto | Seguir guidelines, testar bem |
| Bugs no dia 1 | Alta | Alto | Soft launch, beta testing |
| Custos IA disparando | Média | Médio | Rate limiting, monitoramento |
| Crash em escala | Baixa | Alto | Load testing antes |

---

## 📞 CONTATOS ÚTEIS

```
Apple Developer Support:
https://developer.apple.com/contact/

Google Play Support:
https://support.google.com/googleplay/android-developer/

Expo/EAS Discord:
https://chat.expo.dev/

Supabase Discord:
https://discord.supabase.com/
```

---

## ✅ DEFINIÇÃO DE "PRONTO"

O app está pronto para lançamento quando:

1. ✅ TypeScript: 0 erros
2. ✅ Lint: 0 warnings
3. ⬜ Testes: 0 falhas
4. ⬜ Contas: Apple + Google configuradas
5. ⬜ Assets: Todos criados e aprovados
6. ⬜ Docs legais: URLs públicas funcionando
7. ⬜ Beta: Testado por 10+ pessoas
8. ⬜ Builds: iOS + Android passando
9. ⬜ Submissão: Ambas lojas aceitas

---

*Plano criado em Dezembro 2025 | Estimativa: 3-4 semanas*
