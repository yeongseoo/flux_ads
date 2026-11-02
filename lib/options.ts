/** 베타 신청 양식 선택지 — 클라이언트/서버 공용 */

export const PLATFORMS = [
  { value: "wordpress", label: "WordPress" },
  { value: "tistory", label: "Tistory" },
  { value: "blogger", label: "Blogger" },
  { value: "custom", label: "Custom Website" },
  { value: "other", label: "Other" },
] as const;

export const AD_STATUSES = [
  { value: "none", label: "광고를 사용하지 않음" },
  { value: "adsense_before", label: "Google AdSense 신청 전" },
  { value: "adsense_review", label: "Google AdSense 심사 중" },
  { value: "adsense_approved", label: "Google AdSense 승인 완료" },
  { value: "other_network", label: "다른 광고 플랫폼 사용 중" },
] as const;

export const VISITORS = [
  { value: "lt1k", label: "1,000명 미만" },
  { value: "1k_5k", label: "1,000~5,000명" },
  { value: "5k_10k", label: "5,000~10,000명" },
  { value: "10k_50k", label: "10,000~50,000명" },
  { value: "gt50k", label: "50,000명 이상" },
  { value: "unknown", label: "확인하기 어려움" },
] as const;

export const SUPPORT_TYPES = [
  { value: "diagnosis", label: "광고 수익화 가능성 진단" },
  { value: "signup", label: "광고 플랫폼 가입 안내" },
  { value: "code", label: "광고 코드 설치" },
  { value: "placement", label: "광고 배치 및 설정" },
  { value: "management", label: "광고 운영 및 수익 관리" },
] as const;

export const APPLICATION_STATUSES = [
  { value: "new", label: "신규 신청", tone: "blue" },
  { value: "reviewing", label: "검토 중", tone: "amber" },
  { value: "consult", label: "상담 필요", tone: "violet" },
  { value: "selected", label: "선정 완료", tone: "green" },
  { value: "in_progress", label: "진행 중", tone: "teal" },
  { value: "completed", label: "완료", tone: "gray" },
  { value: "on_hold", label: "보류", tone: "red" },
] as const;

export type Option = { value: string; label: string };
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

/** 베타 파트너로 '승인'된 것으로 집계하는 상태 */
export const APPROVED_STATUSES: ApplicationStatus[] = ["selected", "in_progress", "completed"];

export function labelOf(list: readonly Option[], value: string | null | undefined): string {
  return list.find((o) => o.value === value)?.label ?? value ?? "-";
}

export function isValue(list: readonly Option[], value: unknown): value is string {
  return typeof value === "string" && list.some((o) => o.value === value);
}
