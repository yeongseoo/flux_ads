"use server";

import { redirect } from "next/navigation";
import { createApplication, hasRecentDuplicate, tokenExists } from "@/lib/applications";
import { clientKey, isLimited, recordEvent } from "@/lib/ratelimit";
import { getRecruitSettings } from "@/lib/settings";
import { LIMITS, normalizeUrl, validateBeta, type BetaInput, type FieldErrors } from "@/lib/validation";

export type ApplyState = { errors?: FieldErrors; message?: string };

const MIN_FILL_MS = 3_000;
const TOKEN_RE = /^[A-Za-z0-9-]{16,64}$/;

function str(fd: FormData, key: string, max = 4000): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.slice(0, max) : "";
}

export async function submitApplication(_prev: ApplyState, fd: FormData): Promise<ApplyState> {
  // 1) 모집 상태 확인
  if (!getRecruitSettings().open) {
    return { message: "현재 베타 파트너 모집이 마감되어 신청을 받을 수 없습니다." };
  }

  // 2) 스팸 방지: 허니팟 / 작성 시간 / 요청 빈도
  if (str(fd, "hp_field")) redirect("/beta/success"); // 봇에게는 성공처럼 응답
  const startedAt = Number(str(fd, "_ts", 20));
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MIN_FILL_MS || elapsed > 24 * 60 * 60 * 1000) {
    return { message: "요청을 처리할 수 없습니다. 페이지를 새로고침한 후 다시 시도해 주세요." };
  }
  const key = await clientKey();
  if (isLimited("apply", key, 5, 60 * 60 * 1000)) {
    return { message: "짧은 시간에 너무 많은 신청이 접수되었습니다. 잠시 후 다시 시도해 주세요." };
  }

  const token = str(fd, "submission_token", 64);
  if (!TOKEN_RE.test(token)) return { message: "요청을 처리할 수 없습니다. 페이지를 새로고침한 후 다시 시도해 주세요." };

  // 3) 서버 측 검증
  const input: BetaInput = {
    name: str(fd, "name", LIMITS.name + 50).trim(),
    email: str(fd, "email", LIMITS.email + 50).trim().toLowerCase(),
    website_url: str(fd, "website_url", LIMITS.url + 50).trim(),
    platform: str(fd, "platform", 40),
    ad_status: str(fd, "ad_status", 40),
    monthly_visitors: str(fd, "monthly_visitors", 40),
    support_types: [...new Set(fd.getAll("support_types").filter((v): v is string => typeof v === "string"))].slice(0, 10),
    message: str(fd, "message", LIMITS.message + 100).trim(),
    privacy_consent: fd.get("privacy_consent") === "on",
    marketing_consent: fd.get("marketing_consent") === "on",
  };
  const errors = validateBeta(input);
  if (Object.keys(errors).length) return { errors, message: "입력 내용을 다시 확인해 주세요." };

  const websiteUrl = normalizeUrl(input.website_url)!;
  // 같은 신청서가 다시 전송된 경우(더블 클릭, 새로고침 재전송 등) 새로 저장하지 않음
  if (tokenExists(token)) redirect("/beta/success");
  recordEvent("apply", key);

  if (hasRecentDuplicate(input.email, websiteUrl)) {
    return { message: "같은 이메일과 웹사이트로 이미 접수된 신청이 있습니다. 검토 후 이메일로 안내드리겠습니다." };
  }

  // 4) 저장 (같은 토큰 재전송은 중복 저장하지 않음)
  try {
    createApplication({
      name: input.name,
      email: input.email,
      website_url: websiteUrl,
      platform: input.platform,
      ad_status: input.ad_status,
      monthly_visitors: input.monthly_visitors,
      support_types: input.support_types,
      message: input.message,
      marketing_consent: input.marketing_consent,
      submission_token: token,
    });
  } catch (err) {
    console.error("[beta] failed to save application", err);
    return { message: "일시적인 오류로 신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  redirect("/beta/success");
}
