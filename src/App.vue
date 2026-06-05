<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <v-app>
    <NavBar />
    <v-main class="bg-blue-grey-lighten-5">
      <RouterView />
    </v-main>
  </v-app>
</template>
