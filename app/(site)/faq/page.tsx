import type { Metadata } from "next";
import { FaqList, faqJsonLd } from "@/components/FaqList";
import { PageHero, CtaStrip } from "@/components/PageParts";
import { CORE_FAQS, EXTRA_FAQS } from "@/lib/content";
import { getRecruitSettings } from "@/lib/settings";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "FLUX ADS 서비스, 베타 파트너 신청, 광고 승인과 계정 보안에 관해 자주 묻는 질문을 확인하세요.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "자주 묻는 질문 | FLUX ADS", url: "/faq" },
};

export default function FaqPage() {
  const settings = getRecruitSettings();
  const all = [...CORE_FAQS, ...EXTRA_FAQS.flatMap((g) => g.items)];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(all)) }} />
      <PageHero
        crumb="FAQ"
        eyebrow="FAQ"
        title="자주 묻는 질문"
        lead={
          <>
            FLUX ADS 서비스와 베타 파트너 모집에 대해 자주 받는 질문을 정리했습니다.
            {site.contactEmail && <> 추가 문의는 <a href={`mailto:${site.contactEmail}`} style={{ color: "var(--blue-700)", fontWeight: 600 }}>{site.contactEmail}</a>로 보내 주세요.</>}
          </>
        }
      />
      <section className="section-sm">
        <div className="container container-narrow">
          <div className="faq-group">
            <h2>서비스 기본</h2>
            <FaqList items={CORE_FAQS} openFirst />
          </div>
          {EXTRA_FAQS.map((g) => (
            <div className="faq-group" key={g.title}>
              <h2>{g.title}</h2>
              <FaqList items={g.items} />
            </div>
          ))}
        </div>
      </section>
      <CtaStrip open={settings.open} />
    </>
  );
}
