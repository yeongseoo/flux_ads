"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="status-page">
      <div className="container">
        <div className="status-card">
          <div className="status-icon gray"><CircleAlert aria-hidden="true" /></div>
          <h1>일시적인 오류가 발생했습니다.</h1>
          <p>잠시 후 다시 시도해 주세요. 문제가 계속되면 FAQ의 문의 안내를 참고해 주세요.</p>
          <div className="status-actions">
            <button className="btn btn-primary" onClick={reset}>다시 시도</button>
            <Link href="/" className="btn btn-secondary">홈으로</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
