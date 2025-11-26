# ⚡ Quick Start - Publicação nas Lojas

**Guia rápido para começar AGORA**

---

## 🎯 Ações Imediatas (Hoje)

### 1. Verificar Contas
```bash
# Verificar EAS
eas whoami

# Se não estiver logado:
eas login
```

**Ações:**
- [ ] Criar conta Apple Developer ($99/ano) se não tiver
- [ ] Criar conta Google Play Console ($25 única) se não tiver
- [ ] Verificar login EAS

### 2. Validar Configuração

**Arquivo:** `app.config.js`

**Verificar:**
- [ ] Bundle ID: `com.nossamaternidade.app` (único?)
- [ ] Package: `com.nossamaternidade.app` (único?)
- [ ] Versão: `1.0.0`
- [ ] Build numbers configurados

### 3. Preparar Assets Críticos

**Prioridade ALTA:**
- [ ] Ícone 1024x1024px (`assets/icon.png`)
- [ ] Splash screen (`assets/splash.png`)
- [ ] 5 screenshots iOS (1290x2796px)
- [ ] 5 screenshots Android (1080x1920px)

---

## 📋 Checklist Rápido (5 Minutos)

### Pré-Submissão
- [ ] Privacy Policy publicada (URL válida)
- [ ] Terms of Service publicados (URL válida)
- [ ] Builds de produção gerados
- [ ] Testes em dispositivos reais concluídos

### iOS App Store
- [ ] App criado no App Store Connect
- [ ] Metadados preenchidos
- [ ] Screenshots uploadados
- [ ] Demo account criada
- [ ] Submetido para revisão

### Google Play
- [ ] App criado no Google Play Console
- [ ] Data Safety form preenchido
- [ ] Screenshots uploadados
- [ ] AAB uploadado
- [ ] Publicado

---

## 🚀 Comandos Essenciais

### Builds
```bash
# Preview (teste)
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Produção
eas build --platform ios --profile production
eas build --platform android --profile production

# Submissão
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

### Validação
```bash
# Verificar configuração
eas build:configure

# Listar builds
eas build:list

# Ver status
eas build:view [BUILD_ID]
```

---

## ⏱️ Timeline Resumido

- **Semana 1:** Assets + Documentação Legal
- **Semana 2:** Builds + Testes
- **Semana 3:** Submissão + Revisão
- **Semana 4:** Ajustes + Publicação

**Total: 3-4 semanas**

---

## 📚 Documentação Completa

Ver: `STORE_PUBLICATION_PLAN.md` para guia completo e detalhado.

---

**Próximo passo:** Começar pela criação dos assets (ícone e screenshots)

