# Guia de Agentes - Nossa Maternidade

Este guia explica como usar os agentes especializados do projeto.

## Visão Geral

Os agentes são especializações conceituais que ajudam a organizar o trabalho e garantir consistência. Cada agente tem:

- **Foco específico**: Área de responsabilidade
- **MCPs recomendados**: Ferramentas para usar
- **Regras**: Diretrizes a seguir
- **Arquivos principais**: Onde trabalhar

## Agentes Disponíveis

### 🎨 DesignSystem+UI Agent

**Quando usar**: Trabalhando em design, componentes, acessibilidade, dark mode

**MCPs**:

- Figma MCP (se disponível)
- Context7 (documentação de acessibilidade)

**Exemplo de prompt**:

```
@DesignSystem+UI Agent: Implementar dark mode na HomeScreen usando
tokens do design-system.ts. Garantir contraste WCAG AAA e suporte
a Dynamic Type.
```

### 🧭 MobileUX+Navigation Agent

**Quando usar**: Melhorando navegação, fluxos, gestos, estados vazios

**MCPs**:

- Context7 (react-navigation docs)

**Exemplo de prompt**:

```
@MobileUX+Navigation Agent: Melhorar o fluxo de onboarding adicionando
estados de loading e empty states acolhedores. Usar animações a 60fps.
```

### 🗄️ Supabase+Data Agent

**Quando usar**: Trabalhando com banco de dados, migrations, RLS, Edge Functions

**MCPs**:

- Supabase MCP

**Exemplo de prompt**:

```
@Supabase+Data Agent: Criar migration para adicionar campo de
notificações_push na tabela profiles. Configurar RLS apropriado.
```

### 🤖 AI/NathIA Agent

**Quando usar**: Melhorando assistente IA, safety, rate limiting

**MCPs**:

- Context7 (OpenAI/Grok APIs)
- Supabase MCP (logs da Edge Function)

**Exemplo de prompt**:

```
@AI/NathIA Agent: Implementar rate limiting na Edge Function de IA.
Adicionar fallback para quando a API falhar.
```

### ⚡ QA+Performance Agent

**Quando usar**: Otimizando performance, listas, imagens, testes

**MCPs**:

- Playwright (testes visuais)
- Context7 (documentação de performance)

**Exemplo de prompt**:

```
@QA+Performance Agent: Otimizar CommunityScreen usando FlashList.
Garantir lazy loading de imagens e reduzir re-renders.
```

## Como Escolher o Agente

1. **Identifique a área** da tarefa
2. **Consulte a tabela** de agentes acima
3. **Use o agente apropriado** no prompt
4. **Siga as regras** do agente

## Trabalhando com Múltiplos Agentes

Algumas tarefas requerem múltiplos agentes:

**Exemplo**: "Implementar nova feature com design system"

1. **DesignSystem+UI**: Criar componentes base
2. **MobileUX+Navigation**: Integrar na navegação
3. **Supabase+Data**: Criar schema se necessário
4. **QA+Performance**: Otimizar performance

## Integração com o Plano

O plano de melhorias está organizado por fases. Cada fase pode ser atribuída a agentes:

### Fase 1 (Crítico)

- **DesignSystem+UI**: Dark mode completo
- **Supabase+Data**: Error handling
- **QA+Performance**: Otimizações de listas

### Fase 2 (Alto Impacto)

- **DesignSystem+UI**: Componentes base
- **MobileUX+Navigation**: Melhorias de UX
- **QA+Performance**: Otimizações mobile

### Fase 3 (Melhorias)

- **AI/NathIA**: Melhorias de qualidade
- **QA+Performance**: Testes automatizados
- **MobileUX+Navigation**: Novas features

## Dicas

1. **Seja específico**: Mencione o agente no prompt
2. **Use MCPs**: Aproveite as ferramentas disponíveis
3. **Siga as regras**: Cada agente tem diretrizes específicas
4. **Documente decisões**: Agentes ajudam a manter consistência

## Troubleshooting

**Não sei qual agente usar?**

- Consulte a área de responsabilidade
- Se for misto, use múltiplos agentes

**Agente não está seguindo as regras?**

- Reforce as regras no prompt
- Consulte a documentação do agente

**Preciso de ajuda com MCPs?**

- Consulte `docs/MCP_SETUP.md`
- Verifique se os MCPs estão configurados
