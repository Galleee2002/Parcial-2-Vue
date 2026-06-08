<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchMovieDetails,
  posterUrl,
  titleWithYear,
  formatRuntime,
  certificationForRegion,
  providersForRegion,
  providerLogoUrl,
  DEFAULT_WATCH_REGION,
} from '@/services/tmdb'
import AppContainer from '@/components/AppContainer.vue'
import { useFavorites } from '@/composables/useFavorites'

const route = useRoute()
const router = useRouter()
const { favorites, load, toggle } = useFavorites()

const movie = ref(null)
const loading = ref(true)
const error = ref(null)

const posterSrc = computed(() => (movie.value ? posterUrl(movie.value.poster_path) : null))
const displayTitle = computed(() =>
  movie.value ? titleWithYear(movie.value.title, movie.value.release_date) : '',
)
const genreNames = computed(() =>
  (movie.value?.genres ?? []).map((genre) => genre.name).join(', '),
)
const runtimeLabel = computed(() =>
  movie.value ? formatRuntime(movie.value.runtime) : null,
)
const certification = computed(() =>
  movie.value ? certificationForRegion(movie.value, DEFAULT_WATCH_REGION) : null,
)
const voteAverage = computed(() => movie.value?.vote_average ?? null)
const watchProviders = computed(() =>
  movie.value ? providersForRegion(movie.value, DEFAULT_WATCH_REGION) : null,
)
const isInList = computed(() =>
  movie.value ? favorites.value.some((item) => item.id === movie.value.id) : false,
)

function setError(err) {
  error.value = err instanceof Error ? err.message : 'Error al cargar la película'
}

async function loadMovie(id) {
  loading.value = true
  error.value = null
  movie.value = null

  try {
    movie.value = await fetchMovieDetails(id)
  } catch (err) {
    setError(err)
  } finally {
    loading.value = false
  }
}

async function onToggleList() {
  if (!movie.value) return
  await toggle(movie.value)
}

function goBack() {
  router.push({ name: 'home' })
}

watch(
  () => route.params.id,
  (id) => {
    if (id) loadMovie(id)
  },
  { immediate: true },
)

onMounted(() => {
  load()
})
</script>

<template>
  <AppContainer>
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
      v-else-if="!movie"
      type="error"
      variant="tonal"
      text="No se encontró la película solicitada."
      class="mb-4"
    />

    <template v-else>
      <v-row>
        <v-col cols="12" md="4">
          <v-img
            v-if="posterSrc"
            :src="posterSrc"
            :alt="movie.title"
            rounded="lg"
            cover
            class="mb-4 mb-md-0"
          />
        </v-col>

        <v-col cols="12" md="8">
          <h1 class="text-h4 text-grey-lighten-5 mb-4">
            {{ displayTitle }}
          </h1>

          <div class="d-flex flex-wrap align-center ga-2 mb-4">
            <v-chip v-if="certification" color="grey" variant="tonal">
              {{ certification }}
            </v-chip>
            <v-chip v-if="genreNames" color="grey" variant="tonal">
              {{ genreNames }}
            </v-chip>
            <v-chip
              v-if="voteAverage != null"
              color="grey"
              variant="tonal"
              class="rating-chip"
              :aria-label="`Valoración ${voteAverage.toFixed(1)} de 10`"
            >
              <v-icon icon="mdi-star" color="amber" size="small" aria-hidden="true" />
              <span class="rating-chip__score text-grey-lighten-5">
                {{ voteAverage.toFixed(1) }}/10
              </span>
            </v-chip>
            <v-chip v-if="runtimeLabel" color="grey" variant="tonal">
              {{ runtimeLabel }}
            </v-chip>
          </div>

          <p class="text-body-1 text-grey-lighten-3 mb-6">
            {{ movie.overview }}
          </p>

          <section
            v-if="watchProviders && watchProviders.flatrate.length > 0"
            class="mb-6"
          >
            <h2 class="text-h6 text-grey-lighten-5 mb-3">Disponible en streaming</h2>
            <div class="d-flex flex-wrap ga-3">
              <div
                v-for="provider in watchProviders.flatrate"
                :key="provider.provider_id"
                class="d-flex flex-column align-center"
              >
                <v-img
                  v-if="providerLogoUrl(provider.logo_path)"
                  :src="providerLogoUrl(provider.logo_path)"
                  :alt="provider.provider_name"
                  width="48"
                  height="48"
                  cover
                  rounded="lg"
                />
                <span class="text-caption text-grey-lighten-3 mt-1">
                  {{ provider.provider_name }}
                </span>
              </div>
            </div>
          </section>

          <div class="d-flex flex-column flex-sm-row ga-3">
            <v-btn
              :color="isInList ? 'grey-lighten-1' : 'amber'"
              :variant="isInList ? 'tonal' : 'flat'"
              :class="{ 'card-btn-secondary': isInList, 'font-weight-medium': !isInList }"
              size="large"
              @click="onToggleList"
            >
              {{ isInList ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista' }}
            </v-btn>
            <v-btn
              color="grey-lighten-1"
              variant="tonal"
              size="large"
              class="card-btn-secondary"
              @click="goBack"
            >
              Volver
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
  </AppContainer>
</template>

<style scoped>
.rating-chip :deep(.v-chip__content) {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-block: 2px;
}

.rating-chip__score {
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>
