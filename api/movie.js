// api/movie.js (Node.js serverless for Vercel)
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

export default async function handler(req, res) {
  const TMDB_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_KEY) return res.status(500).json({ error: "TMDB_API_KEY not set" });

  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "missing q" });

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
    q
  )}&language=pt-PT`;
  const r = await fetch(url);
  const json = await r.json();
  res.status(200).json(json);
}
