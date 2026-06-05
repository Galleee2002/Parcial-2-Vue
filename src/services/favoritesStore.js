const DB_NAME = 'tmdb_favorites_db'
const DB_VERSION = 1
const STORE_NAME = 'favorites'

/** @typedef {{ id: number, title: string, poster_path: string | null, release_date: string | null, overview: string, addedAt: string }} FavoriteRecord */

let dbPromise = null

function assertIndexedDb() {
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB no está disponible en este entorno')
  }
}

/**
 * Normaliza un objeto película (detalle TMDB o tarjeta de listado) al formato persistido.
 * @param {Record<string, unknown>} movie
 * @returns {FavoriteRecord}
 */
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

function openFavoritesDb() {
  assertIndexedDb()

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error('No se pudo abrir IndexedDB'))
    })
  }

  return dbPromise
}

/**
 * @template T
 * @param {IDBTransactionMode} mode
 * @param {(store: IDBObjectStore) => T | Promise<T>} callback
 * @returns {Promise<T>}
 */
async function withStore(mode, callback) {
  const db = await openFavoritesDb()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode)
    const store = tx.objectStore(STORE_NAME)
    let result

    Promise.resolve(callback(store))
      .then((value) => {
        result = value
      })
      .catch((err) => {
        tx.abort()
        reject(err)
      })

    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error ?? new Error('Error en transacción IndexedDB'))
    tx.onabort = () => reject(tx.error ?? new Error('Transacción IndexedDB abortada'))
  })
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Operación IndexedDB fallida'))
  })
}

/** @returns {Promise<FavoriteRecord[]>} */
export function getAllFavorites() {
  return withStore('readonly', async (store) => {
    const list = /** @type {FavoriteRecord[]} */ (await requestToPromise(store.getAll()))
    return list.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
  })
}

/**
 * @param {Record<string, unknown>} movie
 * @returns {Promise<void>}
 */
export function addFavorite(movie) {
  const id = Number(movie.id)
  if (!Number.isFinite(id)) {
    return Promise.reject(new Error('La película no tiene un id válido'))
  }

  return withStore('readwrite', async (store) => {
    const existing = await requestToPromise(store.get(id))
    if (existing) return

    await requestToPromise(store.put(toFavoriteRecord(movie)))
  })
}

/**
 * @param {number} id
 * @returns {Promise<void>}
 */
export function removeFavorite(id) {
  return withStore('readwrite', (store) => requestToPromise(store.delete(id)))
}

/**
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export function isFavorite(id) {
  return withStore('readonly', async (store) => Boolean(await requestToPromise(store.get(id))))
}

/** @returns {Promise<void>} */
export function clearFavorites() {
  return withStore('readwrite', (store) => requestToPromise(store.clear()))
}
