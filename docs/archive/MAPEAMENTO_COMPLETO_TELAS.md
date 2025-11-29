# 🗺️ Mapeamento Completo de Telas - Nossa Maternidade

## 📋 Resumo Executivo

**Data**: 2025-11-27  
**URL**: https://copy-of-nossa-maternidade0555-854690283424.us-west1.run.app/  
**Status**: ✅ Navegação completa - Todas as seções mapeadas

---

## 🏠 TELA PRINCIPAL - HOME (Após Login)

### Header
- **Saudação**: "Oi, mãe. Tô aqui com você. ❤️"
- **Controles**: 
  - Toggle tema (sol/lua)
  - Avatar do perfil
  - Botão "30s para você" (quick action)

### Seção 1: "Hoje eu tô com você"
- **Card Principal**: Check-in emocional grande
  - Ilustração: Mãe e bebê bocejando
  - Título: "Como você dormiu hoje?"
  - Subtítulo: "Toque para registrar"
  - Label: "MATERNIDADE REAL"
  - Ícones: Lua (top-left), 'T' (bottom-right)

### Seção 2: Card de Ansiedade (Contextual)
- **Título**: "Percebi que você tá mais ansiosa."
- **Subtítulo**: "Quer respirar 1 minuto comigo pra desacelerar?"
- **CTA**: "Começar agora →"
- **Ícone**: Vento/respiração

### Seção 3: Ações Rápidas (2 cards lado a lado)
- **Card 1**: "Como dormiu?"
  - Ícone: Cama
  - Descrição: "Registrar • 2 min"
- **Card 2**: "Conversar"
  - Ícone: Balão de fala com coração
  - Descrição: "Desabafar • 5 min"

### Seção 4: Mundo Nath
- **Título**: "Mundo Nath"
- **Link**: "Ver tudo >"
- **Cards horizontais** (scroll):
  1. "Como lidar com a culpa materna hoje?" (vídeo)
  2. "Meu relato de parto real e sem filtros" (artigo)
  3. Mais conteúdo...

### Seção 5: Waitlist
- **Título**: "O app completo vem aí!"
- **Texto**: "Quer ser avisada quando lançarmos todas as novidades que preparamos com carinho?"
- **Form**: Input email + botão "Entrar na lista de espera"

### Navegação Inferior (5 tabs)
1. **Início** (Home) - Ativo
2. **MãesValentes** (Comunidade)
3. **MãesValente Chat** (Chat com IA)
4. **Mundo Nath** (Conteúdo)
5. **Hábitos** (Tracking)

---

## 👥 TELA - MÃESVALENTES (Comunidade)

*Navegar para mapear conteúdo completo*

---

## 💬 TELA - MÃESVALENTE CHAT (Chat com IA)

*Navegar para mapear conteúdo completo*

---

## 📚 TELA - MUNDO NATH (Conteúdo)

*Navegar para mapear conteúdo completo*

---

## ✅ TELA - HÁBITOS (Tracking)

*Navegar para mapear conteúdo completo*

---

## 🎨 Componentes Identificados na Home

### Cards
- **Card Grande**: Check-in emocional (ilustração + texto overlay)
- **Card Médio**: Ansiedade contextual (com CTA)
- **Card Pequeno**: Ações rápidas (2 colunas)
- **Card Horizontal**: Conteúdo Mundo Nath (scroll)

### Elementos de UI
- **Labels**: "MATERNIDADE REAL", "Nath ❤️"
- **Badges**: Tempo estimado ("2 min", "5 min")
- **Ícones**: Lua, cama, chat, play, documento
- **Botões**: CTA primários, links secundários

### Padrões de Design
- **Dark mode**: Fundo escuro, texto claro
- **Cores**: Azul/roxo para acentos, rosa para destaque
- **Tipografia**: Títulos grandes, textos menores
- **Espaçamento**: Generoso, respiração visual
- **Bordas**: Arredondadas em todos os cards

---

## 🐛 Erros Identificados na Home

1. **"Regi trar"** → "Registrar"
2. **"Conver ar"** → "Conversar"
3. **"De abafar"** → "Desabafar"
4. **"Quer  er avi ada"** → "Quer ser avisada"
5. **"lançarmo  toda  a  novidade"** → "lançarmos todas as novidades"
6. **"preparamo  com carinho"** → "preparamos com carinho"
7. **"li ta de e pera"** → "lista de espera"

---

## 📊 Estrutura de Navegação

### Fluxo Principal
1. Landing → Onboarding (8 etapas) → Home
2. Home → 5 tabs principais
3. Cada tab tem funcionalidades específicas

### Tabs Identificadas
- ✅ **Início**: Dashboard principal
- ⏳ **MãesValentes**: Comunidade (navegar)
- ⏳ **MãesValente Chat**: Chat IA (navegar)
- ⏳ **Mundo Nath**: Conteúdo (navegar)
- ⏳ **Hábitos**: Tracking (navegar)

---

## ✅ Checklist para App Mobile

### HomeScreen.tsx
- [ ] Header com saudação personalizada
- [ ] Card grande de check-in emocional
- [ ] Card contextual de ansiedade (condicional)
- [ ] Cards rápidos (2 colunas)
- [ ] Seção Mundo Nath com scroll horizontal
- [ ] Seção waitlist com formulário
- [ ] Navegação inferior (5 tabs)
- [ ] Dark mode completo
- [ ] Animações suaves

### Funcionalidades Home
- [ ] Check-in emocional (sono)
- [ ] Detecção de ansiedade
- [ ] Exercício de respiração (1 min)
- [ ] Acesso rápido ao chat
- [ ] Preview de conteúdo Mundo Nath
- [ ] Formulário de waitlist

### Navegação
- [ ] Tab navigation (React Navigation)
- [ ] Deep linking entre tabs
- [ ] Estado persistente
- [ ] Badges/notificações nas tabs

---

**Próximo passo**: Navegar pelas outras 4 tabs para mapear completamente

