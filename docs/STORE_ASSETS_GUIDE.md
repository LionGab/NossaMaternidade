# 📸 Guia de Assets para App Store e Google Play Store

**Aplicativo:** Nossa Maternidade  
**Versão:** 1.0.0  
**Data:** Novembro 2024

---

## 🎯 Visão Geral

Este documento detalha **todos os assets visuais necessários** para publicar o app Nossa Maternidade na App Store (iOS) e Google Play Store (Android).

**Status Atual:**
- ✅ Ícones básicos criados
- ✅ Splash screen criado
- ❌ **FALTANDO: Screenshots para as lojas**
- ❌ **FALTANDO: Feature Graphic (Android)**
- ❌ **FALTANDO: Promotional artwork**

---

## 📱 1. ÍCONES

### 1.1 App Icon (iOS e Android)
**Status:** ✅ Criado

**Arquivo Atual:**
- `assets/icon.png` (1024x1024px)

**Requisitos:**
- ✅ Tamanho: 1024x1024px
- ✅ Formato: PNG (sem transparência)
- ✅ Cantos: Quadrados (iOS aplica arredondamento automaticamente)
- ✅ Design: Logo centralizado, fundo sólido

**Checklist:**
- [x] Visível em tamanho pequeno (60x60px)
- [x] Sem texto pequeno ou detalhes finos
- [x] Cores atraentes e reconhecíveis
- [x] Representa bem o app

---

### 1.2 Adaptive Icon (Android)
**Status:** ✅ Criado

**Arquivo Atual:**
- `assets/adaptive-icon.png` (1024x1024px)

**Requisitos Android:**
- ✅ Foreground layer: Logo/ícone
- ✅ Background color: `#0D5FFF` (azul primário)
- ✅ Safe zone: Elementos importantes dentro de círculo central (66% do tamanho)

**Formas suportadas:**
- Círculo (Samsung)
- Quadrado arredondado (Google Pixel)
- Squircle (OnePlus)
- Teardrop (alguns fabricantes)

---

### 1.3 Notification Icon (Android)
**Status:** ✅ Criado

**Arquivo:**
- `assets/notification-icon.png`

**Requisitos:**
- Monocromático (branco transparente)
- Tamanho: 96x96px
- Formato: PNG com transparência

---

### 1.4 Favicon (Web - Opcional)
**Status:** ✅ Criado

**Arquivo:**
- `assets/favicon.png` (192x192px)

---

## 🖼️ 2. SCREENSHOTS (CRÍTICO - FALTANDO!)

### 2.1 App Store (iOS)

**OBRIGATÓRIO: Mínimo 3 screenshots por tamanho de tela**

#### Tamanhos Requeridos:

| Dispositivo | Resolução | Orientação |
|------------|-----------|-----------|
| iPhone 6.7" | **1290 × 2796 px** | Portrait |
| iPhone 6.5" | **1284 × 2778 px** | Portrait |
| iPhone 5.5" | **1242 × 2208 px** | Portrait |
| iPad Pro 12.9" | 2048 × 2732 px | Portrait |
| iPad Pro 11" | 1668 × 2388 px | Portrait |

**Nota:** iPhone 6.7" e 6.5" são os mais importantes (modelos recentes).

#### Telas a Capturar:

**Screenshot 1 - Onboarding/Welcome**
- Primeira impressão do app
- Mostra valor principal
- Texto: "Sua jornada maternal com IA e comunidade"

**Screenshot 2 - Home/Feed**
- Tela inicial com conteúdo
- Mostra navegação e features principais
- Posts da comunidade ou conteúdo educativo

**Screenshot 3 - Chat com IA**
- Conversa com MãesValente
- Mostra interação e qualidade das respostas
- Exemplo de pergunta/resposta útil

**Screenshot 4 - Comunidade**
- Posts de outras mães
- Interações (curtidas, comentários)
- Senso de comunidade

**Screenshot 5 - Hábitos/Tracking**
- Dashboard de hábitos
- Progresso visual (gráficos, checkmarks)
- Mostra funcionalidade de acompanhamento

