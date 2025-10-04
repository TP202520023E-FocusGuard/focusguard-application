// src/stores/themeStore.js
import { defineStore } from 'pinia'
import { availableThemes, defaultTheme } from '../theme/themeConfig.js'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: localStorage.getItem('userTheme') || defaultTheme,
  }),

  getters: {
    themeColors: (state) => {
      return availableThemes[state.currentTheme]?.colors || availableThemes[defaultTheme].colors
    },
    themeName: (state) => availableThemes[state.currentTheme]?.name || availableThemes[defaultTheme].name
  },

  actions: {
    setTheme(themeName) {
      if (availableThemes[themeName]) {
        this.currentTheme = themeName
        localStorage.setItem('userTheme', themeName)
        this.applyGlobalTheme()
      }
    },

    applyGlobalTheme() {
      const colors = this.themeColors
      const root = document.documentElement
      
      // Aplicar todas las variables CSS
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value)
      })

      // También actualizar Vuetify
      this.updateVuetifyTheme()
    },

    updateVuetifyTheme() {
      // Vuetify usará las variables CSS automáticamente
    }
  }
})