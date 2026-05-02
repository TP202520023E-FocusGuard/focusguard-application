<template>
  <v-card variant="outlined" class="goals-section pa-3 compact-card" elevation="1">
    <div class="section-header compact-header">
      <div class="icon-wrapper compact-icon">
        <v-icon color="white" size="20">mdi-trophy</v-icon>
      </div>
      <div class="header-text">
        <h2 class="section-title compact-title">Meta Principal</h2>
        <p class="section-subtitle compact-subtitle">
          Meta que quieres alcanzar
        </p>
      </div>
    </div>

    <div class="goal-content compact-content">
      <div v-if="!savedGoal" class="goal-edit compact-edit">
        <v-textarea
          v-model="currentGoal"
          label="Describe tu meta principal"
          variant="outlined"
          rows="2"
          auto-grow
          hide-details
          class="goal-textarea compact-textarea"
          placeholder="Ej: Aprender Vue.js avanzado, Completar proyecto X..."
          color="primary"
          density="compact"
        ></v-textarea>
        
        <v-btn 
          color="primary" 
          size="small"
          @click="saveGoal"
          :disabled="!currentGoal.trim() || loading"
          :loading="loading"
          class="goal-save-btn enhanced-save-btn"
          rounded="lg"
          :elevation="2"
        >
          <template v-slot:loader>
            <v-progress-circular
              indeterminate
              size="16"
              width="2"
            ></v-progress-circular>
          </template>
          <v-icon start size="18" class="btn-icon">mdi-check-circle</v-icon>
          <span class="btn-text">{{ loading ? 'Guardando...' : 'Guardar Meta' }}</span>
          <v-icon end size="14" class="btn-arrow">mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <v-card v-else variant="flat" class="saved-goal-card compact-saved">
        <div class="saved-goal-content compact-saved-content">
          <div class="saved-goal-text">
            <div class="saved-label compact-label">Tu meta:</div>
            <div class="saved-goal compact-goal">{{ savedGoal }}</div>
          </div>
          <div class="saved-goal-actions">
            <v-btn 
              icon 
              variant="text" 
              size="x-small"
              @click="editGoal"
              color="primary"
              class="edit-btn enhanced-edit-btn"
            >
              <v-icon size="16">mdi-pencil</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import { goalsService } from '../../goals/services/GoalsService';
import { useAuthStore } from '../../stores/authStore';

export default {
  name: "GoalSection",
  emits: ['goalSaved'],
  data() {
    return {
      currentGoal: '',
      savedGoal: '',
      goalId: null,
      loading: false
    };
  },
  async mounted() {
    // Cargar la meta existente al iniciar
    await this.loadExistingGoal();
  },
  methods: {
    async loadExistingGoal() {
      try {
        const existingGoal = await goalsService.getGoal();
        if (existingGoal) {
          this.savedGoal = existingGoal.texto;
          this.goalId = existingGoal.id;
        }
      } catch (error) {
        console.error('Error cargando meta existente:', error);
      }
    },

    async saveGoal() {
      if (this.currentGoal.trim()) {
        this.loading = true;
        try {
          const goalData = {
            texto: this.currentGoal.trim()
          };

          const savedGoal = await goalsService.saveGoal(goalData);

          this.savedGoal = savedGoal.texto;
          this.goalId = savedGoal.id;
          this.currentGoal = '';

          this.$emit('goalSaved', this.savedGoal);
        } catch (error) {
          console.error('Error guardando meta:', error);
        } finally {
          this.loading = false;
        }
      }
    },
    
    editGoal() {
      this.currentGoal = this.savedGoal;
      this.savedGoal = '';
    }
  }
};
</script>

<style scoped>
.goals-section {
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e3f2fd;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.compact-card {
  min-height: 200px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.compact-header {
  margin-bottom: 12px;
}

.icon-wrapper {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
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
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
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

.goal-content {
  margin-top: 4px;
}

.compact-content {
  margin-top: 0;
}

.goal-edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compact-edit {
  gap: 10px;
}

.goal-textarea :deep(.v-field) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.goal-textarea :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.compact-textarea :deep(.v-field) {
  font-size: 0.9rem;
}

.compact-textarea :deep(.v-field__input) {
  min-height: 60px !important;
}

.enhanced-save-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%) !important;
  border: none;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  height: 40px !important;
  align-self: flex-end;
  min-width: 140px;
}

.enhanced-save-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.enhanced-save-btn:hover::before {
  left: 100%;
}

.enhanced-save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4) !important;
}

.enhanced-save-btn:active:not(:disabled) {
  transform: translateY(0);
}

.enhanced-save-btn:disabled {
  background: #ccc !important;
  color: #666 !important;
  transform: none;
  box-shadow: none !important;
  cursor: not-allowed;
}

.enhanced-save-btn:disabled::before {
  display: none;
}

.enhanced-save-btn .btn-icon {
  transition: transform 0.3s ease;
}

.enhanced-save-btn:hover:not(:disabled) .btn-icon {
  transform: scale(1.1);
}

.enhanced-save-btn .btn-text {
  font-size: 0.85rem;
  font-weight: 600;
}

.enhanced-save-btn .btn-arrow {
  transition: transform 0.3s ease;
  opacity: 0.9;
}

.enhanced-save-btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(2px);
}

/* Efecto de pulso sutil cuando está habilitado */
.enhanced-save-btn:not(:disabled) {
  animation: subtle-pulse-green 3s ease-in-out infinite;
}

@keyframes subtle-pulse-green {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.enhanced-edit-btn {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
  color: white !important;
  border-radius: 6px;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
}

.enhanced-edit-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
}

.saved-goal-card {
  background: linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%);
  border: 1px solid #C8E6C9;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(76, 175, 80, 0.1);
}

.compact-saved {
  padding: 10px;
}

.saved-goal-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.compact-saved-content {
  gap: 6px;
}

.saved-goal-text {
  flex: 1;
  min-width: 0;
}

.saved-label {
  font-size: 0.7rem;
  color: #388E3C;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.compact-label {
  font-size: 0.65rem;
  margin-bottom: 2px;
}

.saved-goal {
  font-size: 0.9rem;
  color: #2E7D32;
  font-weight: 500;
  line-height: 1.4;
  word-wrap: break-word;
}

.compact-goal {
  font-size: 0.85rem;
  line-height: 1.3;
}

.saved-goal-actions {
  flex-shrink: 0;
}

/* Responsive para móviles */
@media (max-width: 600px) {
  .compact-card {
    min-height: 180px;
  }
  
  .section-header {
    gap: 8px;
  }
  
  .compact-icon {
    padding: 4px;
  }
  
  .compact-title {
    font-size: 0.95rem;
  }
  
  .compact-subtitle {
    font-size: 0.7rem;
  }
  
  .enhanced-save-btn {
    min-width: 120px;
    height: 36px !important;
  }
}
</style>