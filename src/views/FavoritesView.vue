<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <v-container class="py-6">
    <h1 class="text-h4 text-blue-grey-darken-4 mb-4">Mi Lista</h1>

    <v-alert
      type="info"
      variant="tonal"
      color="blue-grey"
      text="Todavía no agregaste películas a Mi Lista."
      class="mb-6"
    />

    <v-btn color="blue-grey" variant="outlined" size="large" @click="goHome">
      Volver a Inicio
    </v-btn>
  </v-container>
</template>
