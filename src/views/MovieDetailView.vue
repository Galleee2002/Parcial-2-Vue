<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchMovieDetails,
  posterUrl,
  backdropUrl,
  movieTagline,
  releaseYear,
  formatRuntimeShort,
  formatGenresList,
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
const backdropSrc = computed(() => (movie.value ? backdropUrl(movie.value.backdrop_path) : null))
const tagline = computed(() => (movie.value ? movieTagline(movie.value) : null))
const displayTitle = computed(() => movie.value?.title ?? '')
const releaseYearLabel = computed(() =>
  movie.value ? releaseYear(movie.value.release_date) : null,
)
const genreNames = computed(() => (movie.value ? formatGenresList(movie.value.genres) : null))
const runtimeLabel = computed(() => (movie.value ? formatRuntimeShort(movie.value.runtime) : null))
const certification = computed(() =>
  movie.value ? certificationForRegion(movie.value, DEFAULT_WATCH_REGION) : null,
)
const hasFacts = computed(() =>
  Boolean(certification.value || genreNames.value || runtimeLabel.value),
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
  <AppContainer v-if="loading || error || !movie">
    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="amber" size="48" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal" :text="error" class="mb-4" />

    <v-alert
      v-else
      type="error"
      variant="tonal"
      text="No se encontró la película solicitada."
      class="mb-4"
    />
  </AppContainer>

  <template v-else>
    <section class="detail-hero">
      <div v-if="backdropSrc" class="detail-hero__backdrop" aria-hidden="true">
        <img :src="backdropSrc" alt="" class="detail-hero__backdrop-img" />
      </div>

      <div class="detail-hero__scrim" aria-hidden="true" />

      <div class="detail-hero__inner">
        <v-row class="detail-hero__row" align="start">
          <v-col cols="12" sm="6" md="4" class="detail-hero__poster-col">
            <v-img
              v-if="posterSrc"
              :src="posterSrc"
              :alt="movie.title"
              rounded="lg"
              cover
              class="detail-hero__poster"
            />
          </v-col>

          <v-col cols="12" sm="6" md="8" class="detail-hero__content-col">
            <h1 class="detail-title">
              <span class="text-grey-lighten-5">{{ displayTitle }}</span
              ><span v-if="releaseYearLabel" class="detail-title__year text-grey-lighten-1">
                ({{ releaseYearLabel }})</span
              >
            </h1>

            <p
              v-if="hasFacts || voteAverage != null"
              class="detail-facts text-body-2 text-grey-lighten-5"
            >
              <span v-if="certification" class="detail-facts__cert text-grey-lighten-1">{{
                certification
              }}</span>
              <template v-if="genreNames">
                <span class="detail-facts__sep" aria-hidden="true"> • </span>
                <span>{{ genreNames }}</span>
              </template>
              <template v-if="runtimeLabel">
                <span class="detail-facts__sep" aria-hidden="true"> • </span>
                <span>{{ runtimeLabel }}</span>
              </template>
              <template v-if="voteAverage != null">
                <span class="detail-facts__sep" aria-hidden="true"> • </span>
                <span
                  class="detail-facts__rating"
                  :aria-label="`Valoración ${voteAverage.toFixed(1)} de 10`"
                >
                  <v-icon icon="mdi-star" color="amber" size="x-small" aria-hidden="true" />
                  {{ voteAverage.toFixed(1) }}
                </span>
              </template>
            </p>

            <p v-if="tagline" class="detail-tagline text-body-2 text-grey-lighten-1">
              {{ tagline }}
            </p>

            <h2 class="text-h6 text-grey-lighten-5">Descripción:</h2>
            <p class="text-body-1 text-grey-lighten-3">
              {{ movie.overview }}
            </p>

            <template v-if="watchProviders && watchProviders.flatrate.length > 0">
              <h2 class="text-h6 text-grey-lighten-5">Disponible en streaming</h2>
              <div class="d-flex flex-wrap detail-providers">
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
            </template>

            <div class="detail-actions d-flex flex-column flex-sm-row">
              <v-btn
                :color="isInList ? 'grey-lighten-1' : 'amber'"
                :variant="isInList ? 'tonal' : 'flat'"
                :class="{ 'card-btn-secondary': isInList, 'font-weight-medium': !isInList }"
                size="large"
                @click="onToggleList"
              >
                {{ isInList ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
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
      </div>
    </section>
  </template>
</template>

<style scoped>
.detail-hero {
  position: relative;
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  overflow: hidden;
  padding-block: 24px 32px;
}

.detail-hero__backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.detail-hero__backdrop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.12);
  filter: blur(20px);
}

.detail-hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(33, 33, 33, 0.6) 0%, rgba(33, 33, 33, 0.92) 100%);
  pointer-events: none;
}

