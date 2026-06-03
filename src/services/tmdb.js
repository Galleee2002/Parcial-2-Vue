const BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

/** Construye URL de imagen de póster */
export function posterUrl(posterPath) {
  if (!posterPath) return null
  return `${POSTER_BASE}${posterPath}`
}

/** Año desde release_date (formato TMDB: YYYY-MM-DD) */
export function releaseYear(releaseDate) {
  if (!releaseDate) return null
  return releaseDate.slice(0, 4)
}

async function tmdbGet(path, params = {}) {
  if (!API_KEY) {
    throw new Error('VITE_TMDB_API_KEY no está configurada. Creá un archivo .env en la raíz del proyecto.')
  }

  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'es-ES')
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`TMDB ${res.status}: ${path}`)
  }
  return res.json()
}

/** Requisito 1 — películas populares */
export function fetchPopularMovies(page = 1) {
  return tmdbGet('/movie/popular', { page })
}

/** Requisito 2 — búsqueda por título */
export function searchMovies(query, page = 1) {
  const q = String(query ?? '').trim()
  if (!q) {
    return Promise.resolve({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    })
  }
  return tmdbGet('/search/movie', { query: q, page })
}

/** Requisito 3 — detalle de película */
export function fetchMovieDetails(id) {
  return tmdbGet(`/movie/${id}`)
}

/** Requisito 4 — filtro por género (discover) */
export function discoverByGenre(genreId, page = 1) {
  return tmdbGet('/discover/movie', {
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc',
  })
}

/** Lista de géneros para el v-select */
export function fetchGenres() {
  return tmdbGet('/genre/movie/list')
}
