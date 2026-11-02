"use client";

import { useActionState } from "react";
import { CircleAlert, Lock } from "lucide-react";
import { login, type LoginState } from "../actions";

export function LoginForm({ configError }: { configError: string | null }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="fields" style={{ gap: 18 }}>
      {(configError || state.error) && (
        <div className="alert alert-error" role="alert" style={{ marginBottom: 0 }}>
          <CircleAlert aria-hidden="true" />
          <span>{configError ? `관리자 인증이 설정되지 않았습니다. ${configError} (README 참고)` : state.error}</span>
        </div>
      )}
      <div className="field">
        <label htmlFor="username">아이디</label>
        <input id="username" name="username" className="input" autoComplete="username" required autoFocus={!state.username} defaultValue={state.username} />
      </div>
      <div className="field">
        <label htmlFor="password">비밀번호</label>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required autoFocus={!!state.username} />
      </div>
      <button className="btn btn-dark btn-lg" disabled={pending || !!configError}>
        {pending ? <><span className="spinner" aria-hidden="true" /> 확인 중...</> : <><Lock aria-hidden="true" /> 로그인</>}
      </button>
    </form>
  );
}
