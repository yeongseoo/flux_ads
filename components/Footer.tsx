import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

export function Footer() {
  const c = site.company;
  const companyRows = [
    ["상호", c.name],
    ["대표자", c.representative],
    ["사업자등록번호", c.businessNumber],
    ["주소", c.address],
  ].filter((r): r is [string, string] => !!r[1]);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo onDark />
            <p>{site.slogan}</p>
            <p className="desc">개인 웹사이트와 블로그 운영자를 위한 광고 수익화 지원 서비스</p>
          </div>
          <div>
            <h2>서비스</h2>
            <ul>
              <li><Link href="/service">서비스 소개</Link></li>
              <li><Link href="/#process">서비스 이용 과정</Link></li>
              <li><Link href="/beta">베타 파트너 모집</Link></li>
            </ul>
          </div>
          <div>
            <h2>지원</h2>
            <ul>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/privacy">개인정보처리방침</Link></li>
              <li><Link href="/terms">이용약관</Link></li>
            </ul>
          </div>
          <div className="company">
            <h2>문의 및 회사 정보</h2>
            <ul>
              {site.contactEmail ? (
                <li className="footer-contact">
                  <a href={`mailto:${site.contactEmail}`}>
                    <Mail aria-hidden="true" /> {site.contactEmail}
                  </a>
                </li>
              ) : (
                <li>공식 문의 채널은 준비 중입니다. 베타 신청서를 통해 문의를 남겨 주세요.</li>
              )}
              <li>
                {companyRows.length > 0 ? (
                  <dl>
                    {companyRows.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <span>사업자 정보는 등록 완료 후 게시됩니다.</span>
                )}
              </li>
            </ul>
          </div>
        </div>
        <p className="disclaimer">
          FLUX ADS는 독립적인 광고 수익화 지원 서비스이며, Google 또는 기타 광고 플랫폼의 공식 파트너가 아닙니다. Google 및 AdSense는 Google LLC의
          상표입니다. 광고 승인 여부와 광고 수익은 각 광고 플랫폼의 심사 및 정책에 따라 결정되며, FLUX ADS는 이를 보장하지 않습니다.
        </p>
        <div className="footer-bottom">
          <span>© {year} {c.name ?? "FLUX ADS"}. All rights reserved.</span>
          <div className="legal-links">
            <Link href="/privacy"><b>개인정보처리방침</b></Link>
            <Link href="/terms">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
