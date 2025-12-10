/**
 * Supabase Edge Function: googleplay-proxy
 * Proxy seguro para Google Play Console API
 *
 * Esta função mantém as credenciais do Google Play Console no servidor (nunca expostas no bundle do app)
 * Gera OAuth2 tokens usando service account
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GooglePlayProxyRequest {
  endpoint: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  packageName?: string;
}

/**
 * Gera OAuth2 access token usando service account
 */
async function generateAccessToken(): Promise<string> {
  const serviceAccountEmail = Deno.env.get('GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL');
  const privateKey = Deno.env.get('GOOGLE_PLAY_PRIVATE_KEY');

  if (!serviceAccountEmail || !privateKey) {
    throw new Error('Google Play Console credentials not configured');
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

  // Criar JWT para service account
  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const jwtPayload = {
    iss: serviceAccountEmail,
    sub: serviceAccountEmail,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600, // 1 hora
    scope: 'https://www.googleapis.com/auth/androidpublisher',
  };

  // Nota: Em produção, usar biblioteca JWT adequada para Deno
  // Por enquanto, retornar placeholder - implementação real requer biblioteca JWT
  // TODO: Implementar assinatura JWT com RS256 usando private key

  // Por enquanto, fazer requisição direta ao Google OAuth2
  // (em produção, usar biblioteca adequada)
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const grantType = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
  const assertion = 'PLACEHOLDER_JWT'; // TODO: Gerar JWT real

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: grantType,
      assertion,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Failed to get OAuth2 token: ${tokenResponse.statusText}`);
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string };
  return tokenData.access_token;
}

serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { endpoint, method = 'GET', body, headers, packageName } = (await req.json()) as GooglePlayProxyRequest;

    // Gerar OAuth2 token
    const token = await generateAccessToken();

    // Fazer requisição para Google Play Console API
    const baseUrl = 'https://androidpublisher.googleapis.com/androidpublisher/v3';
    const fullEndpoint = packageName
      ? endpoint.replace('{packageName}', packageName)
      : endpoint;

    const response = await fetch(`${baseUrl}${fullEndpoint}`, {
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
        JSON.stringify({ error: `Google Play Console API error: ${response.status} ${errorText}` }),
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
    console.error('[googleplay-proxy] Error:', error);
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

