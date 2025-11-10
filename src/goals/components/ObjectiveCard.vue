<template>
  <v-card
    class="objective-card"
    variant="outlined"
    elevation="1"
    @click="onCardClick"
  >
    <!-- Contenido principal -->
    <div class="objective-content">
      <div class="header-row">
        <v-icon
          size="18"
          :color="objective.datos.tipo === 'mas' ? 'success' : 'error'"
          class="type-icon"
        >
          {{ objective.datos.tipo === 'mas' ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold' }}
        </v-icon>

        <div class="objective-text" :class="{ completed: objective.completed }">
          {{ objective.text }}
        </div>
      </div>

      <div class="objective-details">
        <v-chip
          size="x-small"
          variant="flat"
          color="primary"
          class="detail-chip"
        >
          {{ getObjectiveAction() }} {{ getCategoryText() }}
        </v-chip>
      </div>
    </div>

    <!-- Footer flotante -->
    <div class="floating-footer">
      <div class="time-info">
        <v-icon size="14" color="primary">mdi-timer-outline</v-icon>
        <span class="elapsed-time">{{ elapsedTime }}</span>
      </div>
      <v-btn
        icon
        size="x-small"
        color="error"
        variant="text"
        class="delete-btn"
        @click.stop="deleteObjective"
      >
        <v-icon size="16">mdi-delete-outline</v-icon>
      </v-btn>
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
  data() {
    return {
      createdAt: this.objective.createdAt || new Date(),
      elapsedTime: '0m',
      timerInterval: null
    };
  },
  mounted() {
    this.updateElapsedTime();
    this.timerInterval = setInterval(this.updateElapsedTime, 60000);
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
  methods: {
    getCategoryText() {
      return this.objective.datos?.subcategoria?.title || "General";
    },
    getObjectiveAction() {
      return this.objective.datos?.tipo === "mas" ? "Aumentar" : "Reducir";
    },
    updateElapsedTime() {
      const now = new Date();
      const created = new Date(this.createdAt);
      const diffMs = now - created;
      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(minutes / 60);
      this.elapsedTime =
        hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
    },
    deleteObjective() {
      this.$emit("delete", this.objective.id);
    },
    onCardClick() {
      // Envía el evento al padre para abrir el diálogo de edición
      this.$emit("click", this.objective);
    }
  }
};
</script>

<style scoped>
.objective-card {
  position: relative;
  border-radius: 10px;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 12px;
  overflow: hidden;
  background: #fff;
  transition: all 0.25s ease;
  cursor: pointer;
}

.objective-card:hover {
  box-shadow: 0 4px 12px rgba(118, 75, 162, 0.15);
  transform: translateY(-1px);
}

.header-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.type-icon {
  margin-top: 2px;
}

.objective-text {
  flex: 1;
  font-size: 0.85rem;
  line-height: 1.3;
  font-weight: 500;
  color: #333;
  word-break: break-word;
}

.objective-text.completed {
  text-decoration: line-through;
  color: #aaa;
}

.detail-chip {
  margin-top: 6px;
  font-size: 0.7rem;
  font-weight: 500;
}

/* Footer flotante */
.floating-footer {
  position: absolute;
  bottom: 6px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(250, 250, 252, 0.95);
  border-radius: 8px;
  padding: 2px 8px;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform: translateY(4px);
}

.objective-card:hover .floating-footer {
  opacity: 1;
  transform: translateY(0);
}

.time-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #555;
}

.elapsed-time {
  font-weight: 600;
  color: #444;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.1);
}
</style>
