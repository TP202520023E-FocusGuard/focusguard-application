<template>
  <v-container fluid class="goals-page pa-3">
    <div class="page-content">
      <!-- Header responsive -->
      <div class="page-header text-center mb-4">
        <div class="header-icon">
          <v-icon color="primary" size="48">mdi-target-account</v-icon>
        </div>
        <h1 class="page-title">Metas y Objetivos</h1>
        <p class="page-subtitle">
          Define tu visión y objetivos semanales
        </p>
      </div>

      <!-- Contenido principal con suficiente espacio -->
      <div class="goals-content">
        <v-row class="sections-container" justify="center">
          <v-col cols="12" xl="10" lg="11" md="12">
            <v-row class="sections-stack" justify="center">
              <!-- Meta Principal -->
              <v-col cols="12" lg="6" md="6" class="section-col">
                <GoalSection 
                  @goalSaved="onGoalSaved"
                  class="section-item"
                />
              </v-col>
              
              <!-- Objetivos Semanales -->
              <v-col cols="12" lg="6" md="6" class="section-col">
                <ObjectivesSection 
                  @objectiveAdded="onObjectiveAdded"
                  @objectiveUpdated="onObjectiveUpdated"
                  @objectiveDeleted="onObjectiveDeleted"
                  class="section-item"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script>
import GoalSection from './../components/GoalSection.vue';
import ObjectivesSection from './../components/ObjectivesSection.vue';

export default {
  name: "GoalsPage",
  components: {
    GoalSection,
    ObjectivesSection
  },
  methods: {
    onGoalSaved(goal) {
      console.log('Meta guardada:', goal);
    },
    
    onObjectiveAdded(objective) {
      console.log('Objetivo agregado:', objective);
    },
    
    onObjectiveUpdated(change) {
      console.log('Objetivo actualizado:', change);
    },
    
    onObjectiveDeleted(objectiveId) {
      console.log('Objetivo eliminado:', objectiveId);
    }
  }
};
</script>

<style scoped>
.goals-page {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 20px !important;
}

.page-content {
  width: 100%;
  height: 100%;
}

/* HEADER */
.page-header {
  padding: 0 0 32px 0;
  margin-bottom: 0;
}

.header-icon {
  margin-bottom: 16px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.5;
}

/* CONTENIDO PRINCIPAL CON ESPACIO SUFICIENTE */
.goals-content {
  width: 100%;
}

.sections-container {
  margin: 0 auto;
  width: 100%;
}

.sections-stack {
  width: 100%;
  margin: 0 -12px;
}

.section-col {
  padding: 12px !important;
  display: flex;
}

.section-item {
  width: 100%;
  height: 100%;
  min-height: 320px; /* Altura mínima suficiente */
}

/* RESPONSIVE: DESKTOP MEDIANO */
@media (max-width: 1440px) {
  .goals-page {
    max-width: 1200px;
    padding: 16px !important;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
}

/* RESPONSIVE: TABLET GRANDE */
@media (max-width: 1264px) {
  .goals-page {
    max-width: 100%;
    padding: 16px 12px !important;
  }
  
  .page-header {
    padding: 0 0 24px 0;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .sections-stack {
    margin: 0 -8px;
  }
  
  .section-col {
    padding: 8px !important;
  }
  
  .section-item {
    min-height: 300px;
  }
}

/* RESPONSIVE: TABLET */
@media (max-width: 960px) {
  .goals-page {
    padding: 12px 8px !important;
  }
  
  .page-header {
    padding: 0 0 20px 0;
  }
  
  .header-icon {
    margin-bottom: 12px;
  }
  
  .page-title {
    font-size: 1.6rem;
  }
  
  .page-subtitle {
    font-size: 0.95rem;
    max-width: 450px;
  }
  
  .sections-stack {
    margin: 0 -6px;
  }
  
  .section-col {
    padding: 6px !important;
  }
  
  .section-item {
    min-height: 280px;
  }
}

/* RESPONSIVE: MÓVIL - CAMBIO A UNA COLUMNA */
@media (max-width: 768px) {
  .goals-page {
    padding: 8px 4px !important;
  }
  
  .page-header {
    padding: 0 0 16px 0;
  }
  
  .header-icon {
    margin-bottom: 8px;
  }
  
  .header-icon :deep(.v-icon) {
    font-size: 40px !important;
  }
  
  .page-title {
    font-size: 1.4rem;
    margin-bottom: 6px;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
    max-width: 400px;
    line-height: 1.4;
  }
  
  .sections-stack {
    margin: 0;
    flex-direction: column;
  }
  
  .section-col {
    padding: 8px 4px !important;
    margin-bottom: 16px; /* ESPACIO EXTRA ENTRE CARDS EN MÓVIL */
  }
  
  .section-col:last-child {
    margin-bottom: 0;
  }
  
  .section-item {
    min-height: 260px;
  }
}

/* RESPONSIVE: MÓVIL PEQUEÑO */
@media (max-width: 480px) {
  .goals-page {
    padding: 6px 2px !important;
  }
  
  .page-header {
    padding: 0 0 12px 0;
  }
  
  .header-icon :deep(.v-icon) {
    font-size: 36px !important;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .page-subtitle {
    font-size: 0.85rem;
    max-width: 350px;
  }
  
  .section-col {
    padding: 6px 2px !important;
    margin-bottom: 12px;
  }
  
  .section-item {
    min-height: 240px;
  }
}

/* MEJORAS PARA PANTALLAS MUY GRANDES */
@media (min-width: 1920px) {
  .goals-page {
    max-width: 1600px;
    padding: 24px !important;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.2rem;
  }
  
  .section-item {
    min-height: 350px;
  }
}

/* GARANTIZAR QUE LAS CARDS TENGAN SUFICIENTE ESPACIO INTERNO */
.section-item :deep(.goals-section) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-item :deep(.goal-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-item :deep(.goal-edit) {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.section-item :deep(.goal-textarea) {
  flex: 1;
}

.section-item :deep(.enhanced-save-btn) {
  margin-top: auto;
}
</style>