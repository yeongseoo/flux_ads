"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, authConfigError, createSessionToken, requireAdmin, sessionCookieOptions, verifyCredentials } from "@/lib/auth";
import { deleteApplication, updateApplication } from "@/lib/applications";
import { APPLICATION_STATUSES, isValue, type ApplicationStatus } from "@/lib/options";
import { clearEvents, clientKey, isLimited, recordEvent } from "@/lib/ratelimit";
import { saveRecruitSettings } from "@/lib/settings";

export type LoginState = { error?: string; username?: string };

const LOGIN_WINDOW = 15 * 60 * 1000;
const LOGIN_MAX_FAILS = 5;

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const cfg = authConfigError();
  if (cfg) return { error: `관리자 인증이 설정되지 않았습니다. (${cfg})` };

  const key = await clientKey();
  if (isLimited("login", key, LOGIN_MAX_FAILS, LOGIN_WINDOW)) {
    return { error: "로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해 주세요.", username: String(fd.get("username") ?? "").slice(0, 100) };
  }
  const username = String(fd.get("username") ?? "").slice(0, 100);
  const password = String(fd.get("password") ?? "").slice(0, 200);
  if (!username || !password || !verifyCredentials(username, password)) {
    recordEvent("login", key);
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다.", username };
  }
  clearEvents("login", key);
  (await cookies()).set(SESSION_COOKIE, createSessionToken(username), sessionCookieOptions);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/" });
  redirect("/admin/login");
}

function parseId(v: FormDataEntryValue | null): number {
  const id = Number(v);
  if (!Number.isInteger(id) || id <= 0) throw new Error("잘못된 요청입니다.");
  return id;
}

export async function saveApplication(fd: FormData) {
  await requireAdmin();
  const id = parseId(fd.get("id"));
  const status = String(fd.get("application_status") ?? "");
  const note = String(fd.get("admin_note") ?? "").slice(0, 5000);
  if (!isValue(APPLICATION_STATUSES, status)) redirect(`/admin/applications/${id}?error=status`);
  updateApplication(id, status as ApplicationStatus, note);
  revalidatePath("/admin");
  redirect(`/admin/applications/${id}?saved=1`);
}

export async function removeApplication(fd: FormData) {
  await requireAdmin();
  const id = parseId(fd.get("id"));
  deleteApplication(id);
  revalidatePath("/admin");
  redirect("/admin?deleted=1");
}

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const target = Number(fd.get("target"));
  if (!Number.isInteger(target) || target < 1 || target > 10000) redirect("/admin/settings?error=target");
  saveRecruitSettings({
    open: fd.get("open") === "on",
    showTarget: fd.get("showTarget") === "on",
    target,
    closedMessage: String(fd.get("closedMessage") ?? "").trim().slice(0, 300),
  });
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
