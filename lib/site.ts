/**
 * 사이트 전역 설정.
 * 회사 정보·연락처는 환경 변수로 확정된 값만 노출합니다. (임의 생성 금지)
 */
function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

export const site = {
  name: "FLUX ADS",
  slogan: "Your Website. Your Revenue.",
  description:
    "FLUX ADS는 개인 웹사이트와 블로그 운영자가 광고 수익화를 보다 쉽게 시작하고 관리할 수 있도록 지원하는 서비스입니다.",
  url: (env("SITE_URL") ?? "http://localhost:3000").replace(/\/+$/, ""),
  contactEmail: env("CONTACT_EMAIL"),
  company: {
    name: env("COMPANY_NAME"),
    representative: env("COMPANY_REPRESENTATIVE"),
    businessNumber: env("COMPANY_BUSINESS_NUMBER"),
    address: env("COMPANY_ADDRESS"),
  },
  privacyOfficer: env("PRIVACY_OFFICER") ?? "FLUX ADS 운영팀",
  /** 개인정보처리방침·이용약관 시행일 — 내용 변경 시 함께 수정하세요. */
  legalEffectiveDate: "2026년 11월 2일",
} as const;

export function missingSiteConfig(): string[] {
  const missing: string[] = [];
  if (!env("SITE_URL")) missing.push("SITE_URL");
  if (!env("CONTACT_EMAIL")) missing.push("CONTACT_EMAIL");
  if (!env("COMPANY_NAME")) missing.push("COMPANY_NAME");
  return missing;
}
