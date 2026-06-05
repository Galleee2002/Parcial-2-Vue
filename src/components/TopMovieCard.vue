<script setup>
import { computed } from 'vue'
import { posterUrl, releaseYear } from '@/services/tmdb'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['navigate'])

const posterSrc = computed(() => posterUrl(props.movie.poster_path))
const year = computed(() => releaseYear(props.movie.release_date) ?? '')

function onClick() {
  emit('navigate', props.movie.id)
}
</script>

<template>
  <v-card class="top-movie-card" elevation="2" rounded="lg" @click="onClick">
    <v-img
      v-if="posterSrc"
      :src="posterSrc"
      :alt="movie.title"
      height="200"
      cover
    />
    <v-card-title class="top-movie-title text-blue-grey-darken-4 px-3 pt-2 pb-0">
      {{ movie.title }}
    </v-card-title>
    <v-card-subtitle v-if="year" class="top-movie-year px-3 pb-2 text-blue-grey-darken-2">
      {{ year }}
    </v-card-subtitle>
  </v-card>
</template>

<style scoped>
.top-movie-card {
  cursor: pointer;
  width: 150px;
  flex-shrink: 0;
}

.top-movie-title {
  font-size: 0.8rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-movie-year {
  font-size: 0.75rem;
}
</style>
