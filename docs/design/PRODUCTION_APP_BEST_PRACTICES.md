# 🎨 Melhores Práticas Extraídas do App em Produção

**Data:** 27 de novembro de 2025  
**Fonte:** Análise do app em `C:\Users\Usuario\Downloads\nossa-maternidade-app`

---

## 📦 Estrutura de Componentes

### Componentes Primitivos

#### **Button.tsx** - Botão Robusto
**Características:**
- ✅ **Pill shape** (`rounded-full`) - Formato arredondado moderno
- ✅ **Altura fixa** (`h-12` = 48px) - Touch target adequado
- ✅ **4 variants:** `primary`, `secondary`, `outline`, `ghost`
- ✅ **Loading state** com spinner animado
- ✅ **Active scale** (`active:scale-[0.98]`) - Feedback tátil visual
- ✅ **Shadow específica** (`shadow-lg shadow-primary/25`) - Elevação com cor
- ✅ **Transições suaves** (`transition-all duration-200`)

**Código-chave:**
```typescript
const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed h-12 px-6 text-[15px] active:scale-[0.98]";
```

---

#### **Input.tsx** - Input Profissional
**Características:**
- ✅ **Altura fixa** (`h-12` = 48px)
- ✅ **Pill shape** (`rounded-input` = 12px)
- ✅ **Label uppercase** com tracking (`tracking-wider`)
- ✅ **Ícone opcional** com posicionamento absoluto
- ✅ **Estados de foco** (`focus:bg-surface focus:border-primary`)
- ✅ **Error state** com animação (`animate-pulse`)
- ✅ **Transições** (`transition-all duration-200`)

**Código-chave:**
```typescript
className={`
  w-full h-12 rounded-input bg-input border-2 border-transparent py-3 
  ${icon ? 'pl-11' : 'pl-4'} pr-4 
  text-textMain placeholder-textMuted text-[15px]
  focus:bg-surface focus:border-primary focus:ring-0 focus:outline-none
  disabled:opacity-60 disabled:cursor-not-allowed
  transition-all duration-200
  ${error ? 'border-coral focus:border-coral' : ''}
`}
```

---

### Componentes de Layout

#### **Layout.tsx** - Navegação Inferior (Tab Bar)
**Características:**
- ✅ **Tab bar fixa** no bottom (`fixed bottom-0`)
- ✅ **Backdrop blur** (`backdrop-blur-md`) - Efeito glassmorphism
- ✅ **Safe area** (`pb-safe`) - Respeita notch/home indicator
- ✅ **Ícone central elevado** - Botão principal destacado
- ✅ **Indicador visual** - Barra no topo quando ativo
- ✅ **Stroke width dinâmico** - Mais grosso quando ativo
- ✅ **Max width** (`max-w-md`) - Centraliza em telas grandes

**Código-chave:**
```typescript
<footer className="fixed bottom-0 left-0 right-0 z-[999] bg-surface/95 backdrop-blur-md border-t border-border/20 pb-safe max-w-md mx-auto">
  {/* Ícone central elevado */}
  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-[1000]">
    <button className="w-14 h-14 rounded-full bg-gradient-to-br from-ocean to-deep/90 shadow-premium">
      <Sparkles size={26} />
    </button>
  </div>
</footer>
```

---

#### **InfluencerHeader.tsx** - Header com Imagem
**Características:**
- ✅ **Background image** com overlay gradient
- ✅ **Rounded bottom** customizável (`rounded-b-[32px]`)
- ✅ **Overlay gradient** (`bg-gradient-to-t from-background`)
- ✅ **Top right content** - Toggle de tema, ações
- ✅ **Overlap element** - Elementos que se sobrepõem ao header
- ✅ **Safe area** (`pt-safe`) - Respeita notch
- ✅ **Shadow premium** (`shadow-lg`)

**Código-chave:**
```typescript
<div className={`relative ${height} bg-deep pt-safe z-30`}>
  <div className={`absolute inset-0 w-full h-full overflow-hidden ${roundedBottom} shadow-lg`}>
    <img src={backgroundImage} className={`w-full h-full object-cover ${opacityOverlay} scale-105`} />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
  </div>
</div>
```

---

## 🎨 Design System

### Paleta de Cores (index.html)

```css
/* Primary Blues */
--color-ocean: #004E9A;       /* Deep Blue */
--color-deep: #002244;        /* Navy */
--color-sky: #E6F0FA;         /* Very Light Blue */

/* Secondary */
--color-coral: #D93025;       /* Strong Red/Coral */
--color-mint: #236B62;        /* Deep Mint */
--color-sunshine: #F59E0B;    /* Amber/Orange-Yellow */

/* Neutrals */
--color-charcoal: #0F172A;    /* Ink Black */
--color-slate: #334155;       /* Dark Slate */
--color-silver: #64748B;      /* Mid Grey */
--color-cloud: #F1F5F9;       /* Light Grey */
--color-snow: #FFFFFF;        /* Pure White */
```

### Dark Mode

```css
.dark {
  --color-ocean: #60A5FA;     /* Lighter blue for dark */
  --color-background: #020617; /* Blue-black */
  --color-surface: #1E293B;   /* Slate */
  --color-text-main: #F8FAFC; /* Off-white */
}
```

### Shadows

```css
'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
'premium': '0 10px 30px -5px rgba(0, 78, 154, 0.4)', /* Shadow com cor primária */
```

---

## 📱 Padrões de UI

### 1. Cards com Elevação

```typescript
className="bg-surface p-5 rounded-[28px] shadow-card border border-border/50 h-36 relative overflow-hidden transition-all active:scale-[0.98] hover:shadow-card-hover"
```

