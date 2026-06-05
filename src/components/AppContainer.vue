<template>
  <v-container fluid :class="['app-container', { 'app-container--padded-y': paddedY }]">
    <slot />
  </v-container>
</template>

<script setup>
defineProps({
  paddedY: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
.app-container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 16px;
}

.app-container--padded-y {
  padding-block: 24px;
}

@media (min-width: 600px) {
  .app-container {
    padding-inline: 24px;
  }
}

@media (min-width: 960px) {
  .app-container {
    padding-inline: 32px;
  }
}
</style>
