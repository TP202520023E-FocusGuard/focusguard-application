<template>
  <v-card 
    class="goal-card" 
    elevation="2" 
    rounded="lg"
    hover
  >
    <v-card-text class="pa-3">
      <div class="goal-header">
        <div class="goal-icon">
          <v-icon size="22" color="#2196F3">mdi-target</v-icon>
        </div>
        <h2 class="goal-title">Mi Meta</h2>
        <v-btn 
          icon 
          variant="text" 
          size="x-small"
          class="edit-btn"
          @click="editGoal"
        >
          <v-icon size="16">mdi-pencil</v-icon>
        </v-btn>
      </div>
      
      <div class="goal-content">
        <div class="goal-description">
          {{ currentGoal }}
        </div>
        
        <div class="goal-meta">
          <div class="meta-item">
            <v-icon size="14" color="#666" class="mr-1">mdi-calendar</v-icon>
            <span class="meta-text">Establecida: {{ goalDate }}</span>
          </div>
          <div class="meta-item">
            <v-icon size="14" color="#666" class="mr-1">mdi-update</v-icon>
            <span class="meta-text">{{ daysActive }} días activa</span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const currentGoal = ref('Desarrollar una aplicación para combatir la procrastinación.')
const goalDate = ref('15 Nov 2024')
const daysActive = ref(12)

const editGoal = () => {
  console.log('Editar meta')
}
</script>

<style scoped>
.goal-card {
  border-left: 3px solid #2196F3;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  height: 100%;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.goal-icon {
  padding: 6px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.goal-card:hover .goal-icon {
  background: rgba(33, 150, 243, 0.15);
  transform: scale(1.05);
}

.goal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
  flex: 1;
}

.edit-btn {
  transition: all 0.2s ease;
  opacity: 0.6;
}

.edit-btn:hover {
  opacity: 1;
  transform: scale(1.1);
  background: rgba(33, 150, 243, 0.1);
}

.goal-content {
  margin-bottom: 4px;
}

.goal-description {
  font-size: 0.9rem;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(33, 150, 243, 0.05);
  border-radius: 8px;
  border-left: 2px solid #2196F3;
  font-weight: 500;
}

.goal-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  padding: 5px 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.7);
  transition: all 0.2s ease;
}

.meta-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.meta-text {
  font-weight: 500;
}

@media (max-width: 600px) {
  .goal-meta {
    flex-direction: column;
    gap: 6px;
  }
}
</style>