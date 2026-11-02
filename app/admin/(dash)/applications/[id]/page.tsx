import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleAlert, CircleCheck, ExternalLink, Mail, Save } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { getApplication } from "@/lib/applications";
import { formatDateTime } from "@/lib/format";
import { AD_STATUSES, APPLICATION_STATUSES, PLATFORMS, SUPPORT_TYPES, VISITORS, labelOf } from "@/lib/options";
import { removeApplication, saveApplication } from "../../../actions";
import { DeleteButton } from "./DeleteButton";

export const metadata: Metadata = { title: "신청 상세" };

export default async function ApplicationDetail({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const numId = Number(id);
  const app = Number.isInteger(numId) && numId > 0 ? getApplication(numId) : null;
  if (!app) notFound();

  return (
    <>
      <Link href="/admin" className="back-link"><ArrowLeft aria-hidden="true" /> 신청 목록</Link>
      <div className="admin-title">
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {app.name} <StatusBadge status={app.application_status} />
          </h1>
          <p>신청 번호 #{app.id} · {formatDateTime(app.created_at)} 접수</p>
        </div>
        <div className="actions">
          <a className="btn btn-secondary btn-sm" href={`mailto:${app.email}`}><Mail aria-hidden="true" /> 이메일 보내기</a>
          <a className="btn btn-secondary btn-sm" href={app.website_url} target="_blank" rel="noopener noreferrer nofollow"><ExternalLink aria-hidden="true" /> 사이트 열기</a>
        </div>
      </div>

      {sp.saved && <div className="alert alert-success" role="status"><CircleCheck aria-hidden="true" />변경 사항이 저장되었습니다.</div>}
      {sp.error && <div className="alert alert-error" role="alert"><CircleAlert aria-hidden="true" />올바르지 않은 상태 값입니다.</div>}

      <div className="detail-grid">
        <div>
          <section className="panel">
            <div className="panel-head"><h2>신청 정보</h2></div>
            <dl className="kv">
              <div><dt>이름 / 닉네임</dt><dd>{app.name}</dd></div>
              <div><dt>이메일</dt><dd><a href={`mailto:${app.email}`} style={{ color: "var(--blue-700)" }}>{app.email}</a></dd></div>
              <div><dt>웹사이트 주소</dt><dd><a href={app.website_url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "var(--blue-700)", wordBreak: "break-all" }}>{app.website_url}</a></dd></div>
              <div><dt>웹사이트 플랫폼</dt><dd>{labelOf(PLATFORMS, app.platform)}</dd></div>
              <div><dt>광고 연결 상태</dt><dd>{labelOf(AD_STATUSES, app.ad_status)}</dd></div>
              <div><dt>월간 방문자 수</dt><dd>{labelOf(VISITORS, app.monthly_visitors)}</dd></div>
              <div>
                <dt>필요한 지원</dt>
                <dd><div className="tags">{app.support_types.map((s) => <span key={s} className="tag">{labelOf(SUPPORT_TYPES, s)}</span>)}</div></dd>
              </div>
              <div><dt>추가 문의사항</dt><dd className="pre">{app.message || <span className="muted">없음</span>}</dd></div>
            </dl>
          </section>
          <section className="panel">
            <div className="panel-head"><h2>동의 및 기록</h2></div>
            <dl className="kv">
              <div><dt>개인정보 수집·이용</dt><dd>{app.privacy_consent ? "동의 (필수)" : "미동의"}</dd></div>
              <div><dt>마케팅 정보 수신</dt><dd>{app.marketing_consent ? <span className="badge tone-green">동의</span> : <span className="badge tone-gray">미동의</span>}</dd></div>
              <div><dt>신청일시</dt><dd className="tabnum">{formatDateTime(app.created_at)}</dd></div>
              <div><dt>최종 수정일시</dt><dd className="tabnum">{formatDateTime(app.updated_at)}</dd></div>
            </dl>
          </section>
        </div>

        <div>
          <section className="panel">
            <div className="panel-head"><h2>상태 및 내부 메모</h2></div>
            <form action={saveApplication} className="panel-body fields" style={{ gap: 18 }}>
              <input type="hidden" name="id" value={app.id} />
              <div className="field">
                <label htmlFor="application_status">신청 상태</label>
                <select id="application_status" name="application_status" className="select" defaultValue={app.application_status}>
                  {APPLICATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="admin_note">내부 메모</label>
                <textarea id="admin_note" name="admin_note" className="textarea" rows={8} maxLength={5000} defaultValue={app.admin_note}
                  placeholder="상담 내용, 진단 결과, 후속 조치 등 (신청자에게 공개되지 않습니다)" />
              </div>
              <button className="btn btn-primary"><Save aria-hidden="true" /> 저장</button>
            </form>
          </section>

          <section className="panel danger-zone">
            <div className="panel-head"><h2>개인정보 파기</h2></div>
            <div className="panel-body">
              <p className="muted" style={{ fontSize: 14, marginBottom: 14 }}>
                신청자의 삭제 요청이 있거나 보유 기간이 지난 경우 신청 정보를 영구 삭제합니다.
              </p>
              <form action={removeApplication}>
                <input type="hidden" name="id" value={app.id} />
                <DeleteButton name={app.name} />
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
