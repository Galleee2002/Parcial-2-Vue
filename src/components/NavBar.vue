<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <v-app-bar color="blue-grey-darken-3" :height="64">
    <RouterLink :to="{ name: 'home' }" class="brand-link d-flex align-center text-decoration-none">
      <img src="/icon.webp" alt="Ugi's Movies" class="brand-logo" />
      <span class="brand-title text-blue-grey-lighten-5 font-weight-bold">
        Ugi's Movies
      </span>
    </RouterLink>

    <v-spacer />

    <v-btn
      :to="{ name: 'home' }"
      variant="text"
      size="large"
      :class="route.path === '/' ? 'text-red-accent-2' : 'text-blue-grey-lighten-5'"
    >
      Inicio
    </v-btn>

    <v-btn
      :to="{ name: 'favorites' }"
      variant="text"
      size="large"
      :class="route.path === '/favorites' ? 'text-red-accent-2' : 'text-blue-grey-lighten-5'"
    >
      Mi Lista
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
.brand-link {
  flex-shrink: 0;
  margin-left: 16px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
  margin-right: 12px;
}

.brand-title {
  font-size: 1.25rem;
  line-height: 1.2;
  white-space: nowrap;
}
</style>
