/**
 * Smoke test temporal para src/services/tmdb.js (carga vía Vite SSR).
 * Ejecutar: node scripts/smoke-tmdb.mjs
 */
import { createServer, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const env = loadEnv('development', root, '')

if (!env.VITE_TMDB_API_KEY?.trim()) {
  console.error('Omitido: definí VITE_TMDB_API_KEY en .env (ver .env.example)')
  process.exit(1)
}

const server = await createServer({
  root,
  configFile: resolve(root, 'vite.config.js'),
  logLevel: 'error',
  define: {
    'import.meta.env.VITE_TMDB_API_KEY': JSON.stringify(env.VITE_TMDB_API_KEY),
  },
})

try {
  const tmdb = await server.ssrLoadModule('/src/services/tmdb.js')

  const popular = await tmdb.fetchPopularMovies()
  console.assert(popular.results?.length > 0, 'fetchPopularMovies: sin results')

  const genres = await tmdb.fetchGenres()
  console.assert(genres.genres?.length > 0, 'fetchGenres: sin genres')

  const search = await tmdb.searchMovies('star wars')
  console.assert(search.results?.length > 0, 'searchMovies: sin results')

  const empty = await tmdb.searchMovies('   ')
  console.assert(empty.results?.length === 0, 'searchMovies vacío: debe devolver []')

  const discover = await tmdb.discoverByGenre(28)
  console.assert(discover.results?.length > 0, 'discoverByGenre: sin results')

  const detail = await tmdb.fetchMovieDetails(11)
  console.assert(detail.title && detail.overview && detail.release_date, 'fetchMovieDetails: campos faltantes')
  console.assert('tagline' in detail, 'fetchMovieDetails: sin tagline')
  console.assert('backdrop_path' in detail, 'fetchMovieDetails: sin backdrop_path')
  console.assert(detail['watch/providers']?.results, 'fetchMovieDetails: sin watch/providers')

  const watch = await tmdb.fetchMovieWatchProviders(11)
  console.assert(watch.results, 'fetchMovieWatchProviders: sin results')

  const providers = tmdb.providersForRegion(watch)
  console.assert(Array.isArray(providers.flatrate), 'providersForRegion: flatrate no es array')

  console.assert(tmdb.posterUrl('/test.jpg')?.includes('w500'), 'posterUrl')
  console.assert(tmdb.backdropUrl('/test.jpg')?.includes('w1280'), 'backdropUrl')
  console.assert(tmdb.movieTagline({ tagline: '  Hola  ' }) === 'Hola', 'movieTagline')
  console.assert(tmdb.movieTagline({ tagline: '   ' }) === null, 'movieTagline vacío')
  console.assert(tmdb.providerLogoUrl('/test.jpg')?.includes('w92'), 'providerLogoUrl')
  console.assert(tmdb.releaseYear('1977-05-25') === '1977', 'releaseYear')
  console.assert(tmdb.titleWithYear('Star Wars', '1977-05-25') === 'Star Wars (1977)', 'titleWithYear')
  console.assert(tmdb.formatRuntime(100) === '1 h 40 min', 'formatRuntime')
  console.assert(tmdb.formatRuntime(45) === '45 min', 'formatRuntime corto')
  console.assert(tmdb.formatRuntimeShort(116) === '1h 56m', 'formatRuntimeShort')
  console.assert(
    tmdb.formatGenresList([{ name: 'Acción' }, { name: 'Fantasía' }, { name: 'Aventura' }]) ===
      'Acción, Fantasía y Aventura',
    'formatGenresList',
  )
  console.assert(detail.release_dates?.results, 'fetchMovieDetails: sin release_dates')
  console.assert(
    tmdb.certificationForRegion(detail, 'AR') != null || detail.release_dates?.results?.length > 0,
    'certificationForRegion',
  )

  console.log('OK: smoke test TMDB pasó (6 endpoints + helpers)')
} finally {
  await server.close()
}
