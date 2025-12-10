/**
 * Supabase Edge Function: sentry-proxy
 * Proxy seguro para Sentry API
 *
 * Esta função mantém o API token do Sentry no servidor (nunca exposta no bundle do app)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SentryProxyRequest {
  action: 'listReleases' | 'getRelease' | 'listTopCrashes' | 'getIssue' | 'getReleaseHealth';
  params: {
    organizationSlug: string;
    projectSlug: string;
    version?: string;
    release?: string;
    issueId?: string;
    limit?: number;
    since?: string;
  };
}

serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, params } = (await req.json()) as SentryProxyRequest;

    // 🔐 Token seguro no servidor - NUNCA vai para o app!
    const SENTRY_AUTH_TOKEN = Deno.env.get('SENTRY_AUTH_TOKEN');
    if (!SENTRY_AUTH_TOKEN) {
      throw new Error('SENTRY_AUTH_TOKEN não configurada');
    }

    const baseUrl = 'https://sentry.io/api/0';
    const { organizationSlug, projectSlug } = params;

    let url = '';
    let response: Response;

    switch (action) {
      case 'listReleases': {
        url = `${baseUrl}/projects/${organizationSlug}/${projectSlug}/releases/?per_page=${params.limit || 10}`;
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SENTRY_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        break;
      }

      case 'getRelease': {
        if (!params.version) {
          throw new Error('version is required for getRelease');
        }
        url = `${baseUrl}/projects/${organizationSlug}/${projectSlug}/releases/${params.version}/`;
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SENTRY_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        break;
      }

      case 'listTopCrashes': {
        const release = params.release || 'current';
        url = `${baseUrl}/projects/${organizationSlug}/${projectSlug}/issues/?query=release:${release}&statsPeriod=14d&per_page=${params.limit || 10}`;
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SENTRY_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        break;
      }

      case 'getIssue': {
        if (!params.issueId) {
          throw new Error('issueId is required for getIssue');
        }
        url = `${baseUrl}/projects/${organizationSlug}/${projectSlug}/issues/${params.issueId}/`;
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SENTRY_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        break;
      }

      case 'getReleaseHealth': {
        if (!params.release) {
          throw new Error('release is required for getReleaseHealth');
        }
        const statsPeriod = params.since || '14d';
        url = `${baseUrl}/projects/${organizationSlug}/${projectSlug}/releases/${params.release}/stats/?stat=crash-free-sessions&stat=crash-free-users&stat=sessions&stat=users&stat=new&stat=resolved&stat=regressed&stat=unhandled&stat=unhandled-new&stat=unhandled-regressed&interval=1d&statsPeriod=${statsPeriod}`;
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SENTRY_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `Sentry API error: ${response.status} ${errorText}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    // Processar dados conforme necessário
    if (action === 'getReleaseHealth') {
      const stats = data as Array<[number, Array<number>]>;
      const latest = stats[stats.length - 1];
      const crashFreeSessions = latest?.[1]?.[0] ?? null;
      const crashFreeUsers = latest?.[1]?.[1] ?? null;
      const sessions = latest?.[1]?.[2] ?? 0;
      const users = latest?.[1]?.[3] ?? 0;

      const totals = stats.reduce(
        (acc, [, values]) => ({
          new: acc.new + (values[4] ?? 0),
          resolved: acc.resolved + (values[5] ?? 0),
          regressed: acc.regressed + (values[6] ?? 0),
          unhandled: acc.unhandled + (values[7] ?? 0),
          unhandledNew: acc.unhandledNew + (values[8] ?? 0),
          unhandledRegressed: acc.unhandledRegressed + (values[9] ?? 0),
        }),
        {
          new: 0,
          resolved: 0,
          regressed: 0,
          unhandled: 0,
          unhandledNew: 0,
          unhandledRegressed: 0,
        }
      );

      const processed = {
        release: params.release,
        date: new Date(latest?.[0] * 1000).toISOString(),
        ...totals,
        crashFreeUsers: crashFreeUsers !== null ? crashFreeUsers * 100 : null,
        crashFreeSessions: crashFreeSessions !== null ? crashFreeSessions * 100 : null,
        sessions,
        users,
      };

      return new Response(JSON.stringify(processed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[sentry-proxy] Error:', error);
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

