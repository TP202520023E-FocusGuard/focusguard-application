<template>
  <v-alert
    v-if="errorMessage"
    type="error"
    class="mb-3"
    density="compact"
    variant="tonal"
  >
    {{ errorMessage }}
  </v-alert>

  <v-progress-circular
    v-if="loading"
    indeterminate
    class="ma-5 d-flex mx-auto"
  />
  
  <v-card class="premium-card pa-5" elevation="0">

    <!-- Header emocional -->
    <div class="text-center mb-5">
      <v-icon :color="currentColor" size="44" class="mb-2">
        mdi-brain
      </v-icon>

      <h2 class="text-h5 font-weight-bold mb-1">
        {{ titleText }}
      </h2>

      <p class="text-caption text--secondary">
        {{ subtitleText }}
      </p>
    </div>

    <!-- Círculo principal -->
    <div class="circle-container mb-6">
      <div class="circle" :style="{ borderColor: currentColor }">
        <div class="circle-inner">
          <span class="time">{{ leisureTime }}</span>
          <span class="label">min</span>
        </div>
      </div>
    </div>

    <!-- Slider elegante -->
    <v-slider
      v-model="leisureTime"
      :min="15"
      :max="180"
      :step="15"
      :color="currentColor"
      thumb-label
      class="mb-4"
    />

    <!-- Presets tipo pills -->
    <div class="d-flex justify-center gap-2 mb-5">
      <v-chip
        v-for="preset in timePresets"
        :key="preset.value"
        @click="leisureTime = preset.value"
        :style="chipStyle(preset.value)"
        class="preset-pill"
      >
        {{ preset.label }}
      </v-chip>
    </div>

    <!-- Insight dinámico -->
    <div class="insight-box mb-5" :style="{ background: currentBg }">
      <span>{{ insightText }}</span>
    </div>

    <!-- Botón -->
    <v-btn
      v-if="hasChanges"
      block
      size="large"
      class="save-btn"
      :style="{ background: currentColor }"
      @click="saveSettings"
      :loading="saving"
    >
      Guardar decisión
    </v-btn>

    <!-- Snackbar -->
    <v-snackbar v-model="showSuccess" timeout="2500">
      Guardado correctamente
    </v-snackbar>

  </v-card>
</template>

<script>
import { apiService } from '../../services/api/api.js';
import { useAuthStore } from '../../stores/authStore.js';

export default {
  data() {
    return {
      leisureTime: 30,
      originalLeisureTime: 30,
      saving: false,
      showSuccess: false,
      loading: true,
      errorMessage: null,

      timePresets: [
        { value: 15, label: "🔥 Enfoque" },
        { value: 30, label: "⚖️ Balance" },
        { value: 60, label: "😌 Chill" }
      ]
    };
  },

  computed: {
    hasChanges() {
      return this.leisureTime !== this.originalLeisureTime;
    },

    currentColor() {
      if (this.leisureTime <= 30) return "#4CAF50";
      if (this.leisureTime <= 60) return "#FF9800";
      return "#F44336";
    },

    currentBg() {
      if (this.leisureTime <= 30) return "#E8F5E9";
      if (this.leisureTime <= 60) return "#FFF3E0";
      return "#FFEBEE";
    },

    titleText() {
      if (this.leisureTime <= 30) return "Modo disciplinado";
      if (this.leisureTime <= 60) return "Buen equilibrio";
      return "Cuidado con el exceso";
    },

    subtitleText() {
      return "Tu relación con el ocio define tu progreso";
    },

    insightText() {
      if (this.leisureTime <= 30) return "Estás priorizando tus objetivos 🚀";
      if (this.leisureTime <= 60) return "Mantienes un balance saludable 👍";
      return "Podrías estar perdiendo foco ⚠️";
    }
  },

  methods: {
    chipStyle(value) {
      return {
        background: this.leisureTime === value ? this.currentColor : "#eee",
        color: this.leisureTime === value ? "#fff" : "#555"
      };
    },

    async loadConfiguration() {
      this.loading = true;
      this.errorMessage = null;

      try {
        const authStore = useAuthStore();
        const userId = authStore.user?.id;

        const res = await apiService.getLeisureTimeByUser(userId);

        this.leisureTime = res?.tiempo_total ?? 30;
        this.originalLeisureTime = this.leisureTime;

      } catch (error) {
        console.error("Error cargando configuración:", error);

        if (!navigator.onLine) {
          this.errorMessage = "Sin conexión a internet";
        } else {
          this.errorMessage = "No se pudo conectar al servidor";
        }

        this.leisureTime = 30;

      } finally {
        this.loading = false;
      }
    },

    sendDataToExtension() {
      const EXTENSION_ID = "bbojhbamnnececlfenffckgabakbdfop";

      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { action: "update-rest-time", newRestTime: this.leisureTime },
          (response) => {
            if (chrome.runtime.lastError) return;
          }
        );
      }
    },

    async saveSettings() {
      if (!this.hasChanges) return;

      this.saving = true;
      this.errorMessage = null;

      try {
        const authStore = useAuthStore();
        const userId = authStore.user?.id;

        this.sendDataToExtension();

        await apiService.updateLeisureTime(userId, {
          tiempo_total: this.leisureTime
        });

        this.originalLeisureTime = this.leisureTime;
        this.showSuccess = true;

      } catch (error) {
        console.error("Error guardando:", error);

        if (!navigator.onLine) {
          this.errorMessage = "Sin conexión a internet";
        } else {
          this.errorMessage = "Error al guardar configuración";
        }

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
.premium-card {
  max-width: 420px;
  margin: auto;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
}

/* Círculo */
.circle-container {
  display: flex;
  justify-content: center;
}

.circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 6px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.circle-inner {
  text-align: center;
}

.time {
  font-size: 36px;
  font-weight: bold;
}

.label {
  font-size: 14px;
  color: #777;
}

/* Chips */
.preset-pill {
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-pill:hover {
  transform: scale(1.08);
}

/* Insight */
.insight-box {
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-size: 13px;
}

/* Botón */
.save-btn {
  color: white;
  border-radius: 12px;
  font-weight: bold;
  text-transform: none;
}

/* Animaciones suaves */
.v-slider {
  transition: all 0.3s ease;
}
</style>