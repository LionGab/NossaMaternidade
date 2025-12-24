# 📱 Guia de Testes iOS - Nossa Maternidade

**Última atualização:** 24 Dezembro 2025
**Versão:** v1.0
**Objetivo:** Garantir qualidade impecável para lançamento com 40M followers

---

## 🎯 Pré-requisitos

### Ambiente de Desenvolvimento
```bash
# Verificar versões
node --version    # Deve ser v20+
npm --version     # Deve ser v10+
expo --version    # Deve ser ~54.0.0

# Verificar quality gate
npm run quality-gate
```

### Contas e Credenciais
- [x] .env.local configurado com Supabase
- [x] .env.local com chaves de IA (OpenAI/Gemini)
- [x] .env.local com ElevenLabs (voz)
- [ ] Apple Developer account ($99/ano) - criar antes do build
- [ ] RevenueCat account (para IAP)

---

## 🖥️ FASE 1: Testes no Simulador iOS

### 1.1. Iniciar o Simulador

```bash
# Limpar cache primeiro
npm run clean

# Iniciar Metro Bundler + Simulador
npm run ios

# OU escolher dispositivo específico
npm run ios -- --simulator="iPhone 16 Pro Max"
npm run ios -- --simulator="iPhone 15"
npm run ios -- --simulator="iPhone 13"
```

