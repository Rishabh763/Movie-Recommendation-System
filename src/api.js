// Thin client for the Flask API. All movie data (catalog, posters, recommendations)
// comes from the backend; the browser never talks to TMDB directly.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://movie-recommendation-system-backend-m2xt.onrender.com";

async function getJSON(path, { token, signal } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const posterUrl = (tmdbId, size = "w342") =>
  tmdbId ? `${API_BASE_URL}/poster/${tmdbId}?size=${size}` : null;

export function searchMovies({ q = "", genre = "", sort = "popular", page = 1, pageSize = 24 }, signal) {
  const params = new URLSearchParams({ sort, page, pageSize });
  if (q) params.set("q", q);
  if (genre) params.set("genre", genre);
  return getJSON(`/movies?${params}`, { signal });
}

export async function getMoviesByIds(ids) {
  const chunks = [];
  for (let i = 0; i < ids.length; i += 60) chunks.push(ids.slice(i, i + 60));
  const pages = await Promise.all(chunks.map((c) => getJSON(`/movies?ids=${c.join(",")}`)));
  return pages.flatMap((p) => p.results);
}

export const getMovie = (id, signal) => getJSON(`/movies/${id}`, { signal });

export const getGenres = () => getJSON("/genres");

export const getRecommendations = (token, top = 20) =>
  getJSON(`/recommendations?top=${top}`, { token });
