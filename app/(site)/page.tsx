import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { HeroDashboard } from "@/components/HeroDashboard";
import { BetaSection } from "@/components/BetaSection";
import { FaqList, faqJsonLd } from "@/components/FaqList";
import { Icon } from "@/components/icons";
import { CORE_FAQS, PROCESS, SERVICES, VALUES } from "@/lib/content";
import { getRecruitSettings } from "@/lib/settings";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const settings = getRecruitSettings();
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.company.name ?? site.name,
    url: site.url,
    slogan: site.slogan,
    description: site.description,
    ...(site.contactEmail ? { email: site.contactEmail } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgLd, faqJsonLd(CORE_FAQS)]) }} />

      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-copy">
            <Link href="/beta" className="eyebrow-pill">
              <span className="tag">BETA</span>
              {settings.open ? "초기 베타 파트너 모집 중" : "베타 서비스 준비 중"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <h1 id="hero-title">
              당신의 웹사이트,<br />
              <span className="hl">더 나은 광고 수익화</span>의 시작.
            </h1>
            <p className="hero-en">{site.slogan}</p>
            <p className="hero-desc">{site.description}</p>
            <div className="hero-cta">
              <Link href="/beta" className="btn btn-primary btn-lg">
                베타 파트너 신청하기 <ArrowRight className="arrow" aria-hidden="true" />
              </Link>
              <Link href="/service" className="btn btn-secondary btn-lg">서비스 알아보기</Link>
            </div>
            <ul className="hero-notes">
              <li><Check aria-hidden="true" /> 베타 기간 기본 지원 무료</li>
              <li><Check aria-hidden="true" /> 계정 비밀번호 요구 없음</li>
              <li><Check aria-hidden="true" /> 주요 블로그 플랫폼 지원</li>
            </ul>
          </div>
          <div className="hero-visual">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="section" aria-labelledby="trust-title">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Why FLUX ADS</span>
            <h2 id="trust-title">웹사이트 운영에 집중하세요.<br />광고 수익화는 FLUX ADS가 함께합니다.</h2>
          </div>
          <div className="values">
            {VALUES.map((v, i) => (
              <article key={v.key} className="value reveal">
                <div className="value-top">
                  <span className="icon-box"><Icon name={v.icon} /></span>
                  <span className="num">0{i + 1}</span>
                </div>
                <span className="label">{v.key}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Service */}
      <section id="service" className="section section-alt" aria-labelledby="service-title">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Services</span>
            <h2 id="service-title">광고 수익화의 시작부터 운영까지</h2>
            <p>수익화 준비 상태 진단부터 광고 연결, 운영 점검과 문제 해결까지 필요한 단계를 함께합니다.</p>
          </div>
          <div className="services">
            {SERVICES.map((s) => (
              <article key={s.title} className="service-card reveal">
                <span className="icon-box"><Icon name={s.icon} /></span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}><Check aria-hidden="true" />{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="section-foot">
            <Link href="/service" className="btn btn-secondary">
              서비스 자세히 보기 <ArrowRight className="arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">How it works</span>
            <h2 id="process-title">복잡한 과정은 줄이고,<br />시작은 간단하게.</h2>
          </div>
          <ol className="process">
            {PROCESS.map((p, i) => (
              <li key={p.title} className="step reveal" style={{ listStyle: "none" }}>
                <span className="step-num"><Icon name={p.icon} /></span>
                <span className="k">STEP 0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BetaSection settings={settings} />

      {/* FAQ */}
      <section id="faq" className="section section-alt" aria-labelledby="faq-title">
        <div className="container faq-layout">
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2 id="faq-title">자주 묻는 질문</h2>
            <p>궁금한 점이 더 있다면 FAQ 페이지에서 더 많은 답변을 확인하세요.</p>
            <div style={{ marginTop: 24 }}>
              <Link href="/faq" className="btn btn-secondary">
                전체 FAQ 보기 <ArrowRight className="arrow" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <FaqList items={CORE_FAQS} openFirst />
        </div>
      </section>
    </>
  );
}
