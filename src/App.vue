<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <v-app>
    <NavBar />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
/* Foco de inputs: solo ámbar del tema (primary), sin rojo de paleta anterior */
.v-theme--moviesDark .v-field--focused:not(.v-field--error) .v-field__outline {
  color: rgb(var(--v-theme-primary));
}

.v-theme--moviesDark .v-field--focused:not(.v-field--error) .v-label.v-field-label--floating,
.v-theme--moviesDark .v-field--focused:not(.v-field--error) .v-field__prepend-inner .v-icon,
.v-theme--moviesDark .v-field--focused:not(.v-field--error) .v-field__append-inner .v-icon,
.v-theme--moviesDark .v-field--focused:not(.v-field--error) .v-field__clearable .v-icon {
  color: rgb(var(--v-theme-primary));
}

/* Botones secundarios: fondo tonal + borde visible */
.card-btn-secondary {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 500;
  border: thin solid rgba(var(--v-theme-on-surface), 0.55);
}
</style>
