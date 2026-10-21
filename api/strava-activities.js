const { getUser, accessToken } = require("./_lib");

// รายการกิจกรรมล่าสุด 100 รายการต่อหน้า (กรองช่วงวันที่ด้วย after/before เป็นวินาที)
module.exports = async (req, res) => {
  const u = await getUser(req);
  if (!u) return res.status(401).json({ error: "login" });
  const tk = await accessToken(u.id);
  if (!tk) return res.status(409).json({ error: "not_connected" });
  const q = req.query || {};
  const p = new URLSearchParams({ per_page: "100", page: String(parseInt(q.page) || 1) });
  if (q.after) p.set("after", String(parseInt(q.after)));
  if (q.before) p.set("before", String(parseInt(q.before)));
  const r = await fetch("https://www.strava.com/api/v3/athlete/activities?" + p, { headers: { Authorization: "Bearer " + tk } });
  if (!r.ok) return res.status(r.status).json({ error: "strava", status: r.status });
  const a = await r.json();
  res.json(a.map((x) => ({ id: x.id, name: x.name, date: x.start_date_local, dist: x.distance, gain: x.total_elevation_gain, type: x.sport_type || x.type })));
};
