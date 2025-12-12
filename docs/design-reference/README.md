# Maternidade App

Um aplicativo móvel nativo (iOS/Android styled) focado no acolhimento e suporte materno.

## Funcionalidades Mobile

- **Navegação em Abas**: Interface intuitiva com barra inferior (Início, Aprender, Comunidade, Perfil).
- **Design Touch-First**: Botões, cards e interações otimizadas para toque.
- **Micro-interações**: Animações suaves de transição entre telas e feedback tátil visual.
- **Tipografia Adaptada**: Uso de fontes legíveis (Nunito para corpo, Lora para títulos) com hierarquia clara para telas pequenas.

## Estrutura do App

- **Home**: Dashboard pessoal com dica do dia e atalhos.
- **Comunidade**: Feed de discussões e interação social.
- **Aprender**: Área para cursos e artigos educativos.
- **Perfil**: Configurações e progresso da usuária.

## Como Usar

```tsx
import MaternidadeApp from '@/sd-components/aca974fc-c357-4c23-9c12-957e8aa91a6a';

function App() {
  return (
    // O componente já possui altura total de tela (h-screen)
    <MaternidadeApp />
  );
}
```
