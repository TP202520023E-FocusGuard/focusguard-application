// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Iconos
import '@mdi/font/css/materialdesignicons.css'

// Store
import { useThemeStore } from './stores/themeStore'

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: false,
        colors: {
          // Estos se sobreescribirán con las variables CSS
          primary: 'rgb(var(--v-theme-primary))',
          secondary: 'rgb(var(--v-theme-secondary))',
          accent: 'rgb(var(--v-theme-accent))',
          background: 'rgb(var(--v-theme-background))',
          surface: 'rgb(var(--v-theme-surface))',
        }
      }
    }
  }
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vuetify)

// Aplicar tema al iniciar
const themeStore = useThemeStore()
themeStore.applyGlobalTheme()

app.mount('#app')
