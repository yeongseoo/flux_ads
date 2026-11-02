import { Plus } from "lucide-react";
import type { Faq } from "@/lib/content";

export function FaqList({ items, openFirst = false }: { items: Faq[]; openFirst?: boolean }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} open={openFirst && i === 0}>
          <summary>
            <span className="q"><b aria-hidden="true">Q.</b>{f.q}</span>
            <span className="plus" aria-hidden="true"><Plus /></span>
          </summary>
          <div className="a">
            {f.a.map((p) => <p key={p}>{p}</p>)}
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") } })),
  };
}
