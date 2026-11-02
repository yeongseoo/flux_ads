import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "관리자", template: "%s | FLUX ADS Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-body">{children}</div>;
}
