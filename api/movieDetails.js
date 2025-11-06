// api/movieDetails.js
export default async function handler(req, res) {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "Missing id parameter" });

  const apiKey = process.env.TMDB_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "TMDB_KEY not configured" });

  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-PT&append_to_response=credits`;
  try {
    const r = await fetch(url);
    const json = await r.json();
    return res.status(200).json(json);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
