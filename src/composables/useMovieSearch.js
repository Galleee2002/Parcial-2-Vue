import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchTick = ref(0)

watch(
  searchQuery,
  (value) => {
    if (value == null) {
      searchQuery.value = ''
    }
  },
  { flush: 'sync' },
)

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
