import { ChartLine, FileText, Gauge, Headset, LifeBuoy, Link2, Plug, ScanSearch, Settings2, type LucideIcon } from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  plug: Plug,
  gauge: Gauge,
  lifebuoy: LifeBuoy,
  scan: ScanSearch,
  link: Link2,
  settings: Settings2,
  headset: Headset,
  file: FileText,
  chart: ChartLine,
};

export function Icon({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) {
  const C = MAP[name] ?? Plug;
  return <C aria-hidden="true" {...props} />;
}
