import "server-only";
import { db } from "./db";

export type RecruitSettings = {
  /** 모집 진행 여부 (false면 신청서 제출 불가) */
  open: boolean;
  /** 초기 모집 목표 팀 수 */
  target: number;
  /** 공개 페이지에 모집 목표를 표시할지 여부 */
  showTarget: boolean;
  /** 마감 시 표시할 안내 문구 */
  closedMessage: string;
};

const DEFAULTS: RecruitSettings = {
  open: true,
  target: 10,
  showTarget: true,
  closedMessage: "1차 베타 파트너 모집이 마감되었습니다. 다음 모집 일정은 추후 안내드리겠습니다.",
};

export function getRecruitSettings(): RecruitSettings {
  const rows = db().prepare("SELECT key, value FROM settings WHERE key LIKE 'recruit.%'").all() as { key: string; value: string }[];
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const target = Number(map.get("recruit.target"));
  return {
    open: map.has("recruit.open") ? map.get("recruit.open") === "1" : DEFAULTS.open,
    target: Number.isInteger(target) && target > 0 ? target : DEFAULTS.target,
    showTarget: map.has("recruit.showTarget") ? map.get("recruit.showTarget") === "1" : DEFAULTS.showTarget,
    closedMessage: map.get("recruit.closedMessage") || DEFAULTS.closedMessage,
  };
}

export function saveRecruitSettings(s: RecruitSettings): void {
  const stmt = db().prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
  stmt.run("recruit.open", s.open ? "1" : "0");
  stmt.run("recruit.target", String(s.target));
  stmt.run("recruit.showTarget", s.showTarget ? "1" : "0");
  stmt.run("recruit.closedMessage", s.closedMessage);
}
