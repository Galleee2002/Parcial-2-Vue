import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchTick = ref(0)

/** Vuetify clearable puede asignar null al v-model. */
watch(
  searchQuery,
  (value) => {
    if (value == null) {
      searchQuery.value = ''
    }
  },
  { flush: 'sync' },
)

/** Dispara búsqueda en HomeView (incrementa tick observado por la vista). */
export function submitMovieSearch() {
  searchTick.value += 1
}

export function useMovieSearch() {
  return {
    searchQuery,
    searchTick,
    submitMovieSearch,
  }
}
