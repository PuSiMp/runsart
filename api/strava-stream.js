const { getUser, accessToken } = require("./_lib");

// ข้อมูลพิกัดและความสูงของกิจกรรมเดียว
module.exports = async (req, res) => {
  try {
    const u = await getUser(req);
    if (!u) return res.status(401).json({ error: "login" });
    const id = parseInt((req.query || {}).id);
    if (!id) return res.status(400).json({ error: "id" });
    const tk = await accessToken(u.id);
    if (!tk) return res.status(409).json({ error: "not_connected" });
    const r = await fetch("https://www.strava.com/api/v3/activities/" + id + "/streams?keys=latlng,altitude&key_by_type=true", { headers: { Authorization: "Bearer " + tk } });
    if (!r.ok) {
      const detail = await r.text();
      console.error("Strava activity streams request failed:", r.status, detail);
      return res.status(r.status === 401 || r.status === 403 ? 409 : 502).json({
        error: r.status === 401 || r.status === 403 ? "reconnect_strava" : "strava",
        status: r.status,
      });
    }
    const s = await r.json();
    return res.json({ latlng: s.latlng && s.latlng.data, altitude: s.altitude && s.altitude.data });
  } catch (err) {
    console.error("strava-stream failed:", err);
    return res.status(502).json({ error: "strava_stream_failed", message: "ไม่สามารถโหลดข้อมูลเส้นทางได้ กรุณาตรวจ Vercel Function Logs และการตั้งค่า Supabase/Strava" });
  }
};
