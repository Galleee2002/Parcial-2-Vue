<script setup>
import { computed } from 'vue'
import AppContainer from '@/components/AppContainer.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <v-footer color="surface" class="app-footer">
    <AppContainer :padded-y="false" class="app-footer__shell">
      <div class="app-footer__grid">
        <div class="app-footer__brand">
          <RouterLink :to="{ name: 'home' }" class="app-footer__brand-link text-decoration-none">
            <img src="/icon.webp" alt="" class="app-footer__logo" width="32" height="32" />
            <span class="app-footer__title text-grey-lighten-5 font-weight-medium">
              Ugi's Movies
            </span>
          </RouterLink>
          <p class="app-footer__tagline text-body-2 text-grey-lighten-1 mb-0">
            Descubrí películas populares, buscá por título, filtrá por género y guardá
            tus favoritas para verlas cuando quieras.
          </p>
        </div>

        <div class="app-footer__meta">
          <p class="text-caption text-grey-lighten-1 mb-1">
            Datos proporcionados por
            <a
              href="https://www.themoviedb.org/?language=es-ES"
              target="_blank"
              rel="noopener noreferrer"
              class="app-footer__tmdb-link"
            >
              The Movie Database (TMDB)
            </a>
          </p>
          <p class="text-caption text-grey mb-0 mt-2">
            © {{ currentYear }} Ugi's Movies
          </p>
        </div>
      </div>
    </AppContainer>
  </v-footer>
</template>

<style scoped>
.app-footer {
  border-top: thin solid rgb(var(--v-theme-secondary));
  margin-top: auto;
}

.app-footer__shell {
  width: 100%;
  padding-block: 24px;
}

.app-footer__grid {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
  width: 100%;
}

.app-footer__brand {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-footer__brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  width: fit-content;
}

.app-footer__logo {
  object-fit: contain;
  flex-shrink: 0;
}

.app-footer__title {
  font-size: 1rem;
  line-height: 1.3;
}

.app-footer__tagline {
  max-width: 42rem;
  line-height: 1.6;
}

.app-footer__meta {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1.5;
}

.app-footer__tmdb-link {
  color: rgb(var(--v-theme-on-surface-variant));
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s ease;
}

.app-footer__tmdb-link:hover,
.app-footer__tmdb-link:focus-visible {
  color: rgb(var(--v-theme-warning));
}

@media (min-width: 600px) {
  .app-footer__shell {
    padding-block: 32px;
  }

  .app-footer__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 32px;
  }

  .app-footer__meta {
    text-align: right;
    justify-self: end;
  }
}

@media (min-width: 960px) {
  .app-footer__grid {
    gap: 48px;
  }
}
</style>
