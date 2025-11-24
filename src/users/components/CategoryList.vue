<template>
  <div>
    <v-card class="compact-card pa-4" elevation="2">
      <div class="text-center mb-4">
        <v-icon :color="themeStore.themeColors.primary" size="48" class="mb-1">mdi-brain</v-icon>
        <h2 class="text-h5 font-weight-bold mb-1" :style="{ color: themeStore.themeColors.primary }">
          Categorías de Procrastinación
        </h2>
        <p class="text-caption" :style="{ color: themeStore.themeColors.textSecondary }">
          Marca las categorías que consideras procrastinación/ocio
        </p>
      </div>

      <v-row class="mt-1" dense>
        <v-col cols="12" sm="6" lg="4" v-for="(category, index) in categories" :key="category.id">
          <v-card 
            :class="[
              'compact-option-card', 
              'pa-3', 
              'mb-2', 
              'elevation-1',
              category.isProcrastination ? 'selected-compact' : 'unselected-compact'
            ]"
            @click="toggleCategory(category)"
            :ripple="true"
          >
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon 
                  :color="category.isProcrastination ? 'white' : 'grey lighten-1'"
                  :class="['compact-checkbox', category.isProcrastination ? 'checkbox-checked' : 'checkbox-unchecked']"
                  size="20"
                >
                  {{ category.isProcrastination ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
                <span 
                  class="text-body-2 ml-2 compact-text"
                  :class="category.isProcrastination ? 'text-white' : ''"
                >
                  {{ category.name }}
                </span>
              </div>
              
              <v-icon 
                v-if="category.isProcrastination"
                color="white"
                size="16"
                class="ml-1"
              >
                mdi-check
              </v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card-actions class="justify-center mt-4 pt-2">
        <v-btn 
          :color="themeStore.themeColors.primary" 
          size="large"
          :class="['compact-btn', 'elevation-2']"
          @click="handleSave"
          min-width="160"
        >
          <v-icon left size="20">mdi-content-save</v-icon>
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar 
      v-model="showSnackbar" 
      timeout="2000" 
      color="success" 
      elevation="2"
      location="top center"
    >
      <div class="d-flex align-center">
        <v-icon color="white" size="20" class="mr-2">mdi-check</v-icon>
        <span class="text-caption text-white">
          <strong>{{ lastUpdatedCategory }}</strong> {{ lastAction }}
        </span>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
import { useThemeStore } from '../../stores/themeStore';
import { mapStores } from 'pinia';

export default {
  name: 'CategoryList',
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showSnackbar: false,
      lastUpdatedCategory: '',
      lastAction: 'seleccionada'
    };
  },
  computed: {
    ...mapStores(useThemeStore)
  },
  methods: {
    async updateCategory(category) {
      try {
        await axios.put(`http://localhost:8080/categories/${category.id}`, category);

        this.lastUpdatedCategory = category.name;
        this.lastAction = category.isProcrastination ? 'seleccionada' : 'deseleccionada';
        this.showSnackbar = true;

        this.$emit('update', category);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    },
    toggleCategory(category) {
      category.isProcrastination = !category.isProcrastination;
      this.updateCategory(category);
    },
    handleSave() {
      this.$emit('save', this.categories);
    }
  }
};
</script>

<style scoped>
.compact-card {
  border-radius: 12px;
  background: white;
}

.compact-option-card {
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.compact-option-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.selected-compact {
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%) !important;
  border-color: var(--theme-primary) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

.selected-compact .compact-text {
  color: white !important;
}

.unselected-compact {
  background: #fafafa;
  border: 1px solid #e0e0e0;
}

.unselected-compact:hover {
  border-color: var(--theme-primary);
  background: #f5f9ff;
}

.unselected-compact .compact-text {
  color: #1e293b !important;
}

.compact-checkbox {
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-checked {
  animation: compactCheck 0.3s ease;
}

.compact-text {
  font-weight: 500;
  line-height: 1.2;
}

.compact-btn {
  border-radius: 24px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.compact-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
}

@keyframes compactCheck {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 960px) {
  .compact-card {
    padding: 16px !important;
  }
  
  .compact-option-card {
    padding: 12px !important;
    min-height: 44px;
  }
  
  .compact-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 600px) {
  .compact-card {
    padding: 12px !important;
    border-radius: 8px;
  }
  
  .compact-option-card {
    padding: 10px !important;
    min-height: 40px;
  }
  
  .compact-btn {
    padding: 10px 20px;
    font-size: 0.8rem;
    min-width: 140px;
  }
}

@media (min-width: 1280px) {
  .compact-option-card {
    min-height: 44px;
  }
}

.selected-compact {
  animation: selectCompact 0.2s ease;
}

@keyframes selectCompact {
  0% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
}
</style>