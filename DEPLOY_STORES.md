# 🚀 Guia de Deploy para App Store e Google Play

**Repositório Oficial:** `NossaMaternidadeMelhor`

Este documento contém o checklist e comandos essenciais para fazer build e submeter o app nas lojas.

---

## ✅ Checklist Pré-Build

Antes de fazer qualquer build, execute:

**Recomendado (via npm):**
```bash
# Funciona em qualquer sistema, desde que esteja no diretório do projeto
npm run check-ready
```

**Windows (PowerShell) - Alternativa:**
```powershell
# Navegue até o diretório do projeto
cd C:\Users\User\Documents\NossaMaternidade\NossaMaternidadeMelhor

# Execute o script
pwsh -File scripts/check-ready.ps1
```

**Linux/Mac (Bash) - Alternativa:**
```bash
bash scripts/check-ready.sh
```

O script verifica:
- ✅ `app.json` e `eas.json` configurados
- ✅ `.env.example` existe
- ✅ `.env` configurado (não commitado)
- ✅ Assets obrigatórios (icon.png, splash.png)
- ✅ Screenshots para lojas
- ✅ README atualizado

**Se o script falhar, corrija os itens marcados como ❌ antes de continuar.**

---

## 📦 Builds

### Preview (Teste Interno)

Build para testar em dispositivos reais antes de publicar:

```bash
# Android
eas build --profile preview --platform android

# iOS
eas build --profile preview --platform ios

# Ambos
eas build --profile preview --platform all
```

**Quando usar:**
- Testar funcionalidades novas
- Validar com beta testers
- Verificar performance em device real

**Resultado:** APK (Android) ou IPA (iOS) para instalação direta

---

### Production (Lojas)

Build otimizado para publicação nas lojas:

```bash
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios

# Ambos
eas build --profile production --platform all
```

**Quando usar:**
- Quando estiver pronto para publicar
- Após todos os testes passarem
- Versão estável e validada

**Resultado:** AAB (Android) ou IPA (iOS) pronto para submissão

---

## 📤 Submissão para Lojas

### Google Play Store

```bash
# Submeter build Android
eas submit --profile production --platform android
```

**Pré-requisitos:**
- Conta Google Play Console criada ($25 único)
- App criado no console
- Service account configurado (opcional, para automação)

**Processo:**
1. Build production concluído
2. Execute `eas submit`
3. Siga instruções no console
4. Preencha informações da loja (descrição, screenshots, etc.)
5. Envie para revisão

---

### Apple App Store

```bash
# Submeter build iOS
eas submit --profile production --platform ios
```

**Pré-requisitos:**
- Conta Apple Developer ($99/ano)
- App criado no App Store Connect
- Certificados e provisioning profiles configurados (EAS gerencia automaticamente)

**Processo:**
1. Build production concluído
2. Execute `eas submit`
3. Siga instruções no console
4. Preencha informações da loja
5. Envie para revisão (pode levar 1-3 dias)

---

## 🔧 Comandos Úteis

### Ver builds em andamento

```bash
eas build:list
```

### Ver detalhes de um build

```bash
eas build:view [BUILD_ID]
```

### Cancelar build

```bash
eas build:cancel [BUILD_ID]
```

### Atualizar app (OTA Update)

```bash
eas update --branch production --message "Correção de bugs"
```

**Nota:** OTA updates funcionam apenas para mudanças em JavaScript/TypeScript. Mudanças nativas requerem novo build.

---

## 🐛 Troubleshooting

### Build falha com erro de assets

```bash
# Verificar assets
ls -la assets/icon.png
ls -la assets/splash.png

# Verificar dimensões (requer ImageMagick)
identify assets/icon.png  # Deve ser 1024x1024
```

### Build falha com erro de variáveis de ambiente

```bash
# Verificar .env
cat .env

# Verificar se variáveis estão corretas
grep EXPO_PUBLIC_ .env
```

### Build iOS falha com certificados

- EAS gerencia certificados automaticamente
- Se falhar, verifique Apple Developer account
- Execute: `eas credentials` para gerenciar manualmente

### Build Android falha com package name

- Verifique `app.json` → `android.package`
- Deve ser único e seguir formato: `com.nossamaternidade.app`
- Não pode ter maiúsculas ou caracteres especiais

---

## 📋 Checklist Final Antes de Submeter

### Android

- [ ] Build production concluído com sucesso
- [ ] App testado em dispositivo real
- [ ] Screenshots adicionados (mínimo 2, recomendado 5+)
- [ ] Descrição curta e completa escritas
- [ ] Ícone e feature graphic prontos
- [ ] Política de privacidade configurada
- [ ] Data Safety preenchida (Google Play)
- [ ] Categoria selecionada corretamente

### iOS

- [ ] Build production concluído com sucesso
- [ ] App testado em dispositivo real
- [ ] Screenshots para todos os tamanhos de tela
- [ ] Descrição e keywords configuradas
- [ ] Ícone e splash screen prontos
- [ ] Política de privacidade configurada
- [ ] Categoria selecionada corretamente
- [ ] Age rating configurado

---

## 🎯 Próximos Passos Após Submissão

1. **Aguardar revisão**
   - Google Play: 1-7 dias (geralmente 1-2 dias)
   - App Store: 1-3 dias (pode levar mais)

2. **Monitorar status**
   - Google Play Console
   - App Store Connect

3. **Responder feedback** (se necessário)
   - Revisores podem pedir ajustes
   - Responda rapidamente

4. **Publicar**
   - Após aprovação, publique manualmente ou configure publicação automática

---

## 📚 Referências

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)

---

**Última atualização:** 2025-01-27  
**Versão:** 1.0

