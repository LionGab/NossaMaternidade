# 📚 Recursos e Referências - Nossa Maternidade

## 🎥 Vídeos

### Desenvolvimento e Boas Práticas
- [Vídeo de Referência](https://www.youtube.com/watch?v=fOxC44g8vig) - Recurso para consulta

## 📖 Documentação do Projeto

### Guias de Implementação
- [CLAUDE.md](../CLAUDE.md) - Instruções para Claude Code
- [SEMANA1_COMPLETA.md](../SEMANA1_COMPLETA.md) - Setup de MCPs para Cursor.AI

### Arquitetura
- [docs/DESIGN_MCP_ARCHITECTURE.md](./DESIGN_MCP_ARCHITECTURE.md) - Arquitetura dos MCPs de Design
- [docs/DESIGN_VALIDATION_GUIDE.md](./DESIGN_VALIDATION_GUIDE.md) - Guia de validação de design

### Planejamento
- Plano de Cursor.AI: `.claude/plans/jazzy-whistling-lobster.md`

## 🛠️ Ferramentas e MCPs

### MCPs Configurados
1. **Supabase MCP** - Database operations
2. **Filesystem MCP** - File operations
3. **Git MCP** - Version control
4. **Puppeteer MCP** - Browser automation
5. **Chrome DevTools MCP** - Web debugging
6. **Brave Search MCP** - Web search
7. **design-tokens** - Validação de design tokens ✅
8. **code-quality** - Análise de qualidade ✅
9. **accessibility** - WCAG AAA compliance ✅

### Scripts Úteis
```bash
# Validação de design tokens
npm run validate:design

# Health check dos MCPs
node scripts/mcp-health-check.js

# Validação completa
npm run validate
```

## 📱 Stack Tecnológico

### Mobile
- React Native 0.81.5
- Expo SDK 54
- TypeScript 5.9
- NativeWind (Tailwind CSS)

### Backend
- Supabase (PostgreSQL + Auth + Storage)
- Edge Functions (Deno)

### IA
- Google Gemini 2.0 Flash
- Claude API (Anthropic)
- OpenAI GPT-4o

## 🔗 Links Úteis

### Documentação Oficial
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Supabase](https://supabase.com/docs)
- [Claude Code](https://code.claude.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io)

### Comunidade
- [React Native Community](https://reactnative.dev/community/overview)
- [Expo Forums](https://forums.expo.dev/)
- [Supabase Discord](https://discord.supabase.com/)

---

**Última atualização:** 27/11/2025
