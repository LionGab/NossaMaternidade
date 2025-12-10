# CHECKLIST FINAL DE DEPLOY - Nossa Maternidade

**Branch:** `release/store-deployment-v1`
**Data:** 2025-12-10
**Status:** 🟡 Pronto para completar assets e deploy

---

## ✅ O QUE JÁ ESTÁ PRONTO

### Código e Configuração (100%)
- ✅ **app.config.js** - Configurado perfeitamente
- ✅ **eas.json** - Perfis de build prontos
- ✅ **package.json** - Scripts de deploy configurados
- ✅ **Permissões** - iOS e Android bem documentadas
- ✅ **Icons e splash** - Assets básicos prontos
- ✅ **Deep linking** - Configurado
- ✅ **Tokens privados removidos** - Segurança OK
- ✅ **Privacy Manifest iOS 17+** - Configurado
- ✅ **Data Safety (Google)** - Documentado em `docs/data-safety-google-play.md`
- ✅ **Políticas legais** - Textos completos em:
  - `docs/PRIVACY_POLICY.md`
  - `docs/TERMS_OF_SERVICE.md`
  - `docs/MEDICAL_DISCLAIMER.md`

### CodeModeExecutor (Verificado)
- ✅ **Análise:** Usa `new Function()` mas:
  - Apenas em código MCP (infra, não bundle do app)
  - NÃO usado em screens ou components
  - Para Docker sandbox (funcionalidade avançada)
- ✅ **Conclusão:** OK para produção - não afeta o app

---

## 🔴 BLOQUEADORES CRÍTICOS (Você precisa fazer)

### 1. SCREENSHOTS (CRÍTICO - 2-3 horas)

**Por quê?** Lojas rejeitam sem screenshots.

**O quê fazer:**

#### iOS - Mínimo 3 tamanhos:

```bash
# 1. Abrir simulador iPhone
npx expo start --ios

# 2. Escolher simuladores:
# - iPhone 15 Pro Max (6.7")
# - iPhone 14 Pro (6.1")
# - iPhone 8 Plus (5.5")

# 3. Capturar telas importantes (Cmd+S):
# - Home Screen (check-in emocional)
# - Chat IA (conversa com MãesValente)
# - Comunidade (feed de posts)
# - Hábitos (tracking)
# - Mundo Nath (conteúdo educacional)

# 4. Salvar em:
assets/screenshots/ios/phone/
```

**Resoluções necessárias:**
- iPhone 6.7": 1290x2796px (3 screenshots mínimo)
- iPhone 6.5": 1284x2778px (3 screenshots mínimo)
- iPhone 5.5": 1242x2208px (3 screenshots - opcional)

#### Android - 1080x1920 (mín 2, máx 8):

```bash
# 1. Abrir emulador Android
npx expo start --android

# 2. Criar AVD se não existir:
# Device: Pixel 7 Pro
# Resolution: 1080x2400

# 3. Capturar (Print Screen no Android Studio)

# 4. Redimensionar para 1080x1920

# 5. Salvar em:
assets/screenshots/android/phone/
```

**Telas recomendadas (mesmas 5):**
1. `01-home.png` - Home Screen
2. `02-chat-ia.png` - Chat IA
3. `03-comunidade.png` - Comunidade
4. `04-habitos.png` - Hábitos
5. `05-mundo-nath.png` - Mundo Nath

**Ferramentas para redimensionar:**
- macOS: Preview (Tools → Adjust Size)
- Windows: Paint / Photoshop / GIMP
- Online: https://www.iloveimg.com/resize-image

---

### 2. FEATURE GRAPHIC ANDROID (CRÍTICO - 1 hora)

**Por quê?** Google Play exige.

**O quê fazer:**

```bash
# Tamanho: 1024x500px
# Formato: PNG ou JPEG

# Opções:
# A) Figma/Canva - Templates prontos "Feature Graphic"
# B) Photoshop - Criar do zero
# C) Contratar no Fiverr ($5-15)

# Conteúdo sugerido:
# - Logo "Nossa Maternidade" à esquerda
# - Tagline: "Apoio emocional para mães" ao centro
# - 2-3 screenshots do app à direita
# - Cores: Rosa (#EC4899) + gradiente

# Salvar em:
assets/feature-graphic.png
```

**Exemplo de busca no Canva:**
"Mobile app feature graphic template"

---

### 3. PUBLICAR POLÍTICAS ONLINE (CRÍTICO - 1 hora)

