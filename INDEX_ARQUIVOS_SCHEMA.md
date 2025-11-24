# Índice de Arquivos - Aplicação do Schema SQL

## Criado em: 2025-11-24

---

## Guias Rápidos (Comece por aqui)

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `QUICK_START_DB.txt` | 4.3 KB | **LEIA PRIMEIRO** - Guia visual de 5 passos |
| `SCHEMA_STATUS.md` | 3.8 KB | Status atual e checklist |
| `DATABASE_SETUP_SUMMARY.txt` | 11 KB | Resumo completo em texto puro |

---

## Documentação Completa

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `supabase/APLICAR_SCHEMA.md` | 3.9 KB | Instruções passo a passo detalhadas |
| `APLICACAO_SCHEMA_RESULTADO.md` | 15 KB | Relatório completo da execução |
| `supabase/README.md` | 6.0 KB | Documentação geral do Supabase |

---

## Scripts de Automação

### Scripts Node.js

| Arquivo | Tamanho | Status | Descrição |
|---------|---------|--------|-----------|
| `scripts/apply-schema.mjs` | 13 KB | ❌ Falhou | Tentativa via PostgreSQL direto |
| `scripts/apply-schema-http.mjs` | 12 KB | ✅ Info | Verificação de métodos HTTP |
| `scripts/apply-schema-final.mjs` | 22 KB | ✅ Funcional | **USE ESTE** - Gera instruções |

**Executar**: `npm run db:schema`

### Scripts PowerShell

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `scripts/apply-via-cli.ps1` | 6.4 KB | Helper para Windows CLI |

---

## Interface Web

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `apply-schema.html` | 41 KB | Interface visual interativa com Supabase.js |

**Uso**: Abra diretamente no navegador

---

## Arquivos SQL (Fonte)

| Arquivo | Tamanho | Linhas | Descrição |
|---------|---------|--------|-----------|
| `supabase/schema.sql` | 18.6 KB | 527 | Schema completo (tabelas, triggers, RLS) |
| `supabase/seed.sql` | 9.7 KB | 126 | Dados iniciais (hábitos, marcos, conteúdos) |

---

## Comandos NPM Adicionados

```json
{
  "db:schema": "Gera instruções para aplicar schema",
  "db:apply": "Aplica schema via Supabase CLI",
  "db:reset": "Reseta banco de dados",
  "db:diff": "Mostra diferenças no schema"
}
```

---

## Como Usar Este Índice

### Para iniciantes:
1. Leia `QUICK_START_DB.txt` (2 minutos)
2. Siga os 5 passos
3. Pronto!

### Para mais detalhes:
1. Leia `supabase/APLICAR_SCHEMA.md`
2. Execute `npm run db:schema`
3. Siga as instruções geradas

### Para relatório completo:
- Abra `APLICACAO_SCHEMA_RESULTADO.md`

### Para automação futura:
- Use `npm run db:apply` (requer Supabase CLI configurado)

---

## Fluxo Recomendado

```
1. QUICK_START_DB.txt (2 min)
   ↓
2. Abra Supabase Dashboard SQL Editor
   ↓
3. Cole supabase/schema.sql
   ↓
4. Execute
   ↓
5. Cole supabase/seed.sql
   ↓
6. Execute
   ↓
7. Verifique no Table Editor
   ↓
8. npm start (testar app)
```

---

## Estrutura de Pastas

```
NossaMaternidadeMelhor-clone/
├── supabase/
│   ├── schema.sql (527 linhas)
│   ├── seed.sql (126 linhas)
│   ├── APLICAR_SCHEMA.md
│   └── README.md
├── scripts/
│   ├── apply-schema.mjs
│   ├── apply-schema-http.mjs
│   ├── apply-schema-final.mjs ⭐
│   └── apply-via-cli.ps1
├── apply-schema.html (interface web)
├── QUICK_START_DB.txt ⭐ COMECE AQUI
├── SCHEMA_STATUS.md
├── DATABASE_SETUP_SUMMARY.txt
├── APLICACAO_SCHEMA_RESULTADO.md
└── INDEX_ARQUIVOS_SCHEMA.md (este arquivo)
```

---

## Estatísticas

### Arquivos Criados
- **Scripts**: 4 (3 Node.js + 1 PowerShell)
- **Documentação**: 6 arquivos
- **Interface**: 1 HTML
- **SQL**: 2 arquivos (schema + seed)
- **Total**: 13 arquivos

### Tamanho Total
- **Scripts**: ~53 KB
- **Documentação**: ~44 KB
- **Interface**: 41 KB
- **SQL**: 28 KB
- **Total**: ~166 KB

### Linhas de Código
- SQL: 653 linhas
- JavaScript: ~1000 linhas
- PowerShell: ~150 linhas
- Documentação: ~1200 linhas
- Total: ~3000 linhas

---

## Problemas Comuns

### "Não consigo conectar no PostgreSQL"
→ Normal! Use o Dashboard (Opção 1)

### "CLI dá erro no .env"
→ Use o Dashboard ou execute `supabase login` manualmente

### "Tabelas já existem"
→ Normal se já aplicou antes (schema usa IF NOT EXISTS)

### "Erro de permissão"
→ Verifique se está logado no projeto correto

---

## Links Úteis

- **Dashboard**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme
- **SQL Editor**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/sql
- **Table Editor**: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme/editor

---

## Próxima Ação

**Escolha UMA opção:**

**A) Rápido (2 min)** ⭐ Recomendado
```bash
# 1. Leia QUICK_START_DB.txt
# 2. Abra o link do SQL Editor
# 3. Cole e execute os SQLs
```

**B) Via CLI**
```bash
npm run db:apply
```

**C) Manual com instruções**
```bash
npm run db:schema
# Siga as instruções mostradas
```

---

**Última atualização**: 2025-11-24
**Projeto**: Nossa Maternidade
**Versão**: 1.0.0