.detail-hero__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 16px;
}

.detail-hero__poster-col {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

@media (max-width: 599px) {
  .detail-hero__inner {
    padding-inline: 0;
  }

  .detail-hero__row {
    margin-inline: 0;
  }

  .detail-hero__poster-col {
    padding: 0 !important;
    margin: 0 0 8px;
    width: 100%;
    max-width: 100%;
  }

  .detail-hero__poster {
    width: 100%;
    max-width: none;
    box-shadow: none;
    border-radius: 0 !important;
  }

  .detail-hero__poster :deep(.v-responsive),
  .detail-hero__poster :deep(.v-img__img) {
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 0 !important;
  }

  .detail-hero__content-col {
    padding-inline: 16px;
    padding-top: 0 !important;
  }
}

.detail-hero__content-col {
  --detail-block-gap: 16px;
  display: flex;
  flex-direction: column;
  gap: var(--detail-block-gap);
  text-align: start;
}

.detail-hero__content-col > :is(h1, h2, p) {
  margin: 0;
}

.detail-actions {
  gap: var(--detail-block-gap);
  width: 100%;
}

.detail-providers {
  gap: 12px;
  justify-content: flex-start;
}

.detail-hero__content-col :is(.detail-providers, .detail-actions) {
  justify-content: flex-start;
}

.detail-hero__poster {
  width: 100%;
  aspect-ratio: 2 / 3;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.25;
  width: 100%;
  text-align: center;
}

.detail-tagline {
  font-style: italic;
  line-height: 1.5;
}

.detail-facts {
  margin: 0;
  line-height: 1.5;
}

.detail-facts__cert {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.625rem;
  padding: 0 0.2rem;
  margin-right: 0.5rem;
  border: 1px solid rgba(189, 189, 189, 0.75);
  border-radius: 2px;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  vertical-align: baseline;
}

.detail-facts__sep {
  opacity: 0.85;
}

.detail-facts__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  vertical-align: baseline;
}

@media (min-width: 600px) and (max-width: 959px) {
  .detail-hero {
    padding-block: 40px;
  }

  .detail-hero__row {
    align-items: flex-start !important;
  }

  .detail-hero__poster-col {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .detail-hero__content-col {
    --detail-block-gap: 24px;
    gap: var(--detail-block-gap);
  }

  .detail-title {
    font-size: 2.125rem;
  }

  .detail-hero__content-col .text-h6 {
    font-size: 1.25rem !important;
  }

  .detail-hero__content-col .text-body-1 {
    font-size: 1.0625rem;
    line-height: 1.6;
  }

  .detail-facts,
  .detail-tagline {
    font-size: 1rem !important;
  }
}

@media (min-width: 600px) {
  .detail-hero__inner {
    padding-inline: 24px;
  }

  .detail-hero__poster-col {
    justify-content: flex-start;
    margin-bottom: 0;
  }

  .detail-hero__poster {
    width: 100%;
    max-width: none;
    border-radius: 8px !important;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  }

  .detail-hero__poster :deep(.v-img__img) {
    border-radius: 8px !important;
  }

  .detail-hero__content-col {
    padding-inline: 0;
    --detail-block-gap: 20px;
    gap: var(--detail-block-gap);
  }

  .detail-title {
    text-align: start;
    font-size: 1.75rem;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .detail-hero__inner {
    padding-inline: 16px;
  }
}

@media (min-width: 960px) {
  .detail-hero {
    padding-block: 20px;
  }

  .detail-hero__inner {
    padding-inline: 32px;
  }

  .detail-hero__content-col {
    --detail-block-gap: 16px;
    gap: var(--detail-block-gap);
  }

  .detail-title {
    font-size: 2.125rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .detail-hero__backdrop-img {
    transform: none;
    filter: blur(12px);
  }
}
</style>