**Por quê?** Lojas exigem URL pública de Privacy Policy.

**OPÇÃO A - GitHub Pages (GRÁTIS, mais rápido):**

```bash
# 1. Criar repositório público
gh repo create nossa-maternidade-policies --public

# 2. Converter MD para HTML
cd docs/
# Copiar PRIVACY_POLICY.md
# Converter com: https://markdowntohtml.com/

# 3. Criar index.html e terms.html

# 4. Push e habilitar Pages
git add index.html terms.html
git commit -m "docs: adiciona políticas públicas"
git push origin main

# 5. Settings → Pages → Source: main branch

# 6. URL será: https://<seu-usuario>.github.io/nossa-maternidade-policies/
```

**OPÇÃO B - Vercel/Netlify (GRÁTIS, melhor):**

```bash
# 1. Criar pasta nova
mkdir nossa-maternidade-policies
cd nossa-maternidade-policies

# 2. Criar site Next.js simples
npx create-next-app@latest . --typescript --tailwind --app

# 3. Criar páginas:
# - app/privacy/page.tsx
# - app/terms/page.tsx

# 4. Deploy
vercel deploy --prod

# 5. Configurar domínio (se tiver):
# nossamaternidade.com.br/privacy
# nossamaternidade.com.br/terms
```

**DEPOIS:** Adicionar URLs no `app.config.js`:

```javascript
extra: {
  privacyPolicyUrl: 'https://sua-url.vercel.app/privacy',
  termsOfServiceUrl: 'https://sua-url.vercel.app/terms',
}
```

---

### 4. CRIAR CONTA DE TESTE (CRÍTICO - 30 min)

**Por quê?** Reviewers precisam testar o app.

**O quê fazer:**

```bash
# 1. Ir para Supabase Dashboard
# URL: https://supabase.com/dashboard/project/<seu-projeto>

# 2. Authentication → Users → Add User

# 3. Preencher:
Email: reviewer@nossamaternidade.com
Password: TestReview2025!
Email Confirm Status: Confirmed (marcar)

# 4. Popular com dados de exemplo:
# - Criar perfil completo
# - Postar 2-3 mensagens na comunidade
# - Adicionar alguns hábitos
# - Fazer 1 conversa com a IA (chat)

# 5. Documentar credenciais em REVIEWER_NOTES.md (próximo passo)
```

---

### 5. CRIAR REVIEWER_NOTES.md (RECOMENDADO - 20 min)

**Por quê?** Acelera aprovação nas lojas.

```bash
# Criar arquivo:
touch docs/REVIEWER_NOTES.md
```

**Conteúdo:**

```markdown
# Notas para Reviewers - Nossa Maternidade

## 🔐 Credenciais de Teste

**Email:** reviewer@nossamaternidade.com
**Senha:** TestReview2025!

Esta conta tem acesso completo a todas as funcionalidades do app com dados de exemplo.

---

## 🎯 Principais Funcionalidades

### 1. Chat IA (MãesValente)
- **Onde:** Tab "Chat" na navegação inferior
- **O quê:** Assistente virtual para apoio emocional
- **Como testar:** Digite "Estou me sentindo ansiosa" e veja a resposta

### 2. Comunidade
- **Onde:** Tab "Comunidade"
- **O quê:** Feed social para mães compartilharem experiências
- **Como testar:** Veja posts existentes, comente, crie um post novo (opcional)

### 3. Hábitos
- **Onde:** Tab "Hábitos"
- **O quê:** Rastreamento de sono, humor, exercícios, água
- **Como testar:** Adicione um novo registro de humor

### 4. Mundo Nath
- **Onde:** Tab "Início" → Card "Mundo Nath"
- **O quê:** Feed de conteúdo educacional (vídeos, áudios, artigos)
- **Como testar:** Navegue pelo feed e abra um conteúdo

---

## 🔔 Permissões Necessárias

Todas as permissões são **OPCIONAIS** e solicitadas apenas quando necessárias:

- **📷 Câmera:** Para tirar fotos e compartilhar na comunidade
- **🖼️ Galeria:** Para escolher fotos existentes
- **📍 Localização:** Para conectar com mães próximas (futura funcionalidade)
- **🔔 Notificações:** Para lembretes de hábitos e avisos da comunidade

**Pode recusar todas** - o app funcionará normalmente.

---

## ⚕️ Aviso Médico Importante

**Este app NÃO substitui atendimento médico profissional.**

É apenas uma ferramenta de **apoio emocional** e **organização de rotina** para mães.

Em caso de emergência:
- SAMU: 192
- CVV (saúde mental): 188
- Procure um pronto-socorro

---

## 📱 Fluxo de Teste Sugerido

1. **Login** com as credenciais acima
2. **Home:** Veja o dashboard e check-in emocional
3. **Chat IA:** Converse com a assistente virtual
4. **Comunidade:** Navegue pelos posts
5. **Hábitos:** Adicione um registro
6. **Mundo Nath:** Explore conteúdo educacional

**Tempo estimado:** 10-15 minutos

---

## 📧 Contato

**Suporte:** contato@nossaMATERNIDADE.app
**DPO (Privacidade):** privacy@nossaMATERNIDADE.app

Qualquer dúvida, estamos à disposição!
```

