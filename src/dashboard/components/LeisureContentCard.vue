<template>
  <v-card 
    class="leisure-content-card" 
    elevation="2" 
    rounded="lg"
  >
    <v-card-text class="pa-3 pa-sm-4">

      <!-- ========== HEADER ========== -->
      <div class="card-header">
        <div class="header-left">
          <v-icon color="#FF6B35" size="22" class="header-icon">
            mdi-gamepad-variant
          </v-icon>
          <h3 class="card-title">Contenido de Ocio</h3>
        </div>

        <!-- Selector de semana -->
        <div class="week-selector">
          <v-btn 
            icon 
            size="small" 
            variant="text"
            @click="goToPreviousWeek"
            class="week-nav"
            title="Semana anterior"
          >
            <v-icon size="18">mdi-chevron-left</v-icon>
          </v-btn>

          <div class="week-range" @click="openWeekPicker">
            <v-icon size="14" class="mr-1">mdi-calendar-week</v-icon>
            <span>{{ weekRangeText }}</span>
            <v-icon size="14" class="ml-1">mdi-menu-down</v-icon>
          </div>

          <v-btn 
            icon 
            size="small" 
            variant="text"
            @click="goToNextWeek"
            class="week-nav"
            :disabled="isNextWeekDisabled"
            title="Semana siguiente"
          >
            <v-icon size="18">mdi-chevron-right</v-icon>
          </v-btn>

          <v-btn 
            size="small" 
            variant="text"
            @click="goToCurrentWeek"
            class="today-btn"
            :class="{ 'current': isCurrentWeek }"
          >
            <v-icon size="14" class="mr-1">mdi-calendar-today</v-icon>
            Esta semana
          </v-btn>
        </div>
      </div>

      <!-- ========== ESTADÍSTICAS ========== -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalHoursDisplay }}</div>
          <div class="stat-label">Total horas</div>
          <div class="stat-hint">esta semana</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ averageDailyDisplay }}</div>
          <div class="stat-label">Promedio diario</div>
          <div class="stat-hint">por día</div>
        </div>

        <div class="stat-card" v-if="maxDay.hours > 0">
          <div class="stat-value">{{ maxDay.hours }}<span class="stat-unit">h</span></div>
          <div class="stat-label">Día récord</div>
          <div class="stat-hint">{{ maxDay.name }}</div>
        </div>
      </div>

      <!-- ========== GRÁFICO ========== -->
      <div class="chart-section">
        <div class="chart-bars-container">
          <div 
            v-for="(day, index) in weekData" 
            :key="day.name"
            class="bar-item"
            @mouseenter="hoveredDay = index"
            @mouseleave="hoveredDay = null"
          >
            <div class="bar-wrapper">
              <div 
                class="bar"
                :style="{
                  height: getBarHeight(day.hours),
                  backgroundColor: getBarColor(day.hours)
                }"
              >
                <!-- Tooltip mejorado: siempre visible para valores > 0 -->
                <span class="bar-value" v-if="hoveredDay === index && day.hours > 0">
                  {{ formatHours(day.hours) }}
                </span>
                <!-- Indicador visual para valores muy pequeños -->
                <div class="bar-mini-indicator" v-if="day.hours > 0 && day.hours < 0.5"></div>
              </div>
            </div>
            
            <div class="day-name" :class="{ 'weekend': day.isWeekend }">
              {{ getDayShortName(day.name) }}
            </div>
            
            <!-- Mostrar horas formateadas incluso si son pequeñas -->
            <div class="day-hours-mobile" v-if="day.hours > 0">
              {{ formatHours(day.hours) }}
            </div>
          </div>
        </div>

        <div class="legend">
          <div class="legend-item">
            <div class="legend-dot low"></div>
            <span>Bajo (≤2h)</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot medium"></div>
            <span>Medio (2-4h)</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot high"></div>
            <span>Alto (>4h)</span>
          </div>
        </div>
      </div>

      <!-- ========== MENSAJE ========== -->
      <div class="info-message" v-if="getInfoMessage">
        <v-icon size="16" class="info-icon">mdi-information</v-icon>
        <span>{{ getInfoMessage }}</span>
      </div>

    </v-card-text>

    <!-- ========== CALENDARIO FLOTANTE (MODAL) CORREGIDO ========== -->
    <v-dialog 
      v-model="showWeekPicker" 
      max-width="380" 
      persistent
      content-class="week-picker-dialog"
    >
      <v-card class="week-picker-card">
        <v-card-title class="pa-4 pb-2">
          <v-icon color="#FF6B35" class="mr-2">mdi-calendar-week</v-icon>
          Seleccionar semana
          <v-spacer></v-spacer>
          <v-btn icon size="small" variant="text" @click="showWeekPicker = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-4">
          <!-- Selector mes/año -->
          <div class="month-year-selector">
            <v-btn icon size="small" variant="text" @click="previousMonth">
              <v-icon size="20">mdi-chevron-left</v-icon>
            </v-btn>
            <span class="month-year-text">{{ currentPickerMonth }} {{ pickerYear }}</span>
            <v-btn icon size="small" variant="text" @click="nextMonth">
              <v-icon size="20">mdi-chevron-right</v-icon>
            </v-btn>
          </div>

          <!-- Días de la semana -->
          <div class="weekdays-header">
            <span v-for="day in weekDays" :key="day" class="weekday">{{ day }}</span>
          </div>

          <!-- Calendario -->
          <div class="calendar-grid">
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              class="calendar-day"
              :class="{
                'other-month': !day.isCurrentMonth,
                'selected': day.isSelected,
                'today': day.isToday
              }"
              @click="selectWeek(day)"
            >
              <span class="day-number">{{ day.date }}</span>
            </div>
          </div>

          <div class="picker-footer">
            <div class="picker-info">
              <v-icon size="12" class="mr-1">mdi-information-outline</v-icon>
              <span>Haz clic en cualquier día para seleccionar esa semana</span>
            </div>
          </div>
        </v-card-text>
        
        <v-divider></v-divider>
        
        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn 
            variant="text" 
            @click="showWeekPicker = false"
            class="cancel-btn"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { weeklyLeisureHoursService } from "../services/WeeklyLeisureHoursService.js";

