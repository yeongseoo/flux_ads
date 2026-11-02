import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { AdminNav } from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <header className="admin-header">
        <div className="container">
          <Logo href="/admin" />
          <span className="admin-badge">ADMIN</span>
          <AdminNav />
          <div className="admin-user">
            <span>{admin.username}</span>
            <form action={logout}>
              <button className="btn btn-secondary btn-sm"><LogOut aria-hidden="true" /> 로그아웃</button>
            </form>
          </div>
        </div>
      </header>
      <main className="admin-main">
        <div className="container">{children}</div>
      </main>
    </>
  );
}
