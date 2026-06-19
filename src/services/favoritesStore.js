const STORAGE_KEY = 'tmdb_favorites'

function assertLocalStorage() {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage no está disponible en este entorno')
  }
}

function readAllSync() {
  assertLocalStorage()

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAllSync(list) {
  assertLocalStorage()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function toFavoriteRecord(movie) {
  return {
    id: Number(movie.id),
    title: String(movie.title ?? ''),
    poster_path: movie.poster_path ? String(movie.poster_path) : null,
    release_date: movie.release_date ? String(movie.release_date) : null,
    overview: String(movie.overview ?? ''),
    addedAt: new Date().toISOString(),
  }
}

export function getAllFavorites() {
  return Promise.resolve(
    readAllSync().sort((a, b) => b.addedAt.localeCompare(a.addedAt)),
  )
}

export function addFavorite(movie) {
  const id = Number(movie.id)
  if (!Number.isFinite(id)) {
    return Promise.reject(new Error('La película no tiene un id válido'))
  }

  const list = readAllSync()
  if (list.some((item) => item.id === id)) {
    return Promise.resolve()
  }

  writeAllSync([...list, toFavoriteRecord(movie)])
  return Promise.resolve()
}

export function removeFavorite(id) {
  writeAllSync(readAllSync().filter((item) => item.id !== id))
  return Promise.resolve()
}

export function isFavorite(id) {
  return Promise.resolve(readAllSync().some((item) => item.id === id))
}

export function clearFavorites() {
  assertLocalStorage()
  localStorage.removeItem(STORAGE_KEY)
  return Promise.resolve()
}
