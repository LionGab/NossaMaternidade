/**
 * Script de Validação do Prompt NathIA
 *
 * Valida se os prompts client e server estão sincronizados
 *
 * Uso: npx tsx scripts/validate-nathia-prompt.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const CLIENT_PROMPT_PATH = path.join(__dirname, '../src/ai/prompts/nathiaSystemPrompt.ts');
const SERVER_PROMPT_PATH = path.join(__dirname, '../supabase/functions/_shared/nathiaSystemPrompt.ts');

function validateSync(): boolean {
  try {
    console.log('🔍 Validando sincronização dos prompts NathIA...\n');

    // Verificar se os arquivos existem
    if (!fs.existsSync(CLIENT_PROMPT_PATH)) {
      console.error(`❌ Arquivo client não encontrado: ${CLIENT_PROMPT_PATH}`);
      return false;
    }

    if (!fs.existsSync(SERVER_PROMPT_PATH)) {
      console.error(`❌ Arquivo server não encontrado: ${SERVER_PROMPT_PATH}`);
      return false;
    }

    // Ler arquivos
    const clientContent = fs.readFileSync(CLIENT_PROMPT_PATH, 'utf-8');
    const serverContent = fs.readFileSync(SERVER_PROMPT_PATH, 'utf-8');

    // Extrair versão do client
    const clientVersionMatch = clientContent.match(/export const NATHIA_SYSTEM_PROMPT_VERSION = ['"](.+?)['"]/);
    const clientVersion = clientVersionMatch?.[1] || 'unknown';

    // Extrair prompt do client
    const clientPromptMatch = clientContent.match(/export const NATHIA_SYSTEM_PROMPT = `([\s\S]*?)`;/);
    if (!clientPromptMatch) {
      console.error('❌ Não foi possível extrair NATHIA_SYSTEM_PROMPT do arquivo client');
      return false;
    }
    const clientPrompt = clientPromptMatch[1];

    // Extrair prompt do server
    const serverPromptMatch = serverContent.match(/export const NATHIA_SYSTEM_PROMPT = `([\s\S]*?)`;/);
    if (!serverPromptMatch) {
      console.error('❌ Não foi possível extrair NATHIA_SYSTEM_PROMPT do arquivo server');
      return false;
    }
    const serverPrompt = serverPromptMatch[1];

    // Normalizar para comparação (remover espaços extras)
    const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
    const clientNormalized = normalize(clientPrompt);
    const serverNormalized = normalize(serverPrompt);

    // Comparar
    const promptsMatch = clientNormalized === serverNormalized;

    // Verificar versão no comentário do server
    const serverVersionMatch = serverContent.match(/Versão: (.+?) \(/);
    const serverVersion = serverVersionMatch?.[1] || 'unknown';

    // Exibir resultados
    console.log(`📋 Versão Client: ${clientVersion}`);
    console.log(`📋 Versão Server: ${serverVersion}`);
    console.log(`📏 Tamanho Client: ${clientNormalized.length} caracteres`);
    console.log(`📏 Tamanho Server: ${serverNormalized.length} caracteres`);
    console.log('');

    if (!promptsMatch) {
      console.error('❌ Prompts NÃO estão sincronizados!');
      console.error('   Execute: npm run sync:nathia-prompt');
      
      // Mostrar diferença aproximada
      const diff = Math.abs(clientNormalized.length - serverNormalized.length);
      if (diff > 0) {
        console.error(`   Diferença: ${diff} caracteres`);
      }
      
      return false;
    }

    if (clientVersion !== serverVersion) {
      console.warn('⚠️  Versões diferentes nos comentários (mas prompts são idênticos)');
      console.warn('   Execute: npm run sync:nathia-prompt para atualizar');
      return true; // Não é crítico, mas avisar
    }

    console.log('✅ Prompts estão sincronizados!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao validar:', error);
    return false;
  }
}

// Executar validação
const isValid = validateSync();
process.exit(isValid ? 0 : 1);
