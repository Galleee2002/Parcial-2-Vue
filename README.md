# 🎬 Ugi's Movies — Trabajo Práctico Vue 3 + TMDB

SPA para explorar películas con **Vue 3**, **Vite**, **Vuetify 4** y la API de [The Movie Database (TMDB)](https://www.themoviedb.org/?language=es-ES).

> Trabajo práctico de la materia · Grupos de hasta 3 integrantes · Entrega vía repositorio en GitHub

---

## ✨ Funcionalidades

| Función | Descripción |
| --- | --- |
| 🏠 **Inicio** | Listado de películas populares + carrusel Top 10 |
| 🔍 **Búsqueda** | Buscar películas por título (navbar en desktop, campo en mobile) |
| 🎭 **Filtros** | Filtrar por **género** y/o **clasificación por edades** (región AR) |
| 📄 **Detalle** | Título, sinopsis, año, póster, géneros, duración, rating, clasificación y streaming |
| ❤️ **Favoritos** | Agregar / quitar películas con persistencia en `localStorage` |

---

## ✅ Checklist de la consigna

| # | Requisito | Estado |
| --- | --- | --- |
| 1 | Películas populares en inicio | ✅ |
| 2 | Búsqueda por título + resultados en lista | ✅ |
| 3 | Detalle con título, sinopsis, año, póster y datos extra | ✅ |
| 4 | Filtro por género **y** clasificación por edades | ✅ |
| 5 | Botón favoritos + `localStorage` | ✅ |
| 6 | Interfaz **mobile first** | ✅ |
| 7 | Datos con `fetch` a TMDB (sin axios) | ✅ |

---

## 🛠️ Stack

| Tecnología | Uso |
| --- | --- |
| Vue 3 | Composition API + `<script setup>` |
| Vite 8 | Dev server, HMR y build |
| Vue Router 5 | Rutas con lazy loading |
| Vuetify 4 | UI responsive y componentes |
| pnpm | Gestor de paquetes |
| TMDB API | Catálogo, búsqueda, discover y detalle |

> La consigna menciona Vue CLI; este proyecto usa **`pnpm create vue`** (flujo oficial actual con Vite). No requiere migración.

**Node.js:** `^20.19.0` o `>=22.12.0`

---

## 🚀 Instalación y ejecución

### Requisitos

- Node.js (ver `engines` en `package.json`)
- pnpm
- API Key de TMDB en un archivo `.env` local (no versionado)

### Pasos

```sh
git clone https://github.com/Galleee2002/Parcial-2-Vue.git
cd Parcial-2-Vue
pnpm install
```

Creá un archivo `.env` en la raíz del proyecto:

```env
VITE_TMDB_API_KEY=tu_api_key_aqui
```

Obtené la clave en [themoviedb.org](https://www.themoviedb.org/settings/api) → Settings → API → **API Key (v3)**.

```sh
pnpm dev      # http://localhost:5173
pnpm build    # build de producción
pnpm preview  # previsualizar el build
pnpm lint     # ESLint + oxlint
```

---

## 📁 Estructura del proyecto

```
src/
├── views/
│   ├── HomeView.vue           # Populares, búsqueda y filtros
│   ├── MovieDetailView.vue    # Detalle + favoritos
│   └── FavoritesView.vue      # Colección en localStorage
├── components/
│   ├── NavBar.vue
│   ├── MovieCard.vue
│   ├── TopMovieCard.vue
│   └── AppContainer.vue
├── services/
│   ├── tmdb.js                # Todas las llamadas HTTP a TMDB
│   └── favoritesStore.js      # Persistencia en localStorage
├── composables/
│   ├── useFavorites.js
│   └── useMovieSearch.js
└── router/index.js
```

**Regla de arquitectura:** las vistas no llaman a TMDB directamente; todo pasa por `src/services/tmdb.js`.

---

## 🗺️ Rutas

| Ruta | Nombre | Vista |
| --- | --- | --- |
| `/` | `home` | Inicio — populares, búsqueda, filtros |
| `/movie/:id` | `movie-detail` | Detalle de película |
| `/favorites` | `favorites` | Favoritos guardados |

---

## 🔌 API TMDB

| Endpoint | Función en `tmdb.js` |
| --- | --- |
| `GET /movie/popular` | `fetchPopularMovies` |
| `GET /search/movie` | `searchMovies` |
| `GET /movie/{id}` | `fetchMovieDetails` |
| `GET /discover/movie` | `discoverMovies`, `discoverByGenre`, `discoverByCertification` |
| `GET /genre/movie/list` | `fetchGenres` |
| `GET /certification/movie/list` | `fetchMovieCertifications` |

Documentación: [developer.themoviedb.org](https://developer.themoviedb.org/docs)

---

## 👥 Integrantes

| Integrante | Rol |
| --- | --- |
| Tomas Fraile | Frontend & API |
| Manuel Agustín Garcia | Frontend & API |
| Gael Garcia | Frontend & API |

---

## 🐛 Problemas frecuentes

| Síntoma | Solución |
| --- | --- |
| API key `undefined` | Verificá que `.env` tenga `VITE_TMDB_API_KEY` y reiniciá `pnpm dev` |
| Póster no visible | `poster_path` puede ser `null`; la UI lo maneja con render condicional |
| Favoritos no persisten | Usá los métodos del composable `useFavorites` (`add`, `remove`, `toggle`) |

---

## 📚 Referencias

- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/)
- [TMDB API](https://developer.themoviedb.org/docs)
