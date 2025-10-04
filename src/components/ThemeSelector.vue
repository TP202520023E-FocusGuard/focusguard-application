<!-- src/components/ThemeSelector.vue -->
<template>
  <v-card class="theme-selector pa-4" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon :color="themeStore.themeColors.primary" class="mr-2">mdi-palette</v-icon>
      Personalizar Tema
    </v-card-title>

    <v-card-text>
      <div class="mb-6">
        <div class="text-subtitle-1 font-weight-medium mb-3">Selecciona un tema</div>
        <div class="theme-options d-flex flex-wrap gap-3">
          <div
            v-for="(theme, key) in availableThemes"
            :key="key"
            class="theme-option"
            :class="{ active: themeStore.currentTheme === key }"
            @click="applyTheme(key)"
          >
            <div class="theme-preview" :style="getThemePreview(theme.colors)">
              <div class="preview-header" :style="{ background: theme.colors.primary }"></div>
              <div class="preview-sidebar" :style="{ background: theme.colors.secondary }"></div>
              <div class="preview-content" :style="{ background: theme.colors.background }"></div>
            </div>
            <div class="theme-name text-caption mt-2">{{ theme.name }}</div>
          </div>
        </div>
      </div>

      <!-- Vista previa en tiempo real -->
      <v-alert :color="themeStore.themeColors.primary" variant="tonal" class="mt-4">
        <template #prepend>
          <v-icon :color="themeStore.themeColors.accent">mdi-eye</v-icon>
        </template>
        <strong>Vista previa:</strong> Este es el color {{ themeStore.themeColors.primary }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { availableThemes } from '../theme/themeConfig.js'
import { useThemeStore } from '../stores/themeStore.js'
import { mapStores } from 'pinia'

export default {
  name: 'ThemeSelector',
  computed: {
    ...mapStores(useThemeStore),
    availableThemes() {
      return availableThemes
    }
  },
  methods: {
    applyTheme(themeName) {
      this.themeStore.setTheme(themeName)
    },
    
    getThemePreview(colors) {
      return {
        '--preview-primary': colors.primary,
        '--preview-secondary': colors.secondary,
        '--preview-background': colors.background
      }
    }
  }
}
</script>

<style scoped>
.theme-options {
  max-width: 100%;
}

.theme-option {
  cursor: pointer;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.theme-option:hover {
  transform: translateY(-4px);
  background: rgba(0, 0, 0, 0.05);
}

.theme-option.active {
  border-color: var(--theme-primary);
  background: rgba(var(--theme-primary), 0.1);
}

.theme-preview {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  transition: all 0.3s ease;
}

.theme-option.active .theme-preview {
  transform: scale(1.1);
}

.preview-header {
  width: 100%;
  height: 12px;
}

.preview-sidebar {
  width: 20px;
  height: 100%;
}

.preview-content {
  flex: 1;
  height: 100%;
}

.theme-name {
  font-weight: 600;
  color: var(--theme-text);
}
</style>