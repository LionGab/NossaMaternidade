/**
 * Supabase Edge Function: appstore-proxy
 * Proxy seguro para App Store Connect API
 *
 * Esta função mantém as credenciais do App Store Connect no servidor (nunca expostas no bundle do app)
 * Gera JWT tokens usando biblioteca jose (Deno-compatible)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import * as jose from 'https://deno.land/x/jose@v5.2.0/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppStoreProxyRequest {
  endpoint: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Gera JWT para App Store Connect API
 */
async function generateJWT(): Promise<string> {
  const issuerId = Deno.env.get('APP_STORE_CONNECT_ISSUER_ID');
  const keyId = Deno.env.get('APP_STORE_CONNECT_KEY_ID');
  const privateKey = Deno.env.get('APP_STORE_CONNECT_PRIVATE_KEY');

  if (!issuerId || !keyId || !privateKey) {
    throw new Error('App Store Connect credentials not configured');
  }

  // Decodificar private key se estiver em base64
  let pemKey = privateKey;
  if (!privateKey.includes('-----BEGIN')) {
    try {
      pemKey = new TextDecoder().decode(
        Uint8Array.from(atob(privateKey), (c) => c.charCodeAt(0))
      );
    } catch {
      // Se falhar, usar como está
      pemKey = privateKey;
    }
  }

  const key = await jose.importPKCS8(pemKey, 'ES256');

  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: keyId, typ: 'JWT' })
    .setIssuedAt()
    .setIssuer(issuerId)
    .setAudience('appstoreconnect-v1')
    .setExpirationTime('5m')
    .sign(key);

  return jwt;
}

serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { endpoint, method = 'GET', body, headers } = (await req.json()) as AppStoreProxyRequest;

    // Gerar JWT
    const token = await generateJWT();

    // Fazer requisição para App Store Connect API
    const baseUrl = 'https://api.appstoreconnect.apple.com/v1';
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `App Store Connect API error: ${response.status} ${errorText}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[appstore-proxy] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

