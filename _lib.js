// ตัวช่วยร่วมของ API (ขึ้นต้นด้วย _ เพื่อไม่ให้ Vercel เปิดเป็น endpoint)
const crypto = require("crypto");
const SB = process.env.SUPABASE_URL;
const SK = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sbHeaders = (extra) => ({ apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json", ...extra });

// ตรวจว่าใครล็อกอินอยู่ จาก JWT ของ Supabase ที่หน้าเว็บส่งมา
async function getUser(req) {
  const jwt = (req.headers.authorization || "").replace(/^Bearer /, "");
  if (!jwt) return null;
  const r = await fetch(SB + "/auth/v1/user", { headers: { apikey: SK, Authorization: "Bearer " + jwt } });
  return r.ok ? r.json() : null;
}

// state ของ OAuth: ผูกกับผู้ใช้ มีอายุ 10 นาที และเซ็นด้วย STATE_SECRET
const mac = (p) => crypto.createHmac("sha256", process.env.STATE_SECRET).update(p).digest("hex");
function sign(uid) {
  const p = uid + "." + (Date.now() + 10 * 60 * 1000);
  return p + "." + mac(p);
}
function verify(state) {
  const a = String(state || "").split(".");
  if (a.length !== 3 || Date.now() > +a[1]) return null;
  const want = Buffer.from(mac(a[0] + "." + a[1])), got = Buffer.from(a[2]);
  return want.length === got.length && crypto.timingSafeEqual(want, got) ? a[0] : null;
}

async function saveTokens(uid, t) {
  await fetch(SB + "/rest/v1/strava_tokens", {
    method: "POST",
    headers: sbHeaders({ Prefer: "resolution=merge-duplicates" }),
    body: JSON.stringify({ user_id: uid, access_token: t.access_token, refresh_token: t.refresh_token, expires_at: t.expires_at, athlete_id: t.athlete ? t.athlete.id : null }),
  });
}

// คืน access token ที่ยังใช้ได้ (ต่ออายุให้ถ้าหมดแล้ว)
async function accessToken(uid) {
  const r = await fetch(SB + "/rest/v1/strava_tokens?user_id=eq." + uid + "&select=*", { headers: sbHeaders() });
  const rows = await r.json();
  const t = rows && rows[0];
  if (!t) return null;
  if (t.expires_at > Math.floor(Date.now() / 1000) + 60) return t.access_token;
  const f = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: process.env.STRAVA_CLIENT_ID, client_secret: process.env.STRAVA_CLIENT_SECRET, grant_type: "refresh_token", refresh_token: t.refresh_token }),
  });
  if (!f.ok) return null;
  const n = await f.json();
  await saveTokens(uid, { ...n, athlete: { id: t.athlete_id } });
  return n.access_token;
}

module.exports = { getUser, sign, verify, saveTokens, accessToken };
