import { AD_STATUSES, PLATFORMS, SUPPORT_TYPES, VISITORS, isValue } from "./options";

export type BetaInput = {
  name: string;
  email: string;
  website_url: string;
  platform: string;
  ad_status: string;
  monthly_visitors: string;
  support_types: string[];
  message: string;
  privacy_consent: boolean;
  marketing_consent: boolean;
};

export type FieldErrors = Partial<Record<keyof BetaInput, string>>;

export const LIMITS = { name: 50, email: 254, url: 300, message: 2000 } as const;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** 사용자가 입력한 주소를 https:// 형식으로 정규화. 유효하지 않으면 null */
export function normalizeUrl(raw: string): string | null {
  let v = raw.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (u.username || u.password) return null;
    const host = u.hostname;
    if (!host.includes(".") || host.endsWith(".") || /\s/.test(host)) return null;
    if (/^(localhost|127\.|10\.|192\.168\.|0\.)/.test(host)) return null;
    u.hash = "";
    const out = u.origin + (u.pathname === "/" ? "" : u.pathname) + u.search;
    return out.length > LIMITS.url ? null : out;
  } catch {
    return null;
  }
}

export function validateBeta(input: BetaInput): FieldErrors {
  const e: FieldErrors = {};
  const name = input.name.trim();
  if (!name) e.name = "이름 또는 닉네임을 입력해 주세요.";
  else if (name.length > LIMITS.name) e.name = `${LIMITS.name}자 이내로 입력해 주세요.`;

  const email = input.email.trim();
  if (!email) e.email = "이메일 주소를 입력해 주세요.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) e.email = "올바른 이메일 주소 형식이 아닙니다.";

  if (!input.website_url.trim()) e.website_url = "웹사이트 주소를 입력해 주세요.";
  else if (!normalizeUrl(input.website_url)) e.website_url = "올바른 웹사이트 주소를 입력해 주세요. (예: myblog.com)";

  if (!isValue(PLATFORMS, input.platform)) e.platform = "웹사이트 플랫폼을 선택해 주세요.";
  if (!isValue(AD_STATUSES, input.ad_status)) e.ad_status = "현재 광고 연결 상태를 선택해 주세요.";
  if (!isValue(VISITORS, input.monthly_visitors)) e.monthly_visitors = "월간 방문자 수를 선택해 주세요.";

  if (!input.support_types.length) e.support_types = "필요한 지원을 하나 이상 선택해 주세요.";
  else if (!input.support_types.every((s) => isValue(SUPPORT_TYPES, s))) e.support_types = "올바르지 않은 선택이 포함되어 있습니다.";

  if (input.message.length > LIMITS.message) e.message = `${LIMITS.message}자 이내로 입력해 주세요.`;
  if (!input.privacy_consent) e.privacy_consent = "개인정보 수집 및 이용에 동의해 주세요.";
  return e;
}
