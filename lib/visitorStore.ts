const COUNTER_KEY = 'nexasmc:website-visitors:total';

type UpstashResult<T> = {
  result?: T;
  error?: string;
};

function getRedisCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

export function isVisitorStoreConfigured(): boolean {
  return getRedisCredentials() !== null;
}

function visitorSeed(): number {
  const parsed = Number.parseInt(process.env.NEXA_VISITOR_SEED || '0', 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

async function redisCommand<T>(command: Array<string | number>): Promise<T> {
  const credentials = getRedisCredentials();
  if (!credentials) throw new Error('Visitor storage is not configured.');

  const response = await fetch(credentials.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command),
    cache: 'no-store'
  });

  const data = await response.json() as UpstashResult<T>;
  if (!response.ok || data.error) {
    throw new Error(data.error || `Visitor storage request failed with HTTP ${response.status}.`);
  }

  return data.result as T;
}

export async function getVisitorCount(): Promise<number> {
  if (!isVisitorStoreConfigured()) return visitorSeed();

  const existing = await redisCommand<string | number | null>(['GET', COUNTER_KEY]);
  if (existing == null) return visitorSeed();
  return Math.max(0, Number(existing) || 0);
}

export async function incrementVisitorCount(): Promise<number> {
  if (!isVisitorStoreConfigured()) return visitorSeed();

  const seed = visitorSeed();
  if (seed > 0) {
    await redisCommand<number>(['SETNX', COUNTER_KEY, seed]);
  }

  return Number(await redisCommand<number>(['INCR', COUNTER_KEY]));
}
