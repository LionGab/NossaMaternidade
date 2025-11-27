#!/usr/bin/env node
/**
 * MCP Health Check
 *
 * Valida se todos os MCPs estão funcionando corretamente
 * Testa comunicação stdio com cada MCP runner
 */

const { spawn } = require('child_process');
const path = require('path');

// MCPs para testar
const MCP_RUNNERS = [
  {
    name: 'design-tokens',
    path: path.join(__dirname, '../src/mcp/runners/design-tokens-runner.js'),
    testMethod: 'design.validate',
    testParams: { filePath: 'src/components/Checkbox.tsx' }
  },
  {
    name: 'code-quality',
    path: path.join(__dirname, '../src/mcp/runners/code-quality-runner.js'),
    testMethod: 'code.analyze.design',
    testParams: { filePath: 'src/components/Checkbox.tsx' }
  },
  {
    name: 'accessibility',
    path: path.join(__dirname, '../src/mcp/runners/accessibility-runner.js'),
    testMethod: 'a11y.audit.screen',
    testParams: { screenPath: 'src/screens/HomeScreen.tsx' }
  },
  {
    name: 'mobile-optimization',
    path: path.join(__dirname, '../src/mcp/runners/mobile-optimization-runner.js'),
    testMethod: 'mobile.check.flatlist',
    testParams: { filePath: 'src/screens/HomeScreen.tsx' }
  },
  {
    name: 'prompt-testing',
    path: path.join(__dirname, '../src/mcp/runners/prompt-testing-runner.js'),
    testMethod: 'prompt.validate.safety',
    testParams: { promptPath: 'src/mcp/servers/OpenAIMCPServer.ts' }
  }
];

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testMCP(mcp) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    // Verificar se arquivo existe
    const fs = require('fs');
    if (!fs.existsSync(mcp.path)) {
      log(`  ❌ ${mcp.name}: Runner não encontrado em ${mcp.path}`, 'red');
      resolve({ success: false, error: 'Runner não encontrado', duration: 0 });
      return;
    }

    log(`  🔍 Testando ${mcp.name}...`, 'gray');

    const child = spawn('node', [mcp.path], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseReceived = false;
    let output = '';
    let errorOutput = '';

    // Request de teste
    const testRequest = {
      jsonrpc: '2.0',
      id: `test-${Date.now()}`,
      method: mcp.testMethod,
      params: mcp.testParams
    };

    // Timeout de 10 segundos
    const timeout = setTimeout(() => {
      if (!responseReceived) {
        child.kill();
        const duration = Date.now() - startTime;
        log(`  ⏱️  ${mcp.name}: Timeout (${duration}ms)`, 'yellow');
        resolve({ success: false, error: 'Timeout', duration });
      }
    }, 10000);

    child.stdout.on('data', (data) => {
      output += data.toString();

      // Tentar parsear response
      try {
        const lines = output.split('\n').filter(l => l.trim());
        for (const line of lines) {
          const response = JSON.parse(line);
          if (response.id === testRequest.id) {
            responseReceived = true;
            clearTimeout(timeout);
            child.kill();

            const duration = Date.now() - startTime;

            if (response.error) {
              log(`  ⚠️  ${mcp.name}: Response com erro (${duration}ms)`, 'yellow');
              log(`      ${response.error.message}`, 'gray');
              resolve({ success: false, error: response.error.message, duration });
            } else {
              log(`  ✅ ${mcp.name}: OK (${duration}ms)`, 'green');
              resolve({ success: true, duration, response: response.result });
            }
          }
        }
      } catch (e) {
        // Continuar acumulando output
      }
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      log(`  ❌ ${mcp.name}: Erro ao executar (${duration}ms)`, 'red');
      log(`      ${error.message}`, 'gray');
      resolve({ success: false, error: error.message, duration });
    });

    child.on('exit', (code) => {
      if (!responseReceived) {
        clearTimeout(timeout);
        const duration = Date.now() - startTime;

        if (code !== 0) {
          log(`  ❌ ${mcp.name}: Exit code ${code} (${duration}ms)`, 'red');
          if (errorOutput) {
            log(`      ${errorOutput.split('\n')[0]}`, 'gray');
          }
          resolve({ success: false, error: `Exit code ${code}`, duration });
        }
      }
    });

    // Enviar request
    child.stdin.write(JSON.stringify(testRequest) + '\n');
  });
}

async function main() {
  log('\n🏥 MCP Health Check\n', 'blue');
  log('═'.repeat(60), 'gray');

  const results = [];

  for (const mcp of MCP_RUNNERS) {
    const result = await testMCP(mcp);
    results.push({ name: mcp.name, ...result });
  }

  // Resumo
  log('\n' + '═'.repeat(60), 'gray');
  log('\n📊 Resumo:\n', 'blue');

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const avgDuration = totalDuration / results.length;

  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const color = result.success ? 'green' : 'red';
    log(`  ${status} ${result.name.padEnd(20)} ${result.duration}ms`, color);
    if (result.error) {
      log(`     ↳ ${result.error}`, 'gray');
    }
  });

  log(`\n  Total: ${successCount}/${results.length} MCPs funcionais`, successCount === results.length ? 'green' : 'yellow');
  log(`  Tempo médio de resposta: ${avgDuration.toFixed(0)}ms`, 'gray');

  if (successCount === results.length) {
    log('\n✨ Todos os MCPs estão funcionando corretamente!\n', 'green');
    process.exit(0);
  } else {
    log(`\n⚠️  ${failCount} MCP(s) com problemas. Verifique os logs acima.\n`, 'yellow');
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}\n`, 'red');
  process.exit(1);
});
