<template>
  <v-card 
    class="rest-time-card" 
    elevation="2" 
    rounded="lg"
    hover
  >
    <v-card-text class="pa-3 text-center">
      <div class="card-header">
        <v-icon :color="circleColor" size="20" class="header-icon">mdi-bed-clock</v-icon>
        <h3 class="card-title">Tiempo de Descanso</h3>
      </div>
      
      <div class="progress-section">
        <div class="circular-progress">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle
              cx="45"
              cy="45"
              r="38"
              stroke="#E0E0E0"
              stroke-width="6"
              fill="none"
            />
            <circle
              cx="45"
              cy="45"
              r="38"
              :stroke="circleColor"
              stroke-width="6"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
            />
          </svg>
          
          <div class="progress-content">
            <div class="time-remaining" :style="{ color: circleColor }">
              {{ formatTime(timeRemaining) }}
            </div>
            <div class="time-label">restante</div>
          </div>
        </div>
        
        <div class="time-info">
          <div class="time-item used">
            <v-icon size="12" color="#2196F3" class="mr-1">mdi-clock-check</v-icon>
            <span>Usado: {{ formatTime(timeUsed) }}</span>
          </div>
          <div class="time-item total">
            <v-icon size="12" :color="circleColor" class="mr-1">mdi-clock-outline</v-icon>
            <span>Total: {{ formatTime(totalTime) }}</span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiService } from '../../services/api/api.js';
import { useAuthStore } from '../../stores/authStore.js';

const authStore = useAuthStore()
const timeUsed = ref(0) // minutos usados
const totalTime = ref(0) // minutos totales

const timeRemaining = computed(() => totalTime.value - timeUsed.value)

const progressPercentage = computed(() => {
  if (!totalTime.value) return 0
  return (timeRemaining.value / totalTime.value) * 100
})

const circumference = computed(() => 2 * Math.PI * 38)

const strokeDashoffset = computed(() => {
  return circumference.value - (progressPercentage.value / 100) * circumference.value
})

const circleColor = computed(() => {
  if (progressPercentage.value >= 50) return '#4CAF50' // Verde - tiempo suficiente
  if (progressPercentage.value >= 25) return '#FF9800' // Naranja - tiempo medio
  return '#F44336' // Rojo - poco tiempo
})

const formatTime = (minutes) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  return `${minutes}m`
}

const sendDataToExtension = () => {
  const EXTENSION_ID = "bbojhbamnnececlfenffckgabakbdfop";

  // SOLICITAR DATOS A LA EXTENSIÓN
  // Verificamos si se tiene instalada la extensión y si está configurada su comunicación en el manifest
  if (typeof chrome !== "undefined" && chrome.runtime) {

    chrome.runtime.sendMessage(EXTENSION_ID, { action: "GET_CONSUMED_TIME" }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("La extensión no está instalada o no es accesible.");
        return;
      }

      if (response && response.status === "success") {
        timeUsed.value = response.timeUsed;
        console.log("Datos sincronizados con la extensión", response);
      }
      else console.log("Sincronización falla:", response);
    });

  } else console.warn("La extensión no está instalada o no se tiene configurado el puente de comunicación.");
}

const loadRestTime = async () => {
  try {

    const userId = authStore.user?.id
    const data = await apiService.getLeisureTimeByUser(userId)
    timeUsed.value = Number(data?.tiempo_usado ?? 0)
    totalTime.value = Number(data?.tiempo_total ?? 60)

    sendDataToExtension(); // Connexion con la extensión

  } catch (error) {
    console.error("Error cargando tiempo de descanso:", error)
    totalTime.value = 60
    timeUsed.value = 0
  }
}

onMounted(() => {
  loadRestTime()
})

</script>

<style scoped>
.rest-time-card {
  height: 100%;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.rest-time-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.header-icon {
  padding: 5px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.rest-time-card:hover .header-icon {
  transform: scale(1.05);
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
}

.progress-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.circular-progress {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circular-progress svg {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
}

.progress-content {
  text-align: center;
  z-index: 1;
}

.time-remaining {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 2px;
  transition: color 0.5s ease;
}

.time-label {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 120px;
}

.time-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.time-item.used {
  color: #2196F3;
  background: rgba(33, 150, 243, 0.05);
}

.time-item.total {
  background: rgba(0, 0, 0, 0.03);
}

.time-item:hover {
  transform: translateX(2px);
}

/* Animación suave para el círculo */
.circular-progress circle {
  transition: all 0.8s ease-in-out;
}
</style>