**Dicas para Screenshots iOS:**
- ✅ Use device frames (opcional, mas profissional)
- ✅ Adicione texto descritivo sobre as features
- ✅ Use mockup de dados realistas
- ✅ Remova informações pessoais sensíveis
- ✅ Consistência visual entre screenshots
- ✅ Ordem: Mais importante → Menos importante

**Ferramentas Recomendadas:**
- [Fastlane Frameit](https://docs.fastlane.tools/actions/frameit/) - Adicionar frames de device
- [Shotbot](https://shotbot.io/) - Gerar screenshots automaticamente
- [Screenshot Creator](https://www.appstorescreenshot.com/) - Templates prontos

---

### 2.2 Google Play Store (Android)

**OBRIGATÓRIO: Mínimo 2 screenshots (máximo 8)**

#### Tamanhos Requeridos:

| Tipo | Dimensões | Orientação |
|------|-----------|-----------|
| **Phone** | **1080 × 1920 px** ou 1080 × 2340 px | Portrait |
| 7" Tablet | 1200 × 1920 px | Portrait (opcional) |
| 10" Tablet | 1600 × 2560 px | Portrait (opcional) |

**Nota:** Screenshots de phone são obrigatórios.

#### Telas a Capturar:

Mesmas 5 telas do iOS, mas capturadas em dispositivo Android:
1. Onboarding
2. Home/Feed
3. Chat IA
4. Comunidade
5. Hábitos

**Diferenças Android:**
- Mostrar barra de navegação Android (se aplicável)
- Material Design elements
- Testar em Pixel, Samsung Galaxy, etc.

**Dicas:**
- ✅ Primeiro screenshot é o mais importante (define impressão)
- ✅ Use imagens de alta qualidade (sem blur)
- ✅ Evite texto muito pequeno
- ✅ Consistência de marca (cores, fontes)

---

### 2.3 Localização de Screenshots (Futuro)

Quando internacionalizar, criar screenshots em cada idioma:
- 🇧🇷 Português (Brasil) - Obrigatório
- 🇺🇸 Inglês (EUA) - Recomendado
- 🇪🇸 Espanhol - Opcional

---

## 🎨 3. FEATURE GRAPHIC (Android)

**Status:** ❌ NÃO EXISTE - OBRIGATÓRIO!

### 3.1 Especificações

**Tamanho:** 1024 × 500 px  
**Formato:** PNG ou JPG (24-bit)  
**Peso máximo:** 1MB  
**Uso:** Banner principal na listagem da Play Store

### 3.2 Conteúdo Sugerido

**Opção 1: Logo + Tagline**
```
┌──────────────────────────────────────┐
│                                      │
│    [LOGO]  Nossa Maternidade        │
│                                      │
│    Sua jornada maternal com IA      │
│    e comunidade                     │
│                                      │
└──────────────────────────────────────┘
```

**Opção 2: Screenshot + Texto**
```
┌──────────────────────────────────────┐
│  [Screenshot do app]  │ Chat com IA  │
│                       │ Comunidade   │
│                       │ Conteúdo     │
│                       │ Hábitos      │
└──────────────────────────────────────┘
```

**Opção 3: Illustração Temática**
```
┌──────────────────────────────────────┐
│  [Ilustração mãe+bebê]               │
│                                      │
│  Apoiando mães em cada etapa        │
└──────────────────────────────────────┘
```

### 3.3 Guidelines

- ✅ **Legível:** Texto grande e claro
- ✅ **Branding:** Logo e cores do app
- ✅ **Apelativo:** Deve atrair downloads
- ✅ **Mobile-first:** Visível em telas pequenas
- ❌ **Sem:** Preços, offers, badges ("#1 App", etc.)
- ❌ **Sem:** Texto enganoso ou clickbait

---

## 🎬 4. VÍDEO PROMOCIONAL (Opcional)

**Status:** ❌ Não criado

### 4.1 App Store (iOS)

**Especificações:**
- **Duração:** 15-30 segundos
- **Formato:** MP4, MOV
- **Resolução:** 1080p mínimo (1920×1080)
- **Aspect Ratio:** 16:9 ou 9:16 (vertical)
- **Tamanho máximo:** 500MB
- **FPS:** 30fps

**Conteúdo:**
- 0-5s: Hook (problema que resolve)
- 5-15s: Features principais (3-4 funcionalidades)
- 15-20s: Prova social ou diferencial
- 20-25s: Call-to-action ("Baixe agora")
- 25-30s: Logo e tagline

### 4.2 Google Play Store (Android)

**Especificações:**
- **Duração:** Até 30 segundos
- **Formato:** MP4, MPEG
- **Resolução:** 720p ou 1080p
- **Aspect Ratio:** 16:9
- **Link YouTube:** Também aceita (mais fácil)

**Dicas:**
- ✅ Mostrar app em uso real
- ✅ Música de fundo agradável
- ✅ Legendas (pessoas assistem sem som)
- ✅ Animações suaves
- ❌ Evitar transições bruscas

**Ferramentas:**
- [Loom](https://loom.com/) - Screen recording
- [CapCut](https://www.capcut.com/) - Edição simples
- [Premiere Pro](https://adobe.com/premiere) - Profissional
- [Fiverr](https://fiverr.com/) - Contratar editor

---

## 🖼️ 5. PROMOTIONAL GRAPHICS (Marketing)

### 5.1 Social Media Assets

**Para Instagram/Facebook:**
- **Post:** 1080 × 1080 px (quadrado)
- **Stories:** 1080 × 1920 px (9:16)
- **Banner:** 1200 × 628 px

**Para Twitter/X:**
- **Post image:** 1200 × 675 px
- **Header:** 1500 × 500 px

**Para LinkedIn:**
- **Post:** 1200 × 627 px

### 5.2 Website/Landing Page

- **Hero image:** 1920 × 1080 px
- **Screenshots:** Mesmos do app
- **Logo (SVG):** Vetorial escalável

---

## 📐 6. COMO CRIAR OS SCREENSHOTS

### Método 1: Captura Manual (Recomendado)

#### iOS:
```bash
# 1. Abrir Xcode Simulator
# 2. Escolher iPhone 15 Pro Max (6.7")
# 3. Executar app: npm run ios
# 4. Navegar para cada tela
# 5. Cmd + S para salvar screenshot
# 6. Repetir para iPhone 8 Plus (5.5")
```

#### Android:
```bash
# 1. Abrir Android Studio Emulator
# 2. Escolher Pixel 7 Pro (1080 × 2400)
# 3. Executar app: npm run android
# 4. Navegar para cada tela
# 5. Screenshot button ou Ctrl+S
```

### Método 2: Fastlane Snapshot (Automatizado)

**iOS:**
```ruby
# Fastlane Snapshotfile
devices([
  "iPhone 15 Pro Max",
  "iPhone 8 Plus",
  "iPad Pro (12.9-inch)"
])

languages([
  "pt-BR",
  "en-US"
])

scheme("NossaMaternidade")

output_directory("./screenshots")
```

```bash
fastlane snapshot
```

**Android:**
```bash
# Usar Screengrab (Fastlane para Android)
fastlane screengrab
```

### Método 3: Figma Mockups

1. Exportar telas do app como PNG
2. Importar no Figma
3. Usar templates de device mockups
4. Adicionar texto descritivo
5. Exportar em tamanhos corretos

**Templates Gratuitos:**
- [Figma Community - App Store Screenshots](https://www.figma.com/community/search?model_type=files&q=app%20store%20screenshot)
- [Mockuuups](https://mockuuups.studio/)

---

## 📋 7. CHECKLIST DE ASSETS

### Ícones
- [x] App Icon (1024×1024)
- [x] Adaptive Icon (Android)
- [x] Notification Icon
- [x] Favicon (web)

### Screenshots - iOS
- [ ] iPhone 6.7" (mínimo 3)
- [ ] iPhone 5.5" (mínimo 3)
- [ ] iPad Pro 12.9" (opcional)

### Screenshots - Android
- [ ] Phone (1080×1920) - mínimo 2
- [ ] 7" Tablet (opcional)
- [ ] 10" Tablet (opcional)

### Promotional
- [ ] Feature Graphic (1024×500) - Android obrigatório
- [ ] Promo Video (opcional)
- [ ] Social media assets (marketing)

### Metadata Textual (Não são assets, mas necessários)
- [ ] Nome do app (30 caracteres max)
- [ ] Subtítulo/Short description (80-100 caracteres)
- [ ] Descrição completa (4000 caracteres max)
- [ ] Keywords (iOS: 100 caracteres)
- [ ] Release notes (Novidades da versão)
- [ ] Privacy Policy URL
- [ ] Support URL

---

## 🎨 8. FERRAMENTAS RECOMENDADAS

### Design
- **Figma** - Design e mockups (gratuito)
- **Canva** - Templates rápidos (gratuito)
- **Adobe Illustrator** - Ícones vetoriais (pago)
- **Sketch** - Mac only (pago)

### Screenshots
- **Fastlane** - Automatização (gratuito, open-source)
- **Shotbot** - Screenshots profissionais (pago)
- **Previewed** - Device mockups (freemium)

### Edição de Imagem
- **Photoshop** - Profissional (pago)
- **GIMP** - Alternativa gratuita
- **Photopea** - Online gratuito (similar ao Photoshop)

### Vídeo
- **CapCut** - Edição simples (gratuito)
- **Premiere Pro** - Profissional (pago)
- **Loom** - Screen recording (freemium)

### Compressão
- **TinyPNG** - Compressão PNG/JPG
- **ImageOptim** - Mac (gratuito)
- **Squoosh** - Online (Google)

---

## 📊 9. DIMENSÕES RÁPIDAS (Referência)

```
┌─────────────────────────────────────────────────┐
│ ÍCONES                                          │
├─────────────────────────────────────────────────┤
│ App Icon            1024 × 1024 px              │
│ Adaptive Icon       1024 × 1024 px              │
│ Notification        96 × 96 px                  │
│ Favicon             192 × 192 px                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SCREENSHOTS - iOS                               │
├─────────────────────────────────────────────────┤
│ iPhone 6.7"         1290 × 2796 px              │
│ iPhone 6.5"         1284 × 2778 px              │
│ iPhone 5.5"         1242 × 2208 px              │
│ iPad Pro 12.9"      2048 × 2732 px              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SCREENSHOTS - Android                           │
├─────────────────────────────────────────────────┤
│ Phone               1080 × 1920 px              │
│ 7" Tablet           1200 × 1920 px              │
│ 10" Tablet          1600 × 2560 px              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROMOTIONAL                                     │
├─────────────────────────────────────────────────┤
│ Feature Graphic     1024 × 500 px               │
│ Video               1920 × 1080 px (16:9)       │
└─────────────────────────────────────────────────┘
```

---

## ✅ PRÓXIMOS PASSOS

### Urgente (Bloqueadores de Deploy):
1. **Criar 5 screenshots iPhone** (6.7" e 5.5")
   - Onboarding, Home, Chat, Comunidade, Hábitos
   - Tempo estimado: 2-3 horas
   
2. **Criar 5 screenshots Android** (1080×1920)
   - Mesmas telas que iOS
   - Tempo estimado: 2-3 horas
   
3. **Criar Feature Graphic Android** (1024×500)
   - Design simples com logo + tagline
   - Tempo estimado: 1-2 horas

**Total:** 1 dia de trabalho

### Recomendado (Melhora conversão):
4. Criar vídeo promocional 15-30s
5. Adicionar texto descritivo nos screenshots
6. Criar mockups com device frames
7. A/B test diferentes screenshots

---

## 📞 RECURSOS E SUPORTE

**Documentação Oficial:**
- [App Store Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications)
- [Google Play Asset Guidelines](https://support.google.com/googleplay/android-developer/answer/9866151)

**Tutoriais:**
- [How to Create App Store Screenshots](https://www.youtube.com/results?search_query=app+store+screenshots+tutorial)
- [Fastlane Screenshot Guide](https://docs.fastlane.tools/actions/snapshot/)

**Ajuda:**
Se precisar de ajuda com assets, contate:
- Design: design@nossamaternidade.com.br
- Suporte técnico: dev@nossamaternidade.com.br

---

**Boa sorte com os assets! 📸✨**

*Última atualização: Novembro 2024*
