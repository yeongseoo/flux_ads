"use client";

import { useActionState, useEffect, useRef, useState, startTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Globe, Mail, UserRound } from "lucide-react";
import { submitApplication, type ApplyState } from "@/app/(site)/beta/actions";
import { AD_STATUSES, PLATFORMS, SUPPORT_TYPES, VISITORS, labelOf, type Option } from "@/lib/options";
import { LIMITS, validateBeta, type BetaInput, type FieldErrors } from "@/lib/validation";

const STEPS = [
  { title: "기본 정보", desc: "신청자와 웹사이트 정보를 입력해 주세요.", fields: ["name", "email", "website_url"] },
  { title: "사이트 현황", desc: "웹사이트의 현재 운영 상태를 알려 주세요.", fields: ["platform", "ad_status", "monthly_visitors"] },
  { title: "지원 및 동의", desc: "필요한 지원을 선택하고 내용을 확인해 주세요.", fields: ["support_types", "message", "privacy_consent", "marketing_consent"] },
] as const satisfies readonly { title: string; desc: string; fields: readonly (keyof BetaInput)[] }[];

const EMPTY: BetaInput = {
  name: "", email: "", website_url: "", platform: "", ad_status: "", monthly_visitors: "",
  support_types: [], message: "", privacy_consent: false, marketing_consent: false,
};

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return <p id={id} className="err" role="alert"><CircleAlert aria-hidden="true" />{msg}</p>;
}

function RadioGroup({ name, legend, options, value, onChange, error, cols }: {
  name: keyof BetaInput; legend: string; options: readonly Option[]; value: string; onChange: (v: string) => void; error?: string; cols?: string;
}) {
  return (
    <fieldset className="field" id={`f-${name}`}>
      <legend>{legend}<span className="req" aria-hidden="true">*</span><span className="sr-only">(필수)</span></legend>
      <div className={`choices ${cols ?? ""}`} role="radiogroup" aria-invalid={!!error || undefined} aria-describedby={error ? `e-${name}` : undefined}>
        {options.map((o) => (
          <label className="choice" key={o.value}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="mark" aria-hidden="true" />
            {o.label}
          </label>
        ))}
      </div>
      <FieldError id={`e-${name}`} msg={error} />
    </fieldset>
  );
}

