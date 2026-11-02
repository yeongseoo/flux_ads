import Link from "next/link";
import { ArrowRight, Check, Gift, Users } from "lucide-react";
import { BETA_BENEFITS, BETA_TARGETS } from "@/lib/content";
import type { RecruitSettings } from "@/lib/settings";

export function BetaSection({ settings }: { settings: RecruitSettings }) {
  return (
    <section id="beta" className="section beta-wrap" aria-labelledby="beta-title">
      <div className="container">
        <div className="beta-band reveal">
          <div className="beta-meta">
            {settings.open ? <span className="pill pill-live">베타 파트너 모집 중</span> : <span className="pill pill-closed">모집 마감</span>}
            {settings.showTarget && <span className="pill pill-dark">초기 모집 목표 {settings.target}팀</span>}
          </div>
          <h2 id="beta-title">FLUX ADS와 함께할<br />첫 번째 파트너를 모집합니다.</h2>
          <p className="lead">FLUX ADS의 새로운 광고 수익화 지원 서비스를 함께 경험하고 개선해 나갈 초기 파트너를 찾습니다.</p>

          <div className="beta-grid">
            <div className="beta-box">
              <h3><Users aria-hidden="true" /> 모집 대상</h3>
              <ul>
                {BETA_TARGETS.map((t) => (
                  <li key={t}><span className="chk"><Check aria-hidden="true" /></span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="beta-box">
              <h3><Gift aria-hidden="true" /> 베타 파트너 혜택</h3>
              <ul>
                {BETA_BENEFITS.map((t) => (
                  <li key={t}><span className="chk"><Check aria-hidden="true" /></span>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="beta-actions">
            {settings.open ? (
              <Link href="/beta" className="btn btn-primary btn-lg">
                베타 파트너 신청하기 <ArrowRight className="arrow" aria-hidden="true" />
              </Link>
            ) : (
              <span className="btn btn-on-dark btn-lg" aria-disabled="true">현재 모집이 마감되었습니다</span>
            )}
            <span className="beta-meta">
              {settings.open ? "신청 후 검토를 거쳐 선정 결과를 이메일로 안내드립니다." : settings.closedMessage}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
