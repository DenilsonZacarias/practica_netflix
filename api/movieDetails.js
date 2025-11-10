// api/movieDetails.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

export default async function handler(req, res) {
  const TMDB_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_KEY) return res.status(500).json({ error: "TMDB_API_KEY not set" });

  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "missing id" });

  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=pt-PT&append_to_response=credits`;
  const r = await fetch(url);
  const json = await r.json();
  res.status(200).json(json);
}