// ========== ESTADO ==========
const weekData = ref([])
const startDate = ref(null)
const endDate = ref(null)
const currentAnchorDate = ref(new Date())
const isLoading = ref(false)
const hoveredDay = ref(null)
const showWeekPicker = ref(false)

// Estado del selector de fecha
const pickerYear = ref(new Date().getFullYear())
const pickerMonth = ref(new Date().getMonth())
const selectedPickerDate = ref(new Date())

// Configuración de días
const daysConfig = [
  { name: 'Lunes', short: 'Lun', en: 'Monday', weekend: false },
  { name: 'Martes', short: 'Mar', en: 'Tuesday', weekend: false },
  { name: 'Miércoles', short: 'Mié', en: 'Wednesday', weekend: false },
  { name: 'Jueves', short: 'Jue', en: 'Thursday', weekend: false },
  { name: 'Viernes', short: 'Vie', en: 'Friday', weekend: false },
  { name: 'Sábado', short: 'Sáb', en: 'Saturday', weekend: true },
  { name: 'Domingo', short: 'Dom', en: 'Sunday', weekend: true }
]

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// ========== HELPERS ==========
// Nueva función para formatear horas correctamente
const formatHours = (hours) => {
  if (hours === 0) return '0h'
  if (hours < 0.1) return `${hours.toFixed(2)}h`
  if (hours < 1) return `${hours.toFixed(1)}h`
  return `${hours.toFixed(1)}h`
}

