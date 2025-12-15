# ✅ Checklist de Deploy - Nossa Maternidade

Este checklist garante que tudo está pronto antes de submeter o app para as lojas.

## 🔧 Configuração Técnica

### Arquivos de Configuração

- [x] `app.json` configurado com bundle IDs corretos
- [x] `eas.json` configurado com perfis de build
- [x] `env.template` criado para documentação
- [ ] `.env` configurado localmente (não commitado)
- [ ] Secrets configurados no EAS Build

### Assets Visuais

- [x] `assets/icon.png` (1024×1024px)
- [x] `assets/splash.png`
- [x] `assets/adaptive-icon.png` (Android)
- [ ] Screenshots iOS (mínimo 3 por tamanho)
  - [ ] iPhone 6.7" (1290×2796px)
  - [ ] iPhone 6.5" (1284×2778px)
  - [ ] iPhone 5.5" (1242×2208px)
- [ ] Screenshots Android (mínimo 2)
  - [ ] Phone (1080×1920px)
- [ ] Feature Graphic Android (1024×500px)

## 🔐 Segurança e Variáveis

### Secrets no EAS

```bash
# Configurar via CLI
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_GROK_API_KEY --value "..."

# Verificar
eas secret:list
```

- [ ] Todos os secrets obrigatórios configurados
- [ ] Feature flags configuradas (opcional)

## 🧪 Testes

### Testes em Dispositivos

- [ ] Testado em dispositivo iOS real (iPhone)
- [ ] Testado em dispositivo Android real
- [ ] Testado em diferentes tamanhos de tela
- [ ] Testado dark mode
- [ ] Testado modo offline (quando aplicável)

### Funcionalidades

- [ ] Login/autenticação funcionando
- [ ] Onboarding completo funcionando
- [ ] Chat com IA funcionando
- [ ] Comunidade (posts, comentários) funcionando
- [ ] Hábitos/tracking funcionando
- [ ] Notificações push (se implementado)
- [ ] Navegação fluida sem crashes

### Qualidade

- [ ] Sem erros no console
- [ ] Sem warnings críticos
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] ESLint sem erros críticos (`npm run lint`)
- [ ] Performance aceitável (< 3s startup)

## 📱 Configuração das Lojas

### iOS (App Store Connect)

- [ ] Conta Apple Developer ativa
- [ ] App criado no App Store Connect
- [ ] Bundle ID configurado: `com.nossamaternidade.app`
- [ ] Metadata preenchida:
  - [ ] Nome: "Nossa Maternidade"
  - [ ] Subtítulo: "Apoio emocional para mães"
  - [ ] Descrição completa
  - [ ] Keywords
  - [ ] Categoria: Saúde e Fitness
  - [ ] Classificação etária: 17+
- [ ] Screenshots adicionados
- [ ] Privacy Policy URL configurada
- [ ] Support URL configurada

### Android (Google Play Console)

- [ ] Conta Google Play Console criada
- [ ] App criado no Play Console
- [ ] Package name configurado: `com.nossamaternidade.app`
- [ ] Metadata preenchida:
  - [ ] Nome: "Nossa Maternidade"
  - [ ] Descrição curta
  - [ ] Descrição completa
  - [ ] Categoria: Saúde e Fitness
  - [ ] Classificação: PEGI 3
- [ ] Feature Graphic adicionado
- [ ] Screenshots adicionados
- [ ] Data Safety preenchido
- [ ] Privacy Policy URL configurada

## 📋 Conformidade Legal

### LGPD (Brasil)

- [ ] Privacy Policy criada e hospedada
- [ ] Terms of Service criados e hospedados
- [ ] Consentimento granular no onboarding
- [ ] Direito ao esquecimento implementado
- [ ] Exportação de dados implementada

### Disclaimer Médico

- [ ] Aviso visível: "Este app não substitui consulta médica"
- [ ] Disclaimer em respostas da IA
- [ ] Avisos em conteúdo de saúde

## 🚀 Build e Submissão

### Build de Produção

```bash
# Verificar prontidão
./scripts/check-build-ready.sh

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production
```

- [ ] Build iOS bem-sucedida
- [ ] Build Android bem-sucedida
- [ ] Build testada antes de submeter

### Submissão

```bash
# Submit iOS
eas submit --platform ios

# Submit Android
eas submit --platform android
```

- [ ] iOS submetido para review
- [ ] Android submetido para review
- [ ] Informações de contato atualizadas

## ✅ Validação Final

Antes de submeter, execute:

```bash
# 1. Verificar tipos
npm run typecheck

# 2. Verificar lint
npm run lint

# 3. Verificar prontidão
./scripts/check-build-ready.sh

# 4. Testar build localmente (opcional)
eas build --platform android --profile preview --local
```

## 📞 Suporte e Monitoramento

### Pós-Deploy

- [ ] Monitoramento de crashes configurado (ex: Sentry)
- [ ] Analytics configurado (se aplicável)
- [ ] Email de suporte configurado
- [ ] Canal de feedback implementado

### Documentação

- [x] `DEPLOY_STORES.md` criado
- [x] `SECRETS_SETUP.md` criado
- [x] `env.template` criado
- [ ] README atualizado com instruções

## 🎯 Status Final

**Data do Checklist:** _______________

**Responsável:** _______________

**Pronto para Deploy:**
- [ ] Sim
- [ ] Não (motivo: _______________)

---

**Última atualização:** 2025

