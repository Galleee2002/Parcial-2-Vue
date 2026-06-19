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
    background: '#212121',
    surface: '#424242',
    'surface-bright': '#616161',
    'surface-light': '#424242',
    'surface-variant': '#616161',
    'on-surface': '#FAFAFA',
    'on-surface-variant': '#BDBDBD',
    'on-background': '#FAFAFA',
    primary: '#FFC107',
    'primary-darken-1': '#FFB300',
    'on-primary': '#212121',
    amber: '#FFC107',
    'amber-darken-1': '#FFB300',
    secondary: '#9E9E9E',
    'secondary-darken-1': '#757575',
    error: '#FF8F00',
    info: '#9E9E9E',
    success: '#9E9E9E',
    warning: '#FFD740',
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
