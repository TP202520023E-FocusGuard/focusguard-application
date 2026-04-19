<template>
  <v-card 
    class="objective-card" 
    :class="tipoClase"
    variant="outlined" 
    elevation="0"
    @click="$emit('click', objective)"
  >
    <div class="card-content">
      <!-- Header: icono + texto -->
      <div class="card-header">
        <div class="icono-container" :class="tipoClase">
          <v-icon size="16" class="tipo-icono">{{ tipoIcono }}</v-icon>
        </div>
        
        <div class="objetivo-texto">
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
      
      <!-- Progreso: cronómetro + barra -->
      <div class="progreso-section">
        <div class="cronometro">
          <v-icon size="12" class="timer-icon">mdi-timer-outline</v-icon>
          <span class="tiempo-valor">{{ tiempoFormateado }}</span>
        </div>
        
        <div class="barra-container">
          <v-progress-linear
            :model-value="porcentajeProgreso"
            :color="barraColor"
            height="4"
            rounded
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
    // Tipo: '+' para aumentar, '-' para reducir
    esAumentar() {
      return this.objective.opcion_1 === 1;
    },
    
    tipoClase() {
      return this.esAumentar ? 'objetivo-mas' : 'objetivo-menos';
    },
    
    tipoIcono() {
      return this.esAumentar ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
    },
    
    barraColor() {
      return this.esAumentar ? 'success' : 'warning';
    },
    
    // Extraer categoría del texto
    categoria() {
      const texto = this.objective.text || '';
      const match = texto.match(/en\s+(.+)$/);
      return match ? match[1] : '';
    },
    
    // Texto del objetivo
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
    
    // Tiempo objetivo en minutos
    tiempoObjetivoMinutos() {
      return this.objective.tiempo_objetivo || this.objective.tiempo || 0;
    },
    
    // Tiempo actual en minutos (desde el backend)
    tiempoActualMinutos() {
      return this.objective.tiempo_actual || 0;
    },
    
    // Porcentaje de progreso (desde el backend)
    porcentajeProgreso() {
      return this.objective.porcentaje_progreso || 0;
    },
    
    // Tiempo formateado para mostrar
    tiempoFormateado() {
      const minutos = this.tiempoActualMinutos;
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      
      if (horas > 0 && mins > 0) {
        return `${horas}h ${mins}m`;
      }
      if (horas > 0) {
        return `${horas}h`;
      }
      return `${mins}m`;
    },
    
    // Meta formateada
    metaTexto() {
      const minutos = this.tiempoObjetivoMinutos;
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      
      if (horas > 0 && mins > 0) {
        return `${horas}h ${mins}m`;
      }
      if (horas > 0) {
        return `${horas}h`;
      }
      return `${mins}m`;
    },
    
    // Estado completado (desde el backend)
    estaCompletado() {
      return this.objective.completado === true;
    }
  }
};
</script>


<style scoped>
.objective-card {
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: white;
  border: 1px solid #e8ecef;
}

.objective-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.objective-card.objetivo-mas {
  border-left: 3px solid #4caf50;
}

.objective-card.objetivo-menos {
  border-left: 3px solid #ff9800;
}

.card-content {
  padding: 10px 12px;
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.icono-container {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icono-container.objetivo-mas {
  background: rgba(76, 175, 80, 0.15);
}

.icono-container.objetivo-menos {
  background: rgba(255, 152, 0, 0.15);
}

.tipo-icono {
  font-size: 14px;
}

.icono-container.objetivo-mas .tipo-icono {
  color: #2e7d32;
}

.icono-container.objetivo-menos .tipo-icono {
  color: #e65100;
}

.objetivo-texto {
  flex: 1;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.delete-btn {
  opacity: 0.4;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

/* Progreso */
.progreso-section {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 8px;
}

.cronometro {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}

.timer-icon {
  color: #666;
}

.tiempo-valor {
  font-size: 0.7rem;
  font-weight: 700;
  color: #333;
}

.barra-container {
  flex: 1;
}

.meta {
  flex-shrink: 0;
}

.meta-texto {
  font-size: 0.6rem;
  color: #999;
  font-weight: 500;
}

/* Completado */
.objective-card.completado {
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 500px) {
  .card-content {
    padding: 8px 10px;
  }
  
  .objetivo-texto {
    font-size: 0.75rem;
  }
  
  .tiempo-valor {
    font-size: 0.65rem;
  }
}
</style>