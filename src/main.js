import { createApp } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

const moviesDarkTheme = {
  dark: true,
  colors: {
    background: '#212121', // grey darken-4 — bg-app
    surface: '#424242', // grey darken-3 — cards
    'surface-bright': '#616161', // grey darken-2
    'surface-light': '#424242',
    'surface-variant': '#616161',
    'on-surface': '#FAFAFA', // grey lighten-5 — text-primary
    'on-surface-variant': '#BDBDBD', // grey lighten-1 — text-secondary
    'on-background': '#FAFAFA',
    primary: '#FFC107', // amber — CTAs y foco de inputs
    'primary-darken-1': '#FFB300',
    'on-primary': '#212121',
    amber: '#FFC107',
    'amber-darken-1': '#FFB300',
    secondary: '#9E9E9E', // grey base
    'secondary-darken-1': '#757575',
    error: '#FF8F00', // amber darken-3
    info: '#9E9E9E',
    success: '#9E9E9E',
    warning: '#FFD740', // amber accent-2
  },
  variables: {
    'border-color': '#757575',
    'border-opacity': 0.24,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.6,
    'disabled-opacity': 0.38,
  },
}

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VTextField: { color: 'primary' },
    VSelect: { color: 'primary' },
  },
  theme: {
    defaultTheme: 'moviesDark',
    themes: {
      moviesDark: moviesDarkTheme,
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
