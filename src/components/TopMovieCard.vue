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
    <div class="poster-frame">
      <img
        v-if="posterSrc"
        :src="posterSrc"
        :alt="movie.title"
        class="poster"
        loading="lazy"
      />
    </div>
    <v-card-title class="top-movie-title text-grey-lighten-5 px-3 pt-2 pb-0">
      {{ movie.title }}
    </v-card-title>
    <v-card-subtitle v-if="year" class="top-movie-year px-3 pb-2 text-grey-lighten-3">
      {{ year }}
    </v-card-subtitle>
  </v-card>
</template>

<style scoped>
.top-movie-card {
  cursor: pointer;
  width: 150px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.top-movie-title {
  font-size: 0.8rem;
  line-height: 1.2;
  min-height: 2.4rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.top-movie-year {
  font-size: 0.75rem;
  min-height: 1.125rem;
}

.poster-frame {
  width: 100%;
  aspect-ratio: 2 / 3;
  flex-shrink: 0;
  overflow: hidden;
  background-color: rgb(var(--v-theme-background));
}

.poster {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: top center;
}
</style>
