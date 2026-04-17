<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="5">

        <v-card class="profile-card" elevation="0">

          <!-- Header perfil -->
          <div class="profile-header text-center">
            <v-avatar size="72" class="mb-3">
              <v-icon size="40">mdi-account</v-icon>
            </v-avatar>

            <div class="text-h6 font-weight-bold">
              {{ fullName }}
            </div>

            <div class="text-caption text--secondary">
              {{ userEmail }}
            </div>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Info -->
          <div class="info-section">

            <div class="info-item">
              <div class="info-label">Nombre</div>
              <div class="info-box">{{ userName }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Apellido</div>
              <div class="info-box">{{ lastName || "—" }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Correo</div>
              <div class="info-box">{{ userEmail }}</div>
            </div>

          </div>

          <!-- Acciones -->
          <div class="actions mt-6">

            <v-btn
              block
              variant="outlined"
              class="mb-2"
            >
              <v-icon left size="18">mdi-pencil</v-icon>
              Editar perfil
            </v-btn>

            <v-btn
              block
              color="error"
              variant="tonal"
            >
              <v-icon left size="18">mdi-logout</v-icon>
              Cerrar sesión
            </v-btn>

          </div>

          <!-- Estado vacío -->
          <v-alert
            v-if="!isUserLoaded"
            type="warning"
            variant="tonal"
            class="mt-5"
          >
            No se pudo cargar tu información.
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
const userName = computed(() => authStore.user?.firstName || "—");
const lastName = computed(() => authStore.user?.lastName || "");
const userEmail = computed(() => authStore.user?.email || "—");

const fullName = computed(() =>
  `${userName.value} ${lastName.value}`.trim()
);
</script>

<style scoped>
.profile-card {
  border-radius: 24px;
  padding: 28px;
  background: linear-gradient(145deg, #ffffff, #f7f7f7);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
}

/* Header */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Info */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #777;
}

.info-box {
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  font-weight: 500;
  transition: all 0.2s ease;
}

.info-box:hover {
  background: rgba(0, 0, 0, 0.07);
}

/* Acciones */
.actions {
  display: flex;
  flex-direction: column;
}

/* Responsive */
@media (max-width: 600px) {
  .profile-card {
    padding: 20px;
  }
}
</style>