import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/LegalDoc";
import { PageHero } from "@/components/PageParts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "FLUX ADS 개인정보처리방침 — 수집 항목, 이용 목적, 보유 기간, 정보주체의 권리를 안내합니다.",
  alternates: { canonical: "/privacy" },
};

const operator = site.company.name ?? "FLUX ADS";

const contact = site.contactEmail ? (
  <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
) : (
  <>공식 문의 이메일(확정 후 본 방침에 게시)</>
);

const sections: LegalSection[] = [
  {
    id: "p1",
    title: "1. 총칙",
    body: (
      <p>
        {operator}(이하 &ldquo;회사&rdquo;)는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 안전하게 처리하기 위하여 다음과 같이
        개인정보처리방침을 수립·공개합니다. 본 방침은 FLUX ADS 웹사이트 및 베타 파트너 모집 서비스에 적용됩니다.
      </p>
    ),
  },
  {
    id: "p2",
    title: "2. 수집하는 개인정보 항목 및 수집 방법",
    body: (
      <>
        <p>회사는 베타 파트너 신청 접수와 서비스 제공에 필요한 최소한의 개인정보만 수집합니다.</p>
        <table>
          <thead><tr><th>구분</th><th>수집 항목</th></tr></thead>
          <tbody>
            <tr><td>필수</td><td>이름 또는 닉네임, 이메일 주소, 웹사이트 주소, 웹사이트 플랫폼, 현재 광고 연결 상태, 월간 방문자 수(구간), 필요한 지원 항목</td></tr>
            <tr><td>선택</td><td>추가 문의사항, 마케팅 정보 수신 동의 여부</td></tr>
          </tbody>
        </table>
        <p>
          수집 방법: 웹사이트의 베타 파트너 신청서를 통해 이용자가 직접 입력합니다. 회사는 광고 플랫폼 계정 비밀번호, 사이트 관리자 비밀번호 등 로그인
          정보를 수집하지 않습니다.
        </p>
        <p>
          부정 이용 방지를 위해 신청 시 접속 IP 주소를 일방향 암호화(해시)한 값을 최대 24시간 동안 임시 보관하며, 원본 IP 주소는 저장하지 않습니다.
        </p>
      </>
    ),
  },
  {
    id: "p3",
    title: "3. 개인정보의 이용 목적",
    body: (
      <ul>
        <li>베타 파트너 신청 접수, 신청 내용 검토 및 선정 결과 안내</li>
        <li>웹사이트 광고 수익화 진단, 광고 연결·설정 지원 등 베타 서비스 제공</li>
        <li>서비스 관련 문의 응대 및 공지사항 전달</li>
        <li>(선택 동의 시) 신규 서비스 및 정식 출시 소식 등 마케팅 정보 안내</li>
      </ul>
    ),
  },
  {
    id: "p4",
    title: "4. 개인정보의 보유 및 이용 기간",
    body: (
      <>
        <p>
          회사는 개인정보 수집·이용 목적이 달성되면 해당 정보를 지체 없이 파기합니다. 베타 신청 정보는 <b>베타 프로그램 종료 시 또는 신청일로부터
          1년 중 먼저 도래하는 시점</b>까지 보유하며, 이용자가 삭제를 요청하는 경우 즉시 파기합니다.
        </p>
        <p>마케팅 정보 수신 동의는 동의 철회 시까지 보유하며, 철회 요청 시 지체 없이 처리합니다.</p>
        <p>다만 관련 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.</p>
      </>
    ),
  },
  {
    id: "p5",
    title: "5. 개인정보의 제3자 제공",
    body: (
      <p>
        회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 이용자가 사전에 동의한 경우 또는 법령에 특별한 규정이 있는 경우에 한하여 예외로
        합니다.
      </p>
    ),
  },
  {
    id: "p6",
    title: "6. 개인정보 처리의 위탁",
    body: (
      <p>
        회사는 현재 개인정보 처리 업무를 외부에 위탁하지 않습니다. 향후 서버 호스팅 또는 이메일 발송 등 처리 업무를 위탁하는 경우, 위탁받는 자와 위탁
        업무의 내용을 본 방침을 통해 사전에 공개하겠습니다.
      </p>
    ),
  },
  {
    id: "p7",
    title: "7. 개인정보의 파기 절차 및 방법",
    body: (
      <ul>
        <li>파기 절차: 보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다.</li>
        <li>파기 방법: 전자적 파일 형태의 정보는 복구할 수 없는 기술적 방법으로 삭제합니다.</li>
      </ul>
    ),
  },
  {
    id: "p8",
    title: "8. 정보주체의 권리와 행사 방법",
    body: (
      <>
        <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <ul>
          <li>개인정보 열람, 정정·삭제, 처리정지 요구</li>
          <li>마케팅 정보 수신 동의 철회</li>
        </ul>
        <p>권리 행사는 {contact}로 요청하실 수 있으며, 회사는 본인 확인 후 지체 없이 조치합니다.</p>
      </>
    ),
  },
  {
    id: "p9",
    title: "9. 개인정보의 안전성 확보 조치",
    body: (
      <ul>
        <li>관리자 페이지 접근 시 인증을 요구하며, 접근 권한을 최소 인원으로 제한합니다.</li>
        <li>관리자 비밀번호는 단방향 암호화하여 저장하고, 로그인 시도 횟수를 제한합니다.</li>
        <li>개인정보는 접근이 통제된 서버에 저장하며, 전송 구간은 HTTPS로 암호화합니다.</li>
        <li>필요한 최소한의 정보만 수집하고, 불필요한 정보는 저장하지 않습니다.</li>
      </ul>
    ),
  },
  {
    id: "p10",
    title: "10. 쿠키 등 자동 수집 장치",
    body: (
      <p>
        회사는 일반 방문자를 대상으로 광고·추적 목적의 쿠키를 사용하지 않습니다. 관리자 로그인 상태 유지를 위한 필수 쿠키만 관리자 페이지에서
        사용합니다.
      </p>
    ),
  },
  {
    id: "p11",
    title: "11. 개인정보 보호책임자",
    body: (
      <>
        <p>회사는 개인정보 처리에 관한 업무를 총괄하고, 관련 불만 처리 및 피해 구제를 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
        <table>
          <tbody>
            <tr><th>개인정보 보호책임자</th><td>{site.privacyOfficer}</td></tr>
            <tr><th>연락처</th><td>{contact}</td></tr>
          </tbody>
        </table>
        <p>
          기타 개인정보 침해에 대한 신고나 상담이 필요한 경우 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118), 개인정보분쟁조정위원회(kopico.go.kr,
          1833-6972) 등에 문의하실 수 있습니다.
        </p>
      </>
    ),
  },
  {
    id: "p12",
    title: "12. 개인정보처리방침의 변경",
    body: <p>본 방침의 내용이 변경되는 경우 시행일 최소 7일 전에 웹사이트를 통해 공지합니다. 본 방침은 {site.legalEffectiveDate}부터 시행됩니다.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumb="개인정보처리방침" title="개인정보처리방침" lead="FLUX ADS는 서비스 제공에 필요한 최소한의 개인정보만 수집하고 안전하게 관리합니다.">
        <div className="legal-meta"><span>시행일: {site.legalEffectiveDate}</span></div>
      </PageHero>
      <LegalDoc sections={sections} />
    </>
  );
}
