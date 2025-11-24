<template>
  <!-- Contenedor principal -->
  <div class="objectives-container">
    <v-card variant="outlined" class="objectives-section pa-3 compact-card" elevation="1">
      <!-- Header compacto -->
      <div class="section-header compact-header">
        <div class="icon-wrapper compact-icon">
          <v-icon color="white" size="20">mdi-calendar-check</v-icon>
        </div>
        <div class="header-text">
          <h2 class="section-title compact-title">Objetivos Semanales</h2>
          <p class="section-subtitle compact-subtitle">
            Objetivos de esta semana
          </p>
        </div>
      </div>

      <!-- Estadísticas compactas -->
      <div v-if="objectives.length > 0" class="objectives-stats compact-stats">
        <v-chip variant="flat" color="success" size="x-small" density="compact" class="stats-chip">
          <v-icon start size="12">mdi-check</v-icon>
          {{ completedCount }}
        </v-chip>
        <v-chip variant="flat" color="warning" size="x-small" density="compact" class="stats-chip">
          <v-icon start size="12">mdi-progress-clock</v-icon>
          {{ pendingCount }}
        </v-chip>
        <v-chip variant="outlined" color="primary" size="x-small" density="compact" class="stats-chip">
          <v-icon start size="12">mdi-format-list-bulleted</v-icon>
          {{ objectives.length }}
        </v-chip>
      </div>

      <!-- Grid de objetivos -->
      <div class="objectives-grid" :class="{ 'has-items': objectives.length > 0 }">
        <ObjectiveCard
          v-for="objective in objectives"
          :key="objective.id"
          :objective="objective"
          @statusChange="onObjectiveStatusChange"
          @click="openEditDialog(objective)"
          @delete="onDeleteObjective"
          class="grid-objective-card"
        />
        
        <!-- Estado vacío -->
        <div v-if="objectives.length === 0" class="empty-state grid-empty">
          <v-icon size="40" color="grey lighten-2" class="empty-icon">mdi-format-list-checks</v-icon>
          <h3 class="empty-title">Sin objetivos</h3>
          <p class="empty-subtitle">Agrega tus primeros objetivos</p>
        </div>
      </div>

      <!-- Botón mejorado -->
      <div class="actions-section compact-actions">
        <v-btn 
          color="primary" 
          size="small"
          @click="openNewObjectiveDialog"
          class="new-objective-btn enhanced-btn"
          rounded="lg"
          block
          :elevation="2"
        >
          <v-icon start size="18" class="btn-icon">mdi-target</v-icon>
          <span class="btn-text">Nuevo Objetivo</span>
          <v-icon end size="14" class="btn-arrow">mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </v-card>

    <!-- DIÁLOGO PARA NUEVO/EDITAR OBJETIVO -->
    <NewObjectiveDialog
      v-model:dialog="showNewObjectiveDialog"
      :objective-to-edit="objectiveToEdit"
      @guardar="onGuardarObjetivo"
    />
  </div>
</template>

<script>
import ObjectiveCard from './ObjectiveCard.vue';
import NewObjectiveDialog from './ObjectiveDialog.vue';
import { apiService } from '../../services/api/api';

