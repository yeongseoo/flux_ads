import { APPLICATION_STATUSES } from "@/lib/options";

export function StatusBadge({ status }: { status: string }) {
  const s = APPLICATION_STATUSES.find((x) => x.value === status);
  return <span className={`badge tone-${s?.tone ?? "gray"}`}>{s?.label ?? status}</span>;
}
