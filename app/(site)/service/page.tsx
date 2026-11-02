import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ban, Check, CircleCheck, Clock, Code, FileText, Globe, Hourglass, KeyRound, LayoutDashboard, ShieldAlert, Plug, ShieldCheck, TrendingUp } from "lucide-react";
import { PageHero, CtaStrip } from "@/components/PageParts";
import { Icon } from "@/components/icons";
import { PROCESS } from "@/lib/content";
import { getRecruitSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "서비스 소개",
  description: "광고 수익화 진단, 광고 연결 지원, 광고 운영 관리, 운영 지원까지 — FLUX ADS의 웹사이트 광고 수익화 지원 서비스를 소개합니다.",
  alternates: { canonical: "/service" },
  openGraph: { title: "서비스 소개 | FLUX ADS", url: "/service" },
};

export default function ServicePage() {
  const settings = getRecruitSettings();
  return (
    <>
      <PageHero
        crumb="서비스 소개"
        eyebrow="Services"
        title={<>광고 수익화의 시작부터<br />운영까지, 한 흐름으로.</>}
        lead="FLUX ADS는 웹사이트 운영자가 광고 수익화를 처음 준비하는 단계부터 실제 운영까지 겪는 과정을 단순하고 명확하게 정리해 드립니다."
      >
        <div className="hero-cta" style={{ marginTop: 32 }}>
          <Link href="/beta" className="btn btn-primary btn-lg">베타 파트너 신청하기 <ArrowRight className="arrow" aria-hidden="true" /></Link>
          <Link href="#scope" className="btn btn-secondary btn-lg">제공 범위 보기</Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="container">
          {/* 1. 진단 */}
          <div className="feature-row reveal">
            <div className="feature-copy">
              <span className="icon-box"><Icon name="scan" /></span>
              <h2>광고 수익화 진단</h2>
              <p>웹사이트 구조와 콘텐츠를 확인하고 광고 수익화 준비 상태를 안내합니다. 무엇이 준비되었고 무엇을 보완해야 하는지 명확하게 알려드립니다.</p>
              <ul className="feature-list">
                <li><Check aria-hidden="true" /><div><b>사이트 기본 구성 점검</b><span>도메인, HTTPS, 모바일 대응, 탐색 구조를 확인합니다.</span></div></li>
                <li><Check aria-hidden="true" /><div><b>콘텐츠 및 필수 페이지 확인</b><span>개인정보처리방침·문의 페이지 등 광고 플랫폼이 일반적으로 요구하는 항목을 점검합니다.</span></div></li>
                <li><Check aria-hidden="true" /><div><b>보완 사항 안내</b><span>우선순위별로 정리된 개선 항목을 전달합니다.</span></div></li>
              </ul>
            </div>
            <div className="feature-visual" aria-hidden="true">
              <div className="fv-card">
                <div className="fv-title">수익화 준비 상태 체크리스트 <span className="sample">EXAMPLE</span></div>
                <div className="fv-row"><span className="l"><Globe />HTTPS 및 도메인</span><span className="badge tone-green">확인</span></div>
                <div className="fv-row"><span className="l"><FileText />개인정보처리방침 페이지</span><span className="badge tone-green">확인</span></div>
                <div className="fv-row"><span className="l"><LayoutDashboard />모바일 레이아웃</span><span className="badge tone-amber">보완 필요</span></div>
                <div className="fv-row"><span className="l"><Clock />콘텐츠 업데이트 주기</span><span className="badge tone-gray">검토 중</span></div>
              </div>
            </div>
          </div>

          {/* 2. 연결 */}
          <div className="feature-row flip reveal">
            <div className="feature-copy">
              <span className="icon-box"><Icon name="link" /></span>
              <h2>광고 연결 지원</h2>
              <p>광고 플랫폼 가입 과정과 광고 코드 설치를 지원합니다. WordPress, Tistory, Blogger, 직접 구축한 사이트 등 환경에 맞는 방법을 안내합니다.</p>
              <ul className="feature-list">
                <li><Check aria-hidden="true" /><div><b>가입 절차 안내</b><span>광고 플랫폼 가입과 사이트 등록 과정을 단계별로 안내합니다.</span></div></li>
                <li><Check aria-hidden="true" /><div><b>광고 코드·ads.txt 설치 지원</b><span>플랫폼별 설치 위치와 방법을 정확히 안내합니다.</span></div></li>
                <li><Check aria-hidden="true" /><div><b>설치 확인</b><span>코드가 올바르게 적용되었는지 함께 확인합니다.</span></div></li>
              </ul>
            </div>
            <div className="feature-visual" aria-hidden="true">
              <div className="code">
                <span className="c">{"<!-- 예시: <head> 영역에 광고 스크립트 삽입 -->"}</span>{"\n"}
                <span className="t">{"<script"}</span> async{"\n"}
                {"  "}src=<span className="s">{'"https://ads.example.com/tag.js"'}</span>{"\n"}
                {"  "}data-client=<span className="s">{'"pub-XXXXXXXX"'}</span><span className="t">{">"}</span>{"\n"}
                <span className="t">{"</script>"}</span>
              </div>
              <div className="fv-card" style={{ marginTop: 12 }}>
                <div className="fv-row"><span className="l"><Code />광고 코드 적용</span><span className="badge tone-green">완료</span></div>
                <div className="fv-row"><span className="l"><FileText />ads.txt 등록</span><span className="badge tone-green">완료</span></div>
              </div>
            </div>
          </div>

          {/* 3. 운영 */}
          <div className="feature-row reveal">
            <div className="feature-copy">
              <span className="icon-box"><Icon name="settings" /></span>
              <h2>광고 운영 관리</h2>
              <p>광고 설정 및 운영 상태를 점검하고 개선 방향을 제안합니다. 방문자 경험을 해치지 않는 균형 잡힌 광고 운영을 목표로 합니다.</p>
              <ul className="feature-list">
                <li><Check aria-hidden="true" /><div><b>광고 배치·설정 점검</b><span>노출 위치, 광고 밀도, 모바일 표시 상태를 확인합니다.</span></div></li>
                <li><Check aria-hidden="true" /><div><b>개선 방향 제안</b><span>사이트 특성에 맞는 설정 개선안을 제안합니다.</span></div></li>
                <li><Check aria-hidden="true" /><div><b>정책 준수 확인</b><span>광고 플랫폼 정책에 어긋나는 설정이 없는지 함께 살펴봅니다.</span></div></li>
              </ul>
            </div>
            <div className="feature-visual" aria-hidden="true">
              <div className="fv-card">
                <div className="fv-title">운영 점검 항목 <span className="sample">EXAMPLE</span></div>
                <div className="fv-row"><span className="l"><LayoutDashboard />본문 내 광고 배치</span><span className="muted">점검</span></div>
                <div className="fv-row"><span className="l"><Globe />모바일 광고 표시</span><span className="muted">점검</span></div>
                <div className="fv-row"><span className="l"><ShieldCheck />정책 준수 상태</span><span className="muted">점검</span></div>
                <div className="fv-row"><span className="l"><TrendingUp />개선 제안</span><span className="muted">리포트</span></div>
              </div>
            </div>
          </div>

          {/* 4. 지원 */}
          <div className="feature-row flip reveal">
            <div className="feature-copy">
              <span className="icon-box"><Icon name="headset" /></span>
              <h2>운영 지원</h2>
              <p>광고 수익화 관련 문의와 문제 해결을 지원합니다. 광고가 표시되지 않거나 설정이 헷갈릴 때 함께 원인을 찾습니다.</p>
              <ul className="feature-list">
                <li><Check aria-hidden="true" /><div><b>1:1 문의 대응</b><span>이메일을 통해 수익화 관련 질문에 답변합니다.</span></div></li>
                <li><Check aria-hidden="true" /><div><b>문제 해결 지원</b><span>광고 미노출, 코드 오류 등 자주 발생하는 문제의 원인을 함께 확인합니다.</span></div></li>
                <li><Check aria-hidden="true" /><div><b>정책 안내</b><span>광고 플랫폼의 공개된 정책과 공식 도움말을 기반으로 안내합니다.</span></div></li>
              </ul>
            </div>
            <div className="feature-visual" aria-hidden="true">
              <div className="fv-card">
                <div className="fv-title">문의 처리 흐름</div>
                <div className="fv-row"><span className="l"><FileText />문의 접수</span><span className="badge tone-blue">1</span></div>
                <div className="fv-row"><span className="l"><Plug />원인 확인</span><span className="badge tone-blue">2</span></div>
                <div className="fv-row"><span className="l"><CircleCheck />해결 방법 안내</span><span className="badge tone-blue">3</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 제공 범위 */}
      <section id="scope" className="section section-alt" aria-labelledby="scope-title">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Scope</span>
            <h2 id="scope-title">현재 제공하는 기능과<br />개발 예정 기능을 투명하게 안내합니다.</h2>
            <p>베타 기간에는 전문 인력의 진단과 지원 중심으로 서비스를 제공하며, 자동화 기능은 순차적으로 개발할 예정입니다.</p>
          </div>
          <div className="scope-grid">
            <div className="scope reveal">
              <div className="scope-head"><h3>베타 기간 제공</h3><span className="pill pill-green">현재 제공</span></div>
              <p>베타 파트너에게 바로 제공되는 지원입니다.</p>
              <ul>
                <li><CircleCheck aria-hidden="true" />웹사이트 광고 수익화 준비 상태 진단</li>
                <li><CircleCheck aria-hidden="true" />광고 플랫폼 가입 절차 안내</li>
                <li><CircleCheck aria-hidden="true" />광고 코드 및 ads.txt 설치 지원</li>
                <li><CircleCheck aria-hidden="true" />광고 배치·설정 점검 및 개선 제안</li>
                <li><CircleCheck aria-hidden="true" />이메일 기반 문의 대응 및 문제 해결 지원</li>
              </ul>
            </div>
            <div className="scope planned reveal">
              <div className="scope-head"><h3>향후 개발 예정</h3><span className="pill pill-gray">개발 예정</span></div>
              <p>아래 기능은 현재 제공되지 않으며, 출시 일정은 확정 후 안내드립니다.</p>
              <ul>
                <li><Hourglass aria-hidden="true" />웹사이트 성과·광고 운영 현황 대시보드</li>
                <li><Hourglass aria-hidden="true" />공식 권한 부여(OAuth) 기반 광고 플랫폼 데이터 연동</li>
                <li><Hourglass aria-hidden="true" />사이트 상태 모니터링 및 알림</li>
                <li><Hourglass aria-hidden="true" />정기 운영 리포트 자동 발송</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 원칙 */}
      <section className="section" aria-labelledby="principle-title">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Our Principles</span>
            <h2 id="principle-title">FLUX ADS가 하지 않는 것</h2>
            <p>신뢰할 수 있는 파트너가 되기 위해 다음 원칙을 지킵니다.</p>
          </div>
          <div className="principles">
            <div className="principle reveal">
              <span className="icon-box"><KeyRound aria-hidden="true" /></span>
              <h3>계정 비밀번호를 요구하지 않습니다</h3>
              <p>광고 플랫폼이나 사이트 관리자 비밀번호를 요청하지 않습니다. 연동이 필요한 경우 공식 권한 부여 절차만 검토합니다.</p>
            </div>
            <div className="principle reveal">
              <span className="icon-box"><Ban aria-hidden="true" /></span>
              <h3>승인·수익을 보장하지 않습니다</h3>
              <p>광고 승인과 수익은 각 광고 플랫폼의 심사·정책과 사이트 상황에 따라 결정됩니다. 과장된 약속을 하지 않습니다.</p>
            </div>
            <div className="principle reveal">
              <span className="icon-box"><ShieldAlert aria-hidden="true" /></span>
              <h3>정책 위반 방식을 권하지 않습니다</h3>
              <p>클릭 유도, 인위적 트래픽 등 광고 플랫폼 정책에 위배되는 방법을 제안하거나 사용하지 않습니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm section-alt">
        <div className="container">
          <div className="section-head reveal" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Process</span>
            <h2>서비스 이용 과정</h2>
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

      <CtaStrip open={settings.open} />
    </>
  );
}
