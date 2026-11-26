import { createClient, SupabaseClient } from '@supabase/supabase-js';

const LOCAL_URL_KEY = '01web_supabase_url';
const LOCAL_ANON_KEY = '01web_supabase_anon_key';

export type CloudDbSource = 'env' | 'local_override' | 'offline';

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

function readEnvCredentials(): { url: string; anonKey: string } {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  const anonKey = (
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined) ||
    ''
  ).trim();
  return { url, anonKey };
}

export function getStoredLocalSupabaseConfig(): { url: string; anonKey: string } {
  if (typeof window === 'undefined') return { url: '', anonKey: '' };
  try {
    return {
      url: (localStorage.getItem(LOCAL_URL_KEY) || '').trim(),
      anonKey: (localStorage.getItem(LOCAL_ANON_KEY) || '').trim(),
    };
  } catch {
    return { url: '', anonKey: '' };
  }
}

export function getCloudDatabaseSource(): CloudDbSource {
  const env = readEnvCredentials();
  if (env.url && env.anonKey) return 'env';

  const local = getStoredLocalSupabaseConfig();
  if (local.url && local.anonKey) return 'local_override';

  return 'offline';
}

export function isCloudDatabaseConfigured(): boolean {
  return getCloudDatabaseSource() !== 'offline';
}

function resolveActiveCredentials(): { url: string; anonKey: string } {
  const env = readEnvCredentials();
  if (env.url && env.anonKey) return env;

  const local = getStoredLocalSupabaseConfig();
  if (local.url && local.anonKey) return local;

  return { url: '', anonKey: '' };
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = resolveActiveCredentials();
  if (!url || !anonKey) {
    cachedClient = null;
    cachedSignature = '';
    return null;
  }

  const signature = `${url}::${anonKey}`;
  if (cachedClient && cachedSignature === signature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    cachedSignature = signature;
    return cachedClient;
  } catch {
    cachedClient = null;
    cachedSignature = '';
    return null;
  }
}

export function saveLocalSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_URL_KEY, url.trim());
    localStorage.setItem(LOCAL_ANON_KEY, anonKey.trim());
    cachedClient = null;
    cachedSignature = '';
  } catch {
    // ignore
  }
}

export function clearLocalSupabaseConfig(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_URL_KEY);
    localStorage.removeItem(LOCAL_ANON_KEY);
    cachedClient = null;
    cachedSignature = '';
  } catch {
    // ignore
  }
}

export async function testCloudConnection(): Promise<{
  ok: boolean;
  message: string;
  leadsCount?: number;
}> {
  const { url, anonKey } = resolveActiveCredentials();
  if (!url || !anonKey) {
    return {
      ok: false,
      message: 'Cole a Project URL e a Anon Public Key do seu Supabase antes de testar.',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      message: 'URL ou chave do Supabase inválida. Confira se copiou o link https://... completo.',
    };
  }

  try {
    const { count, error } = await client
      .from('leads')
      .select('id', { count: 'exact', head: true });

    if (error) {
      const lowerMsg = (error.message || '').toLowerCase();
      if (lowerMsg.includes('relation') || lowerMsg.includes('does not exist')) {
        return {
          ok: false,
          message:
            'Conectou no Supabase, mas as tabelas ainda não foram criadas! Cole o arquivo supabase/schema.sql no SQL Editor e clique em RUN.',
        };
      }
      return {
        ok: false,
        message: `Erro do Supabase: ${error.message}`,
      };
    }

    return {
      ok: true,
      leadsCount: count ?? 0,
      message: `Conectado com sucesso na nuvem! (${count ?? 0} leads salvos no banco PostgreSQL).`,
    };
  } catch (err) {
    return {
      ok: false,
      message: `Falha de rede ao conectar no Supabase: ${
        err instanceof Error ? err.message : 'erro desconhecido'
      }`,
    };
  }
}
