<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchPopularMovies,
  searchMovies,
  fetchGenres,
  fetchMovieCertifications,
  certificationsForRegion,
  discoverMovies,
  filterMoviesForUI,
  DEFAULT_WATCH_REGION,
} from '@/services/tmdb'
import AppContainer from '@/components/AppContainer.vue'
import MovieCard from '@/components/MovieCard.vue'
import TopMovieCard from '@/components/TopMovieCard.vue'
import { useFavorites } from '@/composables/useFavorites'
import { useMovieSearch } from '@/composables/useMovieSearch'

const route = useRoute()
const router = useRouter()
const { load: loadFavorites } = useFavorites()
const { searchQuery, searchTick } = useMovieSearch()

const movies = ref([])
const topMovies = ref([])
const genres = ref([])
const selectedGenre = ref(null)
const selectedCertification = ref(null)
const loading = ref(true)
const error = ref(null)

const carouselRef = ref(null)
const showLeftFade = ref(false)
const showRightFade = ref(false)

const genreOptions = ref([])
const certificationOptions = ref([])

function setError(err) {
  error.value = err instanceof Error ? err.message : 'Error al cargar películas'
}

async function loadPopular() {
  const data = await fetchPopularMovies()
  movies.value = filterMoviesForUI(data.results)
}

async function loadTopMovies() {
  const data = await fetchPopularMovies()
  topMovies.value = filterMoviesForUI(data.results).slice(0, 10)
}

async function loadGenres() {
  const data = await fetchGenres()
  genres.value = data.genres ?? []
  genreOptions.value = genres.value.map((genre) => ({
    title: genre.name,
    value: genre.id,
  }))
}

async function loadCertifications() {
  const data = await fetchMovieCertifications()
  certificationOptions.value = certificationsForRegion(data, DEFAULT_WATCH_REGION)
}

async function refreshMovies() {
  loading.value = true
  error.value = null

  try {
    const query = String(searchQuery.value ?? '').trim()
    if (query) {
      const data = await searchMovies(query)
      movies.value = filterMoviesForUI(data.results)
      return
    }

    const hasGenreFilter = selectedGenre.value != null
    const hasCertificationFilter = Boolean(selectedCertification.value)

    if (hasGenreFilter || hasCertificationFilter) {
      const data = await discoverMovies({
        genreId: selectedGenre.value,
        certification: selectedCertification.value,
        region: DEFAULT_WATCH_REGION,
      })
      movies.value = filterMoviesForUI(data.results)
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

async function onCertificationChange() {
  await refreshMovies()
}

function updateCarouselEdges() {
  const carousel = carouselRef.value
  if (!carousel) return

  const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth)
  showLeftFade.value = carousel.scrollLeft > 4
  showRightFade.value = carousel.scrollLeft < maxScroll - 4
}

watch(searchTick, () => {
  if (route.name === 'home') {
    onSearch()
  }
})

watch(topMovies, async () => {
  await nextTick()
  if (carouselRef.value) {
    carouselRef.value.scrollLeft = 0
  }
  updateCarouselEdges()
})

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
    await Promise.all([
      loadTopMovies(),
      loadGenres(),
      loadCertifications(),
      loadPopular(),
      loadFavorites(),
    ])
  } catch (err) {
    setError(err)
    movies.value = []
    topMovies.value = []
  } finally {
    loading.value = false
  }

  await nextTick()
  updateCarouselEdges()
  window.addEventListener('resize', updateCarouselEdges)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCarouselEdges)
})
</script>

