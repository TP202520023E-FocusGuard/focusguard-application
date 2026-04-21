<template>
  <v-card 
    class="objective-card" 
    :class="[tipoClase, { 'card-error-exceeded': mostrarErrorExceso }]"
    variant="outlined" 
    elevation="0"
    @click="$emit('click', objective)"
  >
    <div class="card-content">
      <div class="card-header">
        <div class="icono-container" :class="tipoClase">
          <v-icon size="16" class="tipo-icono">{{ tipoIcono }}</v-icon>
        </div>
        
        <div class="objetivo-texto" :class="{ 'text-error-bold': mostrarErrorExceso }">
          {{ textoObjetivo }}
        </div>
        
        <v-btn
          icon
          size="x-small"
          variant="text"
          color="error"
          class="delete-btn"
          @click.stop="$emit('delete', objective.id)"
        >
          <v-icon size="14">mdi-delete-outline</v-icon>
        </v-btn>
      </div>
      
      <div class="progreso-section" :class="{ 'progreso-error': mostrarErrorExceso }">
        <div class="cronometro" :class="cronometroClase">
          <v-icon size="12" class="timer-icon" :color="timerIconColor">
            {{ estaCompletado ? 'mdi-check-circle' : 'mdi-timer-outline' }}
          </v-icon>
          <span class="tiempo-valor">{{ tiempoFormateado }}</span>
        </div>
        
        <div class="barra-container">
          <v-progress-linear
            :model-value="porcentajeVisual"
            :color="barraColor"
            height="4"
            rounded
            :striped="mostrarErrorExceso"
          ></v-progress-linear>
        </div>
        
        <div class="meta">
          <span class="meta-texto">/ {{ metaTexto }}</span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ObjectiveCard",
  props: {
    objective: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Tipo: '+' para aumentar (1), '-' para reducir (2)
    esAumentar() {
      return this.objective.opcion_1 === 1;
    },

    estaCompletado() {
      return this.objective.completado === true;
    },

    // Nueva: Detecta si se pasó del límite en objetivos de tipo "menos"
    mostrarErrorExceso() {
      return !this.esAumentar && !this.estaCompletado;
    },
    
    tipoClase() {
      return this.esAumentar ? 'objetivo-mas' : 'objetivo-menos';
    },
    
    tipoIcono() {
      return this.esAumentar ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
    },
    
    barraColor() {
      if (this.esAumentar) {
        return this.estaCompletado ? 'success' : 'warning';
      } else {
        // Rojo si se pasó del límite, verde si sigue cumpliendo
        return this.estaCompletado ? 'success' : 'error';
      }
    },

    timerIconColor() {
      if (this.mostrarErrorExceso) return 'error';
      return this.estaCompletado ? 'success' : '';
    },
    
    // Extraer categoría del texto
    categoria() {
      const texto = this.objective.text || '';
      const match = texto.match(/en\s+(.+)$/);
      return match ? match[1] : '';
    },
    
    textoObjetivo() {
      const tiempo = this.objective.tiempo_objetivo || this.objective.tiempo || 0;
      const horas = Math.floor(tiempo / 60);
      const minutos = tiempo % 60;
      
      let tiempoStr = '';
      if (horas > 0) tiempoStr += `${horas}h`;
      if (minutos > 0) tiempoStr += `${minutos}m`;
      if (!tiempoStr) tiempoStr = '0m';
      
      const signo = this.esAumentar ? '+' : '-';
      
      if (this.categoria) {
        return `${signo} ${tiempoStr} en ${this.categoria}`;
      }
      return `${signo} ${tiempoStr}`;
    },
    
    tiempoActualMinutos() {
      return this.objective.tiempo_actual || 0;
    },
    
    porcentajeProgreso() {
      return this.objective.porcentaje_progreso || 0;
    },

    porcentajeVisual() {
      // Muestra la barra llena si se pasó del límite
      return Math.min(100, this.porcentajeProgreso);
    },
    
    tiempoFormateado() {
      const minutos = this.tiempoActualMinutos; // Aquí viene el decimal
      
      if (minutos > 0 && minutos < 1) {
        // Si es menos de un minuto, muestra segundos o decimal
        return `${(minutos * 60).toFixed(0)}s`; 
        // O si prefieres decimales: return `${minutos.toFixed(1)}m`;
      }

      const horas = Math.floor(minutos / 60);
      const mins = Math.floor(minutos % 60); // Math.floor puede convertir 0.9 en 0
      
      if (horas > 0) return `${horas}h ${mins}m`;
      return `${mins}m`;
    },
    
    metaTexto() {
      const minutos = this.objective.tiempo_objetivo || this.objective.tiempo || 0;
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      
      if (horas > 0) return `${horas}h ${mins}m`;
      return `${mins}m`;
    },
    
    cronometroClase() {
      if (this.mostrarErrorExceso) return 'text-error font-weight-bold';
      return this.estaCompletado ? 'text-success font-weight-bold' : 'text-grey-darken-1';
    }
  }
};
</script>

<style scoped>
.objective-card {
  border-radius: 12px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: white;
  border: 1px solid #e8ecef;
  position: relative;
  overflow: hidden;
}

.objective-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* Bordes laterales de tipo */
.objective-card.objetivo-mas { border-left: 4px solid #4caf50; }
.objective-card.objetivo-menos { border-left: 4px solid #ff9800; }

/* Estado de Error (Cuando se pasa del límite) */
.card-error-exceeded {
  border: 1.5px solid rgb(var(--v-theme-error)) !important;
  background-color: rgba(var(--v-theme-error), 0.02);
}

.text-error-bold {
  color: rgb(var(--v-theme-error)) !important;
  font-weight: 800;
}

.card-content { padding: 12px; }

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.icono-container {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono-container.objetivo-mas { background: rgba(76, 175, 80, 0.12); color: #2e7d32; }
.icono-container.objetivo-menos { background: rgba(255, 152, 0, 0.12); color: #e65100; }

.objetivo-texto {
  flex: 1;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
}

.progreso-section {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fcfdfe;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #f0f2f5;
}

.progreso-error {
  background: rgba(var(--v-theme-error), 0.05);
  border-color: rgba(var(--v-theme-error), 0.1);
}

.cronometro { display: flex; align-items: center; gap: 4px; }

.tiempo-valor { font-size: 0.75rem; }

.barra-container { flex: 1; }

.meta-texto {
  font-size: 0.65rem;
  color: #94a3b8;
  font-weight: 600;
}

.text-error { color: rgb(var(--v-theme-error)) !important; }
.text-success { color: rgb(var(--v-theme-success)) !important; }
</style>