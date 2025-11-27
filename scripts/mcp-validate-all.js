#!/usr/bin/env node
/**
 * MCP Validate All
 *
 * Valida todos os arquivos do projeto com MCPs específicos
 * Para uso em CI/CD
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mcp: 'all', // 'all' or specific MCP name
    output: 'console', // 'console' or 'json'
    failOnCritical: true,
  };

  args.forEach(arg => {
    if (arg.startsWith('--mcp=')) {
      options.mcp = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      options.output = arg.split('=')[1];
    } else if (arg === '--no-fail-on-critical') {
      options.failOnCritical = false;
    }
  });

  return options;
}

// MCPs disponíveis
const MCP_CONFIGS = {
  'design-tokens': {
    runner: path.join(__dirname, '../src/mcp/runners/design-tokens-runner.js'),
    method: 'design.validate',
    params: { filePath: 'src/components/Checkbox.tsx' }, // Usar arquivo específico para evitar timeout
  },
  'code-quality': {
    runner: path.join(__dirname, '../src/mcp/runners/code-quality-runner.js'),
    method: 'code.analyze.design',
    params: { filePath: 'src/components/Checkbox.tsx' },
  },
  'accessibility': {
    runner: path.join(__dirname, '../src/mcp/runners/accessibility-runner.js'),
    method: 'a11y.audit.screen',
    params: { screenPath: 'src/screens/HomeScreen.tsx' },
  },
  'mobile-optimization': {
    runner: path.join(__dirname, '../src/mcp/runners/mobile-optimization-runner.js'),
    method: 'mobile.analyze.all',
    params: { filePath: 'src/screens/HomeScreen.tsx' }, // Usar arquivo específico para evitar timeout
  },
  'prompt-testing': {
    runner: path.join(__dirname, '../src/mcp/runners/prompt-testing-runner.js'),
    method: 'prompt.validate.all',
    params: { promptPath: 'src/mcp/servers/OpenAIMCPServer.ts' },
  },
};

// Chamar MCP e obter resultado
async function callMCP(mcpName, config) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(config.runner)) {
      reject(new Error(`Runner não encontrado: ${config.runner}`));
      return;
    }

    const child = spawn('node', [config.runner], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    const request = {
      jsonrpc: '2.0',
      id: `validate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      method: config.method,
      params: config.params,
    };

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Timeout ao chamar ${mcpName}`));
    }, 60000); // 60 segundos para validação completa (pode demorar em projetos grandes)

    let responseReceived = false;

    child.stdout.on('data', (data) => {
      output += data.toString();

      // Tentar parsear response assim que receber dados
      try {
        const lines = output.split('\n').filter(l => l.trim());
        for (const line of lines) {
          try {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              responseReceived = true;
              clearTimeout(timeout);
              child.kill();

              if (response.error) {
                reject(new Error(response.error.message));
              } else {
                resolve(response.data || {});
              }
              return;
            }
          } catch (e) {
            // Continuar acumulando output
          }
        }
      } catch (e) {
        // Continuar acumulando output
      }
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('exit', (code) => {
      clearTimeout(timeout);

      if (!responseReceived) {
        if (code !== 0) {
          reject(new Error(`Runner exit code ${code}: ${errorOutput}`));
        } else {
          reject(new Error('Response não encontrada'));
        }
      }
    });

    child.stdin.write(JSON.stringify(request) + '\n');
  });
}

// Processar resultado e contar violations
function processResult(mcpName, result) {
  const summary = {
    mcp: mcpName,
    totalIssues: 0,
    critical: 0,
    warning: 0,
    info: 0,
    files: [],
  };

  // Design tokens
  if (result.violations && Array.isArray(result.violations)) {
    summary.totalIssues = result.violations.length;
    summary.critical = result.violations.filter(v => v.severity === 'critical').length;
    summary.warning = result.violations.filter(v => v.severity === 'warning').length;
    summary.info = result.violations.filter(v => v.severity === 'info').length;
    summary.files = [...new Set(result.violations.map(v => v.file))];
    return summary; // Retornar early se encontrou violations
  }

  // Code quality (issues é um array)
  if (result.issues && Array.isArray(result.issues)) {
    summary.totalIssues = result.issues.length;
    summary.critical = result.issues.filter(i => i.severity === 'critical').length;
    summary.warning = result.issues.filter(i => i.severity === 'warning').length;
    summary.info = result.issues.filter(i => i.severity === 'info').length;
    return summary; // Retornar early
  }

  // Accessibility (issues é um objeto com contadores)
  if (result.issues && typeof result.issues === 'object' && !Array.isArray(result.issues)) {
    const issues = Object.values(result.issues).reduce((sum, count) => sum + (count || 0), 0);
    summary.totalIssues = issues;
    // Accessibility não tem severity breakdown, usar totalIssues
    return summary; // Retornar early
  }

  // Mobile optimization
  if (result.summary) {
    summary.totalIssues = result.summary.totalIssues || 0;
    summary.critical = result.summary.critical || 0;
    summary.warning = result.summary.warning || 0;
    summary.info = result.summary.info || 0;
  }

  // Prompt testing
  if (result.summary) {
    summary.totalIssues = result.summary.totalIssues || 0;
    summary.critical = result.summary.critical || 0;
    summary.warning = result.summary.warning || 0;
    summary.info = result.summary.info || 0;
  }

  return summary;
}

// Validar com um MCP específico
async function validateMCP(mcpName, options) {
  const config = MCP_CONFIGS[mcpName];
  if (!config) {
    throw new Error(`MCP não encontrado: ${mcpName}`);
  }

  try {
    const result = await callMCP(mcpName, config);
    return processResult(mcpName, result);
  } catch (error) {
    return {
      mcp: mcpName,
      error: error.message,
      totalIssues: 0,
      critical: 0,
      warning: 0,
      info: 0,
      files: [],
    };
  }
}

// Validar com todos os MCPs
async function validateAll(options) {
  const mcpsToValidate = options.mcp === 'all' 
    ? Object.keys(MCP_CONFIGS)
    : [options.mcp];

  const results = [];
  for (const mcpName of mcpsToValidate) {
    const result = await validateMCP(mcpName, options);
    results.push(result);
  }

  return results;
}

// Main
async function main() {
  const options = parseArgs();

  console.log('\n🔍 MCP Validate All\n');
  console.log('═'.repeat(60));

  try {
    const results = await validateAll(options);

    // Output
    if (options.output === 'json') {
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.log('\n📊 Resultados:\n');

      let totalIssues = 0;
      let totalCritical = 0;
      let hasErrors = false;

      results.forEach(result => {
        if (result.error) {
          console.log(`❌ ${result.mcp}: ${result.error}`);
          hasErrors = true;
        } else {
          const status = result.critical > 0 ? '🔴' : result.warning > 0 ? '🟡' : result.totalIssues > 0 ? '🟠' : '✅';
          console.log(`${status} ${result.mcp.padEnd(25)} ${result.totalIssues} issues (${result.critical} critical, ${result.warning} warning, ${result.info} info)`);
          
          totalIssues += result.totalIssues;
          totalCritical += result.critical;
        }
      });

      console.log('\n' + '═'.repeat(60));
      console.log(`\n📈 Total: ${totalIssues} issues (${totalCritical} critical)`);

      // Exit code
      if (hasErrors) {
        process.exit(1);
      }

      if (options.failOnCritical && totalCritical > 0) {
        console.log(`\n❌ Falha: ${totalCritical} issues críticos encontrados`);
        process.exit(1);
      }

      if (totalIssues === 0) {
        console.log('\n✅ Nenhuma violation encontrada!');
        process.exit(0);
      } else {
        console.log(`\n⚠️  ${totalIssues} issues encontrados (mas nenhum crítico)`);
        process.exit(0);
      }
    }
  } catch (error) {
    console.error('\n❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

main();


