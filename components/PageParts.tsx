import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export function PageHero({ eyebrow, title, lead, crumb, center = false, children }: {
  eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; crumb?: string; center?: boolean; children?: React.ReactNode;
}) {
  return (
    <section className={`page-hero${center ? " center" : ""}`}>
      <div className="container">
        {crumb && (
          <nav className="breadcrumb" aria-label="현재 위치" style={center ? { justifyContent: "center" } : undefined}>
            <Link href="/">홈</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{crumb}</span>
          </nav>
        )}
        {eyebrow && <div style={{ marginTop: crumb ? 20 : 0 }}><span className="eyebrow">{eyebrow}</span></div>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function CtaStrip({ open = true }: { open?: boolean }) {
  return (
    <section className="section-sm">
      <div className="container">
        <div className="cta-strip reveal">
          <div>
            <h2>{open ? "베타 파트너로 먼저 시작해 보세요." : "다음 베타 모집 소식을 기다려 주세요."}</h2>
            <p>{open ? "베타 기간 동안 기본 진단과 광고 연결 지원을 무료로 제공합니다." : "서비스 소개와 FAQ에서 FLUX ADS를 더 알아볼 수 있습니다."}</p>
          </div>
          <div className="actions">
            {open && (
              <Link href="/beta" className="btn btn-primary btn-lg">
                베타 파트너 신청하기 <ArrowRight className="arrow" aria-hidden="true" />
              </Link>
            )}
            <Link href="/faq" className="btn btn-secondary btn-lg">자주 묻는 질문</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
