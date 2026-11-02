import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CircleCheck, Download, Inbox, Search, Sparkles, Users } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { getStats, listApplications, type ListQuery } from "@/lib/applications";
import { formatDateTime } from "@/lib/format";
import { APPLICATION_STATUSES, PLATFORMS, VISITORS, labelOf } from "@/lib/options";
import { getRecruitSettings } from "@/lib/settings";
import { missingSiteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "신청 관리" };
const PAGE_SIZE = 20;

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminHome({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const sp = await searchParams;
  const query: ListQuery = {
    q: one(sp.q).slice(0, 100),
    platform: one(sp.platform),
    status: one(sp.status),
    sort: one(sp.sort) === "oldest" ? "oldest" : "newest",
    page: Math.max(1, parseInt(one(sp.page)) || 1),
    pageSize: PAGE_SIZE,
  };
  const stats = getStats();
  const settings = getRecruitSettings();
  const { items, total } = listApplications(query);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const missing = missingSiteConfig();
  const filtered = !!(query.q || query.platform || query.status);

  const qs = (patch: Record<string, string | number | undefined>) => {
    const merged: Record<string, string | number | undefined> = { q: query.q, platform: query.platform, status: query.status, sort: query.sort, ...patch };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v === undefined || v === "") continue;
      if (k === "page" && Number(v) <= 1) continue;
      if (k === "sort" && v === "newest") continue;
      p.set(k, String(v));
    }
    const s = p.toString();
    return s ? `?${s}` : "";
  };
  const exportQs = qs({}).slice(1);
  const approvedPct = Math.min(100, Math.round((stats.approved / settings.target) * 100));

  return (
    <>
      <div className="admin-title">
        <div>
          <h1>베타 신청 관리</h1>
          <p>베타 파트너 신청 현황을 확인하고 상태를 관리합니다.</p>
        </div>
        <div className="actions">
          <a className="btn btn-secondary btn-sm" href={`/admin/export${exportQs ? `?${exportQs}` : ""}`}>
            <Download aria-hidden="true" /> CSV 내보내기{filtered ? " (필터 적용)" : ""}
          </a>
        </div>
      </div>

      {sp.deleted && <div className="alert alert-success" role="status"><CircleCheck aria-hidden="true" />신청 정보가 삭제되었습니다.</div>}
      {missing.length > 0 && (
        <div className="alert alert-warn">
          <Sparkles aria-hidden="true" />
          <span>사이트 정보가 아직 설정되지 않았습니다: <b>{missing.join(", ")}</b> — 설정된 정보만 사이트에 표시됩니다. (.env 참고)</span>
        </div>
      )}

      <section className="kpis" aria-label="신청 현황 요약">
        <div className="kpi">
          <div className="k">전체 신청자 <Users aria-hidden="true" /></div>
          <div className="v">{stats.total.toLocaleString()}</div>
          <div className="s">최근 7일 {stats.last7.toLocaleString()}건</div>
        </div>
        <div className="kpi">
          <div className="k">신규 신청 <Inbox aria-hidden="true" /></div>
          <div className="v">{stats.new.toLocaleString()}</div>
          <div className="s">아직 검토하지 않은 신청</div>
        </div>
        <div className="kpi">
          <div className="k">검토 중 <Search aria-hidden="true" /></div>
          <div className="v">{stats.reviewing.toLocaleString()}</div>
          <div className="s">상담 필요 {(stats.byStatus.consult ?? 0).toLocaleString()}건 별도</div>
        </div>
        <div className="kpi accent">
          <div className="k">승인된 베타 파트너 <BadgeCheck aria-hidden="true" /></div>
          <div className="v">{stats.approved.toLocaleString()} <span style={{ fontSize: 16, color: "#98a2b3" }}>/ {settings.target}팀</span></div>
          <div className="meter" aria-hidden="true"><i style={{ width: `${approvedPct}%` }} /></div>
          <div className="s">선정 완료·진행 중·완료 합계 · 모집 {settings.open ? "진행 중" : "마감"}</div>
        </div>
      </section>

      <nav className="status-bar" aria-label="상태별 보기">
        <Link href={`/admin${qs({ status: "", page: "" })}`} aria-current={!query.status ? "true" : undefined}>전체 <b>{stats.total}</b></Link>
        {APPLICATION_STATUSES.map((s) => (
          <Link key={s.value} href={`/admin${qs({ status: s.value, page: "" })}`} aria-current={query.status === s.value ? "true" : undefined}>
            {s.label} <b>{stats.byStatus[s.value] ?? 0}</b>
          </Link>
        ))}
      </nav>

      <div className="panel">
        <form className="toolbar" role="search" action="/admin">
          {query.status && <input type="hidden" name="status" value={query.status} />}
          <label className="sr-only" htmlFor="q">검색</label>
          <input id="q" name="q" className="input search" placeholder="이름, 이메일, 사이트 URL 검색" defaultValue={query.q} />
          <label className="sr-only" htmlFor="platform">플랫폼</label>
          <select id="platform" name="platform" className="select" defaultValue={query.platform}>
            <option value="">모든 플랫폼</option>
            {PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <label className="sr-only" htmlFor="sort">정렬</label>
          <select id="sort" name="sort" className="select" defaultValue={query.sort}>
            <option value="newest">최신 신청순</option>
            <option value="oldest">오래된 신청순</option>
          </select>
          <button className="btn btn-dark btn-sm"><Search aria-hidden="true" /> 적용</button>
          {filtered && <Link href="/admin" className="btn btn-ghost btn-sm">초기화</Link>}
        </form>

        {items.length === 0 ? (
          <div className="empty">
            <span className="icon-box"><Inbox aria-hidden="true" /></span>
            <h3>{filtered ? "조건에 맞는 신청이 없습니다" : "아직 접수된 신청이 없습니다"}</h3>
            <p>{filtered ? "검색어나 필터를 변경해 보세요." : "베타 신청서가 제출되면 이곳에 표시됩니다."}</p>
            {filtered ? <Link href="/admin" className="btn btn-secondary btn-sm">필터 초기화</Link> : <Link href="/beta" target="_blank" className="btn btn-secondary btn-sm">신청 페이지 보기</Link>}
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th scope="col">신청자</th>
                    <th scope="col">웹사이트</th>
                    <th scope="col">플랫폼</th>
                    <th scope="col">월간 방문자</th>
                    <th scope="col">상태</th>
                    <th scope="col">신청일</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <Link className="row-link" href={`/admin/applications/${a.id}`}>{a.name}</Link>
                        <div className="sub">{a.email}</div>
                      </td>
                      <td><a className="url" href={a.website_url} target="_blank" rel="noopener noreferrer nofollow">{a.website_url.replace(/^https?:\/\//, "")}</a></td>
                      <td><span className="tag">{labelOf(PLATFORMS, a.platform)}</span></td>
                      <td className="nowrap muted">{labelOf(VISITORS, a.monthly_visitors)}</td>
                      <td><StatusBadge status={a.application_status} /></td>
                      <td className="nowrap muted tabnum">{formatDateTime(a.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>총 {total.toLocaleString()}건 · {query.page} / {pages} 페이지</span>
              <div className="pages">
                {query.page! > 1 ? <Link className="btn btn-secondary btn-sm" href={`/admin${qs({ page: query.page! - 1 })}`}>이전</Link> : <span className="btn btn-secondary btn-sm" aria-disabled="true">이전</span>}
                {query.page! < pages ? <Link className="btn btn-secondary btn-sm" href={`/admin${qs({ page: query.page! + 1 })}`}>다음</Link> : <span className="btn btn-secondary btn-sm" aria-disabled="true">다음</span>}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