const getWeekRange = (date) => {
  const current = new Date(date)
  const day = current.getDay()
  const diff = current.getDate() - (day === 0 ? 6 : day - 1)
  
  const monday = new Date(current.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  
  return { monday, sunday }
}

const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - (day === 0 ? 6 : day - 1)
  const weekStart = new Date(d.setDate(diff))
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

const isSameWeek = (date1, date2) => {
  const start1 = getWeekStart(date1)
  const start2 = getWeekStart(date2)
  return start1.getTime() === start2.getTime()
}

const formatDateShort = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

const getDayShortName = (fullName) => {
  const day = daysConfig.find(d => d.name === fullName)
  return day ? day.short : fullName.substring(0, 3)
}

const getBarHeight = (hours) => {
  // Configuración de alturas
  const MAX_HEIGHT = 80        // Altura máxima de la barra en píxeles
  const MAX_HOURS = 8          // 8 horas = altura máxima
  const MIN_BAR_HEIGHT = 8     // Altura mínima para cualquier valor > 0

  if (hours === 0) return '0px'
  
  // Calculamos la altura proporcional
  let height = (hours / MAX_HOURS) * MAX_HEIGHT
  
  // Aseguramos la altura mínima
  if (height < MIN_BAR_HEIGHT) {
    height = MIN_BAR_HEIGHT
  }
  
  // Limitamos a la altura máxima
  height = Math.min(height, MAX_HEIGHT)
  
  return `${height}px`
}

const getBarColor = (hours) => {
  if (hours === 0) return '#E0E0E0' // Gris para valores cero
  if (hours <= 2) return '#4CAF50'
  if (hours <= 4) return '#FF9800'
  return '#F44336'
}

// ========== CALENDARIO ==========
const calendarDays = computed(() => {
  const firstDayOfMonth = new Date(pickerYear.value, pickerMonth.value, 1)
  const startDayOfWeek = firstDayOfMonth.getDay()
  const daysFromPrevMonth = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Días del mes anterior
  const prevMonthDate = new Date(pickerYear.value, pickerMonth.value, 0)
  const prevMonthDays = prevMonthDate.getDate()
  
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const dateNum = prevMonthDays - i
    const fullDate = new Date(pickerYear.value, pickerMonth.value - 1, dateNum)
    fullDate.setHours(0, 0, 0, 0)
    
    days.push({
      date: dateNum,
      fullDate,
      isCurrentMonth: false,
      isSelected: isSameWeek(fullDate, selectedPickerDate.value),
      isToday: fullDate.getTime() === today.getTime()
    })
  }
  
  // Días del mes actual
  const daysInMonth = new Date(pickerYear.value, pickerMonth.value + 1, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = new Date(pickerYear.value, pickerMonth.value, i)
    fullDate.setHours(0, 0, 0, 0)
    
    days.push({
      date: i,
      fullDate,
      isCurrentMonth: true,
      isSelected: isSameWeek(fullDate, selectedPickerDate.value),
      isToday: fullDate.getTime() === today.getTime()
    })
  }
  
  // Días del mes siguiente (para completar 42 días = 6 semanas)
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const fullDate = new Date(pickerYear.value, pickerMonth.value + 1, i)
    fullDate.setHours(0, 0, 0, 0)
    
    days.push({
      date: i,
      fullDate,
      isCurrentMonth: false,
      isSelected: isSameWeek(fullDate, selectedPickerDate.value),
      isToday: fullDate.getTime() === today.getTime()
    })
  }
  
  return days
})

const currentPickerMonth = computed(() => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[pickerMonth.value]
})

const previousMonth = () => {
  if (pickerMonth.value === 0) {
    pickerMonth.value = 11
    pickerYear.value--
  } else {
    pickerMonth.value--
  }
}

const nextMonth = () => {
  if (pickerMonth.value === 11) {
    pickerMonth.value = 0
    pickerYear.value++
  } else {
    pickerMonth.value++
  }
}

const selectWeek = (day) => {
  if (!day.fullDate) return
  selectedPickerDate.value = day.fullDate
  const weekStart = getWeekStart(day.fullDate)
  currentAnchorDate.value = weekStart
  loadWeekData()
  showWeekPicker.value = false
}

// ========== CARGAR DATOS ==========
const loadWeekData = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    const { monday, sunday } = getWeekRange(currentAnchorDate.value)
    startDate.value = monday
    endDate.value = sunday

    const toLocalISO = (date) => {
      const pad = (n) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
    
    const mondayStr = toLocalISO(monday);
    const sundayStr = toLocalISO(sunday);
    console.log("=== 🚀 ENVIANDO PETICIÓN AL BACKEND ===");
    console.log("Fecha Inicio (mondayStr):", mondayStr);
    console.log("Fecha Fin (sundayStr):", sundayStr);
    const response = await weeklyLeisureHoursService.getWeeklyLeisureHours(mondayStr, sundayStr)
    console.log("=== 📥 RESPUESTA DEL BACKEND ===");
    console.log("Data cruda recibida:", JSON.parse(JSON.stringify(response)));
    // CORRECCIÓN: Agregamos (config, index) para que 'index' exista y valga de 0 a 6
    const mapped = daysConfig.map((config, index) => {
      const found = response.find(item => {
        const itemDay = item.day?.trim().toLowerCase()
        const configDay = config.en.trim().toLowerCase()
        const itemWeekday = item.weekday !== undefined ? Number(item.weekday) : null
        
        return itemDay === configDay || itemWeekday === index
      })
      
      return {
        name: config.name,
        short: config.short,
        isWeekend: config.weekend,
        hours: found ? Math.round(parseFloat(found.total_hours) * 10) / 10 : 0
      }
    })
    console.log("=== 📊 DATA PROCESADA PARA EL GRÁFICO ===");
    console.log("Array mapped final:", mapped);
    weekData.value = mapped
    
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    isLoading.value = false
  }
}

