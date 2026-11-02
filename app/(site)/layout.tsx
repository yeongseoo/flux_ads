import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">본문으로 건너뛰기</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Reveal />
    </>
  );
}