**Salvar** e adicionar ao commit.

---

### 6. DEFINIR AGE RATING (CRÍTICO - 5 min)

**Por quê?** Lojas exigem classificação etária.

**Recomendação baseada na análise:**

| Loja | Rating | Motivo |
|------|--------|--------|
| **App Store** | **12+** | Medical/Treatment Information (Infrequent/Mild) |
| **Google Play** | **Everyone (PEGI 3)** | Com disclosure "Health Information" |

**Por que NÃO 18+?**
- App é ferramenta de apoio (não tem conteúdo sexual/violento)
- Mães adolescentes (16-17 anos) também precisam de suporte
- Rating 18+ reduz MUITO a audiência potencial

**Onde configurar:**

**App Store Connect:**
- Durante submit: Content Rights → App Age Rating
- Selecionar: 12+
- Motivos: Medical/Treatment Information

**Google Play Console:**
- Durante setup: Content rating questionnaire
- Selecionar: Everyone
- Marcar: "Contains health/medical information"

---

## 🟡 AÇÕES RECOMENDADAS (Não bloqueantes)

### 7. ATUALIZAR EAS CLI (5 min)

**Por quê?** Versão 12.6.2 instalada vs 16.28.0 disponível.

```bash
npm install -g eas-cli@latest

# Verificar
eas --version
# Deve mostrar: 16.28.0
```

---

### 8. ATUALIZAR SHA256 FINGERPRINT (10 min)

**Por quê?** Deep links Android funcionarem corretamente.

```bash
# 1. Obter fingerprint real
eas credentials --platform android

# 2. Copiar "SHA-256 Fingerprint"

# 3. Editar arquivo
code .well-known/assetlinks.json

# 4. Substituir placeholder por SHA256 real

# 5. Commit
git add .well-known/assetlinks.json
git commit -m "fix: atualiza SHA256 fingerprint para deep links"
```

---

### 9. CONFIGURAR CREDENCIAIS DE DEPLOY

**Depois de ter contas criadas:**

#### Apple Developer Account ($99/ano)

```bash
# 1. Criar app no App Store Connect
# 2. Obter IDs:
# - Apple Team ID: ABCD123456
# - ASC App ID: 1234567890

# 3. Editar eas.json (linha ~95):
"submit": {
  "production": {
    "ios": {
      "ascAppId": "1234567890",      // SEU APP ID REAL
      "appleTeamId": "ABCD123456"    // SEU TEAM ID REAL
    }
  }
}

# 4. Configurar certificados
eas credentials --platform ios
```

#### Google Play Developer Account ($25 pagamento único)

```bash
# 1. Criar app no Google Play Console

# 2. API Access → Create Service Account
# Seguir: https://docs.expo.dev/submit/android/#optional-create-a-google-service-account

# 3. Baixar JSON e salvar na raiz:
google-play-service-account.json

# 4. Verificar que está no .gitignore (linha 41)
# ✅ Já está: "google-play-service-account.json"
```

---

## 🚀 COMANDOS DE DEPLOY

### Build Preview (Testar primeiro!)

```bash
# iOS
npm run build:preview -- --platform ios

# Android
npm run build:preview -- --platform android

# Ambos
npm run build:preview
```

**Tempo:** 15-30 minutos (cloud build)

**Depois:** Testar em device real via EAS Build download.

---

### Build Production (Final)

```bash
# ANTES: Garantir que tudo está commitado
git status

# Commitar mudanças
git add .
git commit -m "chore: prepara release v1.0.0 para stores"
git push origin release/store-deployment-v1

# Build iOS
npm run build:ios

# Build Android
npm run build:android

# OU ambos
npm run build:production
```

