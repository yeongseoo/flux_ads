"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "신청 관리", match: (p: string) => p === "/admin" || p.startsWith("/admin/applications") },
  { href: "/admin/settings", label: "모집 설정", match: (p: string) => p.startsWith("/admin/settings") },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="관리자 메뉴">
      {ITEMS.map((i) => (
        <Link key={i.href} href={i.href} aria-current={i.match(pathname) ? "page" : undefined}>{i.label}</Link>
      ))}
      <Link href="/" target="_blank">사이트 보기 ↗</Link>
    </nav>
  );
}