// ========== NAVEGACIÓN ==========
const goToPreviousWeek = () => {
  const newDate = new Date(currentAnchorDate.value)
  newDate.setDate(newDate.getDate() - 7)
  currentAnchorDate.value = newDate
  loadWeekData()
}

const goToNextWeek = () => {
  const newDate = new Date(currentAnchorDate.value)
  newDate.setDate(newDate.getDate() + 7)
  currentAnchorDate.value = newDate
  loadWeekData()
}

const goToCurrentWeek = () => {
  currentAnchorDate.value = new Date()
  loadWeekData()
}

const openWeekPicker = () => {
  pickerYear.value = currentAnchorDate.value.getFullYear()
  pickerMonth.value = currentAnchorDate.value.getMonth()
  selectedPickerDate.value = currentAnchorDate.value
  showWeekPicker.value = true
}

// ========== COMPUTADOS ==========
const totalHoursDisplay = computed(() => {
  const total = weekData.value.reduce((sum, day) => sum + day.hours, 0)
  return `${total.toFixed(1)}h`
})

const averageDailyDisplay = computed(() => {
  if (weekData.value.length === 0) return '0h'
  const total = weekData.value.reduce((sum, day) => sum + day.hours, 0)
  const avg = total / 7
  return `${avg.toFixed(1)}h`
})

const maxDay = computed(() => {
  if (weekData.value.length === 0) return { hours: 0, name: '' }
  return weekData.value.reduce((max, day) => day.hours > max.hours ? day : max, weekData.value[0])
})

const weekRangeText = computed(() => {
  if (!startDate.value || !endDate.value) return 'Cargando...'
  return `${formatDateShort(startDate.value)} - ${formatDateShort(endDate.value)}`
})

const isCurrentWeek = computed(() => {
  const { monday: currentMonday } = getWeekRange(new Date())
  const { monday: anchorMonday } = getWeekRange(currentAnchorDate.value)
  return currentMonday.getTime() === anchorMonday.getTime()
})

const isNextWeekDisabled = computed(() => {
  const { monday: currentMonday } = getWeekRange(new Date())
  const { monday: anchorMonday } = getWeekRange(currentAnchorDate.value)
  return anchorMonday >= currentMonday
})

const getInfoMessage = computed(() => {
  const total = weekData.value.reduce((sum, day) => sum + day.hours, 0)
  
  if (total === 0) {
    return 'No hay registros de actividad esta semana'
  }
  
  if (total <= 7) {
    return '✅ ¡Muy bien! Has mantenido un uso moderado del contenido de ocio'
  }
  
  if (total <= 14) {
    return 'ℹ️ Has dedicado un tiempo razonable al ocio esta semana'
  }
  
  if (total <= 21) {
    return '⚠️ El tiempo de ocio está por encima de lo recomendado (3h/día)'
  }
  
  return '🔴 Atención: El tiempo de ocio es muy elevado. Considera equilibrar con otras actividades'
})

// ========== INICIALIZACIÓN ==========
onMounted(() => {
  loadWeekData()
})
</script>

<style scoped>
.leisure-content-card {
  background: white;
  border-radius: 16px !important;
  transition: box-shadow 0.2s ease;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  background: rgba(255, 107, 53, 0.12);
  padding: 6px;
  border-radius: 10px;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.week-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 40px;
}

