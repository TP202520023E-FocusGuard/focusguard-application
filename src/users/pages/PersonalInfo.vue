<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="info-card" elevation="4">
          <v-card-title class="d-flex align-center mb-4">
            <v-icon class="mr-3" :style="{ color: 'var(--theme-primary, #4ca1af)' }" size="28">
              mdi-account-circle
            </v-icon>
            <span class="text-h5 font-weight-semibold">Información Personal</span>
          </v-card-title>

          <v-divider class="mb-6"></v-divider>

          <v-card-text>
            <div class="info-group">
              <div class="info-label">Nombre completo</div>
              <div class="info-value">{{ userName }}</div>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="info-group">
              <div class="info-label">Correo electrónico</div>
              <div class="info-value">{{ userEmail }}</div>
            </div>
          </v-card-text>

          <v-alert
            v-if="!isUserLoaded"
            type="warning"
            variant="tonal"
            border="start"
            class="mt-6"
          >
            No se encontró información del usuario. Por favor inicia sesión nuevamente.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../../stores/authStore";

const authStore = useAuthStore();

const isUserLoaded = computed(() => Boolean(authStore.user));
const userName = computed(() => authStore.user?.name || "—");
const userEmail = computed(() => authStore.user?.email || "—");
</script>

<style scoped>
.info-card {
  border-radius: 20px;
  padding: 24px;
  background: var(--theme-surface, #ffffff);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(var(--v-theme-on-surface, 33, 37, 41), 0.7);
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--theme-text, #1e293b);
  background: rgba(15, 23, 42, 0.04);
  border-radius: 12px;
  padding: 14px 16px;
}

@media (max-width: 600px) {
  .info-card {
    padding: 16px;
  }

  .info-value {
    font-size: 1rem;
  }
}
</style>