**Características:**
- ✅ Border radius grande (`rounded-[28px]`)
- ✅ Shadow card com hover
- ✅ Active scale feedback
- ✅ Overflow hidden para imagens
- ✅ Border sutil (`border-border/50`)

---

### 2. Mood Tracker (Emoções)

```typescript
{[
  { icon: Frown, label: 'Difícil', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { icon: Meh, label: 'Cansada', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { icon: Smile, label: 'Bem', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  // ...
].map((mood) => (
  <button className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border-2 ${
    isSelected 
    ? `${mood.bg} ${mood.color} ${mood.border} scale-110 shadow-lg` 
    : 'bg-surface border-transparent hover:border-border'
  }`}>
    <mood.icon size={26} strokeWidth={2.5} />
    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-current mt-1 animate-bounce"></div>}
  </button>
))}
```

**Características:**
- ✅ **Aspect square** - Mantém proporção
- ✅ **Scale on select** (`scale-110`)
- ✅ **Animated indicator** (`animate-bounce`)
- ✅ **Dark mode aware** (`dark:bg-rose-900/20`)

---

### 3. Feed de Posts (Comunidade)

**Características:**
- ✅ **Admin posts destacados** - Background gradient + border
- ✅ **Tags** - Badges pequenos uppercase
- ✅ **Ações** - Like, comment, share com contadores
- ✅ **Imagens** - Rounded com border sutil
- ✅ **Hover states** - Background change

```typescript
className={`
  ${post.isAdmin 
    ? 'bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-transparent border-2 border-blue-100 dark:border-blue-800 rounded-2xl shadow-md my-4 mx-2 transform scale-[1.01]' 
    : 'bg-surface border-b border-border last:border-0 hover:bg-secondary/20'
  }
`}
```

---

### 4. Chat Interface (Assistant)

**Características:**
- ✅ **Bubbles** - User (primary) vs AI (surface)
- ✅ **Rounded corners** - `rounded-br-none` para user, `rounded-bl-none` para AI
- ✅ **Suggestion chips** - Chips clicáveis acima do input
- ✅ **Tools menu** - Popup com opções (imagem, vídeo, upload)
- ✅ **Loading state** - Spinner com texto contextual
- ✅ **Voice input** - Botão de microfone integrado

```typescript
className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
  msg.role === 'user'
    ? 'bg-primary text-white rounded-br-none shadow-md'
    : 'bg-surface text-textMain border border-border rounded-bl-none shadow-sm'
}`}
```

---

## 🎯 Padrões de Interação

### 1. Active Scale Feedback

```typescript
active:scale-[0.98]  // Botões
active:scale-95      // Cards pequenos
```

### 2. Hover States

```typescript
hover:bg-secondary/20
hover:shadow-card-hover
hover:border-border
```

### 3. Transitions

```typescript
transition-all duration-200
transition-colors
transition-transform
```

### 4. Loading States

```typescript
{isLoading && (
  <div className="flex items-center gap-2 text-textMuted text-xs animate-pulse">
    <Loader2 size={14} className="animate-spin text-primary" />
    <span>Digitando...</span>
  </div>
)}
```

---

## 📐 Espaçamento e Tipografia

### Espaçamento

- **Padding padrão:** `px-6` (24px horizontal)
- **Gap entre elementos:** `gap-3` (12px) ou `gap-4` (16px)
- **Margin entre seções:** `mb-10` (40px)

### Tipografia

- **Títulos grandes:** `text-3xl font-black` (30px, weight 900)
- **Títulos médios:** `text-lg font-bold` (18px, weight 700)
- **Body text:** `text-[15px]` (15px) - Tamanho legível
- **Labels:** `text-xs font-semibold uppercase tracking-wide`
- **Captions:** `text-[10px]` ou `text-[11px]`

---

## 🎨 Efeitos Visuais

### 1. Glassmorphism

```typescript
className="bg-white/10 backdrop-blur-md rounded-full border border-white/20"
```

### 2. Gradients

```typescript
className="bg-gradient-to-br from-ocean to-deep/90"
className="bg-gradient-to-t from-background via-background/40 to-transparent"
```

### 3. Shadows com Cor

```typescript
className="shadow-lg shadow-primary/25"
className="shadow-premium" // 0 10px 30px -5px rgba(0, 78, 154, 0.4)
```

### 4. Scale on Hover

```typescript
className="group-hover:scale-105 transition-transform duration-700"
```

---

## 🔧 Utilitários

### Safe Area

```css
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.pt-safe { padding-top: env(safe-area-inset-top); }
```

### Scrollbar Escondido

```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

### Tap Highlight Removido

```css
-webkit-tap-highlight-color: transparent;
```

---

## ✅ Checklist de Implementação

### Componentes a Criar/Refatorar

- [x] Button com pill shape e active scale
- [x] Input com label uppercase e ícone opcional
- [ ] Tab bar fixa com ícone central elevado
- [ ] Header com imagem e overlay gradient
- [ ] Cards com shadow premium
- [ ] Mood tracker com animações
- [ ] Feed de posts com admin destacado
- [ ] Chat bubbles com rounded corners assimétricos
- [ ] Suggestion chips
- [ ] Tools menu popup

### Design Tokens a Adicionar

- [ ] Shadow premium (com cor primária)
- [ ] Border radius grandes (28px, 32px)
- [ ] Safe area utilities
- [ ] Glassmorphism utilities
- [ ] Active scale utilities

---

## 🚀 Próximos Passos

1. **Adaptar componentes** para React Native
2. **Criar tokens** no design system
3. **Implementar padrões** de interação
4. **Adicionar animações** suaves
5. **Testar acessibilidade** (WCAG AA+)

---

**Melhores práticas extraídas e documentadas!** 🎨

