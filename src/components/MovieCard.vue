<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { posterUrl, releaseYear } from '@/services/tmdb'
import { useFavorites } from '@/composables/useFavorites'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const { favorites, toggle } = useFavorites()

const posterSrc = computed(() => posterUrl(props.movie.poster_path))
const year = computed(() => releaseYear(props.movie.release_date) ?? '')
const isInList = computed(() => favorites.value.some((item) => item.id === props.movie.id))

function goToDetail(id) {
  router.push({ name: 'movie-detail', params: { id } })
}

async function onToggleList() {
  await toggle(props.movie)
}
</script>

<template>
  <v-card class="h-100" elevation="2" rounded="lg">
    <v-img
      v-if="posterSrc"
      :src="posterSrc"
      :alt="movie.title"
      height="300"
      cover
    />

    <v-card-title class="text-blue-grey-darken-4">
      {{ movie.title }}
    </v-card-title>

    <v-card-subtitle v-if="year" class="text-blue-grey-darken-2 pb-2">
      {{ year }}
    </v-card-subtitle>

    <v-card-actions class="movie-card-actions pa-4 pt-0">
      <v-btn color="blue-grey" variant="outlined" size="small" @click="goToDetail(movie.id)">
        Ver detalle
      </v-btn>
      <v-btn
        :color="isInList ? 'blue-grey' : 'red'"
        :variant="isInList ? 'outlined' : 'flat'"
        size="small"
        @click="onToggleList"
      >
        {{ isInList ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.movie-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.movie-card-actions .v-btn {
  width: 100%;
}
</style>
