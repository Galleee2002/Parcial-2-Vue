<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppContainer from '@/components/AppContainer.vue'
import { useMovieSearch, submitMovieSearch } from '@/composables/useMovieSearch'

const route = useRoute()
const router = useRouter()
const { smAndUp, width } = useDisplay()
const { searchQuery } = useMovieSearch()

const drawerOpen = ref(false)

const navBtnSize = computed(() => (smAndUp.value ? 'large' : 'default'))

const isNarrowNav = computed(() => width.value < 380)

watch(
  () => route.path,
  () => {
    drawerOpen.value = false
  },
)

async function onNavSearch() {
  if (route.name !== 'home') {
    await router.push({ name: 'home' })
  }
  await nextTick()
  submitMovieSearch()
}

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}
</script>

<template>
  <v-app-bar color="surface" :height="64" elevation="2">
    <AppContainer :padded-y="false" class="navbar-shell">
      <div class="navbar-row" :class="{ 'navbar-row--narrow': isNarrowNav }">
        <RouterLink :to="{ name: 'home' }" class="brand-link d-flex align-center text-decoration-none">
          <img src="/icon.webp" alt="Ugi's Movies" class="brand-logo" />
          <span class="brand-title text-grey-lighten-5 font-weight-bold">
            Ugi's Movies
          </span>
        </RouterLink>

        <div class="navbar-search d-none d-sm-flex">
          <v-text-field
            v-model="searchQuery"
            label="Buscar película"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            color="primary"
            density="compact"
            hide-details
            clearable
            class="navbar-search__field"
            @keyup.enter="onNavSearch"
            @click:clear="onNavSearch"
          />
        </div>

        <nav v-if="smAndUp" class="nav-actions" aria-label="Navegación principal">
          <v-btn
            :to="{ name: 'home' }"
            variant="text"
            :size="navBtnSize"
            :class="route.path === '/' ? 'text-amber-accent-2' : 'text-grey-lighten-5'"
          >
            Inicio
          </v-btn>

          <v-btn
            :to="{ name: 'favorites' }"
            variant="text"
            :size="navBtnSize"
            :class="route.path === '/favorites' ? 'text-amber-accent-2' : 'text-grey-lighten-5'"
          >
            Mi Lista
          </v-btn>
        </nav>

        <v-btn
          v-else
          class="nav-menu-btn"
          :icon="drawerOpen ? 'mdi-close' : 'mdi-menu'"
          variant="text"
          color="grey-lighten-5"
          size="large"
          :aria-label="drawerOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
          :aria-expanded="drawerOpen"
          @click="toggleDrawer"
        />
      </div>
    </AppContainer>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawerOpen"
    location="right"
    temporary
    color="surface"
    width="260"
    class="nav-drawer"
  >
    <v-list nav density="comfortable" class="nav-drawer__list">
      <v-list-item
        :to="{ name: 'home' }"
        title="Inicio"
        prepend-icon="mdi-home-outline"
        :active="route.path === '/'"
        color="amber"
        rounded="lg"
        @click="drawerOpen = false"
      />
      <v-list-item
        :to="{ name: 'favorites' }"
        title="Mi Lista"
        prepend-icon="mdi-heart-outline"
        :active="route.path === '/favorites'"
        color="amber"
        rounded="lg"
        @click="drawerOpen = false"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.navbar-shell {
  height: 100%;
  display: flex;
  align-items: center;
}

.navbar-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.brand-link {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

.navbar-search {
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
  max-width: 420px;
  padding-inline: 8px;
}

.navbar-search__field {
  width: 100%;
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
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.nav-actions {
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
  padding-left: 16px;
  gap: 4px;
}

.nav-menu-btn {
  margin-left: auto;
  flex-shrink: 0;
}

.nav-drawer__list {
  padding-top: 8px;
}

@media (max-width: 599px) {
  .navbar-row {
    gap: 12px;
  }

  .brand-logo {
    width: 36px;
    height: 36px;
    margin-right: 8px;
  }

  .brand-title {
    font-size: 1rem;
  }
}

@media (max-width: 380px) {
  .navbar-row--narrow {
    gap: 8px;
  }

  .navbar-row--narrow .brand-link {
    flex: 0 1 auto;
    overflow: visible;
  }

  .navbar-row--narrow .brand-title {
    font-size: 1rem;
    overflow: visible;
    text-overflow: clip;
    flex-shrink: 0;
  }

  .navbar-row--narrow .brand-logo {
    width: 36px;
    height: 36px;
    margin-right: 8px;
  }

}

@media (min-width: 600px) {
  .navbar-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 16px;
  }

  .brand-link {
    flex: none;
    overflow: visible;
  }

  .navbar-search {
    justify-self: center;
    width: 100%;
    max-width: 400px;
    padding-inline: 12px;
  }

  .nav-actions {
    display: flex;
    margin-left: 0;
    padding-left: 0;
    gap: 8px;
  }
}

@media (min-width: 960px) {
  .navbar-search {
    max-width: 480px;
  }
}
</style>
