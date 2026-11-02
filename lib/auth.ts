import "server-only";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "flux_admin";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8시간

export function authConfigError(): string | null {
  if (!process.env.ADMIN_USERNAME?.trim()) return "ADMIN_USERNAME 환경 변수가 설정되지 않았습니다.";
  if (!process.env.ADMIN_PASSWORD_HASH?.startsWith("scrypt:")) return "ADMIN_PASSWORD_HASH 환경 변수가 설정되지 않았습니다.";
  if ((process.env.SESSION_SECRET?.length ?? 0) < 32) return "SESSION_SECRET 환경 변수(32자 이상)가 설정되지 않았습니다.";
  return null;
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyCredentials(username: string, password: string): boolean {
  if (authConfigError()) return false;
  const [, saltB64, hashB64] = process.env.ADMIN_PASSWORD_HASH!.split(":");
  if (!saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = scryptSync(password, Buffer.from(saltB64, "base64url"), expected.length, { N: 16384, r: 8, p: 1 });
  const userOk = safeEqual(
    createHmac("sha256", "u").update(username).digest(),
    createHmac("sha256", "u").update(process.env.ADMIN_USERNAME!.trim()).digest(),
  );
  // 두 비교를 모두 수행해 타이밍 차이를 줄임
  const passOk = safeEqual(actual, expected);
  return userOk && passOk;
}

function sign(payload: string): string {
  return createHmac("sha256", process.env.SESSION_SECRET!).update(payload).digest("base64url");
}

export function createSessionToken(username: string): string {
  const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string | undefined): { u: string; exp: number } | null {
  if (!token || authConfigError()) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!safeEqual(Buffer.from(sig), Buffer.from(sign(payload)))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (data.u !== process.env.ADMIN_USERNAME!.trim()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getAdmin(): Promise<{ username: string } | null> {
  const store = await cookies();
  const data = readToken(store.get(SESSION_COOKIE)?.value);
  return data ? { username: data.u } : null;
}

/** 관리자 전용 페이지·액션·라우트 진입 시 반드시 호출 */
export async function requireAdmin(): Promise<{ username: string }> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};
