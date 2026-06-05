import { createApp } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#ECEFF1',
          surface: '#FFFFFF',
          primary: '#F44336',
          secondary: '#607D8B',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