**Dispositivos recomendados para testar:**
- ✅ iPhone 16 Pro Max (6.9" - tela maior)
- ✅ iPhone 15 Pro (6.1" - padrão)
- ✅ iPhone 13 (6.1" - base de mercado)
- ✅ iPhone SE (4.7" - tela pequena, crítico)

### 1.2. Fluxo de Autenticação (Completo)

#### Login
- [ ] **Tela aparece** sem crash
- [ ] **Formulário funcional**: e-mail + senha
- [ ] **Validação client-side**: e-mail inválido → erro
- [ ] **Login válido** → vai para NotificationPermissionScreen
- [ ] **Login inválido** → mensagem de erro amigável
- [ ] **Offline**: mostra banner "Sem conexão" no topo

**Casos especiais:**
```bash
# Testar com dev bypass (pula auth)
# Adicione no .env.local:
EXPO_PUBLIC_DEV_BYPASS=true
```

#### Permissão de Notificações
- [ ] **Prompt iOS** aparece corretamente
- [ ] **Permitir** → marca setup done, vai para onboarding
- [ ] **Negar** → ainda vai para onboarding (gracioso)
- [ ] **Polling funciona**: detecta mudança em ~500ms

**⚠️ SIMULADOR:**
- Notificações push retornam `"simulator-mode"` (esperado)
- Teste push real só em dispositivo físico

#### Onboarding (6 steps)
- [ ] **Step 1: Welcome** → mostra logo + título
- [ ] **Step 2: Name** → input funcional + validação
- [ ] **Step 3: Stage** → seletor (Tentante/Gestante/Mãe)
- [ ] **Step 4: Date** → date picker funcionando
- [ ] **Step 5: Interests** → multi-select de interesses
- [ ] **Step 6: Complete** → botão final ativo
- [ ] **Navegação** back/forward funcionando
- [ ] **Skip** funciona (se houver)

#### NathIA Onboarding (5 steps)
- [ ] **Fluxo completo** sem crash
- [ ] **Personalização AI** salvando preferências
- [ ] **Conclusão** → vai para MainTabs

### 1.3. Main App - Bottom Tabs (5 telas)

#### Tab 1: Home
- [x] **Layout corrigido**: Progress card em row (ring | texto | chevron) ✅
- [x] **Check-in labels**: "Cansada", "Enjoada" não quebram linha ✅
- [ ] **Check-in funcional**: clicar em mood → abre AssistantScreen com contexto
- [ ] **Progress ring**: percentual correto dos 8 habits
- [ ] **Cards de micro-ações**: pelo menos 1 card aparece
- [ ] **Scroll suave**: sem engasgo

**Validar visualmente:**
```
┌─────────────────────────────────────┐
│ [Ring 56x56] │ Cuidados de hoje    [>] │
└─────────────────────────────────────┘
```

#### Tab 2: Ciclo
- [ ] **Cycle tracker** carrega
- [ ] **Date picker** funcional
- [ ] **Sintomas** salvam corretamente
- [ ] **Gráfico** renderiza sem crash
- [ ] **DailyLog modal** abre/fecha

#### Tab 3: NathIA (Chat)
- [ ] **Empty state** aparece se sem mensagens
- [ ] **Sugestões** (chips) clicáveis
- [ ] **Input funcional**: texto + imagem
- [ ] **Mic button** aparece quando input vazio
- [ ] **Send button** aparece quando há texto
- [ ] **Mensagem enviada** → loading dots aparecem
- [ ] **Resposta da IA** chega (OpenAI ou Gemini)
- [ ] **Pre-classifier ativo**: testar mensagem "quero morrer" → responde com CVV 188 IMEDIATAMENTE (sem chamar LLM) ✅
- [ ] **Histórico persiste**: fechar app, reabrir → mensagens ainda lá
- [ ] **Scroll automático**: vai para o fim ao enviar
- [ ] **Voice player** aparece (se premium)

**Casos de teste críticos:**

| Input | Esperado |
|-------|----------|
| "Como está meu bebê?" | Resposta normal da IA |
| "Posso tomar dipirona?" | Detecta como medical → Gemini + grounding |
| "Quero morrer" | Template CVV 188 IMEDIATO (sem LLM) ✅ |
| "Não aguento mais" | Template CVV 188 IMEDIATO (sem LLM) ✅ |
| Imagem + "O que é isso?" | Claude processa imagem |

**Offline:**
- [ ] Enviar mensagem offline → erro amigável (não crash)

#### Tab 4: Comunidade
- [ ] **Posts mock carregam** (lista de ~10 posts)
- [ ] **Search** abre/fecha, filtra por texto
- [ ] **Like** funciona (contador incrementa localmente)
- [ ] **Comment** abre modal
- [ ] **Share** abre sheet iOS
- [ ] **NewPost modal**: criar post → aparece no topo como "Em revisão"
- [ ] **FlatList performance**: scroll sem engasgo (deve usar FlatList, não ScrollView)

**⚠️ Importante:**
- Comunidade é **mock/local-first** hoje (não usa Supabase)
- Posts não sincronizam entre dispositivos
- Objetivo: validar UX, não backend

#### Tab 5: Meus Cuidados
- [ ] **Tela carrega** sem crash
- [ ] **Habits tracker** (8 items) aparece
- [ ] **Check habit** → persist AsyncStorage
- [ ] **Streaks** calculam corretamente
- [ ] **Affirmations** carregam

### 1.4. Premium & IAP (Simulador: Funcionalidade Limitada)

**⚠️ CRÍTICO:** RevenueCat **NÃO funciona no simulador**. Testes reais precisam de dispositivo físico + Dev Client.

No simulador, validar apenas:
- [ ] **PaywallScreen** abre sem crash
- [ ] **Planos renderizam** (mensal/anual)
- [ ] **Botão CTA** responsivo
- [ ] **Legal links** funcionam (privacy/terms)
- [ ] **Botão "Restore"** existe

**Fallback esperado:**
```
logger.warn("RevenueCat indisponível (provável Expo Go)")
```

#### Premium Features (apenas visual no simulador)
- [ ] **Voz da NathIA**: botão aparece nas mensagens
- [ ] **Breathing exercise**: pode entrar na tela
- [ ] **Premium Gate**: bloqueia features corretamente

### 1.5. Notificações (Simulador: Apenas Locais)

```bash
# Testar notificação local
# Usar debug menu no app ou disparar via código
```

- [ ] **Local notification** aparece
- [ ] **Badge** incrementa
- [ ] **Tap** abre app na tela correta

**Push remoto:** Só testa em device físico.

### 1.6. Testes de Performance (Simulador)

```bash
# Abrir React DevTools
npm run start -- --dev-client

# No Xcode Instruments:
# Product > Profile > Time Profiler
```

**Métricas alvo:**
- [ ] **Cold start**: < 3s (do tap no ícone até Main App)
- [ ] **Hot reload**: < 500ms
- [ ] **FlatList scroll**: 60fps (sem drops)
- [ ] **Bundle size**: < 50MB (.ipa final)

### 1.7. Testes de Acessibilidade (Simulador)

**Habilitar VoiceOver:**
```
Settings > Accessibility > VoiceOver > ON
```

- [ ] **Todos os botões** têm `accessibilityLabel`
- [ ] **Tap targets**: mínimo 44pt (validar no HomeScreen)
- [ ] **Contraste**: text primary em background passa WCAG AAA
- [ ] **Dynamic Type**: aumentar texto → layout não quebra

---

## 📲 FASE 2: Testes em Dispositivo Físico (iPhone)

### 2.1. Preparar Dispositivo

**Requisitos:**
- iPhone com iOS 15+ (idealmente iOS 17+)
- Cabo USB-C ou Lightning
- Xcode instalado no Mac

**Configurar dispositivo:**
1. Settings > General > VPN & Device Management
2. Trust o certificado do desenvolvedor
3. Habilitar modo desenvolvedor (iOS 16+):
   - Settings > Privacy & Security > Developer Mode > ON

### 2.2. Build e Instalação

**Opção 1: Development Build (EAS)**
```bash
# Criar build development para iOS
eas build --profile development --platform ios

# Aguardar ~15-20min
# Baixar .ipa quando pronto
# Instalar via Apple Configurator 2 ou Xcode
```

**Opção 2: Expo Go (Limitado)**
```bash
# Instalar Expo Go da App Store
# Escanear QR code do Metro
npm start
```

**⚠️ Limitações do Expo Go:**
- RevenueCat não funciona
- Notificações push limitadas
- Algumas libs nativas não carregam

**Opção preferida:** Development Build (EAS)

### 2.3. Testes Específicos de Device

#### 2.3.1. Câmera e Galeria
- [ ] **Permissão câmera**: prompt iOS aparece
- [ ] **Capturar foto**: câmera funciona
- [ ] **Galeria**: selecionar foto funciona
- [ ] **Upload imagem** → AssistantScreen processa

#### 2.3.2. Notificações Push
- [ ] **Permissão**: prompt iOS
- [ ] **Push token** gera corretamente (não "simulator-mode")
- [ ] **Receber push**: testar via Firebase/OneSignal
- [ ] **Deep link**: tap na notificação → vai para tela certa
- [ ] **Badge**: incrementa/limpa corretamente

#### 2.3.3. RevenueCat & IAP (CRÍTICO)

**Pré-requisitos:**
1. App Store Connect app criado
2. IAP products criados (`nossa_maternidade_monthly`, `nossa_maternidade_yearly`)
3. Sandbox tester account criado
4. RevenueCat configurado com Apple App Store

**Fluxo de teste:**
```bash
# 1. Login como sandbox tester
Settings > App Store > Sandbox Account > Login

# 2. Abrir app → ir para Paywall

# 3. Verificar logs
logger.info("RevenueCat isConfigured: true")
```

- [ ] **Paywall carrega prices**: R$ 19,90/mês, R$ 99,00/ano
- [ ] **Comprar plano mensal**: prompt Apple aparece
- [ ] **Aprovar compra**: sandbox aceita
- [ ] **isPremium vira true**: features desbloqueiam
- [ ] **Restore purchases**: recupera compra anterior
- [ ] **Cancelar subscription**: via App Store → app respeita

**Testar edge cases:**
- [ ] **Compra cancelada** → volta para paywall
- [ ] **Erro de rede** → retry gracioso
- [ ] **Já tem subscription** → mostra status ativo

#### 2.3.4. Voz (ElevenLabs)

Só funciona se:
- `EXPO_PUBLIC_ELEVENLABS_API_KEY` configurado
- `EXPO_PUBLIC_ELEVENLABS_VOICE_ID` configurado
- User é premium

- [ ] **Botão play** aparece nas mensagens da NathIA
- [ ] **Clicar play**: áudio carrega
- [ ] **Playback funciona**: voz da NathIA reproduz
- [ ] **Pause/Stop** funcionam
- [ ] **Loading spinner** enquanto gera áudio

#### 2.3.5. Sensores e Haptics

- [ ] **Haptics** funcionam (vibração ao tap)
- [ ] **Giroscópio**: breathing exercise (se implementado)
- [ ] **Location** (futuro): permissão funcional

#### 2.3.6. Offline e Conectividade

**Teste de rede:**
1. Habilitar Airplane Mode
2. Abrir app
3. Tentar enviar mensagem no chat
4. Verificar banner "Sem conexão"
5. Desabilitar Airplane Mode
6. Verificar reconexão automática

- [ ] **Offline banner** aparece no topo
- [ ] **AsyncStorage persiste** (habits, check-ins, chat history)
- [ ] **Retry automático** quando volta online
- [ ] **Supabase Realtime** reconecta

### 2.4. Testes de Stress (Device)

**Memória:**
```bash
# No Xcode Instruments:
# Product > Profile > Leaks
# Usar app por 10min, verificar vazamentos
```

- [ ] **Sem memory leaks** após 10min de uso
- [ ] **App background/foreground** → não crash
- [ ] **Scroll longo** (100+ posts) → não trava

**Bateria:**
- [ ] **Uso normal** < 5% bateria/hora
- [ ] **Background**: não drena bateria

---

## 🔍 FASE 3: Smoke Tests (Checklist Rápido)

Execute este checklist em **< 5 minutos** antes de qualquer build:

```bash
# 1. Quality Gate
npm run quality-gate
# ✅ Deve passar 100%

# 2. Iniciar no simulador
npm run ios

# 3. Testar fluxo crítico (1-2-3-4-5):
```

1. **Login** → entra sem crash
2. **Onboarding** → completa 6 steps + NathIA
3. **Home** → progress card correto, check-in funciona
4. **NathIA** → enviar "Como está meu bebê?" → resposta OK
5. **Paywall** → abre sem crash

**✅ Se todos passam:** pode continuar para build production.
**❌ Se 1+ falha:** investigar antes de prosseguir.

---

## 📊 Critérios de Aprovação Final

Para considerar o app **PRONTO para TestFlight/App Store:**

### Must Have (Obrigatórios)
- [x] ✅ Quality gate 100% (typecheck + lint + build)
- [x] ✅ Zero console.log no código (só logger)
- [x] ✅ Pre-classifier de segurança ativo (CVV 188)
- [x] ✅ Design system migrado (Tokens.*)
- [ ] Fluxo de autenticação completo (Login → Onboarding → App)
- [ ] Chat NathIA funcional (AI responde, salva histórico)
- [ ] Paywall abre sem crash (prices carregam em device físico)
- [ ] Zero crashes em 10min de uso contínuo
- [ ] Funciona offline (modo gracioso, banner aparece)

### Should Have (Importantes mas não bloqueantes)
- [ ] RevenueCat completamente funcional (sandbox compras OK)
- [ ] Voz da NathIA tocando (ElevenLabs)
- [ ] Push notifications funcionando (device físico)
- [ ] TestFlight com 10+ beta testers testando
- [ ] Comunidade (mock) funcionando (like, post, comment)

### Nice to Have (Melhorias futuras, v1.1)
- [ ] Comunidade integrada com Supabase (RLS)
- [ ] Transcrição de voz (Whisper)
- [ ] Onboarding adaptativo (Tentante vs Gestante vs Mãe)

---

## 🐛 Troubleshooting Comum

### Problema: "Metro Bundler não inicia"
```bash
# Solução:
npm run clean
npm start -- --reset-cache
```

### Problema: "Simulador não abre app"
```bash
# Reset simulador:
xcrun simctl erase all
npm run ios
```

### Problema: "RevenueCat retorna isConfigured: false"
**Causa:** Está no Expo Go ou faltam env vars
**Solução:**
1. Verificar `.env.local` tem `EXPO_PUBLIC_REVENUECAT_IOS_KEY`
2. Usar Dev Client (não Expo Go)
3. Rebuild: `eas build --profile development --platform ios`

### Problema: "TypeScript errors após editar tokens.ts"
```bash
# Rebuild TypeScript:
npm run typecheck
# Se persistir: reiniciar VS Code
```

### Problema: "Notificações não aparecem em device"
1. Settings > Notifications > [App Name] → Allow
2. Verificar token gerado nos logs
3. Testar via Firebase console (send test message)

---

## 📝 Relatório de Testes (Template)

Preencher após cada sessão de testes:

```markdown
## Sessão de Testes iOS - [DATA]

**Device:** iPhone [modelo] - iOS [versão]
**Build:** Development / Production
**Testador:** [Nome]

### Resultados

#### ✅ Passou
- Login funcionando
- Chat NathIA responde
- ...

#### ⚠️ Problemas Encontrados
- [ ] Bug: [descrição] - Severidade: Alta/Média/Baixa
- [ ] Bug: [descrição] - Severidade: Alta/Média/Baixa

#### 🚫 Bloqueadores
- [ ] [Descrição do bloqueador crítico]

### Screenshots
[Anexar prints de bugs]

### Próximos Passos
- [ ] Corrigir bug X
- [ ] Re-testar Y
```

---

## 🚀 Próximos Passos Após Testes

1. **Se todos smoke tests passaram:**
   ```bash
   # Criar build production iOS
   eas build --profile production --platform ios
   ```

2. **Fazer upload para TestFlight**
   - App Store Connect → TestFlight
   - Adicionar 10-20 beta testers
   - Enviar convites

3. **Monitorar TestFlight feedback** (1-2 semanas)
   - Coletar bugs reportados
   - Iterar fixes
   - Re-deploy builds

4. **Quando estável (zero crashes, bugs críticos resolvidos):**
   - Submeter para App Store Review
   - Aguardar aprovação (1-5 dias)

5. **LANÇAMENTO 28 Janeiro 2026** 🚀
   - Coordenar com Nathália (posts 9h)
   - Monitorar analytics/crashes primeiras 48h
   - Responder reviews rapidamente

---

**📌 IMPORTANTE:** Este guia será atualizado conforme encontramos bugs/melhorias durante os testes. Sempre verificar versão mais recente em `docs/IOS_TESTING_GUIDE.md`.

---

**✨ Meta Final:** App impecável, zero crashes, experiência fluida digna de 40M followers. Não rushamos qualidade por deadline.
