const { getUser, accessToken } = require("./_lib");

// ข้อมูลพิกัดและความสูงของกิจกรรมเดียว
module.exports = async (req, res) => {
  const u = await getUser(req);
  if (!u) return res.status(401).json({ error: "login" });
  const id = parseInt((req.query || {}).id);
  if (!id) return res.status(400).json({ error: "id" });
  const tk = await accessToken(u.id);
  if (!tk) return res.status(409).json({ error: "not_connected" });
  const r = await fetch("https://www.strava.com/api/v3/activities/" + id + "/streams?keys=latlng,altitude&key_by_type=true", { headers: { Authorization: "Bearer " + tk } });
  if (!r.ok) return res.status(r.status).json({ error: "strava", status: r.status });
  const s = await r.json();
  res.json({ latlng: s.latlng && s.latlng.data, altitude: s.altitude && s.altitude.data });
};
