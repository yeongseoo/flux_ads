import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { authConfigError, getAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "관리자 로그인" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="login-page">
      <div className="login-card">
        <Logo />
        <h1>관리자 로그인</h1>
        <p>FLUX ADS 베타 신청 관리 페이지입니다. 권한이 있는 관리자만 접근할 수 있습니다.</p>
        <LoginForm configError={authConfigError()} />
        <p className="login-foot"><Link href="/">← 웹사이트로 돌아가기</Link></p>
      </div>
    </main>
  );
}
