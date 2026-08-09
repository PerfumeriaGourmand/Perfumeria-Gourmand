import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface Bucket {
  count: number;
  resetAt: number;
}

// Fallback usado si no hay Upstash configurado (dev local, o si nunca se
// crea la cuenta) — en memoria, por instancia. En Vercel cada instancia
// serverless tiene su propio Map, asi que esto NO protege de forma
// confiable en produccion con mas de una instancia corriendo; existe solo
// para que el proyecto siga funcionando sin depender de una cuenta externa.
const buckets = new Map<string, Bucket>();

function inMemoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (buckets.size > 5000) {
    for (const [k, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count++;
  return true;
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Un Ratelimit por combinacion (limit, windowMs) — se reusan entre requests
// en vez de crear uno nuevo cada vez.
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

// Si UPSTASH_REDIS_REST_URL/TOKEN estan configuradas, el limite se comparte
// entre todas las instancias serverless via Redis. Si no, cae al Map en
// memoria (ver comentario arriba) — ver migration guide en README/plan.
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (!redis) return inMemoryRateLimit(key, limit, windowMs);

  const { success } = await getLimiter(limit, windowMs).limit(key);
  return success;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
