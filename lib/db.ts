import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * SQLite (Node.js 내장 node:sqlite) — 외부 DB 서비스나 네이티브 모듈 없이 동작합니다.
 * 운영 환경에서는 DATABASE_PATH를 영구 볼륨 경로로 지정하세요.
 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS beta_applications (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  name               TEXT    NOT NULL,
  email              TEXT    NOT NULL,
  website_url        TEXT    NOT NULL,
  platform           TEXT    NOT NULL,
  ad_status          TEXT    NOT NULL,
  monthly_visitors   TEXT    NOT NULL,
  support_types      TEXT    NOT NULL,            -- JSON 배열
  message            TEXT    NOT NULL DEFAULT '',
  privacy_consent    INTEGER NOT NULL CHECK (privacy_consent = 1),
  marketing_consent  INTEGER NOT NULL DEFAULT 0,
  application_status TEXT    NOT NULL DEFAULT 'new',
  admin_note         TEXT    NOT NULL DEFAULT '',
  submission_token   TEXT    UNIQUE,                -- 중복 제출 방지용 1회성 토큰
  created_at         TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at         TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_beta_created  ON beta_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_beta_status   ON beta_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_beta_email    ON beta_applications(email);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 남용 방지용 이벤트 기록 (IP는 해시값만 저장, 24시간 후 삭제)
CREATE TABLE IF NOT EXISTS rate_events (
  bucket     TEXT    NOT NULL,
  key_hash   TEXT    NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate ON rate_events(bucket, key_hash, created_at);
`;

const globalForDb = globalThis as unknown as { __fluxDb?: DatabaseSync };

function open(): DatabaseSync {
  const file = path.resolve(process.cwd(), process.env.DATABASE_PATH || "./data/flux-ads.db");
  mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  return db;
}

export function db(): DatabaseSync {
  if (!globalForDb.__fluxDb) globalForDb.__fluxDb = open();
  return globalForDb.__fluxDb;
}