**Tempo:** 20-40 minutos (cloud build)

---

### Submit para Stores

```bash
# iOS (App Store)
npm run submit:ios

# Android (Google Play)
npm run submit:android

# Ambos
npm run submit:all
```

**Depois do submit:**

1. **App Store Connect:**
   - Preencher metadata (descrição, keywords, categoria)
   - Upload de screenshots (arrastar para os campos)
   - Preencher App Privacy details
   - Submit for Review

2. **Google Play Console:**
   - Preencher Store Listing (descrição, screenshots)
   - Content Rating questionnaire
   - Data Safety section
   - Submit for Review

**Tempo de review:**
- Apple: 1-3 dias úteis
- Google: 1-7 dias úteis

---

## 📋 CHECKLIST COMPLETO

### ANTES DE BUILDAR

- [ ] Screenshots criados (5 telas × 3 tamanhos iOS + 1 Android)
- [ ] Feature graphic Android criado (1024×500px)
- [ ] Privacy Policy publicada online
- [ ] Terms of Service publicados online
- [ ] URLs adicionadas ao app.config.js
- [ ] Conta de teste criada (reviewer@nossamaternidade.com)
- [ ] REVIEWER_NOTES.md criado
- [ ] Age rating definido (12+ / Everyone)
- [ ] EAS CLI atualizado
- [ ] SHA256 atualizado (se tiver)
- [ ] .env criado com Supabase e Gemini keys
- [ ] Git: tudo commitado

### CONTAS NECESSÁRIAS

- [ ] Apple Developer Account ($99/ano) - [Criar](https://developer.apple.com)
- [ ] Google Play Developer Account ($25 único) - [Criar](https://play.google.com/console/signup)
- [ ] App criado no App Store Connect
- [ ] App criado no Google Play Console
- [ ] Service Account JSON baixado (Google)

### BUILDS

- [ ] Build preview testado (iOS)
- [ ] Build preview testado (Android)
- [ ] Build production iOS finalizado
- [ ] Build production Android finalizado

### SUBMISSÃO

- [ ] iOS: Metadata preenchida no App Store Connect
- [ ] iOS: Screenshots uploaded
- [ ] iOS: Privacy details completos
- [ ] iOS: Submitted for review
- [ ] Android: Store Listing completo
- [ ] Android: Content Rating feito
- [ ] Android: Data Safety completo
- [ ] Android: Submitted for review

---

## 🎯 RESUMO EXECUTIVO

### TEMPO TOTAL ESTIMADO

| Fase | Tempo |
|------|-------|
| Screenshots | 2-3h |
| Feature Graphic | 1h |
| Publicar políticas | 1h |
| Conta teste + notas | 45min |
| Criar contas stores | 2h |
| Configurar credenciais | 1h |
| Build + teste | 2h |
| Submit + metadata | 2-3h |
| **TOTAL** | **12-14 horas** |

### CUSTO

| Item | Valor |
|------|-------|
| Apple Developer | $99/ano |
| Google Play | $25 (único) |
| **TOTAL** | **$124** |

### PRIORIDADE DE EXECUÇÃO

1. 🔴 **AGORA** (sem isso não pode submeter):
   - Screenshots
   - Feature graphic
   - Publicar políticas online
   - Conta de teste

2. 🟡 **ANTES DE BUILDAR**:
   - Criar contas stores
   - Configurar credenciais
   - Age rating

3. 🟢 **NO DIA DO DEPLOY**:
   - Build production
   - Submit
   - Preencher metadata

---

## 📞 SUPORTE

**Documentação EAS:**
- Build: https://docs.expo.dev/build/introduction/
- Submit: https://docs.expo.dev/submit/introduction/
- Credentials: https://docs.expo.dev/app-signing/app-credentials/

**Problemas comuns:**
- Build failing? Ver `docs/TROUBLESHOOTING.md`
- Permissions issues? Ver `docs/APP_STORES_CHECKLIST.md`
- Compliance? Ver `docs/DEPLOYMENT_READINESS_CHECKLIST.md`

**Contato:**
- GitHub Issues: https://github.com/LionGab/NossaMaternidade/issues
- Email: eugabrielmktd@gmail.com

---

**Criado:** 2025-12-10 por Claude Code
**Branch:** `release/store-deployment-v1`
**Versão:** 1.0.0
