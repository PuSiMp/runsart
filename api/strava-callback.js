const { verify, saveTokens } = require("./_lib");

// Strava เด้งกลับมาที่นี่พร้อม code
module.exports = async (req, res) => {
  const q = req.query || {};
  const uid = verify(q.state);
  if (!uid || !q.code) return res.status(400).send("ลิงก์เชื่อมต่อไม่ถูกต้อง หมดอายุ หรือคุณไม่ได้กดอนุญาต กลับไปลองใหม่ได้");
  const r = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: process.env.STRAVA_CLIENT_ID, client_secret: process.env.STRAVA_CLIENT_SECRET, code: q.code, grant_type: "authorization_code" }),
  });
  if (!r.ok) return res.status(502).send("Strava ปฏิเสธการเชื่อมต่อ ตรวจ Client ID, Secret และ Callback Domain");
  await saveTokens(uid, await r.json());
  res.writeHead(302, { Location: "/?strava=connected" });
  res.end();
};
