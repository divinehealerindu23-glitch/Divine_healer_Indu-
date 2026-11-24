import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "dhi_admin";
const MAX_AGE = 12 * 60 * 60;

function secret() {
  return process.env.ADMIN_PASSWORD || "";
}
function signature(timestamp) {
  return createHmac("sha256", secret()).update(String(timestamp)).digest("hex");
}
function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}
export function passwordMatches(value) {
  return Boolean(secret()) && safeEqual(value || "", secret());
}
export function issueAdminCookie(res) {
  const timestamp = Math.floor(Date.now() / 1000);
  const value = timestamp + "." + signature(timestamp);
  res.setHeader("Set-Cookie", COOKIE + "=" + value + "; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=" + MAX_AGE);
}
export function clearAdminCookie(res) {
  res.setHeader("Set-Cookie", COOKIE + "=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0");
}
export function isAdmin(req) {
  if (!secret()) return false;
  const header = req.headers.cookie || "";
  const raw = header.split(";").map(v => v.trim()).find(v => v.startsWith(COOKIE + "="));
  if (!raw) return false;
  const value = raw.slice(COOKIE.length + 1);
  const [timestamp, supplied] = value.split(".");
  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  return Number.isFinite(Number(timestamp)) && age >= 0 && age <= MAX_AGE && safeEqual(supplied || "", signature(timestamp));
}
export function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  res.status(401).json({ error: "Please sign in to the admin panel again." });
  return false;
}
