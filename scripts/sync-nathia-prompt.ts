/**
 * Script de Sincronização do Prompt NathIA
 *
 * Sincroniza o prompt canônico do client (src/ai/prompts/nathiaSystemPrompt.ts)
 * para o server (supabase/functions/_shared/nathiaSystemPrompt.ts)
 *
 * Uso: npx tsx scripts/sync-nathia-prompt.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const CLIENT_PROMPT_PATH = path.join(__dirname, '../src/ai/prompts/nathiaSystemPrompt.ts');
const SERVER_PROMPT_PATH = path.join(__dirname, '../supabase/functions/_shared/nathiaSystemPrompt.ts');

interface PromptData {
  version: string;
  prompt: string;
  rules: string;
}

/**
 * Extrai o prompt do arquivo client
 */
function extractClientPrompt(): PromptData {
  const content = fs.readFileSync(CLIENT_PROMPT_PATH, 'utf-8');

  // Extrair versão
  const versionMatch = content.match(/export const NATHIA_SYSTEM_PROMPT_VERSION = ['"](.+?)['"]/);
  const version = versionMatch?.[1] || 'unknown';

  // Extrair prompt (entre as backticks)
  const promptMatch = content.match(/export const NATHIA_SYSTEM_PROMPT = `([\s\S]*?)`;/);
  if (!promptMatch) {
    throw new Error('Não foi possível extrair NATHIA_SYSTEM_PROMPT do arquivo client');
  }
  const prompt = promptMatch[1];

  // Extrair regras obrigatórias
  const rulesMatch = content.match(/export const NATHIA_MANDATORY_RULES = `([\s\S]*?)`;/);
  const rules = rulesMatch?.[1] || '';

  return { version, prompt, rules };
}

/**
 * Gera o conteúdo do arquivo server
 */
function generateServerFile(data: PromptData): string {
  return `/**
 * NathIA System Prompt - Versão Server-Side (Edge Functions)
 *
 * ⚠️ ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITAR MANUALMENTE
 * 
 * Este prompt é usado como fallback quando o client não envia systemInstruction
 * Garante consistência mesmo para apps desatualizados ou chamadas diretas
 *
 * Versão: ${data.version} (Consolidada)
 * Sincronizado automaticamente de src/ai/prompts/nathiaSystemPrompt.ts
 * 
 * Para atualizar este arquivo, execute: npm run sync:nathia-prompt
 */

export const NATHIA_SYSTEM_PROMPT = \`${data.prompt}\`;

${data.rules ? `export const NATHIA_MANDATORY_RULES = \`${data.rules}\`;` : ''}
`;
}

/**
 * Valida se os prompts estão sincronizados
 */
function validateSync(): boolean {
  try {
    const clientData = extractClientPrompt();
    const serverContent = fs.readFileSync(SERVER_PROMPT_PATH, 'utf-8');

    // Verificar se o prompt está presente no server
    const serverPromptMatch = serverContent.match(/export const NATHIA_SYSTEM_PROMPT = `([\s\S]*?)`;/);
    if (!serverPromptMatch) {
      console.error('❌ Prompt não encontrado no arquivo server');
      return false;
    }

    const serverPrompt = serverPromptMatch[1];

    // Comparar prompts (normalizar espaços em branco)
    const clientPromptNormalized = clientData.prompt.replace(/\s+/g, ' ').trim();
    const serverPromptNormalized = serverPrompt.replace(/\s+/g, ' ').trim();

    if (clientPromptNormalized !== serverPromptNormalized) {
      console.error('❌ Prompts não estão sincronizados');
      console.error(`Client length: ${clientPromptNormalized.length}`);
      console.error(`Server length: ${serverPromptNormalized.length}`);
      return false;
    }

    // Verificar versão no comentário do server
    const versionMatch = serverContent.match(/Versão: (.+?) \(/);
    if (versionMatch?.[1] !== clientData.version) {
      console.warn(`⚠️  Versões diferentes: client=${clientData.version}, server=${versionMatch?.[1]}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao validar sincronização:', error);
    return false;
  }
}

/**
 * Sincroniza o prompt do client para o server
 */
function syncPrompt(): void {
  try {
    console.log('🔄 Sincronizando prompt NathIA...');

    // Extrair dados do client
    const clientData = extractClientPrompt();
    console.log(`✅ Prompt extraído (versão ${clientData.version})`);

    // Gerar conteúdo do server
    const serverContent = generateServerFile(clientData);

    // Verificar se o diretório existe
    const serverDir = path.dirname(SERVER_PROMPT_PATH);
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
      console.log(`📁 Diretório criado: ${serverDir}`);
    }

    // Escrever arquivo server
    fs.writeFileSync(SERVER_PROMPT_PATH, serverContent, 'utf-8');
    console.log(`✅ Prompt sincronizado para: ${SERVER_PROMPT_PATH}`);

    // Validar sincronização
    if (validateSync()) {
      console.log('✅ Validação: Prompts estão sincronizados');
    } else {
      console.error('❌ Validação falhou após sincronização');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro ao sincronizar prompt:', error);
    process.exit(1);
  }
}

// Executar
const command = process.argv[2];

if (command === 'validate' || command === '--validate') {
  console.log('🔍 Validando sincronização dos prompts...');
  const isValid = validateSync();
  if (isValid) {
    console.log('✅ Prompts estão sincronizados');
    process.exit(0);
  } else {
    console.error('❌ Prompts não estão sincronizados. Execute: npm run sync:nathia-prompt');
    process.exit(1);
  }
} else {
  syncPrompt();
}
