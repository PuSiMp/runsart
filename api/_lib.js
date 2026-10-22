// ตัวช่วยร่วมของ API (ขึ้นต้นด้วย _ เพื่อไม่ให้ Vercel เปิดเป็น endpoint)
const crypto = require("crypto");

// 1. รองรับชื่อตัวแปรทั้งแบบมีและไม่มี NEXT_PUBLIC_
const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SK = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireSupabaseAdmin() {
  if (!SB) throw new Error("Missing SUPABASE_URL");
  if (!SK) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

const sbHeaders = (extra) => ({
  apikey: SK,
  Authorization: "Bearer " + SK,
  "Content-Type": "application/json",
  ...extra,
});

// ตรวจว่าใครล็อกอินอยู่ จาก JWT ของ Supabase ที่หน้าเว็บส่งมา
async function getUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  const jwt = authHeader.replace(/^Bearer /i, "").trim();
  
  if (!jwt) return null;
  requireSupabaseAdmin();

  try {
    const r = await fetch(SB + "/auth/v1/user", {
      headers: {
        apikey: SK,
        Authorization: "Bearer " + jwt,
      },
    });
    return r.ok ? await r.json() : null;
  } catch (err) {
    console.error("getUser error:", err);
    return null;
  }
}

// state ของ OAuth: ผูกกับผู้ใช้ มีอายุ 10 นาที และเซ็นด้วย STATE_SECRET
const mac = (p) =>
  crypto
    .createHmac("sha256", process.env.STATE_SECRET || "default_secret_key")
    .update(p)
    .digest("hex");

function sign(uid) {
  const p = uid + "." + (Date.now() + 10 * 60 * 1000);
  return p + "." + mac(p);
}

function verify(state) {
  const a = String(state || "").split(".");
  if (a.length !== 3 || Date.now() > +a[1]) return null;
  const want = Buffer.from(mac(a[0] + "." + a[1])),
    got = Buffer.from(a[2]);
  return want.length === got.length && crypto.timingSafeEqual(want, got) ? a[0] : null;
}

async function saveTokens(uid, t) {
  requireSupabaseAdmin();
  if (!t || !t.access_token || !t.refresh_token || !t.expires_at) {
    throw new Error("Strava token response is incomplete");
  }

  const r = await fetch(SB + "/rest/v1/strava_tokens?on_conflict=user_id", {
    method: "POST",
    headers: sbHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify({
      user_id: uid,
      access_token: t.access_token,
      refresh_token: t.refresh_token,
      expires_at: t.expires_at,
      athlete_id: t.athlete ? t.athlete.id : null,
    }),
  });
  if (!r.ok) {
    console.error("saveTokens failed:", r.status, await r.text());
    throw new Error("Unable to save Strava tokens");
  }
}

// คืน access token ที่ยังใช้ได้ (ต่ออายุให้ถ้าหมดแล้ว)
async function accessToken(uid) {
  requireSupabaseAdmin();
  const r = await fetch(SB + "/rest/v1/strava_tokens?user_id=eq." + uid + "&select=*", {
    headers: sbHeaders(),
  });
  if (!r.ok) {
    console.error("accessToken lookup failed:", r.status, await r.text());
    throw new Error("Unable to read Strava tokens");
  }
  const rows = await r.json();
  const t = rows && rows[0];
  if (!t) return null;
  if (t.expires_at > Math.floor(Date.now() / 1000) + 60) return t.access_token;

  const f = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: t.refresh_token,
    }),
  });

  if (!f.ok) {
    console.error("Strava token refresh failed:", f.status, await f.text());
    throw new Error("Unable to refresh Strava token");
  }
  const n = await f.json();
  if (!n.access_token || !n.refresh_token || !n.expires_at) {
    throw new Error("Strava token refresh response is incomplete");
  }
  await saveTokens(uid, { ...n, athlete: { id: t.athlete_id } });
  return n.access_token;
}

module.exports = { getUser, sign, verify, saveTokens, accessToken };