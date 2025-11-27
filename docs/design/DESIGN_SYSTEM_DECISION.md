# Decisão de Design System - Nossa Maternidade

**Data:** 27 de novembro de 2025  
**Versão:** 1.0  
**Status:** ✅ Aprovado

---

## 🎯 Objetivo

Definir o design system base para Nossa Maternidade (React Native + iOS/Android) que seja:

- **Humanizado** (Nathália Valente + Flo)
- **Acessível** (WCAG AA+, saúde)
- **Escalável** (múltiplos produtos futuros)
- **Consistente** (iOS + Android unified)

---

## 📚 Camadas Adotadas

### **Camada 1: Fundação = Flo.health**

**Por quê:**
- Domínio comprovado (saúde feminina)
- Estética validada (mães confiam)
- Personalidade alinhada (Nathália é similar a Flo: empoderamento feminino)

**O que copiar:**
- Paleta rosa/roxo/ouro
- Tipografia sem-serif warm (Poppins/Inter)
- Componentes pill (botões, inputs)
- Ilustrações flat pastel

**O que ADAPTAR:**
- Rosa Flo (#FF6E8F) → Rosa Nathália (#EC5975) mais quente
- Adicionar terra/bronze (lifestyle Nathália)
- Adicionar ciclo menstrual (educação)

**Referência:** Já documentado em `src/design-system/colors.ts`

---

### **Camada 2: Estrutura = Material Design 3 + Apple HIG**

**Material Design 3 (Android Principal):**
- 8-point grid (spacing)
- Tokens formalizados (colors, typography, elevation)
- Motion design (swipe, reveal, fade)
- Dark mode nativo

**Apple HIG (iOS Principal):**
- Safe area respeito
- Tap targets 44x44px mínimo
- Navigation patterns (tab bar, back button)
- SF Pro font fallback

**Híbrido (React Native):**

```typescript
// src/design-system/responsive.ts
export const RESPONSIVE = {
  ios: {
    safeArea: true,
    navigation: 'tab-bar', // iOS padrão
    gestures: ['swipe-back', 'long-press'],
  },
  android: {
    safeArea: true,
    navigation: 'bottom-sheet',
    gestures: ['system-back', 'long-press'],
  },
};
```

---

### **Camada 3: Especialização = Carbon (Health) + Paste (Chat)**

**Carbon Design System (Saúde):**
- Temas claros/escuros robusto
- Estados sensíveis (disabled, loading, error)
- Acessibilidade WCAG AAA
- Tokens para "sentient design" (adaptável)

**Paste Design System (Chat/Messaging):**
- Padrões conversacionais (bubbles, timestamps)
- Indicadores de typing/read
- Voice notes (futura integração NathIA)
- Emojis acessíveis

---

## 🎨 Tokens Definidos

### Cores

```
// Primary: Rosa Nathália
primary: { 500: '#EC5975', ... }

// Secundária: Roxo (espiritual)
purple: { 500: '#A17FFF', ... }

// Terciária: Ouro (lifestyle)
gold: { 500: '#FFA500', ... }

// Terra: Acolhimento
earth: { 500: '#9B7659', ... }

// Ciclo: Educação
cycle: {
  menstruation: '#DC2626',
  follicular: '#FCD34D',
  ovulation: '#EC4899',
  luteal: '#8B5CF6',
}
```

### Tipografia

```
h1: { size: 40px, weight: 800, lineHeight: 1.2 }
h2: { size: 32px, weight: 700, lineHeight: 1.2 }
body: { size: 16px, weight: 400, lineHeight: 1.5 }
caption: { size: 12px, weight: 500, lineHeight: 1.4 }
```

### Espaçamento (8-point grid)

```
spacing: {
  0: 0,
  2: 8,   // base
  4: 16,  // padrão
  6: 24,  // cards
  8: 32,  // sections
}
```

### Border Radius

```
borders: {
  none: 0,
  base: 8,
  md: 12,
  lg: 16,
  full: 9999, // pills
}
```

---

## ✅ Checklist de Alinhamento

- [x] Paleta de cores (Flo-inspired + Nathália)
- [x] Tipografia (San-serif warm + weights)
- [x] Espaçamento (8-point grid MD3)
- [x] Componentes base (button, card, input)
- [ ] Temas dark/light (next: Carbon)
- [ ] Acessibilidade audit (WCAG AA+)
- [ ] Documentação Figma
- [ ] Implementação em componentes React Native

---

## 📊 Métricas de Sucesso

- **Consistência:** 100% componentes usam tokens (zero hard-coded colors)
- **Acessibilidade:** WCAG AA minimum (AAA target)
- **Performance:** Design tokens < 50KB minified
- **Cobertura iOS/Android:** Ambas plataformas com visual parity 95%+

---

## 🚀 Próximos Passos

1. **Sprint Atual:** Implementar design system base (colors, typography, spacing) ✅
2. **Sprint 2:** Criar componentes primitivos (Button, Card, Input, Modal)
3. **Sprint 3:** Temas dark/light + acessibilidade audit
4. **Sprint 4:** Documentação Figma + design tokens export

---

## 📚 Referências Consultadas

- Flo.health (análise estrutural completa)
- Material Design 3 (m3.material.io)
- Apple HIG (developer.apple.com/design)
- Carbon Design System (carbondesignsystem.com)
- Paste Design System (paste.twilio.design)

---

*Decisão validada e pronta para implementação.*