.week-nav {
  background: white !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.week-nav:hover:not(:disabled) {
  background: #FF6B35 !important;
  color: white !important;
}

.week-nav:disabled {
  opacity: 0.3;
}

.week-range {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #FF6B35;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.week-range:hover {
  background: #fff5f0;
}

.today-btn {
  font-size: 0.7rem !important;
  text-transform: none !important;
  background: white !important;
}

.today-btn.current {
  background: rgba(255, 107, 53, 0.1) !important;
  color: #FF6B35;
}

/* ========== ESTADÍSTICAS ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
  padding: 12px 8px;
  background: #f8f9fa;
  border-radius: 14px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #FF6B35;
  line-height: 1.2;
}

.stat-unit {
  font-size: 0.7rem;
  font-weight: 500;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #666;
  margin-top: 4px;
}

.stat-hint {
  font-size: 0.6rem;
  color: #999;
  margin-top: 2px;
}

/* ========== GRÁFICO ========== */
.chart-section {
  margin-bottom: 16px;
}

.chart-bars-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  padding: 24px 4px 8px; /* Aumentado padding superior para el tooltip */
  background: #fafafa;
  border-radius: 16px;
  min-height: 140px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-wrapper {
  height: 90px; /* Aumentado para dar espacio al tooltip */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}

.bar {
  width: 100%;
  max-width: 40px; /* Ligéramente más ancho para mejor visibilidad */
  min-width: 24px;
  border-radius: 6px 6px 4px 4px;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.bar:hover {
  transform: scaleX(1.05);
  filter: brightness(1.05);
}

.bar-value {
  position: absolute;
  top: -28px; /* Ajustado para que no se corte */
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  font-weight: 600;
  color: #FF6B35;
  background: white;
  padding: 2px 8px;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}

/* Indicador visual para valores muy pequeños */
.bar-mini-indicator {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: #FF6B35;
  border-radius: 50%;
  opacity: 0.8;
  box-shadow: 0 0 0 1px white;
}

.day-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #555;
}

.day-name.weekend {
  color: #FF6B35;
}

.day-hours-mobile {
  display: none;
  font-size: 0.65rem;
  font-weight: 500;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 12px;
  margin-top: 4px;
}

/* ========== LEYENDA ========== */
.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.legend-dot.low { background: #4CAF50; }
.legend-dot.medium { background: #FF9800; }
.legend-dot.high { background: #F44336; }

/* ========== MENSAJE ========== */
.info-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f0f7ff;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #1a1a1a;
  margin-top: 16px;
}

.info-icon {
  color: #2196F3;
  flex-shrink: 0;
}

/* ========== CALENDARIO FLOTANTE ========== */
.week-picker-card {
  border-radius: 20px !important;
  overflow: hidden;
  background: white !important;
}

.month-year-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 4px;
}

.month-year-text {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;
}

.weekday {
  font-size: 0.8rem;
  font-weight: 600;
  color: #999;
  padding: 8px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
  position: relative;
}

.calendar-day:hover {
  background: rgba(255, 107, 53, 0.15);
}

.calendar-day.other-month {
  opacity: 0.4;
}

.calendar-day.selected {
  background: #FF6B35;
  color: white;
}

.calendar-day.selected .day-number {
  color: white;
  font-weight: 600;
}

.calendar-day.today {
  border: 2px solid #FF6B35;
}

.calendar-day.today .day-number {
  font-weight: 700;
}

.day-number {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.picker-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.picker-info {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #999;
}

.cancel-btn {
  color: #666 !important;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 600px) {
  .stats-grid {
    gap: 8px;
  }
  
  .stat-card {
    padding: 8px 4px;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .chart-bars-container {
    gap: 6px;
    padding: 20px 2px 8px;
  }
  
  .bar {
    min-width: 20px;
  }
  
  .bar-wrapper {
    height: 80px;
  }
  
  .day-name {
    font-size: 0.65rem;
  }
  
  .day-hours-mobile {
    display: block;
  }
  
  .week-range span {
    font-size: 0.7rem;
  }
  
  .today-btn span {
    display: none;
  }
  
  .today-btn {
    min-width: 36px !important;
    padding: 0 8px !important;
  }
}

@media (max-width: 400px) {
  .week-range span {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<!-- ESTILOS GLOBALES (fuera de scoped para el modal) -->
<style>
/* Estos estilos son para el dialog - deben estar fuera de scoped */
.week-picker-dialog {
  background: transparent !important;
}

.week-picker-dialog .v-card {
  background: white !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
}

/* Overlay de fondo oscuro */
.v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

/* Asegurar que el dialog tenga z-index alto */
.v-overlay-container {
  z-index: 9999 !important;
}
</style>