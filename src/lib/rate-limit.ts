import type { NextRequest } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

// In-memory, per-instance only — resets on cold start and isn't shared across
// serverless instances. Good enough to blunt casual abuse/enumeration; if
// traffic grows, swap for Upstash Redis (@upstash/ratelimit) for a shared store.
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
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

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
