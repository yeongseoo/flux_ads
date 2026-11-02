import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { db } from "./db";

/** 클라이언트 IP를 비밀키로 해시 — 원본 IP는 저장하지 않습니다. */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const secret = process.env.SESSION_SECRET || "flux-ads-dev-only";
  return createHmac("sha256", secret).update(`ip:${ip}`).digest("base64url").slice(0, 32);
}

/** windowMs 동안 limit 회를 초과했는지 확인 */
export function isLimited(bucket: string, key: string, limit: number, windowMs: number): boolean {
  const since = Date.now() - windowMs;
  const row = db()
    .prepare("SELECT COUNT(*) AS n FROM rate_events WHERE bucket = ? AND key_hash = ? AND created_at > ?")
    .get(bucket, key, since) as { n: number };
  return row.n >= limit;
}

export function recordEvent(bucket: string, key: string): void {
  const d = db();
  d.prepare("INSERT INTO rate_events (bucket, key_hash, created_at) VALUES (?, ?, ?)").run(bucket, key, Date.now());
  d.prepare("DELETE FROM rate_events WHERE created_at < ?").run(Date.now() - 24 * 60 * 60 * 1000);
}

export function clearEvents(bucket: string, key: string): void {
  db().prepare("DELETE FROM rate_events WHERE bucket = ? AND key_hash = ?").run(bucket, key);
}
