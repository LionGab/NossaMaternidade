/**
 * Supabase MCP Server
 * Fornece acesso ao Supabase para autenticação, banco de dados e storage
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  MCPServer,
  MCPRequest,
  MCPResponse,
  createMCPResponse,
  MCPError,
} from '../types';

export class SupabaseMCPServer implements MCPServer {
  name = 'supabase-mcp';
  version = '1.0.0';

  private client: SupabaseClient | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not configured');
      }

      this.client = createClient(supabaseUrl, supabaseKey);
      this.initialized = true;

      console.log('[SupabaseMCP] Initialized successfully');
    } catch (error) {
      console.error('[SupabaseMCP] Initialization failed:', error);
      throw error;
    }
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized || !this.client) {
      return createMCPResponse(request.id, undefined, {
        code: 'NOT_INITIALIZED',
        message: 'MCP Server not initialized',
      });
    }

    try {
      const [category, action] = request.method.split('.');

      switch (category) {
        case 'auth':
          return await this.handleAuth(request.id, action, request.params);
        case 'db':
          return await this.handleDatabase(request.id, action, request.params);
        case 'storage':
          return await this.handleStorage(request.id, action, request.params);
        default:
          return createMCPResponse(request.id, undefined, {
            code: 'UNKNOWN_METHOD',
            message: `Unknown method category: ${category}`,
          });
      }
    } catch (error: any) {
      return createMCPResponse(request.id, undefined, {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        details: error,
      });
    }
  }

  private async handleAuth(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    if (!this.client) throw new Error('Client not initialized');

    switch (action) {
      case 'signIn': {
        const { email, password } = params;
        const { data, error } = await this.client.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'AUTH_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, data);
      }

      case 'signUp': {
        const { email, password, metadata } = params;
        const { data, error } = await this.client.auth.signUp({
          email,
          password,
          options: { data: metadata },
        });

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'AUTH_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, data);
      }

      case 'signOut': {
        const { error } = await this.client.auth.signOut();

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'AUTH_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, { success: true });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown auth action: ${action}`,
        });
    }
  }

  private async handleDatabase(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    if (!this.client) throw new Error('Client not initialized');

    const { table } = params;

    switch (action) {
      case 'query': {
        const { query } = params;
        const { data, error } = await this.client
          .from(table)
          .select(query.select || '*')
          .match(query.match || {});

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'DB_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, data);
      }

      case 'insert': {
        const { data: insertData } = params;
        const { data, error } = await this.client
          .from(table)
          .insert(insertData)
          .select();

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'DB_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, data);
      }

      case 'update': {
        const { id: recordId, data: updateData } = params;
        const { data, error } = await this.client
          .from(table)
          .update(updateData)
          .eq('id', recordId)
          .select();

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'DB_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, data);
      }

      case 'delete': {
        const { id: recordId } = params;
        const { error } = await this.client
          .from(table)
          .delete()
          .eq('id', recordId);

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'DB_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, { success: true });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown database action: ${action}`,
        });
    }
  }

  private async handleStorage(
    id: string,
    action: string,
    params: any
  ): Promise<MCPResponse> {
    if (!this.client) throw new Error('Client not initialized');

    const { bucket, path } = params;

    switch (action) {
      case 'upload': {
        const { file } = params;
        const { data, error } = await this.client.storage
          .from(bucket)
          .upload(path, file);

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'STORAGE_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, data);
      }

      case 'download': {
        const { data, error } = await this.client.storage
          .from(bucket)
          .download(path);

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'STORAGE_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, data);
      }

      case 'delete': {
        const { error } = await this.client.storage
          .from(bucket)
          .remove([path]);

        if (error) {
          return createMCPResponse(id, undefined, {
            code: 'STORAGE_ERROR',
            message: error.message,
          });
        }

        return createMCPResponse(id, { success: true });
      }

      default:
        return createMCPResponse(id, undefined, {
          code: 'UNKNOWN_ACTION',
          message: `Unknown storage action: ${action}`,
        });
    }
  }

  async shutdown(): Promise<void> {
    this.client = null;
    this.initialized = false;
    console.log('[SupabaseMCP] Shutdown complete');
  }
}

// Singleton instance
export const supabaseMCP = new SupabaseMCPServer();
