<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockMovies } from '@/data/mockMovies'
import MovieCard from '@/components/MovieCard.vue'
import TopMovieCard from '@/components/TopMovieCard.vue'

const router = useRouter()
const topMovies = mockMovies.slice(0, 10)

const search = ref('')
const selectedGenre = ref(null)

const carouselRef = ref(null)
const showLeftFade = ref(false)
const showRightFade = ref(false)

const genreOptions = [
  { title: 'Todos los géneros', value: null },
  ...Array.from(new Set(mockMovies.map((movie) => movie.genre))).map((genre) => ({
    title: genre,
    value: genre,
  })),
]

const filteredMovies = computed(() => {
  const query = search.value.trim().toLowerCase()

  return mockMovies.filter((movie) => {
    const matchesSearch = query === '' || movie.title.toLowerCase().includes(query)
    const matchesGenre = selectedGenre.value === null || movie.genre === selectedGenre.value
    return matchesSearch && matchesGenre
  })
})

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

onMounted(() => {
  updateCarouselEdges()
  window.addEventListener('resize', updateCarouselEdges)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCarouselEdges)
})
</script>

<template>
  <v-container class="py-6">
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
        />
      </v-col>
    </v-row>

    <section class="mb-8">
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

    <v-alert
      v-if="filteredMovies.length === 0"
      type="info"
      variant="tonal"
      color="blue-grey"
      text="No se encontraron películas."
      class="mb-4"
    />

    <v-row v-else>
      <v-col
        v-for="movie in filteredMovies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard :movie="movie" />
      </v-col>
    </v-row>
  </v-container>
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
