import { ref } from 'vue'
import {
  addFavorite,
  getAllFavorites,
  isFavorite as checkIsFavorite,
  removeFavorite,
} from '@/services/favoritesStore'

const favorites = ref([])
const loading = ref(false)
const error = ref(null)

function setError(err) {
  error.value = err instanceof Error ? err.message : 'Error al gestionar favoritos'
}

async function load() {
  loading.value = true
  error.value = null
  try {
    favorites.value = await getAllFavorites()
    return favorites.value
  } catch (err) {
    setError(err)
    favorites.value = []
    return favorites.value
  } finally {
    loading.value = false
  }
}

async function add(movie) {
  loading.value = true
  error.value = null
  try {
    await addFavorite(movie)
    return await load()
  } catch (err) {
    setError(err)
    throw err
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  loading.value = true
  error.value = null
  try {
    await removeFavorite(id)
    return await load()
  } catch (err) {
    setError(err)
    throw err
  } finally {
    loading.value = false
  }
}

async function isFavorite(id) {
  try {
    return await checkIsFavorite(id)
  } catch (err) {
    setError(err)
    return false
  }
}

async function toggle(movie) {
  const id = Number(movie?.id)
  if (!Number.isFinite(id)) return favorites.value

  const alreadyFavorite = favorites.value.some((item) => item.id === id) || (await isFavorite(id))
  return alreadyFavorite ? remove(id) : add(movie)
}

export function useFavorites() {
  return {
    favorites,
    loading,
    error,
    load,
    add,
    remove,
    isFavorite,
    toggle,
  }
}
