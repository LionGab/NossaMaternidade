# Quick Start - Teste Rápido dos MCPs

Guia rápido para testar os MCPs de Release Ops em 5 minutos.

## 🚀 Teste Rápido (Sem Supabase Local)

### Passo 1: Verificar Arquivos e Configuração

```bash
npm run test:mcp
```

Isso verifica se todos os arquivos necessários estão presentes.

### Passo 2: Verificar Configuração de Variáveis

```bash
npm run check:env-config
```

Isso mostra quais variáveis estão configuradas. **Não precisa de todas** - os MCPs funcionam em modo graceful degradation.

### Passo 3: Testar no App React Native

Os MCPs precisam ser testados no ambiente React Native/Expo. Para isso:

1. **Inicie o app:**
   ```bash
   npm start
   ```

2. **Use os MCPs no código do app:**
   ```typescript
   import { releaseOpsAgent } from '@/agents';
   
   // No seu componente ou service
   const report = await releaseOpsAgent.process({
     release: '1.0.0',
     appId: 'test-app-id',
     packageName: 'com.nossamaternidade.app',
   });
   ```

**Nota:** Sem credenciais reais, os MCPs retornam dados vazios ou mockados. Isso é **esperado e normal** - eles funcionam em modo graceful degradation.

## 🧪 Teste Individual de MCPs (No App React Native)

Os MCPs precisam ser testados no ambiente React Native. Crie um componente de teste:

### Teste SentryMCPServer

```typescript
// src/screens/TestMCPScreen.tsx
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { sentryMCP } from '@/mcp/servers';

export function TestMCPScreen() {
  const [result, setResult] = useState<string>('Carregando...');

  useEffect(() => {
    async function test() {
      try {
        await sentryMCP.initialize();
        const response = await sentryMCP.handleRequest({
          id: 'test',
          method: 'release.getCurrent',
          params: {},
        });
        setResult(JSON.stringify(response, null, 2));
      } catch (error) {
        setResult(`Erro: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    test();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Sentry MCP Test:</Text>
      <Text>{result}</Text>
    </View>
  );
}
```

### Teste AppStoreConnectMCPServer

```typescript
// Criar arquivo: test-appstore.ts
import { appStoreConnectMCP } from './src/mcp/servers';

async function test() {
  await appStoreConnectMCP.initialize();
  const response = await appStoreConnectMCP.handleRequest({
    id: 'test',
    method: 'build.list',
    params: { appId: 'test' },
  });
  console.log(response);
}

test();
```

```bash
npx tsx test-appstore.ts
```

## 🔍 O Que Esperar

### Com Credenciais Reais
- ✅ Chamadas reais às APIs
- ✅ Dados reais de releases, builds, crashes
- ✅ Respostas completas

### Sem Credenciais (Modo Graceful)
- ⚠️ Logs de aviso sobre falta de credenciais
- ✅ MCPs inicializam normalmente
- ✅ Retornam dados vazios ou mockados
- ✅ Não quebram o app

## 📝 Exemplo de Saída Esperada

```
[Test] ========================================
[Test] Iniciando testes de Release Ops MCP
[Test] ========================================

[Test] 1. Testando inicialização do ReleaseOpsAgent...
[Test] ✅ ReleaseOpsAgent inicializado com sucesso

[Test] 2. Testando getReleaseReadinessReport...
[SentryMCP] API token não configurado - retornando release local
[Test] ✅ Report recebido com sucesso

📊 Release Readiness Report:
{
  "isReady": false,
  "crashFreeRate": null,
  "criticalCrashes": [],
  "recommendations": [
    "⚠️ Não foi possível verificar saúde do release (credenciais não configuradas)"
  ]
}

[Test] ========================================
[Test] ✅ Todos os testes concluídos!
[Test] ========================================
```

## ✅ Próximos Passos

1. **Se tudo funcionou:** Pronto para usar! Os MCPs estão funcionando.
2. **Para dados reais:** Configure credenciais em `app.config.js` ou Supabase secrets.
3. **Para deploy:** Veja `docs/MCP_MOBILE_HARDENING.md` seção "Próximos Passos".

## 🐛 Problemas Comuns

### Erro: "Cannot find module 'tsx'"
```bash
npm install -D tsx
```

### Erro: "MCP Server not initialized"
Verifique se chamou `await mcpServer.initialize()` antes de usar.

### Erro: "Edge function error"
- Se testando localmente: Inicie Supabase local (`supabase start`)
- Se em produção: Verifique se as Edge Functions foram deployadas

## 📚 Documentação Completa

- `docs/TESTE_MCP_RELEASE_OPS.md` - Guia completo de testes
- `docs/MCP_MOBILE_HARDENING.md` - Detalhes técnicos
- `docs/MCP_OPERACAO_STORES.md` - Documentação dos MCPs

