# 📸 Screenshots para App Store e Google Play

Este diretório contém os screenshots necessários para publicar o app nas lojas.

## 📁 Estrutura de Diretórios

```
assets/screenshots/
├── android/
│   ├── phone/          # Screenshots para telefones Android (1080x1920px)
│   ├── tablet-7/       # Screenshots para tablets 7" Android (1200x1920px)
│   └── tablet-10/      # Screenshots para tablets 10" Android (1600x2560px)
└── ios/
    ├── phone/          # Screenshots para iPhone (vários tamanhos)
    └── tablet/         # Screenshots para iPad (vários tamanhos)
```

---

## 🤖 Google Play Store (Android)

### 📱 Telefones (Obrigatório)

**Localização:** `assets/screenshots/android/phone/`

**Especificações:**
- **Tamanho**: 1080x1920 pixels (portrait)
- **Quantidade mínima**: 2 screenshots
- **Quantidade máxima**: 8 screenshots
- **Formato**: PNG ou JPG
- **Peso máximo**: 8MB por imagem

**Exemplo de nomes:**
```
screenshot-1.png
screenshot-2.png
screenshot-3.png
```

### 📱 Tablets 7" (Opcional)

**Localização:** `assets/screenshots/android/tablet-7/`

**Especificações:**
- **Tamanho**: 1200x1920 pixels
- **Quantidade**: 2-8 screenshots
- **Formato**: PNG ou JPG

### 📱 Tablets 10" (Opcional)

**Localização:** `assets/screenshots/android/tablet-10/`

**Especificações:**
- **Tamanho**: 1600x2560 pixels
- **Quantidade**: 2-8 screenshots
- **Formato**: PNG ou JPG

### 🎨 Feature Graphic (Obrigatório)

**Localização:** `assets/feature-graphic.png` (na raiz de `assets/`)

**Especificações:**
- **Tamanho**: 1024x500 pixels
- **Formato**: PNG ou JPG
- **Peso máximo**: 15MB

---

## 🍎 App Store (iOS)

### 📱 iPhone (Obrigatório)

**Localização:** `assets/screenshots/ios/phone/`

**Tamanhos necessários (pelo menos um):**

| Dispositivo | Tamanho (pixels) | Nome do arquivo |
|-------------|------------------|-----------------|
| iPhone 6.7" (Pro Max) | 1290x2796 | screenshot-iphone-67.png |
| iPhone 6.5" (Pro Max) | 1284x2778 | screenshot-iphone-65.png |
| iPhone 6.1" (Pro) | 1179x2556 | screenshot-iphone-61.png |
| iPhone 5.5" (Plus) | 1242x2208 | screenshot-iphone-55.png |

**Especificações:**
- **Quantidade mínima**: 1 screenshot por tamanho de tela
- **Quantidade máxima**: 10 screenshots por tamanho
- **Formato**: PNG ou JPG
- **Peso máximo**: 500MB total

### 📱 iPad (Opcional mas recomendado)

**Localização:** `assets/screenshots/ios/tablet/`

**Tamanhos:**

| Dispositivo | Tamanho (pixels) | Nome do arquivo |
|-------------|------------------|-----------------|
| iPad Pro 12.9" | 2048x2732 | screenshot-ipad-129.png |
| iPad Pro 11" | 1668x2388 | screenshot-ipad-11.png |
| iPad 10.2" | 1620x2160 | screenshot-ipad-102.png |

---

## 📝 Como Capturar Screenshots

### Opção 1: Simulador/Emulador

**Android:**
```bash
# Inicie o app no emulador
npm run android

# Capture screenshots manualmente ou use:
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png assets/screenshots/android/phone/
```

**iOS:**
```bash
# Inicie o app no simulador
npm run ios

# Capture screenshots manualmente (Cmd+S no simulador)
# Ou use: xcrun simctl io booted screenshot screenshot.png
```

### Opção 2: Dispositivo Real

1. Execute o app no dispositivo
2. Navegue até a tela que quer capturar
3. Capture o screenshot (botões de volume + power no Android, ou botões laterais no iOS)
4. Transfira para o computador
5. Redimensione se necessário e coloque na pasta correta

### Opção 3: Ferramentas Online

- [App Store Screenshot Generator](https://www.appstorescreenshot.com/)
- [Screenshot.rocks](https://screenshot.rocks/)
- [Mockuphone](https://mockuphone.com/)

---

## ✅ Checklist de Screenshots

### Google Play (Mínimo necessário)

- [ ] 2+ screenshots em `android/phone/` (1080x1920px)
- [ ] Feature graphic em `assets/feature-graphic.png` (1024x500px)

### App Store (Mínimo necessário)

- [ ] 1+ screenshot em `ios/phone/` para pelo menos um tamanho de iPhone
- [ ] Screenshots mostram funcionalidades principais do app

### Recomendado (Melhor experiência)

- [ ] 4-6 screenshots mostrando diferentes funcionalidades
- [ ] Screenshots para múltiplos tamanhos de tela (iOS)
- [ ] Screenshots para tablets (opcional mas recomendado)
- [ ] Texto explicativo nas imagens (opcional)

---

## 🎨 Dicas de Design

1. **Mostre funcionalidades principais:**
   - Tela inicial/Home
   - Chat com IA
   - Comunidade
   - Hábitos/Tracking
   - Mundo Nath (conteúdo)

2. **Mantenha consistência:**
   - Use o mesmo estilo visual
   - Mesma paleta de cores
   - Mesmo nível de zoom/posição

3. **Adicione contexto (opcional):**
   - Textos explicativos curtos
   - Destaques de funcionalidades
   - Não exagere - menos é mais

4. **Teste antes de enviar:**
   - Visualize em diferentes dispositivos
   - Verifique se textos estão legíveis
   - Confirme que imagens estão nítidas

---

## 📦 Como Usar nos Builds

Os screenshots não são incluídos automaticamente no build. Você precisa:

1. **Google Play:**
   - Fazer upload manualmente no Google Play Console
   - Ou usar `eas submit` que pode fazer upload automático (se configurado)

2. **App Store:**
   - Fazer upload manualmente no App Store Connect
   - Ou usar `eas submit` que pode fazer upload automático (se configurado)

**Nota:** O EAS Submit pode fazer upload automático dos screenshots se você configurar no `eas.json`, mas o método mais comum é fazer upload manual no console de cada loja.

---

## 🔍 Validação

O script `check-ready.sh` / `check-ready.ps1` verifica:
- ✅ Se a pasta `assets/screenshots/` existe
- ⚠️ Se há screenshots (recomenda pelo menos 3)

Execute para validar:
```bash
npm run check-ready
```

---

**Última atualização:** 2025-01-27
