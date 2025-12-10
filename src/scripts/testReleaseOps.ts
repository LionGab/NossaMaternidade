/**
 * Script de Teste - Release Ops MCP
 * 
 * Testa os MCP Servers de Release Ops localmente
 * 
 * NOTA: Este script requer ambiente React Native/Expo.
 * Para testar em Node.js puro, use os testes unitários ou teste no app.
 * 
 * Uso:
 *   npm run test:release-ops
 *   ou
 *   npx tsx src/scripts/testReleaseOps.ts
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */

// Verificar se estamos em ambiente React Native/Expo
// eslint-disable-next-line @typescript-eslint/no-var-requires
const isReactNative = typeof require !== 'undefined' && require('react-native');

if (!isReactNative) {
  console.log('⚠️ Este script requer ambiente React Native/Expo.');
  console.log('   Para testar os MCPs:');
  console.log('   1. Use os testes unitários (npm test)');
  console.log('   2. Ou teste diretamente no app React Native');
  console.log('   3. Ou use o Supabase local para testar Edge Functions');
  console.log('');
  console.log('   Veja docs/TESTE_MCP_RELEASE_OPS.md para mais opções.');
  process.exit(0);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { releaseOpsAgent } = require('../agents');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { logger } = require('../utils/logger');

async function testReleaseOps() {
  try {
    logger.info('[Test] ========================================');
    logger.info('[Test] Iniciando testes de Release Ops MCP');
    logger.info('[Test] ========================================\n');

    // Teste 1: Inicialização
    logger.info('[Test] 1. Testando inicialização do ReleaseOpsAgent...');
    await releaseOpsAgent.initialize();
    logger.info('[Test] ✅ ReleaseOpsAgent inicializado com sucesso\n');

    // Teste 2: Release Readiness Report
    logger.info('[Test] 2. Testando getReleaseReadinessReport...');
    try {
      const report = await releaseOpsAgent.process({
        release: '1.0.0',
        appId: 'test-app-id',
        packageName: 'com.nossamaternidade.app',
      });

      logger.info('[Test] ✅ Report recebido com sucesso');
      console.log('\n📊 Release Readiness Report:');
      console.log(JSON.stringify(report, null, 2));
      console.log('');
    } catch (error) {
      logger.warn('[Test] ⚠️ Report falhou (pode ser esperado sem credenciais):', error);
    }

    // Teste 3: Store Status Summary
    logger.info('[Test] 3. Testando getStoreStatusSummary...');
    try {
      const storeStatus = await releaseOpsAgent.getStoreStatusSummary({
        appId: 'test-app-id',
        packageName: 'com.nossamaternidade.app',
      });

      logger.info('[Test] ✅ Store Status recebido com sucesso');
      console.log('\n🏪 Store Status Summary:');
      console.log(JSON.stringify(storeStatus, null, 2));
      console.log('');
    } catch (error) {
      logger.warn('[Test] ⚠️ Store Status falhou (pode ser esperado sem credenciais):', error);
    }

    // Teste 4: Critical Crashes
    logger.info('[Test] 4. Testando listCriticalCrashesSince...');
    try {
      const crashes = await releaseOpsAgent.listCriticalCrashesSince('2025-12-01', '1.0.0');
      logger.info('[Test] ✅ Crashes recebidos com sucesso');
      console.log('\n💥 Critical Crashes:');
      console.log(JSON.stringify(crashes, null, 2));
      console.log('');
    } catch (error) {
      logger.warn('[Test] ⚠️ Crashes falhou (pode ser esperado sem credenciais):', error);
    }

    logger.info('[Test] ========================================');
    logger.info('[Test] ✅ Todos os testes concluídos!');
    logger.info('[Test] ========================================');
    logger.info('[Test] Nota: Alguns testes podem falhar sem credenciais reais.');
    logger.info('[Test] Isso é esperado - os MCPs funcionam em modo graceful degradation.');
    logger.info('[Test] ========================================\n');
  } catch (error) {
    logger.error('[Test] ❌ Erro crítico nos testes:', error);
    console.error('\n❌ Erro crítico:', error);
    throw error;
  }
}

// Executar se chamado diretamente
// eslint-disable-next-line @typescript-eslint/no-var-requires
if (require.main === module) {
  testReleaseOps()
    .then(() => {
      console.log('✅ Testes concluídos');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Testes falharam:', error);
      process.exit(1);
    });
}

export { testReleaseOps };

