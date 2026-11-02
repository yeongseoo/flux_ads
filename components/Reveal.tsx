"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** 화면 아래쪽 요소에만 부드러운 등장 효과 적용. JS가 없거나 모션 축소 설정 시 그대로 표시됩니다. */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.reveal-init)")).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92,
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const siblings = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains("reveal-init"));
          el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 4) * 70}ms`;
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => {
      el.classList.add("reveal-init");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