export default {
  name: "ObjectivesSection",
  components: {
    ObjectiveCard,
    NewObjectiveDialog
  },
  emits: ['objectiveAdded', 'objectiveUpdated', 'objectiveDeleted'],
  data() {
    return {
      objectives: [
      ],
      showNewObjectiveDialog: false,
      objectiveToEdit: null
    };
  },
  computed: {
    completedCount() {
      return this.objectives.filter(obj => obj.completed).length;
    },
    pendingCount() {
      return this.objectives.filter(obj => !obj.completed).length;
    }
  },
  methods: {
    // MÉTODO NUEVO: Abrir diálogo para editar objetivo
    openEditDialog(objective) {
      this.objectiveToEdit = objective;
      this.showNewObjectiveDialog = true;
    },

    // MÉTODO NUEVO: Abrir diálogo para nuevo objetivo
    openNewObjectiveDialog() {
      this.objectiveToEdit = null;
      this.showNewObjectiveDialog = true;
    },

    onGuardarObjetivo(objetivoData) {
      if (objetivoData.id) {
        // Modo edición
        const index = this.objectives.findIndex(obj => obj.id === objetivoData.id);
        if (index !== -1) {
          this.objectives[index] = {
            ...this.objectives[index],
            text: objetivoData.texto,
            datos: objetivoData
          };
          this.$emit('objectiveUpdated', { id: objetivoData.id, ...objetivoData });
        }
      } else {
        // Nuevo objetivo
        const newObjective = {
          id: Date.now(),
          text: objetivoData.texto,
          completed: false,
          createdAt: new Date(),
          datos: objetivoData
        };
        this.objectives.push(newObjective);
        this.$emit('objectiveAdded', newObjective);
      }
      
      this.showNewObjectiveDialog = false;
      this.objectiveToEdit = null;
    },
    
    onObjectiveStatusChange(change) {
      this.$emit('objectiveUpdated', change);
    },
    
    onDeleteObjective(objectiveId) {
      this.objectives = this.objectives.filter(obj => obj.id !== objectiveId);
      this.$emit('objectiveDeleted', objectiveId);
    }
  }
};
</script>

<style scoped>
/* (Mantén todos los estilos que ya tienes) */
/* CONTENEDOR PRINCIPAL */
.objectives-container {
  position: relative;
  height: 100%;
}

/* ESTILOS DEL CARD PRINCIPAL */
.objectives-section {
  border-radius: 12px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  border: 1px solid #e0e0e0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.compact-card {
  min-height: 200px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.compact-header {
  margin-bottom: 8px;
}

.icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.compact-icon {
  padding: 6px;
  border-radius: 8px;
}

.header-text {
  flex: 1;
  min-width: 0;
}

.section-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.compact-title {
  font-size: 1rem;
}

.section-subtitle {
  color: #666;
  font-size: 0.8rem;
  margin: 2px 0 0 0;
  line-height: 1.2;
}

.compact-subtitle {
  font-size: 0.75rem;
}

.objectives-stats {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.compact-stats {
  margin-bottom: 8px;
}

.stats-chip {
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* GRID DE OBJETIVOS */
.objectives-grid {
  flex: 1;
  margin-bottom: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  align-content: start;
  overflow-y: auto;
  max-height: 320px;
  padding: 4px;
}

.grid-objective-card {
  min-height: 80px;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.grid-empty {
  padding: 30px 20px;
}

.empty-icon {
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #666;
}

.empty-subtitle {
  font-size: 0.8rem;
  margin: 0;
}

.actions-section {
  flex-shrink: 0;
}

.compact-actions {
  margin-top: auto;
}

/* BOTÓN MEJORADO */
.enhanced-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  height: 40px !important;
}

.enhanced-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.enhanced-btn:hover::before {
  left: 100%;
}

.enhanced-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
}

.enhanced-btn:active {
  transform: translateY(0);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.enhanced-btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-text {
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-arrow {
  transition: transform 0.3s ease;
  opacity: 0.9;
}

.enhanced-btn:hover .btn-arrow {
  transform: translateX(2px);
}

/* Efecto de pulso sutil */
@keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.enhanced-btn {
  animation: subtle-pulse 3s ease-in-out infinite;
}

/* OVERLAY PARA EL DIÁLOGO */
.v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.6) !important;
}

.v-overlay__content {
  z-index: 3000 !important;
}

.objectives-container {
  position: relative;
  z-index: 1;
}

/* RESPONSIVE DEL GRID */
@media (max-width: 768px) {
  .objectives-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 6px;
    max-height: 250px;
  }
  
  .grid-objective-card {
    min-height: 70px;
  }
}

@media (max-width: 480px) {
  .objectives-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 4px;
  }
}

/* Scroll personalizado */
.objectives-grid::-webkit-scrollbar {
  width: 4px;
}

.objectives-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.objectives-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.objectives-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>