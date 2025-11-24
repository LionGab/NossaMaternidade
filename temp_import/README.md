# Nossa Maternidade - MVP PWA

## 1. Arquitetura do Projeto

Este projeto é um **Single Page Application (SPA)** construído para funcionar como um **PWA (Progressive Web App)** com design **Mobile-First**.

### Tech Stack
- **Core:** React 18 + TypeScript.
- **Build/Runtime:** Vite-based (simulated in this environment).
- **Estilização:** Tailwind CSS (via CDN para MVP rápido, focado em tokens visuais).
- **Roteamento:** `react-router-dom` (HashRouter) para navegação client-side sem recarregamento.
- **Ícones:** `lucide-react` para leveza e estilo outline.
- **IA:** `@google/genai` (Gemini 3.0) para a NathIA.
- **Dados:** Estrutura preparada para Supabase (atualmente usando mocks/localStorage até o schema ser fornecido).

### Estrutura de Pastas
- `/`: Arquivos de entrada (`index.html`, `index.tsx`, `App.tsx`).
- `components/`: Componentes reutilizáveis (Botões, Cards, Inputs, Navigation).
- `pages/`: Telas principais (Splash, Onboarding, Home, Chat, Feed).
- `services/`: Lógica de integração (Gemini, Supabase).
- `types/`: Definições de tipos TypeScript.
- `constants.ts`: Paleta de cores e configurações globais.

## 2. Execução
O projeto roda instantaneamente no navegador. Para desenvolvimento local:
1. `npm install`
2. `npm run dev`

## 3. Layouts e Telas (Implementados)
- **Splash:** Tela de boas-vindas com logo e frase de impacto.
- **Onboarding:** Fluxo de 2 passos para identificar o momento da mãe e sentimentos.
- **Home:** Hub central com atalhos rápidos, chamada para IA e mini-feed.
- **Chat NathIA:** Interface de chat estilo WhatsApp/Messenger com integração Gemini.
- **Mundo Nath:** Feed de conteúdos (mock inicial).
