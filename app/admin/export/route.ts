import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/auth";
import { listApplications } from "@/lib/applications";
import { formatDateTime } from "@/lib/format";
import { AD_STATUSES, APPLICATION_STATUSES, PLATFORMS, SUPPORT_TYPES, VISITORS, labelOf } from "@/lib/options";

export const dynamic = "force-dynamic";

/** CSV 셀 이스케이프 + 수식 삽입(CSV Injection) 방지 */
function cell(v: unknown): string {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const sp = req.nextUrl.searchParams;
  const { items } = listApplications({
    q: sp.get("q")?.slice(0, 100) ?? "",
    platform: sp.get("platform") ?? "",
    status: sp.get("status") ?? "",
    sort: sp.get("sort") === "oldest" ? "oldest" : "newest",
  });

  const header = ["ID", "이름", "이메일", "웹사이트", "플랫폼", "광고 연결 상태", "월간 방문자", "필요한 지원", "추가 문의", "개인정보 동의", "마케팅 동의", "신청 상태", "내부 메모", "신청일시", "수정일시"];
  const rows = items.map((a) => [
    a.id, a.name, a.email, a.website_url,
    labelOf(PLATFORMS, a.platform), labelOf(AD_STATUSES, a.ad_status), labelOf(VISITORS, a.monthly_visitors),
    a.support_types.map((s) => labelOf(SUPPORT_TYPES, s)).join(" / "),
    a.message, a.privacy_consent ? "Y" : "N", a.marketing_consent ? "Y" : "N",
    labelOf(APPLICATION_STATUSES, a.application_status), a.admin_note,
    formatDateTime(a.created_at), formatDateTime(a.updated_at),
  ]);
  const csv = "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="flux-ads-beta-applications-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
