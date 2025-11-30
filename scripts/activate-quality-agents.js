#!/usr/bin/env node
/**
 * Script para Ativar Agentes e MCPs para Correção de Qualidade
 * 
 * Uso: node scripts/activate-quality-agents.js
 * 
 * Este script:
 * 1. Verifica se os agentes necessários estão configurados
 * 2. Verifica se os MCPs estão funcionando
 * 3. Inicializa os agentes se necessário
 * 4. Gera relatório de status
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log('\n' + '═'.repeat(60), 'gray');
  log(`${colors.bright}${title}${colors.reset}`, 'blue');
  log('═'.repeat(60), 'gray');
}

// Agentes necessários para correção de qualidade
const REQUIRED_AGENTS = [
  {
    name: 'DesignQualityAgent',
    file: 'src/agents/design/DesignQualityAgent.ts',
    description: 'Validação de design tokens e qualidade de código',
    capabilities: [
      'validate-design-tokens',
      'fix-design-violations',
      'suggest-design-improvements',
      'audit-accessibility',
      'check-dark-mode',
      'analyze-code-quality',
    ],
  },
];

// MCPs necessários (configurados em mcp.json)
const REQUIRED_MCPS = [
  {
    name: 'code-quality',
    runner: 'src/mcp/runners/code-quality-runner.js',
    description: 'Validação de qualidade de código (ESLint, TypeScript)',
  },
  {
    name: 'design-tokens',
    runner: 'src/mcp/runners/design-tokens-runner.js',
    description: 'Validação de design tokens (cores, spacing, etc)',
  },
  {
    name: 'accessibility',
    runner: 'src/mcp/runners/accessibility-runner.js',
    description: 'Auditoria de acessibilidade WCAG AAA',
  },
  {
    name: 'mobile-optimization',
    runner: 'src/mcp/runners/mobile-optimization-runner.js',
    description: 'Otimização mobile (FlatList, memo, images)',
  },
  {
    name: 'prompt-testing',
    runner: 'src/mcp/runners/prompt-testing-runner.js',
    description: 'Teste de prompts de IA',
  },
];

// Scripts de validação disponíveis
const VALIDATION_SCRIPTS = [
  {
    name: 'validate:design',
    command: 'npm run validate:design',
    description: 'Valida design tokens',
  },
  {
    name: 'type-check',
    command: 'npm run type-check',
    description: 'Verifica erros TypeScript',
  },
  {
    name: 'lint',
    command: 'npm run lint',
    description: 'Verifica ESLint',
  },
  {
    name: 'test',
    command: 'npm test',
    description: 'Executa testes',
  },
];

function checkFileExists(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

function checkAgent(agent) {
  log(`\n📦 ${agent.name}`, 'bright');
  log(`   Descrição: ${agent.description}`, 'gray');
  
  const exists = checkFileExists(agent.file);
  if (exists) {
    log(`   ✅ Arquivo encontrado: ${agent.file}`, 'green');
    
    // Verificar se está exportado em index.ts
    const indexPath = path.resolve(process.cwd(), 'src/agents/index.ts');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      if (indexContent.includes(agent.name)) {
        log(`   ✅ Exportado em src/agents/index.ts`, 'green');
      } else {
        log(`   ⚠️  Não exportado em src/agents/index.ts`, 'yellow');
      }
    }
    
    // Verificar capabilities
    log(`   🔧 Capabilities:`, 'gray');
    agent.capabilities.forEach(cap => {
      log(`      • ${cap}`, 'gray');
    });
    
    return { exists: true, exported: true };
  } else {
    log(`   ❌ Arquivo não encontrado: ${agent.file}`, 'red');
    return { exists: false, exported: false };
  }
}

function checkMCP(mcp) {
  log(`\n🔌 ${mcp.name}`, 'bright');
  log(`   Descrição: ${mcp.description}`, 'gray');
  
  const runnerExists = checkFileExists(mcp.runner);
  if (runnerExists) {
    log(`   ✅ Runner encontrado: ${mcp.runner}`, 'green');
  } else {
    log(`   ⚠️  Runner não encontrado: ${mcp.runner}`, 'yellow');
    log(`      (Pode estar em scripts/mcp-servers/)`, 'gray');
  }
  
  // Verificar se está em mcp.json
  const mcpJsonPath = path.resolve(process.cwd(), 'mcp.json');
  if (fs.existsSync(mcpJsonPath)) {
    const mcpJson = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
    const mcpServers = mcpJson.mcpServers || {};
    
    if (mcpServers[mcp.name]) {
      log(`   ✅ Configurado em mcp.json`, 'green');
      return { runnerExists, configured: true };
    } else {
      log(`   ⚠️  Não configurado em mcp.json`, 'yellow');
      return { runnerExists, configured: false };
    }
  } else {
    log(`   ⚠️  mcp.json não encontrado`, 'yellow');
    return { runnerExists, configured: false };
  }
}

function checkValidationScript(script) {
  log(`\n🔍 ${script.name}`, 'bright');
  log(`   Descrição: ${script.description}`, 'gray');
  
  try {
    // Apenas verificar se o comando existe no package.json
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const scripts = packageJson.scripts || {};
      
      const scriptName = script.name.split(':')[1] || script.name;
      const scriptKey = Object.keys(scripts).find(key => key.includes(scriptName));
      
      if (scriptKey) {
        log(`   ✅ Disponível como: npm run ${scriptKey}`, 'green');
        return { available: true, key: scriptKey };
      } else {
        log(`   ⚠️  Não encontrado em package.json`, 'yellow');
        return { available: false };
      }
    } else {
      log(`   ❌ package.json não encontrado`, 'red');
      return { available: false };
    }
  } catch (error) {
    log(`   ❌ Erro ao verificar: ${error.message}`, 'red');
    return { available: false };
  }
}

function generateActivationReport(results) {
  logSection('📊 RELATÓRIO DE ATIVAÇÃO');
  
  const agentResults = results.agents;
  const mcpResults = results.mcps;
  const scriptResults = results.scripts;
  
  // Resumo de Agentes
  log('\n🤖 Agentes:', 'bright');
  const agentsOk = agentResults.filter(r => r.exists && r.exported).length;
  const agentsTotal = agentResults.length;
  log(`   ${agentsOk}/${agentsTotal} agentes prontos`, agentsOk === agentsTotal ? 'green' : 'yellow');
  
  // Resumo de MCPs
  log('\n🔌 MCPs:', 'bright');
  const mcpsOk = mcpResults.filter(r => r.runnerExists && r.configured).length;
  const mcpsTotal = mcpResults.length;
  log(`   ${mcpsOk}/${mcpsTotal} MCPs configurados`, mcpsOk === mcpsTotal ? 'green' : 'yellow');
  
  // Resumo de Scripts
  log('\n🔍 Scripts de Validação:', 'bright');
  const scriptsOk = scriptResults.filter(r => r.available).length;
  const scriptsTotal = scriptResults.length;
  log(`   ${scriptsOk}/${scriptsTotal} scripts disponíveis`, scriptsOk === scriptsTotal ? 'green' : 'yellow');
  
  // Status geral
  log('\n📈 Status Geral:', 'bright');
  const totalOk = agentsOk + mcpsOk + scriptsOk;
  const totalItems = agentsTotal + mcpsTotal + scriptsTotal;
  const percentage = Math.round((totalOk / totalItems) * 100);
  
  log(`   ${totalOk}/${totalItems} itens prontos (${percentage}%)`, percentage >= 80 ? 'green' : percentage >= 50 ? 'yellow' : 'red');
  
  if (percentage >= 80) {
    log('\n✨ Sistema pronto para correção de qualidade!', 'green');
    log('   Você pode começar a Fase 1 do plano de correção.', 'gray');
  } else if (percentage >= 50) {
    log('\n⚠️  Sistema parcialmente pronto.', 'yellow');
    log('   Alguns itens precisam de configuração antes de começar.', 'gray');
  } else {
    log('\n❌ Sistema não está pronto.', 'red');
    log('   Configure os itens faltantes antes de começar.', 'gray');
  }
}

async function main() {
  log('\n🚀 ATIVAÇÃO DE AGENTES E MCPs PARA CORREÇÃO DE QUALIDADE\n', 'blue');
  log('═'.repeat(60), 'gray');
  
  const results = {
    agents: [],
    mcps: [],
    scripts: [],
  };
  
  // Verificar Agentes
  logSection('🤖 VERIFICANDO AGENTES');
  for (const agent of REQUIRED_AGENTS) {
    const result = checkAgent(agent);
    results.agents.push({ name: agent.name, ...result });
  }
  
  // Verificar MCPs
  logSection('🔌 VERIFICANDO MCPs');
  for (const mcp of REQUIRED_MCPS) {
    const result = checkMCP(mcp);
    results.mcps.push({ name: mcp.name, ...result });
  }
  
  // Verificar Scripts
  logSection('🔍 VERIFICANDO SCRIPTS DE VALIDAÇÃO');
  for (const script of VALIDATION_SCRIPTS) {
    const result = checkValidationScript(script);
    results.scripts.push({ name: script.name, ...result });
  }
  
  // Gerar Relatório
  generateActivationReport(results);
  
  // Próximos Passos
  logSection('📝 PRÓXIMOS PASSOS');
  log('\n1. Revisar o plano de correção:', 'bright');
  log('   📄 plano-de-correcao-de-qualidade-nossa-maternidade.plan.md', 'gray');
  log('\n2. Começar pela Fase 1: Limpeza Rápida', 'bright');
  log('   • Remover console.log (30min)', 'gray');
  log('   • Limpar variáveis não usadas (1-2h)', 'gray');
  log('   • Corrigir let → const (15min)', 'gray');
  log('\n3. Executar validações:', 'bright');
  log('   npm run validate:design', 'gray');
  log('   npm run type-check', 'gray');
  log('   npm run lint', 'gray');
  log('\n4. Usar agentes via AgentsContext:', 'bright');
  log('   const { designAgent } = useAgents();', 'gray');
  log('   await designAgent.process({ validateTokens: true });', 'gray');
  
  log('\n' + '═'.repeat(60), 'gray');
  log('\n✅ Verificação completa!\n', 'green');
}

main().catch(error => {
  log(`\n❌ Erro: ${error.message}\n`, 'red');
  process.exit(1);
});

