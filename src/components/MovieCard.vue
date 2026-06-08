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
  <v-card class="movie-card h-100 d-flex flex-column" elevation="2" rounded="lg">
    <div class="poster-frame">
      <img
        v-if="posterSrc"
        :src="posterSrc"
        :alt="movie.title"
        class="poster"
        loading="lazy"
      />
    </div>

    <v-card-title class="movie-card__title text-grey-lighten-5">
      {{ movie.title }}
    </v-card-title>

    <v-card-subtitle class="movie-card__year text-grey-lighten-3 pb-2">
      {{ year || '—' }}
    </v-card-subtitle>

    <v-card-actions class="movie-card-actions pa-4 pt-0 mt-auto">
      <v-btn
        color="grey-lighten-1"
        variant="tonal"
        size="small"
        class="card-btn-secondary"
        @click="goToDetail(movie.id)"
      >
        Ver detalle
      </v-btn>
      <v-btn
        :color="isInList ? 'grey-lighten-1' : 'amber'"
        :variant="isInList ? 'tonal' : 'flat'"
        :class="{ 'card-btn-secondary': isInList, 'font-weight-medium': !isInList }"
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

.movie-card__title {
  min-height: 3rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  line-height: 1.5rem;
  padding-bottom: 0;
}

.movie-card__year {
  min-height: 1.25rem;
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
