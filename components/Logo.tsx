import Link from "next/link";

export function LogoMark({ className = "logo-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#101828" />
      <path d="M9 10.5h14" stroke="#4169F5" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M9 16h9.5" stroke="#8EA6FF" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M9 21.5h5" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="22.5" cy="21.5" r="2.2" fill="#4169F5" />
    </svg>
  );
}

export function Logo({ onDark = false, href = "/" }: { onDark?: boolean; href?: string }) {
  return (
    <Link href={href} className={`logo${onDark ? " on-dark" : ""}`} aria-label="FLUX ADS 홈">
      <LogoMark />
      <span className="logo-word">
        FLUX<span className="logo-ads">ADS</span>
      </span>
    </Link>
  );
}
