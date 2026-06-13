<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import AppContainer from '@/components/AppContainer.vue'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const { favorites, loading, error, load } = useFavorites()

function goHome() {
  router.push({ name: 'home' })
}

onMounted(() => {
  load()
})
</script>

<template>
  <AppContainer>
    <h1 class="text-h4 text-grey-lighten-5 mb-4">Favoritos</h1>

    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="amber" size="48" />
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      :text="error"
      class="mb-6"
    />

    <template v-else-if="favorites.length === 0">
      <v-alert
        type="info"
        variant="tonal"
        color="grey"
        text="Todavía no agregaste películas a favoritos."
        class="mb-6"
      />

      <div class="d-flex justify-center">
        <v-btn
          color="grey-lighten-1"
          variant="tonal"
          size="large"
          class="card-btn-secondary"
          @click="goHome"
        >
          Volver a Inicio
        </v-btn>
      </div>
    </template>

    <v-row v-else>
      <v-col
        v-for="movie in favorites"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard :movie="movie" />
      </v-col>
    </v-row>
  </AppContainer>
</template>
