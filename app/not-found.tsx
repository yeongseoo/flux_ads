import Link from "next/link";
import { Compass } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="status-page">
        <div className="container">
          <div className="status-card">
            <div className="status-icon blue"><Compass aria-hidden="true" /></div>
            <h1>페이지를 찾을 수 없습니다.</h1>
            <p>요청하신 페이지가 존재하지 않거나 이동되었습니다. 주소를 다시 확인해 주세요.</p>
            <div className="status-actions">
              <Link href="/" className="btn btn-primary">홈으로 이동</Link>
              <Link href="/faq" className="btn btn-secondary">자주 묻는 질문</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
