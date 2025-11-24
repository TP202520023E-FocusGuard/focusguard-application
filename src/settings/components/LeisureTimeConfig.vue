<template>
  <v-card class="compact-settings-card pa-4" elevation="2">
    <!-- Header compacto -->
    <div class="text-center mb-4">
      <v-icon color="primary" size="48" class="mb-1">mdi-timer-sand</v-icon>
      <h2 class="text-h5 font-weight-bold primary--text mb-1">
        Tiempo de Ocio Diario
      </h2>
      <p class="text-caption text--secondary">
        Establece tu límite de tiempo para actividades de ocio
      </p>
    </div>

    <!-- Loading state-->
    <div v-if="loading" class="text-center py-4">
      <v-progress-circular
        indeterminate
        color="primary"
        size="36"
      ></v-progress-circular>
      <div class="text-caption text--secondary mt-2">Cargando configuración...</div>
    </div>

    <!-- Display del tiempo actual -->
    <v-card variant="outlined" class="pa-3 mb-3 text-center">
      <div class="time-display-compact">
        <span class="text-h4 font-weight-bold primary--text">{{ leisureTime }}</span>
        <div class="text-caption text--secondary">minutos</div>
      </div>
    </v-card>

    <!-- Slider compacto -->
    <div class="mb-4">
      <div class="d-flex justify-space-between align-center mb-1">
        <span class="text-body-2 font-weight-medium">Ajustar tiempo:</span>
        <span class="text-body-2 primary--text font-weight-medium">{{ leisureTime }} min</span>
      </div>
      <v-slider
        v-model="leisureTime"
        :min="15"
        :max="180"
        :step="15"
        color="primary"
        thumb-color="primary"
        track-color="grey lighten-2"
        hide-details
        density="compact"
      >
        <template #thumb-label>
          {{ leisureTime }}
        </template>
      </v-slider>
      <div class="d-flex justify-space-between mt-1">
        <small class="text-caption text--secondary">15 min</small>
        <small class="text-caption text--secondary">3 hrs</small>
      </div>
    </div>

    <!-- Controles rápidos -->
    <div class="d-flex justify-center align-center mb-4">
      <v-btn 
        icon 
        @click="decrementTime"
        :disabled="leisureTime <= 15"
        color="primary"
        size="small"
        variant="outlined"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      
      <div class="mx-3 text-center">
        <v-chip color="primary" text-color="white" class="font-weight-bold">
          {{ leisureTime }} min
        </v-chip>
      </div>
      
      <v-btn 
        icon 
        @click="incrementTime"
        :disabled="leisureTime >= 180"
        color="primary"
        size="small"
        variant="outlined"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <!-- Presets compactos -->
    <div class="presets-compact mb-3">
      <span class="text-body-2 font-weight-medium d-block mb-2 text-center">Presets:</span>
      <div class="d-flex flex-wrap gap-1 justify-center">
        <v-chip
          v-for="preset in timePresets"
          :key="preset"
          :color="leisureTime === preset ? 'primary' : 'grey lighten-3'"
          :text-color="leisureTime === preset ? 'white' : 'grey darken-2'"
          @click="leisureTime = preset"
          class="preset-chip-compact"
          size="small"
          density="comfortable"
        >
          {{ preset }}
        </v-chip>
      </div>
    </div>

    <!-- Información compacta -->
    <v-alert type="info" variant="tonal" density="compact" class="mt-3">
      <template #prepend>
        <v-icon color="info" size="small">mdi-information</v-icon>
      </template>
      <div class="text-caption">
        <strong>Recomendado:</strong> 30-60 min para equilibrio
      </div>
    </v-alert>

    <!-- Botón compacto -->
    <v-card-actions class="justify-center mt-4 pa-0">
      <v-btn 
        color="primary" 
        size="large"
        @click="saveSettings"
        :loading="saving"
        min-width="140"
      >
        <v-icon left size="small">mdi-content-save</v-icon>
        {{ hasChanges ? 'Guardar Cambios' : 'Guardado' }}
      </v-btn>
    </v-card-actions>

    <!-- Mensaje de exito-->
    <v-alert
      v-if="showSuccess"
      type="success"
      variant="tonal"
      density="compact"
      class="mt-3"
    >
      <div class="text-caption">
        Configuración guardada con éxito.
      </div>
    </v-alert> 
  </v-card>
</template>

<script>

import { apiService } from '../../services/api/api.js';
import { useAuthStore } from '../../stores/authStore.js';
export default {
  name: 'LeisureTimeConfig',
  data() {
    return {
      leisureTime: 30,
      originalLeisureTime: 30,
      saving: false,
      loading: true,
      showSuccess: false,
      timePresets: [15, 30, 45, 60, 90, 120],
      userConfig: null
    };
  },
  computed: {
    hasChanges() {
      return this.leisureTime !== this.originalLeisureTime;
    }
  },
  methods: {
    async loadConfiguration() {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user?.id
        this.loading = true;
        const config = await apiService.getTimeConfiguration(userId); // userId = 1 por ahora
        
        this.userConfig = config;
        this.leisureTime = config.tiempo_ocio_diario || 30;
        this.originalLeisureTime = this.leisureTime;
     
      } catch (error) {
        console.error('❌ Error cargando configuración:', error);
        // Valores por defecto si hay error
        this.leisureTime = 30;
        this.originalLeisureTime = 30;
      } finally {
        this.loading = false;
      }
    },

    incrementTime() {
      if (this.leisureTime < 180) {
        this.leisureTime += 15;
      }
    },

    decrementTime() {
      if (this.leisureTime > 15) {
        this.leisureTime -= 15;
      }
    },

    async saveSettings() {
      if (!this.hasChanges) return;

      this.saving = true;
      this.showSuccess = false;
      
      try {
        const configData = {
          tiempo_ocio_diario: this.leisureTime,
          tiempo_max_productivo: this.userConfig?.tiempo_max_productivo || 0,
          idioma: this.userConfig?.idioma || 'es',
          bloqueo_automatico: this.userConfig?.bloqueo_automatico || true
        };
        const authStore = useAuthStore();
        const userId = authStore.user?.id;
        const response = await apiService.updateTimeConfiguration(configData, userId);
        
        this.originalLeisureTime = this.leisureTime;
        this.showSuccess = true;
        
        this.$emit('saved', this.leisureTime);

        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);

      } catch (error) {
        console.error('❌ Error guardando configuración:', error);
        this.$emit('error', error.message);
      } finally {
        this.saving = false;
      }
    }
  },
  mounted() {
    this.loadConfiguration();
  }
};
</script>

<style scoped>
.compact-settings-card {
  border-radius: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.time-display-compact {
  padding: 8px 0;
}

.presets-compact {
  max-width: 100%;
}

.preset-chip-compact {
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 40px;
  justify-content: center;
}

.preset-chip-compact:hover {
  transform: scale(1.05);
}

.gap-1 {
  gap: 4px;
}

/* Asegurar que ocupe solo el espacio necesario */
.compact-settings-card {
  width: 100%;
  max-width: 400px;
}

/* Responsive para móviles */
@media (max-width: 600px) {
  .compact-settings-card {
    padding: 16px !important;
    max-width: 100%;
  }
  
  .time-display-compact {
    padding: 4px 0;
  }
}
</style>