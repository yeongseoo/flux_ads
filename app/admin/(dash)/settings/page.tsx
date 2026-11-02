import type { Metadata } from "next";
import { CircleAlert, CircleCheck, Save } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getStats } from "@/lib/applications";
import { getRecruitSettings } from "@/lib/settings";
import { saveSettings } from "../../actions";

export const metadata: Metadata = { title: "모집 설정" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const s = getRecruitSettings();
  const stats = getStats();

  return (
    <>
      <div className="admin-title">
        <div>
          <h1>모집 설정</h1>
          <p>베타 파트너 모집 진행 여부와 공개 페이지에 표시되는 모집 정보를 관리합니다.</p>
        </div>
      </div>

      {sp.saved && <div className="alert alert-success" role="status"><CircleCheck aria-hidden="true" />설정이 저장되어 사이트에 바로 반영되었습니다.</div>}
      {sp.error && <div className="alert alert-error" role="alert"><CircleAlert aria-hidden="true" />모집 목표는 1 이상의 정수로 입력해 주세요.</div>}

      <div className="detail-grid">
        <form action={saveSettings} className="panel">
          <div className="panel-head"><h2>베타 모집</h2></div>
          <div className="panel-body">
            <div className="switch-row">
              <div>
                <b>모집 진행</b>
                <span>끄면 신청서 제출이 차단되고, 사이트에 &lsquo;모집 마감&rsquo;으로 표시됩니다.</span>
              </div>
              <label className="switch"><input type="checkbox" name="open" defaultChecked={s.open} aria-label="모집 진행" /><i /></label>
            </div>
            <div className="switch-row">
              <div>
                <b>모집 목표 공개</b>
                <span>사이트에 &lsquo;초기 모집 목표 N팀&rsquo; 문구를 표시합니다. 신청자 수·잔여 인원은 공개하지 않습니다.</span>
              </div>
              <label className="switch"><input type="checkbox" name="showTarget" defaultChecked={s.showTarget} aria-label="모집 목표 공개" /><i /></label>
            </div>
            <div className="fields" style={{ paddingTop: 18 }}>
              <div className="field">
                <label htmlFor="target">모집 목표 (팀)</label>
                <input id="target" name="target" type="number" min={1} max={10000} step={1} className="input" defaultValue={s.target} required style={{ maxWidth: 200 }} />
              </div>
              <div className="field">
                <label htmlFor="closedMessage">마감 안내 문구</label>
                <textarea id="closedMessage" name="closedMessage" className="textarea" rows={3} maxLength={300} defaultValue={s.closedMessage} />
                <span className="hint">모집 마감 시 메인 페이지와 신청 페이지에 표시됩니다.</span>
              </div>
              <div><button className="btn btn-primary"><Save aria-hidden="true" /> 설정 저장</button></div>
            </div>
          </div>
        </form>

        <section className="panel">
          <div className="panel-head"><h2>현재 상태</h2></div>
          <dl className="kv">
            <div><dt>모집 상태</dt><dd>{s.open ? <span className="badge tone-green">모집 중</span> : <span className="badge tone-gray">마감</span>}</dd></div>
            <div><dt>모집 목표</dt><dd>{s.target}팀</dd></div>
            <div><dt>승인된 파트너</dt><dd>{stats.approved}팀</dd></div>
            <div><dt>전체 신청</dt><dd>{stats.total}건</dd></div>
          </dl>
        </section>
      </div>
    </>
  );
}
