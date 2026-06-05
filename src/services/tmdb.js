const BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'
const PROVIDER_LOGO_BASE = 'https://image.tmdb.org/t/p/w92'

/** Región ISO 3166-1 por defecto para plataformas de streaming */
export const DEFAULT_WATCH_REGION = 'AR'

/** Construye URL de imagen de póster */
export function posterUrl(posterPath) {
  if (!posterPath) return null
  return `${POSTER_BASE}${posterPath}`
}

/** Construye URL del logo de una plataforma (watch provider) */
export function providerLogoUrl(logoPath) {
  if (!logoPath) return null
  return `${PROVIDER_LOGO_BASE}${logoPath}`
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

/** Requisito 3 — detalle de película (incluye plataformas vía append_to_response) */
export function fetchMovieDetails(id, watchRegion = DEFAULT_WATCH_REGION) {
  return tmdbGet(`/movie/${id}`, {
    append_to_response: 'watch/providers',
    watch_region: watchRegion,
  })
}

/** Plataformas donde ver la película (streaming, alquiler y compra) */
export function fetchMovieWatchProviders(id, watchRegion = DEFAULT_WATCH_REGION) {
  return tmdbGet(`/movie/${id}/watch/providers`, { watch_region: watchRegion })
}

/**
 * Extrae proveedores por región desde la respuesta de watch/providers
 * o desde el objeto anidado en fetchMovieDetails (clave "watch/providers").
 */
export function providersForRegion(watchData, region = DEFAULT_WATCH_REGION) {
  const payload = watchData?.['watch/providers'] ?? watchData
  const country = payload?.results?.[region]
  if (!country) {
    return { flatrate: [], rent: [], buy: [], link: null }
  }
  return {
    flatrate: country.flatrate ?? [],
    rent: country.rent ?? [],
    buy: country.buy ?? [],
    link: country.link ?? null,
  }
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
