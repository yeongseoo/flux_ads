import { Activity, ChartLine, CircleCheck, Clock, Globe, LayoutDashboard, Plug, ScanSearch, Settings, Wallet } from "lucide-react";

/** 디자인용 예시 데이터 — 실제 운영 데이터가 아닙니다. */
const SAMPLE_VIEWS = [32, 38, 35, 44, 41, 52, 49, 58, 55, 63, 61, 70, 68, 76];
const SAMPLE_BARS = [40, 55, 48, 62, 58, 74, 66];

function linePath(values: number[], w: number, h: number, pad = 4) {
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values) * 0.8;
  const step = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => [pad + i * step, h - pad - ((v - min) / (max - min)) * (h - pad * 2)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return { line, area: `${line} L${pts.at(-1)![0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`, last: pts.at(-1)! };
}

export function HeroDashboard() {
  const { line, area, last } = linePath(SAMPLE_VIEWS, 300, 92);
  return (
    <div className="dash-wrap" role="img" aria-label="FLUX ADS 대시보드 예시 화면 (DEMO, 실제 데이터 아님)">
      <div className="dash" aria-hidden="true">
        <div className="dash-top">
          <div className="dash-dots"><i /><i /><i /></div>
          <div className="dash-url">app.fluxads · overview</div>
          <span className="demo-badge">DEMO</span>
        </div>
        <div className="dash-body">
          <div className="dash-side">
            <div className="sec">WORKSPACE</div>
            <div className="item active"><LayoutDashboard /> Overview</div>
            <div className="item"><ChartLine /> Analytics</div>
            <div className="item"><Plug /> Ad Integration</div>
            <div className="item"><Wallet /> Revenue</div>
            <div className="sec">SITE</div>
            <div className="item"><Globe /> Site Status</div>
            <div className="item"><ScanSearch /> Diagnosis</div>
            <div className="item"><Settings /> Settings</div>
          </div>
          <div className="dash-main">
            <div className="head"><b>Overview</b><span>예시 화면 · 실제 데이터 아님</span></div>
            <div className="dcard span2">
              <div className="dcard-h">
                <b>Website Performance</b>
                <span className="sample">SAMPLE</span>
              </div>
              <div className="dval">24,580 <small>+12.4%</small></div>
              <svg className="chart" viewBox="0 0 300 92" preserveAspectRatio="none" style={{ height: 120 }}>
                <defs>
                  <linearGradient id="dashFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4169F5" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#4169F5" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g className="chart-grid">
                  <line x1="0" x2="300" y1="23" y2="23" />
                  <line x1="0" x2="300" y1="46" y2="46" />
                  <line x1="0" x2="300" y1="69" y2="69" />
                </g>
                <path d={area} fill="url(#dashFill)" />
                <path d={line} fill="none" stroke="#4169F5" strokeWidth="2.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                <circle cx={last[0]} cy={last[1]} r="3.5" fill="#fff" stroke="#4169F5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className="dcard">
              <div className="dcard-h"><b>Ad Integration</b><span className="sample">SAMPLE</span></div>
              <ul className="checks">
                <li><span className="ic ok"><CircleCheck /></span> ads.txt 확인</li>
                <li><span className="ic ok"><CircleCheck /></span> 광고 코드 설치</li>
                <li><span className="ic wait"><Clock /></span> 광고 배치 점검</li>
              </ul>
            </div>

            <div className="dcard">
              <div className="dcard-h"><b>Revenue Overview</b><span className="sample">SAMPLE</span></div>
              <div className="dval" style={{ fontSize: 18 }}>₩ 000,000</div>
              <div className="bars">
                {SAMPLE_BARS.map((h, i) => (
                  <span key={i} className={i === SAMPLE_BARS.length - 1 ? "on" : ""} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className="dcard">
              <div className="dcard-h"><b>Site Status</b><span className="sample">SAMPLE</span></div>
              <div className="status-row"><span><i className="dot" />Online</span><span className="muted">HTTPS</span></div>
              <div className="status-row"><span className="muted">Mobile</span><span>Responsive</span></div>
            </div>

            <div className="dcard">
              <div className="dcard-h"><b>Analytics</b><Activity size={14} /></div>
              <div className="status-row"><span className="muted">Sessions</span><span>—</span></div>
              <div className="status-row"><span className="muted">Avg. Time</span><span>—</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="dash-float" aria-hidden="true">
        <div className="row">
          <span className="ico"><ScanSearch /></span>
          <div>
            <b>수익화 준비 진단</b>
            <span className="muted">3 / 4 항목 확인 · DEMO</span>
          </div>
        </div>
        <div className="progress"><i /></div>
      </div>
      <p className="dash-caption">* 서비스 이해를 돕기 위한 예시 화면이며, 실제 운영 데이터가 아닙니다.</p>
    </div>
  );
}