<template>
  <AppContainer>
    <section class="home-filters mb-6">
      <div class="home-filters__intro">
        <h1 class="text-h4 text-grey-lighten-5">Películas populares</h1>
        <p class="text-body-1 text-grey-lighten-3">
          Buscá películas por título, filtrá por género o clasificación por edades y agregá tus favoritas.
        </p>
      </div>

      <v-text-field
        v-model="searchQuery"
        class="home-filters__search d-sm-none"
        label="Buscar película"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        color="primary"
        density="comfortable"
        hide-details
        clearable
        @keyup.enter="onSearch"
        @click:clear="onSearch"
      />

      <div class="home-filters__controls">
        <v-select
          v-model="selectedGenre"
          class="home-filters__select"
          :items="genreOptions"
          item-title="title"
          item-value="value"
          label="Género"
          placeholder="Todos los géneros"
          prepend-inner-icon="mdi-movie-filter-outline"
          variant="outlined"
          color="primary"
          density="comfortable"
          hide-details
          clearable
          @update:model-value="onGenreChange"
          @click:clear="onGenreChange"
        />

        <v-select
          v-model="selectedCertification"
          class="home-filters__select"
          :items="certificationOptions"
          item-title="title"
          item-value="value"
          item-subtitle="subtitle"
          label="Clasificación"
          placeholder="Todas las edades"
          prepend-inner-icon="mdi-account-child-outline"
          variant="outlined"
          color="primary"
          density="comfortable"
          hide-details
          clearable
          @update:model-value="onCertificationChange"
          @click:clear="onCertificationChange"
        />
      </div>
    </section>

    <section v-if="topMovies.length > 0" class="mb-8">
      <h2 class="text-h5 text-grey-lighten-5 mb-4">Top 10</h2>

      <div class="carousel-wrapper">
        <v-btn
          v-if="showLeftFade"
          class="carousel-arrow carousel-arrow-left"
          icon="mdi-chevron-left"
          color="grey-darken-2"
          size="small"
          aria-label="Anterior"
          @click="scrollCarousel(-1)"
        />

        <v-btn
          v-show="showRightFade"
          class="carousel-arrow carousel-arrow-right"
          icon="mdi-chevron-right"
          color="grey-darken-2"
          size="small"
          aria-label="Siguiente"
          @click="scrollCarousel(1)"
        />

        <div
          v-if="showLeftFade"
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
      <v-progress-circular indeterminate color="amber" size="48" />
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
      color="grey"
      text="No se encontraron películas."
      class="mb-4"
    />

    <v-row v-else class="movie-grid">
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="movie-grid__col"
      >
        <MovieCard :movie="movie" />
      </v-col>
    </v-row>
  </AppContainer>
</template>

<style scoped>
.home-filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home-filters__intro h1 {
  margin-bottom: 8px;
}

.home-filters__intro p {
  margin-bottom: 0;
}

.home-filters__controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.home-filters__select {
  width: 100%;
  max-width: 100%;
}

@media (min-width: 600px) and (max-width: 959px) {
  .home-filters {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .home-filters__intro {
    width: 100%;
    text-align: start;
  }

  .home-filters__controls {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 16px;
  }

  .home-filters__select {
    flex: 1 1 0;
    width: auto;
    min-width: 0;
    max-width: 240px;
  }
}

@media (min-width: 960px) {
  .home-filters {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px 24px;
  }

  .home-filters__intro {
    flex: 1 1 auto;
    min-width: 0;
  }

  .home-filters__controls {
    flex: 0 0 auto;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    width: auto;
    gap: 12px 16px;
  }

  .home-filters__select {
    min-width: 220px;
    max-width: 260px;
  }
}

/* Grid de películas (debajo del Top 10) — móvil */
@media (max-width: 599px) {
  .movie-grid {
    padding-inline: 8px;
  }

  .movie-grid__col {
    display: flex;
    justify-content: center;
    padding-block: 4px;
  }

  .movie-grid__col :deep(.movie-card) {
    width: 100%;
    max-width: 280px;
    margin-inline: auto;
  }
}

.carousel-wrapper {
  position: relative;
}

.top-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px 0 8px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.top-carousel::-webkit-scrollbar {
  display: none;
}

.top-carousel > * {
  scroll-snap-align: start;
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
  background: linear-gradient(to right, rgb(var(--v-theme-background)) 20%, transparent);
}

.carousel-fade-right {
  right: 0;
  background: linear-gradient(to left, rgb(var(--v-theme-background)) 20%, transparent);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  min-width: 40px;
  min-height: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.carousel-arrow-left {
  left: 0;
}

.carousel-arrow-right {
  right: 0;
}

@media (min-width: 600px) {
  .top-carousel {
    padding-inline: 0 12px;
  }
}
</style>
