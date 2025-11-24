# 🎨 Recursos de Front-end Extraídos

Este documento lista todos os recursos de UI, temas e layouts extraídos do projeto `copy-of-nossa-maternidade0555`.

---

## 🌈 Sistema de Cores e Tema

### Paleta Principal (Light Mode)
```typescript
{
  'nath-blue': '#4285F4',        // Google Blue - profissional e rico
  'nath-light-blue': '#E8F0FE',  // Azul claro arejado
  'nath-warm': '#F8F9FA',        // Branco quente sutil
  'nath-dark': '#5D4E4B',        // Cinza-marrom profundo
  'nath-pink': '#FF8FA3',        // Rosa coral suave
}
```

### Paleta Dark Mode (Ocean Dark Theme)
```typescript
{
  'nath-dark-bg': '#020617',         // Fundo canvas
  'nath-dark-card': '#0B1220',       // Superfície de card
  'nath-dark-sleep': '#111827',      // Superfície sleep
  'nath-dark-pause': '#1D2843',      // Superfície pause
  'nath-dark-hero': '#3B82F6',       // Azul hero (mais claro para dark)
  'nath-dark-hero-soft': '#1D4ED8',  // Formas
  'nath-dark-text': '#F9FAFB',       // Texto primário
  'nath-dark-sec': '#D1D5DB',        // Texto secundário
  'nath-dark-muted': '#9CA3AF',      // Texto desbotado
  'nath-dark-border': 'rgba(148,163,184,0.24)', // Borda sutil
  'nath-dark-tab': '#020617',        // Barra de tabs
}
```

---

## 🎭 Tipografia

**Fonte Principal:** Quicksand
- Weights: 300, 400, 500, 600, 700
- URL: `https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap`

---

## 📦 Componentes de UI

### Button Component
```typescript
interface ButtonProps {
  fullWidth?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

// Estilos base
const baseStyles = "py-4 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-70"

// Variantes
{
  primary: "bg-nath-blue hover:bg-blue-500 dark:bg-nath-dark-hero text-white shadow-lg",
  outline: "border-2 border-gray-200 dark:border-nath-dark-border text-nath-dark dark:text-nath-dark-text",
  ghost: "bg-transparent text-nath-dark dark:text-nath-dark-text hover:bg-gray-100"
}
```

### Input Component
```typescript
// Estilos completos
className="w-full px-4 py-4 rounded-xl bg-white dark:bg-nath-dark-bg border border-gray-200 dark:border-nath-dark-border text-nath-dark dark:text-nath-dark-text placeholder-gray-400 focus:outline-none focus:border-nath-blue focus:ring-2 focus:ring-nath-blue/20"
```

### Haptic Feedback
```typescript
export const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10); // Vibração leve
  }
};
```

---

## 🧭 Bottom Navigation

### Estrutura
```typescript
interface NavigationProps {
  activeTab: 'home' | 'community' | 'chat' | 'content' | 'habits';
  onTabChange: (tab) => void;
}
```

### Ícones e Labels
1. **Home** - `Home` icon (24px)
2. **MãesValentes** (Community) - `Users` icon (24px)
3. **MãesValente** (Chat) - `MessageCircleHeart` icon (28px) - Destaque central
4. **Mundo Nath** (Content) - `PlayCircle` icon (24px)
5. **Hábitos** - `CheckCircle2` icon (24px)

### Estilos
```css
/* Container */
.nav-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 480px;
  background: white;
  dark:background: #020617;
  border-top: 1px solid rgba(0,0,0,0.1);
  padding: 12px 16px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.03);
}

/* Tab ativo */
.active-tab {
  color: #4285F4;
  dark:color: #3B82F6;
  scale: 1.1;
  drop-shadow: sm;
}

/* Chat button (central destacado) */
.chat-button-active {
  background: #4285F4;
  color: white;
  padding: 12px;
  border-radius: 9999px;
  box-shadow: 0 10px 15px rgba(66, 133, 244, 0.4);
  scale: 1.1;
  rotate: 3deg;
}
```

---

## 📐 Layout Mobile

### Container Principal
```css
.mobile-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  background-color: #F8F9FA;
}

.dark .mobile-container {
  background-color: #020617;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}
```

### Scrollbar Hidden
```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

---

## 🎬 Animações

### Pulse Slow
```css
@keyframes pulse-slow {
  /* 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite */
}

/* Uso */
.animate-pulse-slow {
  animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Active Scale
```css
.active:scale-95 {
  transform: scale(0.95);
}
```

---

## 🗂️ Estrutura de Types

### UserProfile
```typescript
export interface UserProfile {
  name?: string;
  email?: string;
  stage?: UserStage;  // 'Tentante' | 'Gestante' | 'Puérpera' | 'Mãe experiente'
  timelineInfo?: string; // "32 semanas" ou "3 meses"
  currentFeeling?: UserEmotion;
  biggestChallenge?: UserChallenge;
  supportLevel?: UserSupport;
  primaryNeed?: UserNeed;
  notificationsEnabled?: boolean;
}
```

### ChatMessage
```typescript
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
```

### Post
```typescript
export interface Post {
  id: string;
  title: string;
  type: 'Reels' | 'Vídeo' | 'Texto' | 'Áudio';
  thumbnailUrl: string;
  isNew?: boolean;
  url?: string;
  description?: string;
  duration?: string;
}
```

### Season (Série de Episódios)
```typescript
export interface Season {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  progress: number;
  totalEpisodes: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}
```

---

## 💡 Constantes Úteis

### App Name
```typescript
export const APP_NAME = "Nossa Maternidade";
```

### Mensagem Inicial do Chat
```typescript
export const INITIAL_CHAT_GREETING = "Oi! Eu sou a MãesValente. Obrigada por confiar em mim. Como você está se sentindo agora?";
```

### Anjo do Dia
```typescript
export const ANGEL_OF_THE_DAY = {
  name: "Camila R.",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
  message: "Obrigada por me lembrar que prato sujo pode esperar, mas meu sono não."
};
```

---

## 🎯 Recomendações de Implementação

### 1. Atualizar Tailwind Config
Adicionar as cores personalizadas do tema no [tailwind.config.js](tailwind.config.js).

### 2. Criar Theme Provider
Implementar dark mode toggle usando React Context.

### 3. Adaptar Bottom Navigation
Usar `@react-navigation/bottom-tabs` com estilo customizado baseado no design extraído.

### 4. Implementar Haptics
Usar `expo-haptics` para feedback tátil em botões e interações.

### 5. Fonte Quicksand
Adicionar fonte via `expo-font` ou Google Fonts.

---

## 📚 Recursos Adicionais Encontrados

### Páginas Disponíveis
- ✅ Splash
- ✅ Login
- ✅ Onboarding
- ✅ Home
- ✅ Chat
- ✅ Feed (Mundo Nath)
- ✅ Community (MãesValentes)
- ✅ Habits (Hábitos)
- ✅ Ritual
- ✅ Diary (Diário)

### Serviços
- Audio Utils (controle de áudio)
- Gemini AI Integration (já implementado no mobile)

---

**Data de extração:** 23 de novembro de 2025
**Fonte:** `c:\Users\User\Downloads\copy-of-nossa-maternidade0555`
