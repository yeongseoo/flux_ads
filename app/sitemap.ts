import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { path: "/", priority: 1, freq: "weekly" as const },
    { path: "/service", priority: 0.9, freq: "monthly" as const },
    { path: "/beta", priority: 0.9, freq: "weekly" as const },
    { path: "/faq", priority: 0.7, freq: "monthly" as const },
    { path: "/privacy", priority: 0.3, freq: "yearly" as const },
    { path: "/terms", priority: 0.3, freq: "yearly" as const },
  ].map((p) => ({ url: `${site.url}${p.path === "/" ? "" : p.path}`, lastModified: now, changeFrequency: p.freq, priority: p.priority }));
}
