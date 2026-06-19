const BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const PROVIDER_LOGO_BASE = 'https://image.tmdb.org/t/p/w92'

export const DEFAULT_WATCH_REGION = 'AR'

export function hasLocalizedOverview(movie) {
  return Boolean(String(movie?.overview ?? '').trim())
}

export function filterMoviesForUI(movies) {
  return (movies ?? []).filter(hasLocalizedOverview)
}

export function posterUrl(posterPath) {
  if (!posterPath) return null
  return `${POSTER_BASE}${posterPath}`
}

export function backdropUrl(backdropPath) {
  if (!backdropPath) return null
  return `${BACKDROP_BASE}${backdropPath}`
}

export function movieTagline(movie) {
  const tagline = String(movie?.tagline ?? '').trim()
  return tagline || null
}

export function providerLogoUrl(logoPath) {
  if (!logoPath) return null
  return `${PROVIDER_LOGO_BASE}${logoPath}`
}

export function releaseYear(releaseDate) {
  if (!releaseDate) return null
  return releaseDate.slice(0, 4)
}

export function titleWithYear(title, releaseDate) {
  const year = releaseYear(releaseDate)
  if (!title) return ''
  return year ? `${title} (${year})` : title
}

export function formatRuntime(minutes) {
  if (minutes == null || minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours} h`
  return `${hours} h ${mins} min`
}

export function formatRuntimeShort(minutes) {
  if (minutes == null || minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function formatGenresList(genres) {
  const names = (genres ?? []).map((genre) => genre.name).filter(Boolean)
  if (names.length === 0) return null
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} y ${names[1]}`
  return `${names.slice(0, -1).join(', ')} y ${names.at(-1)}`
}

export function certificationForRegion(movie, region = DEFAULT_WATCH_REGION) {
  const country = movie?.release_dates?.results?.find((entry) => entry.iso_3166_1 === region)
  const dates = country?.release_dates ?? []
  if (dates.length === 0) return null

  const theatrical = dates.find((d) => d.type === 3 && d.certification?.trim())
  if (theatrical) return theatrical.certification.trim()

  const any = dates.find((d) => d.certification?.trim())
  return any ? any.certification.trim() : null
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

export function fetchPopularMovies(page = 1) {
  return tmdbGet('/movie/popular', { page })
}

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

export function fetchMovieDetails(id, watchRegion = DEFAULT_WATCH_REGION) {
  return tmdbGet(`/movie/${id}`, {
    append_to_response: 'watch/providers,release_dates',
    watch_region: watchRegion,
  })
}

export function fetchMovieWatchProviders(id, watchRegion = DEFAULT_WATCH_REGION) {
  return tmdbGet(`/movie/${id}/watch/providers`, { watch_region: watchRegion })
}

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

export function discoverByGenre(genreId, page = 1) {
  return discoverMovies({ genreId, page })
}

export function discoverMovies(
  { genreId, certification, region = DEFAULT_WATCH_REGION, page = 1 } = {},
) {
  const params = {
    page,
    sort_by: 'popularity.desc',
  }

  if (genreId != null && genreId !== '') {
    params.with_genres = genreId
  }

  if (certification) {
    params.certification_country = region
    params.certification = certification
  }

  return tmdbGet('/discover/movie', params)
}

export function discoverByCertification(certification, region = DEFAULT_WATCH_REGION, page = 1) {
  return discoverMovies({ certification, region, page })
}

export function fetchGenres() {
  return tmdbGet('/genre/movie/list')
}

export function fetchMovieCertifications() {
  return tmdbGet('/certification/movie/list')
}

export function certificationsForRegion(certData, region = DEFAULT_WATCH_REGION) {
  const items = certData?.certifications?.[region] ?? []

  return items
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((entry) => ({
      title: entry.certification,
      value: entry.certification,
      subtitle: entry.meaning,
    }))
}
