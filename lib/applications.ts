import "server-only";
import { db } from "./db";
import { APPLICATION_STATUSES, APPROVED_STATUSES, PLATFORMS, isValue, type ApplicationStatus } from "./options";

export type Application = {
  id: number;
  name: string;
  email: string;
  website_url: string;
  platform: string;
  ad_status: string;
  monthly_visitors: string;
  support_types: string[];
  message: string;
  privacy_consent: boolean;
  marketing_consent: boolean;
  application_status: ApplicationStatus;
  admin_note: string;
  created_at: string;
  updated_at: string;
};

type Row = Omit<Application, "support_types" | "privacy_consent" | "marketing_consent"> & {
  support_types: string;
  privacy_consent: number;
  marketing_consent: number;
};

const COLUMNS =
  "id, name, email, website_url, platform, ad_status, monthly_visitors, support_types, message, privacy_consent, marketing_consent, application_status, admin_note, created_at, updated_at";

function toApp(r: Row): Application {
  let support: string[] = [];
  try {
    support = JSON.parse(r.support_types);
  } catch {}
  return { ...r, support_types: support, privacy_consent: !!r.privacy_consent, marketing_consent: !!r.marketing_consent };
}

export type NewApplication = Omit<Application, "id" | "application_status" | "admin_note" | "created_at" | "updated_at" | "privacy_consent"> & {
  submission_token: string;
};

/** 신청 저장. 같은 submission_token이 이미 있으면 기존 건으로 간주(중복 제출) */
export function createApplication(a: NewApplication): { id: number; duplicate: boolean } {
  const d = db();
  const existing = d.prepare("SELECT id FROM beta_applications WHERE submission_token = ?").get(a.submission_token) as { id: number } | undefined;
  if (existing) return { id: existing.id, duplicate: true };
  const res = d
    .prepare(
      `INSERT INTO beta_applications
        (name, email, website_url, platform, ad_status, monthly_visitors, support_types, message, privacy_consent, marketing_consent, submission_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    )
    .run(
      a.name, a.email, a.website_url, a.platform, a.ad_status, a.monthly_visitors,
      JSON.stringify(a.support_types), a.message, a.marketing_consent ? 1 : 0, a.submission_token,
    );
  return { id: Number(res.lastInsertRowid), duplicate: false };
}

export function tokenExists(token: string): boolean {
  return !!db().prepare("SELECT 1 FROM beta_applications WHERE submission_token = ?").get(token);
}

/** 같은 이메일 + 같은 사이트로 최근 24시간 내 신청이 있었는지 */
export function hasRecentDuplicate(email: string, websiteUrl: string): boolean {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const row = db()
    .prepare("SELECT 1 FROM beta_applications WHERE lower(email) = lower(?) AND website_url = ? AND created_at > ? LIMIT 1")
    .get(email, websiteUrl, since);
  return !!row;
}

export type ListQuery = { q?: string; platform?: string; status?: string; sort?: "newest" | "oldest"; page?: number; pageSize?: number };

function where(query: ListQuery): { sql: string; params: (string | number)[] } {
  const parts: string[] = [];
  const params: (string | number)[] = [];
  const q = query.q?.trim();
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, (m) => "\\" + m)}%`;
    parts.push("(name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR website_url LIKE ? ESCAPE '\\')");
    params.push(like, like, like);
  }
  if (isValue(PLATFORMS, query.platform)) {
    parts.push("platform = ?");
    params.push(query.platform);
  }
  if (isValue(APPLICATION_STATUSES, query.status)) {
    parts.push("application_status = ?");
    params.push(query.status);
  }
  return { sql: parts.length ? `WHERE ${parts.join(" AND ")}` : "", params };
}

export function listApplications(query: ListQuery): { items: Application[]; total: number } {
  const { sql, params } = where(query);
  const order = query.sort === "oldest" ? "ASC" : "DESC";
  const d = db();
  const total = (d.prepare(`SELECT COUNT(*) AS n FROM beta_applications ${sql}`).get(...params) as { n: number }).n;
  let limitSql = "";
  if (query.pageSize) {
    const page = Math.max(1, query.page ?? 1);
    limitSql = ` LIMIT ${query.pageSize} OFFSET ${(page - 1) * query.pageSize}`;
  }
  const rows = d.prepare(`SELECT ${COLUMNS} FROM beta_applications ${sql} ORDER BY created_at ${order}, id ${order}${limitSql}`).all(...params) as Row[];
  return { items: rows.map(toApp), total };
}

export function getApplication(id: number): Application | null {
  const row = db().prepare(`SELECT ${COLUMNS} FROM beta_applications WHERE id = ?`).get(id) as Row | undefined;
  return row ? toApp(row) : null;
}

export function updateApplication(id: number, status: ApplicationStatus, note: string): boolean {
  const res = db()
    .prepare("UPDATE beta_applications SET application_status = ?, admin_note = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?")
    .run(status, note, id);
  return Number(res.changes) > 0;
}

export function deleteApplication(id: number): boolean {
  return Number(db().prepare("DELETE FROM beta_applications WHERE id = ?").run(id).changes) > 0;
}

export function getStats() {
  const rows = db().prepare("SELECT application_status AS s, COUNT(*) AS n FROM beta_applications GROUP BY application_status").all() as { s: string; n: number }[];
  const by = Object.fromEntries(rows.map((r) => [r.s, r.n])) as Record<string, number>;
  const total = rows.reduce((a, r) => a + r.n, 0);
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const last7 = (db().prepare("SELECT COUNT(*) AS n FROM beta_applications WHERE created_at > ?").get(since) as { n: number }).n;
  return {
    total,
    new: by.new ?? 0,
    reviewing: by.reviewing ?? 0,
    approved: APPROVED_STATUSES.reduce((a, s) => a + (by[s] ?? 0), 0),
    last7,
    byStatus: by,
  };
}
