const { getUser, sign } = require("./_lib");

// หน้าเว็บเรียกอันนี้ (พร้อมล็อกอินแล้ว) เพื่อขอลิงก์ไปหน้าอนุญาตของ Strava
module.exports = async (req, res) => {
  try {
  const u = await getUser(req);
  if (!u) return res.status(401).json({ error: "login" });
  const proto = req.headers["x-forwarded-proto"] || "https";
  const redirect = proto + "://" + req.headers.host + "/api/strava-callback";
  const url = "https://www.strava.com/oauth/authorize?" + new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: redirect,
    response_type: "code",
    approval_prompt: "force",
    scope: "read,activity:read_all",
    state: sign(u.id),
  });
  res.json({ url });
  } catch (err) {
    console.error("strava-connect failed:", err);
    res.status(500).json({ error: "server_config", message: "ตั้งค่าเซิร์ฟเวอร์ไม่ครบ ตรวจ STATE_SECRET, STRAVA_CLIENT_ID และ SUPABASE_* ใน Vercel" });
  }
};
