import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "신청 완료",
  description: "FLUX ADS 베타 파트너 신청이 접수되었습니다.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <section className="status-page">
      <div className="container">
        <div className="status-card">
          <div className="status-icon"><Check aria-hidden="true" /></div>
          <h1>베타 파트너 신청이 접수되었습니다.</h1>
          <p>FLUX ADS에 관심을 가져 주셔서 감사합니다. 제출해 주신 정보를 검토한 뒤, 입력하신 이메일로 결과를 안내드리겠습니다.</p>

          <ol className="next-steps" aria-label="다음 진행 단계">
            <li>
              <span className="n">1</span>
              <div><b>신청 내용 검토</b><span>웹사이트 정보와 필요한 지원 내용을 순차적으로 검토합니다.</span></div>
            </li>
            <li>
              <span className="n">2</span>
              <div><b>이메일 안내</b><span>선정 여부와 진행 방법을 이메일로 안내드립니다. 스팸함도 함께 확인해 주세요.</span></div>
            </li>
            <li>
              <span className="n">3</span>
              <div><b>진단 및 지원 시작</b><span>선정된 파트너는 웹사이트 진단부터 광고 연결 지원을 순서대로 진행합니다.</span></div>
            </li>
          </ol>

          <p style={{ marginTop: 24, fontSize: 14, color: "var(--muted)" }}>
            {site.contactEmail ? (
              <>신청 내용 수정이나 삭제가 필요하시면 <a href={`mailto:${site.contactEmail}`} style={{ color: "var(--blue-700)" }}>{site.contactEmail}</a>로 문의해 주세요.</>
            ) : (
              <>신청 내용 수정이나 삭제가 필요하시면 안내 이메일에 회신해 주세요.</>
            )}
          </p>

          <div className="status-actions">
            <Link href="/" className="btn btn-primary">홈으로 돌아가기</Link>
            <Link href="/service" className="btn btn-secondary">서비스 자세히 보기</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
