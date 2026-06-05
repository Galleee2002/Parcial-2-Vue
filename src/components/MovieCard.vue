<script setup>
import { useRouter } from 'vue-router'

defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

function getYear(releaseDate) {
  if (!releaseDate) return ''
  return releaseDate.slice(0, 4)
}

function goToDetail(id) {
  router.push({ name: 'movie-detail', params: { id } })
}
</script>

<template>
  <v-card class="h-100" elevation="2" rounded="lg">
    <v-img :src="movie.poster_path" :alt="movie.title" height="300" cover />

    <v-card-title class="text-blue-grey-darken-4">
      {{ movie.title }}
    </v-card-title>

    <v-card-subtitle class="text-blue-grey-darken-2 pb-2">
      {{ getYear(movie.release_date) }}
    </v-card-subtitle>

    <v-card-actions class="flex-column flex-sm-row ga-2 pa-4 pt-0">
      <v-btn color="blue-grey" variant="outlined" block class="flex-sm-grow-1" @click="goToDetail(movie.id)">
        Ver detalle
      </v-btn>
      <v-btn color="red" variant="flat" block class="flex-sm-grow-1">
        Agregar a Mi Lista
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
