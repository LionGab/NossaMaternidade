# Exemplo de Uso - ReleaseOpsAgent

Exemplos práticos de como usar o `ReleaseOpsAgent` para monitorar releases e operar o app em produção.

## 📋 Pré-requisitos

1. Variáveis de ambiente configuradas (ver `MCP_OPERACAO_STORES.md`)
2. MCPs inicializados via `AgentOrchestrator`
3. Agente inicializado

## 🚀 Exemplos Básicos

### 1. Verificar Readiness de Release

```typescript
import { releaseOpsAgent } from '@/agents';

// Analisar se release está pronto para promover
const report = await releaseOpsAgent.process({
  release: '1.0.3',
  appId: '1234567890', // App Store Connect App ID
  packageName: 'com.nossamaternidade.app',
});

console.log('Release pronto?', report.isReady);
console.log('Crash-free rate:', report.crashFreeRate);
console.log('Recomendações:', report.recommendations);

// Exemplo de output:
// {
//   isReady: false,
//   crashFreeRate: 98.5,
//   criticalCrashes: 2,
//   recommendations: [
//     '⚠️ Crash rate acima do threshold (1.5% > 1.5%)',
//     '🐛 2 crash(es) crítico(s) encontrado(s)'
//   ],
//   summary: '⚠️ Release não está pronto para promover. Crash-free rate: 98.50%. 2 crash(es) crítico(s).'
// }
```

### 2. Obter Status das Stores

```typescript
import { releaseOpsAgent } from '@/agents';

// Verificar status atual nas stores
const storeStatus = await releaseOpsAgent.getStoreStatusSummary({
  appId: '1234567890',
  packageName: 'com.nossamaternidade.app',
});

console.log('iOS Status:', storeStatus.ios?.state);
console.log('Android Status:', storeStatus.android?.status);
console.log('iOS pode promover?', storeStatus.ios?.canPromote);
console.log('Android pode promover?', storeStatus.android?.canPromote);

// Exemplo de output:
// {
//   ios: {
//     version: '1.0.3',
//     state: 'IN_REVIEW',
//     inReview: true,
//     canPromote: false
//   },
//   android: {
//     track: 'production',
//     versionCode: '103',
//     versionName: '1.0.3',
//     status: 'completed',
//     rolloutPercentage: 100,
//     canPromote: false,
//     issues: []
//   },
//   timestamp: 1702147200000
// }
```

### 3. Listar Crashes Críticos

```typescript
import { releaseOpsAgent } from '@/agents';

// Listar crashes críticos desde uma data
const crashes = await releaseOpsAgent.listCriticalCrashesSince(
  '2025-12-01',
  '1.0.3'
);

crashes.forEach(crash => {
  console.log(`${crash.title}: ${crash.count} ocorrências, ${crash.userCount} usuários afetados`);
});

// Exemplo de output:
// [
//   {
//     issueId: '1234567890',
//     title: 'NullPointerException in HomeScreen',
//     count: 45,
//     userCount: 32,
//     crashFreeRate: 98.5,
//     platform: 'android',
//     deviceModel: 'Samsung Galaxy S21'
//   }
// ]
```

## 🔄 Integração com CI/CD

### Exemplo: Bloquear Deploy se Release Não Estiver Saudável

```typescript
import { releaseOpsAgent } from '@/agents';

async function checkReleaseBeforeDeploy(version: string): Promise<boolean> {
  const report = await releaseOpsAgent.process({
    release: version,
    appId: process.env.APP_STORE_CONNECT_APP_ID,
    packageName: process.env.GOOGLE_PLAY_PACKAGE_NAME,
  });

  if (!report.isReady) {
    console.error('❌ Release não está pronto para deploy:');
    report.recommendations.forEach(rec => console.error(`  - ${rec}`));
    return false;
  }

  console.log('✅ Release saudável, pode fazer deploy');
  return true;
}

// Uso em pipeline
const canDeploy = await checkReleaseBeforeDeploy('1.0.4');
if (!canDeploy) {
  process.exit(1);
}
```

## 📊 Dashboard de Métricas

### Exemplo: Relatório Completo de Release

```typescript
import { releaseOpsAgent } from '@/agents';

async function generateReleaseReport(version: string) {
  const [report, storeStatus, crashes] = await Promise.all([
    releaseOpsAgent.process({
      release: version,
      appId: process.env.APP_STORE_CONNECT_APP_ID,
      packageName: process.env.GOOGLE_PLAY_PACKAGE_NAME,
    }),
    releaseOpsAgent.getStoreStatusSummary({
      appId: process.env.APP_STORE_CONNECT_APP_ID,
      packageName: process.env.GOOGLE_PLAY_PACKAGE_NAME,
    }),
    releaseOpsAgent.listCriticalCrashesSince('2025-12-01', version),
  ]);

  return {
    version,
    timestamp: Date.now(),
    health: {
      crashFreeRate: report.crashFreeRate,
      isHealthy: report.isReady,
      criticalCrashes: crashes.length,
    },
    stores: {
      ios: storeStatus.ios,
      android: storeStatus.android,
    },
    recommendations: report.recommendations,
  };
}

// Gerar relatório
const report = await generateReleaseReport('1.0.3');
console.log(JSON.stringify(report, null, 2));
```

## 🎯 Casos de Uso Comuns

### 1. Antes de Promover Build para Produção

```typescript
const report = await releaseOpsAgent.process({
  release: '1.0.4',
  appId: '1234567890',
  packageName: 'com.nossamaternidade.app',
});

if (report.isReady) {
  console.log('✅ Pode promover para produção');
  // Lógica de promoção...
} else {
  console.log('❌ Não promover - corrigir issues primeiro');
  report.recommendations.forEach(rec => console.log(`  - ${rec}`));
}
```

### 2. Monitoramento Contínuo

```typescript
// Rodar a cada hora
setInterval(async () => {
  const report = await releaseOpsAgent.process({
    release: 'current',
  });

  if (!report.isReady) {
    // Enviar alerta (email, Slack, etc)
    sendAlert({
      title: '⚠️ Release não saudável',
      message: report.summary,
      recommendations: report.recommendations,
    });
  }
}, 60 * 60 * 1000); // 1 hora
```

### 3. Verificar Status de Review

```typescript
const storeStatus = await releaseOpsAgent.getStoreStatusSummary({
  appId: '1234567890',
  packageName: 'com.nossamaternidade.app',
});

if (storeStatus.ios?.inReview) {
  console.log(`iOS ${storeStatus.ios.version} está em review`);
}

if (storeStatus.android?.status === 'completed') {
  console.log(`Android ${storeStatus.android.versionName} está em produção`);
}
```

## 🔧 Tratamento de Erros

```typescript
try {
  const report = await releaseOpsAgent.process({
    release: '1.0.3',
  });
  
  // Processar report...
} catch (error) {
  // Erro de rede, API, etc
  logger.error('Erro ao obter report de release', error);
  
  // Fallback: retornar status desconhecido
  return {
    isReady: false,
    error: 'Não foi possível verificar saúde do release',
  };
}
```

## 📝 Notas

- Todos os métodos retornam dados mockados se as APIs não estiverem configuradas
- Erros são tratados com graceful degradation (retorna `null` ou arrays vazios)
- Métodos são assíncronos e podem ser chamados em paralelo quando apropriado
- Logs são gerados automaticamente via `logger` do projeto

