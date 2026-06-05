<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  fetchPopularMovies,
  searchMovies,
  fetchGenres,
  discoverByGenre,
} from '@/services/tmdb'
import AppContainer from '@/components/AppContainer.vue'
import MovieCard from '@/components/MovieCard.vue'
import TopMovieCard from '@/components/TopMovieCard.vue'
import { useFavorites } from '@/composables/useFavorites'

const router = useRouter()
const { load: loadFavorites } = useFavorites()

const movies = ref([])
const topMovies = ref([])
const genres = ref([])
const search = ref('')
const selectedGenre = ref(null)
const loading = ref(true)
const error = ref(null)

const carouselRef = ref(null)
const showLeftFade = ref(false)
const showRightFade = ref(false)

const genreOptions = ref([{ title: 'Todos los géneros', value: null }])

function setError(err) {
  error.value = err instanceof Error ? err.message : 'Error al cargar películas'
}

async function loadPopular() {
  const data = await fetchPopularMovies()
  movies.value = data.results ?? []
}

async function loadTopMovies() {
  const data = await fetchPopularMovies()
  topMovies.value = (data.results ?? []).slice(0, 10)
}

async function loadGenres() {
  const data = await fetchGenres()
  genres.value = data.genres ?? []
  genreOptions.value = [
    { title: 'Todos los géneros', value: null },
    ...genres.value.map((genre) => ({ title: genre.name, value: genre.id })),
  ]
}

async function refreshMovies() {
  loading.value = true
  error.value = null

  try {
    const query = search.value.trim()
    if (query) {
      const data = await searchMovies(query)
      movies.value = data.results ?? []
      return
    }

    if (selectedGenre.value != null) {
      const data = await discoverByGenre(selectedGenre.value)
      movies.value = data.results ?? []
      return
    }

    await loadPopular()
  } catch (err) {
    setError(err)
    movies.value = []
  } finally {
    loading.value = false
  }
}

async function onSearch() {
  await refreshMovies()
}

async function onGenreChange() {
  await refreshMovies()
}

function updateCarouselEdges() {
  const carousel = carouselRef.value
  if (!carousel) return

  const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth)
  showLeftFade.value = carousel.scrollLeft > 1
  showRightFade.value = carousel.scrollLeft < maxScroll - 1
}

function scrollCarousel(direction) {
  const carousel = carouselRef.value
  if (!carousel) return

  const step = 166
  carousel.scrollBy({ left: direction * step, behavior: 'smooth' })
}

function onNavigate(id) {
  router.push({ name: 'movie-detail', params: { id } })
}

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    await Promise.all([loadTopMovies(), loadGenres(), loadPopular(), loadFavorites()])
  } catch (err) {
    setError(err)
    movies.value = []
    topMovies.value = []
  } finally {
    loading.value = false
  }

  updateCarouselEdges()
  window.addEventListener('resize', updateCarouselEdges)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCarouselEdges)
})
</script>

<template>
  <AppContainer>
    <h1 class="text-h4 text-blue-grey-darken-4 mb-2">Películas populares</h1>
    <p class="text-body-1 text-blue-grey-darken-2 mb-6">
      Buscá películas por título, filtrá por género y agregá tus favoritas a Mi Lista.
    </p>

    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="search"
          label="Buscar película"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          color="red"
          clearable
          @keyup.enter="onSearch"
          @click:clear="onSearch"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedGenre"
          :items="genreOptions"
          item-title="title"
          item-value="value"
          label="Filtrar por género"
          variant="outlined"
          color="red"
          clearable
          @update:model-value="onGenreChange"
        />
      </v-col>
    </v-row>

    <v-row class="mb-2">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn color="red" variant="flat" size="large" :loading="loading" @click="onSearch">
          Buscar
        </v-btn>
      </v-col>
    </v-row>

    <section v-if="topMovies.length > 0" class="mb-8">
      <h2 class="text-h5 text-blue-grey-darken-4 mb-4">Top 10</h2>

      <div class="carousel-wrapper">
        <v-btn
          v-show="showLeftFade"
          class="carousel-arrow carousel-arrow-left d-none d-sm-flex"
          icon="mdi-chevron-left"
          color="blue-grey-darken-3"
          size="small"
          aria-label="Anterior"
          @click="scrollCarousel(-1)"
        />

        <v-btn
          v-show="showRightFade"
          class="carousel-arrow carousel-arrow-right d-none d-sm-flex"
          icon="mdi-chevron-right"
          color="blue-grey-darken-3"
          size="small"
          aria-label="Siguiente"
          @click="scrollCarousel(1)"
        />

        <div
          v-show="showLeftFade"
          class="carousel-fade carousel-fade-left is-visible"
        />
        <div
          v-show="showRightFade"
          class="carousel-fade carousel-fade-right is-visible"
        />

        <div ref="carouselRef" class="top-carousel" @scroll="updateCarouselEdges">
          <TopMovieCard
            v-for="movie in topMovies"
            :key="movie.id"
            :movie="movie"
            @navigate="onNavigate"
          />
        </div>
      </div>
    </section>

    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="red" size="48" />
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      :text="error"
      class="mb-4"
    />

    <v-alert
      v-else-if="movies.length === 0"
      type="info"
      variant="tonal"
      color="blue-grey"
      text="No se encontraron películas."
      class="mb-4"
    />

    <v-row v-else>
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard :movie="movie" />
      </v-col>
    </v-row>
  </AppContainer>
</template>

<style scoped>
.carousel-wrapper {
  position: relative;
}

.top-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px 12px 8px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.top-carousel::-webkit-scrollbar {
  display: none;
}

.carousel-fade {
  position: absolute;
  top: 0;
  bottom: 8px;
  width: 40px;
  pointer-events: none;
  z-index: 1;
}

.carousel-fade-left {
  left: 0;
  background: linear-gradient(to right, #eceff1 20%, transparent);
}

.carousel-fade-right {
  right: 0;
  background: linear-gradient(to left, #eceff1 20%, transparent);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.carousel-arrow-left {
  left: 0;
}

.carousel-arrow-right {
  right: 0;
}
</style>
