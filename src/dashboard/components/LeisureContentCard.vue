<template>
  <v-card 
    class="leisure-content-card" 
    elevation="2" 
    rounded="lg"
    hover
  >
    <v-card-text class="pa-3">
      <div class="card-header">
        <v-icon color="#FF6B35" size="20" class="header-icon">mdi-gamepad-variant</v-icon>
        <h3 class="card-title">Contenido de Ocio</h3>
        <div class="time-frame">Esta semana</div>
      </div>
      
      <div class="stats-summary">
        <div class="stat-item">
          <div class="stat-value">{{ totalHours }}h</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ averageDaily }}h</div>
          <div class="stat-label">Prom/día</div>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-bars">
          <div 
            v-for="day in weekData" 
            :key="day.name"
            class="chart-bar-container"
            @mouseenter="hoverDay = day.name"
            @mouseleave="hoverDay = null"
          >
            <div class="bar-tooltip" v-if="hoverDay === day.name">
              {{ day.hours }}h
            </div>
            <div class="chart-bar-wrapper">
              <div 
                class="chart-bar" 
                :style="{ height: getBarHeight(day.hours) }"
                :class="{ 
                  'low': day.hours <= 2,
                  'medium': day.hours > 2 && day.hours <= 4,
                  'high': day.hours > 4,
                  'hovered': hoverDay === day.name
                }"
              ></div>
            </div>
            <div class="day-label" :class="{ 'highlighted': hoverDay === day.name }">
              {{ day.name }}
            </div>
          </div>
        </div>
        
        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-color low"></div>
            <span>Bajo</span>
          </div>
          <div class="legend-item">
            <div class="legend-color medium"></div>
            <span>Medio</span>
          </div>
          <div class="legend-item">
            <div class="legend-color high"></div>
            <span>Alto</span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const hoverDay = ref(null)

const weekData = ref([
  { name: 'Lun', hours: 2, isWeekend: false },
  { name: 'Mar', hours: 3, isWeekend: false },
  { name: 'Mié', hours: 1, isWeekend: false },
  { name: 'Jue', hours: 4, isWeekend: false },
  { name: 'Vie', hours: 2, isWeekend: false },
  { name: 'Sáb', hours: 6, isWeekend: true },
  { name: 'Dom', hours: 5, isWeekend: true }
])

const totalHours = computed(() => {
  return weekData.value.reduce((total, day) => total + day.hours, 0)
})

const averageDaily = computed(() => {
  return (totalHours.value / 7).toFixed(1)
})

const getBarHeight = (hours) => {
  const maxHeight = 70
  const maxHours = 8
  return `${(hours / maxHours) * maxHeight}px`
}
</script>

<style scoped>
.leisure-content-card {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.leisure-content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.header-icon {
  background: rgba(255, 107, 53, 0.1);
  padding: 5px;
  border-radius: 6px;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
  flex: 1;
}

.time-frame {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
}

.stats-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #FF6B35;
  line-height: 1;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 4px;
  height: 90px;
  padding: 8px 0;
  position: relative;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  position: relative;
}

.bar-tooltip {
  position: absolute;
  top: -30px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 10;
  white-space: nowrap;
}

.bar-tooltip::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 3px solid rgba(0, 0, 0, 0.9);
}

.chart-bar-wrapper {
  height: 70px;
  display: flex;
  align-items: end;
  width: 100%;
  max-width: 24px;
  position: relative;
}

.chart-bar {
  width: 100%;
  border-radius: 3px 3px 0 0;
  transition: all 0.3s ease;
  position: relative;
  min-height: 4px;
}

.chart-bar.low {
  background: linear-gradient(to top, #4CAF50, #66BB6A);
}

.chart-bar.medium {
  background: linear-gradient(to top, #FF9800, #FFB74D);
}

.chart-bar.high {
  background: linear-gradient(to top, #F44336, #EF5350);
}

.chart-bar.hovered {
  transform: scale(1.1);
  filter: brightness(1.1);
}

.day-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  transition: all 0.2s ease;
}

.day-label.highlighted {
  color: #FF6B35;
  transform: scale(1.1);
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.7);
}

.legend-color {
  width: 8px;
  height: 8px;
  border-radius: 1px;
}

.legend-color.low {
  background: #4CAF50;
}

.legend-color.medium {
  background: #FF9800;
}

.legend-color.high {
  background: #F44336;
}
</style>