import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, Gift, Hourglass, KeyRound, ShieldCheck } from "lucide-react";
import { BetaForm } from "@/components/BetaForm";
import { PageHero } from "@/components/PageParts";
import { BETA_BENEFITS } from "@/lib/content";
import { getRecruitSettings } from "@/lib/settings";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "베타 파트너 신청",
  description: "FLUX ADS 베타 파트너를 모집합니다. 초기 웹사이트 진단과 기본 광고 연결 지원을 베타 기간 동안 무료로 제공합니다.",
  alternates: { canonical: "/beta" },
  openGraph: { title: "베타 파트너 신청 | FLUX ADS", url: "/beta" },
};

export default function BetaPage() {
  const settings = getRecruitSettings();
  return (
    <>
      <PageHero
        crumb="베타 파트너 신청"
        eyebrow="Beta Program"
        title="FLUX ADS Beta Partner Application"
        lead="당신의 웹사이트와 함께 더 나은 광고 수익화 경험을 만들어 갑니다."
      >
        <div className="beta-meta" style={{ marginTop: 24 }}>
          {settings.open ? <span className="pill pill-green">● 모집 중</span> : <span className="pill pill-gray">모집 마감</span>}
          {settings.showTarget && <span className="pill pill-soft">초기 모집 목표 {settings.target}팀</span>}
          <span className="pill pill-gray">작성 시간 약 2분</span>
        </div>
      </PageHero>

      <div className="container">
        {settings.open ? (
          <div className="apply-layout">
            <BetaForm />
            <aside className="apply-aside" aria-label="베타 프로그램 안내">
              <div className="aside-card">
                <h3><Gift aria-hidden="true" /> 베타 파트너 혜택</h3>
                <ul>
                  {BETA_BENEFITS.map((b) => (
                    <li key={b}><CircleCheck aria-hidden="true" />{b}</li>
                  ))}
                </ul>
              </div>
              <div className="aside-card">
                <h3><ShieldCheck aria-hidden="true" /> 안심하고 신청하세요</h3>
                <ul>
                  <li><KeyRound aria-hidden="true" style={{ color: "var(--blue)" }} />광고 플랫폼·사이트 관리자 비밀번호를 요구하지 않습니다.</li>
                  <li><ShieldCheck aria-hidden="true" style={{ color: "var(--blue)" }} />신청에 필요한 최소한의 정보만 수집합니다.</li>
                </ul>
              </div>
              <div className="aside-card muted">
                <h3><Hourglass aria-hidden="true" /> 꼭 확인해 주세요</h3>
                <p>광고 승인 여부와 광고 수익은 각 광고 플랫폼의 심사와 정책에 따라 결정되며, FLUX ADS는 이를 보장하지 않습니다.</p>
                <p>베타 파트너는 신청 내용 검토 후 선정되며, 결과는 이메일로 안내드립니다.</p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="status-page" style={{ minHeight: 0 }}>
            <div className="status-card">
              <div className="status-icon gray"><Hourglass aria-hidden="true" /></div>
              <h1>현재 베타 파트너 모집이 마감되었습니다.</h1>
              <p>{settings.closedMessage}</p>
              {site.contactEmail && (
                <p style={{ marginTop: 12, fontSize: 15, color: "var(--muted)" }}>
                  문의: <a href={`mailto:${site.contactEmail}`} style={{ color: "var(--blue-700)" }}>{site.contactEmail}</a>
                </p>
              )}
              <div className="status-actions">
                <Link href="/" className="btn btn-primary">홈으로</Link>
                <Link href="/service" className="btn btn-secondary">서비스 알아보기</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
