<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockMovies } from '@/data/mockMovies'

const route = useRoute()
const router = useRouter()

const movie = computed(() => {
  const id = Number(route.params.id)
  return mockMovies.find((item) => item.id === id) ?? null
})

function getYear(releaseDate) {
  if (!releaseDate) return ''
  return releaseDate.slice(0, 4)
}

function goBack() {
  router.push({ name: 'home' })
}
</script>

<template>
  <v-container class="py-6">
    <v-alert
      v-if="!movie"
      type="error"
      variant="tonal"
      text="No se encontró la película solicitada."
      class="mb-4"
    />

    <template v-else>
      <v-row>
        <v-col cols="12" md="4">
          <v-img
            :src="movie.poster_path"
            :alt="movie.title"
            rounded="lg"
            cover
            class="mb-4 mb-md-0"
          />
        </v-col>

        <v-col cols="12" md="8">
          <h1 class="text-h4 text-blue-grey-darken-4 mb-4">
            {{ movie.title }}
          </h1>

          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip color="blue-grey" variant="tonal">
              {{ getYear(movie.release_date) }}
            </v-chip>
            <v-chip color="blue-grey" variant="tonal">
              {{ movie.genre }}
            </v-chip>
            <v-chip color="blue-grey" variant="tonal">
              {{ movie.vote_average }}/10
            </v-chip>
            <v-chip color="blue-grey" variant="tonal">
              {{ movie.runtime }} min
            </v-chip>
          </div>

          <p class="text-body-1 text-blue-grey-darken-2 mb-6">
            {{ movie.overview }}
          </p>

          <div class="d-flex flex-column flex-sm-row ga-3">
            <v-btn color="red" variant="flat" size="large">
              Agregar a Mi Lista
            </v-btn>
            <v-btn color="blue-grey" variant="outlined" size="large" @click="goBack">
              Volver
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