export function BetaForm() {
  const [state, formAction, pending] = useActionState<ApplyState, FormData>(submitApplication, {});
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BetaInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [meta, setMeta] = useState({ ts: "", token: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const token = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}abcdef`;
    setMeta({ ts: String(Date.now()), token });
  }, []);

  // 서버 검증 오류 반영
  useEffect(() => {
    if (!state.errors) return;
    setErrors(state.errors);
    const idx = STEPS.findIndex((s) => s.fields.some((f) => state.errors![f]));
    if (idx >= 0) setStep(idx);
  }, [state]);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headRef.current?.focus();
  }, [step]);

  const set = <K extends keyof BetaInput>(k: K, v: BetaInput[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const stepErrors = (i: number): FieldErrors => {
    const all = validateBeta(data);
    return Object.fromEntries(STEPS[i].fields.filter((f) => all[f]).map((f) => [f, all[f]]));
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`#f-${first} input, #f-${first} textarea, [name="${first}"]`);
      el?.focus();
    });
  };

  const next = () => {
    const errs = stepErrors(step);
    if (Object.keys(errs).length) { setErrors((e) => ({ ...e, ...errs })); focusFirstError(errs); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 100, behavior: "smooth" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    if (step < STEPS.length - 1) return next();
    const all = validateBeta(data);
    if (Object.keys(all).length) {
      setErrors(all);
      const idx = STEPS.findIndex((s) => s.fields.some((f) => all[f]));
      setStep(idx);
      focusFirstError(all);
      return;
    }
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };

  const toggleSupport = (v: string) =>
    set("support_types", data.support_types.includes(v) ? data.support_types.filter((x) => x !== v) : [...data.support_types, v]);

  const s = STEPS[step];

  return (
    <div className="form-card">
      <ol className="stepper" aria-label="신청 단계">
        {STEPS.map((st, i) => (
          <li key={st.title} className={i === step ? "current" : i < step ? "done" : ""} aria-current={i === step ? "step" : undefined}>
            <span className="n">{i < step ? <Check aria-hidden="true" /> : i + 1}</span>
            {st.title}
          </li>
        ))}
      </ol>

      <form ref={formRef} className="form-body" onSubmit={onSubmit} noValidate aria-busy={pending}>
        {state.message && (
          <div className="alert alert-error" role="alert"><CircleAlert aria-hidden="true" /><span>{state.message}</span></div>
        )}

        <div className="form-step-head">
          <h2 ref={headRef} tabIndex={-1}>{s.title}</h2>
          <p>{s.desc}</p>
        </div>

        {/* 스팸 방지용 필드 — 사람에게는 보이지 않습니다 */}
        <div className="hp" aria-hidden="true">
          <label>이 칸은 비워 두세요<input type="text" name="hp_field" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
        </div>
        <input type="hidden" name="_ts" value={meta.ts} />
        <input type="hidden" name="submission_token" value={meta.token} />

        {/* STEP 1 */}
        <div className="fields" hidden={step !== 0}>
          <div className="field" id="f-name">
            <label htmlFor="name">이름 또는 닉네임<span className="req" aria-hidden="true">*</span></label>
            <div className="input-prefix">
              <UserRound aria-hidden="true" />
              <input id="name" name="name" className="input" autoComplete="name" required maxLength={LIMITS.name}
                value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="홍길동 또는 닉네임"
                aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? "e-name" : undefined} />
            </div>
            <FieldError id="e-name" msg={errors.name} />
          </div>
          <div className="field" id="f-email">
            <label htmlFor="email">이메일 주소<span className="req" aria-hidden="true">*</span></label>
            <div className="input-prefix">
              <Mail aria-hidden="true" />
              <input id="email" name="email" type="email" inputMode="email" className="input" autoComplete="email" required maxLength={LIMITS.email}
                value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com"
                aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? "e-email" : "h-email"} />
            </div>
            <p className="hint" id="h-email">검토 결과와 진행 안내를 이 주소로 보내 드립니다.</p>
            <FieldError id="e-email" msg={errors.email} />
          </div>
          <div className="field" id="f-website_url">
            <label htmlFor="website_url">웹사이트 주소<span className="req" aria-hidden="true">*</span></label>
            <div className="input-prefix">
              <Globe aria-hidden="true" />
              <input id="website_url" name="website_url" type="url" inputMode="url" className="input" autoComplete="url" required maxLength={LIMITS.url}
                value={data.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://myblog.com"
                aria-invalid={!!errors.website_url || undefined} aria-describedby={errors.website_url ? "e-website_url" : "h-url"} />
            </div>
            <p className="hint" id="h-url">직접 운영 중인 웹사이트 또는 블로그의 주소를 입력해 주세요.</p>
            <FieldError id="e-website_url" msg={errors.website_url} />
          </div>
        </div>

        {/* STEP 2 */}
        <div className="fields" hidden={step !== 1}>
          <RadioGroup name="platform" legend="웹사이트 플랫폼" options={PLATFORMS} value={data.platform} onChange={(v) => set("platform", v)} error={errors.platform} />
          <RadioGroup name="ad_status" legend="현재 광고 연결 상태" options={AD_STATUSES} value={data.ad_status} onChange={(v) => set("ad_status", v)} error={errors.ad_status} cols="cols-2" />
          <RadioGroup name="monthly_visitors" legend="월간 방문자 수" options={VISITORS} value={data.monthly_visitors} onChange={(v) => set("monthly_visitors", v)} error={errors.monthly_visitors} />
        </div>

        {/* STEP 3 */}
        <div className="fields" hidden={step !== 2}>
          <fieldset className="field" id="f-support_types">
            <legend>필요한 지원<span className="req" aria-hidden="true">*</span><span className="opt">복수 선택 가능</span></legend>
            <div className="choices cols-2" aria-invalid={!!errors.support_types || undefined} aria-describedby={errors.support_types ? "e-support_types" : undefined}>
              {SUPPORT_TYPES.map((o) => (
                <label className="choice" key={o.value}>
                  <input type="checkbox" name="support_types" value={o.value} checked={data.support_types.includes(o.value)} onChange={() => toggleSupport(o.value)} />
                  <span className="mark" aria-hidden="true"><Check /></span>
                  {o.label}
                </label>
              ))}
            </div>
            <FieldError id="e-support_types" msg={errors.support_types} />
          </fieldset>

          <div className="field" id="f-message">
            <label htmlFor="message">추가 문의사항<span className="opt">선택</span></label>
            <textarea id="message" name="message" className="textarea" maxLength={LIMITS.message} value={data.message}
              onChange={(e) => set("message", e.target.value)} placeholder="웹사이트 운영 현황이나 궁금한 점을 자유롭게 남겨 주세요."
              aria-invalid={!!errors.message || undefined} aria-describedby="c-message" />
            <span className="counter" id="c-message">{data.message.length.toLocaleString()} / {LIMITS.message.toLocaleString()}</span>
            <FieldError id="e-message" msg={errors.message} />
          </div>

          <div>
            <dl className="review" aria-label="입력 내용 확인">
              <div><dt>이름</dt><dd>{data.name || "-"}</dd></div>
              <div><dt>이메일</dt><dd>{data.email || "-"}</dd></div>
              <div><dt>웹사이트</dt><dd>{data.website_url || "-"}</dd></div>
              <div><dt>플랫폼 / 광고 상태</dt><dd>{labelOf(PLATFORMS, data.platform)} · {labelOf(AD_STATUSES, data.ad_status)}</dd></div>
              <div><dt>월간 방문자</dt><dd>{labelOf(VISITORS, data.monthly_visitors)}</dd></div>
            </dl>

            <div className={`consent${errors.privacy_consent ? " invalid" : ""}`} id="f-privacy_consent">
              <label className="consent-row">
                <input type="checkbox" name="privacy_consent" checked={data.privacy_consent} onChange={(e) => set("privacy_consent", e.target.checked)}
                  aria-invalid={!!errors.privacy_consent || undefined} aria-describedby="d-privacy" required />
                <span className="mark" aria-hidden="true"><Check /></span>
                <span className="t">개인정보 수집 및 이용에 동의합니다.<small className="r">(필수)</small></span>
              </label>
              <div className="consent-detail" id="d-privacy">
                <table>
                  <tbody>
                    <tr><th>수집 항목</th><td>이름(닉네임), 이메일, 웹사이트 주소·플랫폼·광고 상태·방문자 수, 필요한 지원, 문의사항</td></tr>
                    <tr><th>이용 목적</th><td>베타 신청 검토, 결과 안내 및 베타 서비스 제공</td></tr>
                    <tr><th>보유 기간</th><td>베타 프로그램 종료 또는 신청일로부터 1년 중 먼저 도래하는 시점까지 (삭제 요청 시 즉시 파기)</td></tr>
                  </tbody>
                </table>
                <p>동의를 거부할 수 있으며, 거부 시 베타 신청이 제한됩니다. 자세한 내용은 <Link href="/privacy" target="_blank">개인정보처리방침</Link>을 확인해 주세요.</p>
              </div>
            </div>
            <div style={{ marginTop: 8 }}><FieldError id="e-privacy_consent" msg={errors.privacy_consent} /></div>

            <div className="consent" style={{ marginTop: 12 }}>
              <label className="consent-row">
                <input type="checkbox" name="marketing_consent" checked={data.marketing_consent} onChange={(e) => set("marketing_consent", e.target.checked)} aria-describedby="d-mkt" />
                <span className="mark" aria-hidden="true"><Check /></span>
                <span className="t">서비스 소식 및 마케팅 정보 수신에 동의합니다.<small className="o">(선택)</small></span>
              </label>
              <div className="consent-detail" id="d-mkt">
                <p style={{ marginTop: 0 }}>정식 출시, 신규 기능 등의 소식을 이메일로 받아 보실 수 있습니다. 동의하지 않아도 신청할 수 있으며, 언제든 철회할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* hidden 상태의 단계 입력값도 함께 전송되도록 모든 입력 요소는 DOM에 유지됩니다 */}
        <div className="form-actions">
          {step > 0 ? (
            <button type="button" className="btn btn-secondary" onClick={() => setStep((v) => v - 1)} disabled={pending}>
              <ArrowLeft aria-hidden="true" /> 이전
            </button>
          ) : (
            <span className="step-info">{step + 1} / {STEPS.length} 단계</span>
          )}
          <span className="spacer" />
          {step > 0 && <span className="step-info">{step + 1} / {STEPS.length} 단계</span>}
          {step < STEPS.length - 1 ? (
            <button type="submit" className="btn btn-primary">
              다음 <ArrowRight className="arrow" aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary btn-lg" disabled={pending || !meta.token}>
              {pending ? <><span className="spinner" aria-hidden="true" /> 제출 중...</> : <>베타 파트너 신청하기 <ArrowRight className="arrow" aria-hidden="true" /></>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
