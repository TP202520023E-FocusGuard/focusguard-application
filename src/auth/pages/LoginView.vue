<template>
  <div class="auth-wrapper">
    <div class="auth-background">
      <div class="focus-dot dot-1"></div>
      <div class="focus-dot dot-2"></div>
    </div>

    <v-container class="fill-height" fluid>
      <v-row class="ma-0 fill-height" align="center" justify="center">
        <v-col cols="12" sm="10" md="8" lg="5" xl="4">
          <v-card class="auth-card" elevation="0">
            <div class="auth-header">
              <div class="logo-wrapper">
                <v-icon size="28" color="primary" class="logo-icon">
                  mdi-shield-account
                </v-icon>
                <span class="logo-text">FocusGuard</span>
              </div>
              <v-card-title class="text-h6 font-weight-bold text-center pa-0 mt-1">
                ¡Bienvenido!
              </v-card-title>
              <v-card-subtitle class="text-center text-caption mt-1">
                Gestiona tu productividad con seguridad
              </v-card-subtitle>
            </div>

            <v-alert
              v-if="formError"
              type="error"
              variant="tonal"
              class="mb-2 mx-1"
              density="compact"
              :icon="false"
            >
              <div class="d-flex align-center">
                <v-icon color="error" size="16" class="me-1">mdi-alert-circle-outline</v-icon>
                <span class="text-caption">{{ formError }}</span>
              </div>
            </v-alert>

            <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit" class="auth-form">
              <v-text-field
                v-model="form.email"
                label="Correo electrónico"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                variant="outlined"
                color="primary"
                density="compact"
                autocomplete="email"
                required
                class="mb-3"
                :disabled="authStore.loading"
                @input="clearError"
              />

              <v-text-field
                v-model="form.password"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                prepend-inner-icon="mdi-lock-outline"
                :rules="passwordRules"
                variant="outlined"
                color="primary"
                density="compact"
                autocomplete="current-password"
                required
                class="mb-1"
                :disabled="authStore.loading"
                @click:append-inner="togglePassword"
                @keyup.enter="handleSubmit"
                @input="clearError"
              />

              <div class="d-flex justify-end mb-4">
                <RouterLink to="/auth/forgot-password" class="forgot-link text-caption">
                  ¿Contraseña olvidada?
                </RouterLink>
              </div>

              <v-btn
                type="submit"
                color="primary"
                class="auth-button"
                size="large"
                block
                :loading="authStore.loading"
                :disabled="!isValid || authStore.loading"
              >
                <template v-slot:loader>
                  <v-progress-circular
                    indeterminate
                    size="20"
                    width="2"
                  ></v-progress-circular>
                </template>
                <v-icon start size="18">mdi-login</v-icon>
                Iniciar sesión
              </v-btn>

            </v-form>

            <v-card-actions class="auth-footer">
              <p class="text-center text-caption mb-0 w-100">
                ¿Sin cuenta?
                <RouterLink to="/auth/register" class="auth-link">
                  Crear cuenta
                </RouterLink>
              </p>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { useDisplay } from 'vuetify'

const { mobile: isMobile } = useDisplay()
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
authStore.clearError();

const form = reactive({
  email: "",
  password: ""
});

const showPassword = ref(false);
const isValid = ref(false);
const formRef = ref(null);

const emailRules = [
  value => !!value || "Correo obligatorio",
  value => /\S+@\S+\.\S+/.test(value) || "Correo válido"
];

const passwordRules = [
  value => !!value || "Contraseña obligatoria",
  value => value.length >= 6 || "Mínimo 6 caracteres"
];

const formError = computed(() => authStore.error);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const clearError = () => {
  if (authStore.error) {
    authStore.clearError();
  }
};

const handleSubmit = async () => {
  const formEl = formRef.value;
  if (!formEl) return;

  const { valid } = await formEl.validate();
  if (!valid) return;

  try {
    await authStore.login({ ...form });
    const redirectTo = route.query.redirect || "/tracking";
    router.push(redirectTo);
  } catch (error) {
    console.error(error);
  }
};

const socialLogin = (provider) => {
  console.log(`Login con ${provider}`);
};

onMounted(() => {
  document.documentElement.style.overflow = 'auto';
});

onUnmounted(() => {
  document.documentElement.style.overflow = 'auto';
});
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 16px;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.focus-dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: pulse 4s ease-in-out infinite;
}

.dot-1 {
  width: 40px;
  height: 40px;
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.dot-2 {
  width: 30px;
  height: 30px;
  top: 70%;
  right: 20%;
  animation-delay: 2s;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.1;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.15;
  }
}

.auth-card {
  border-radius: 12px;
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.auth-header {
  margin-bottom: 20px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  gap: 6px;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #1a237e, #3949ab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-form {
  padding: 0 2px;
}

.auth-button {
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  height: 44px;
  font-size: 0.875rem;
}

.auth-button:not(.v-btn--disabled):hover {
  transform: translateY(-1px);
}

.separator {
  position: relative;
  text-align: center;
  margin: 16px 0;
}

.separator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.separator-text {
  background: white;
  padding: 0 12px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.75rem;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 8px;
}

.social-button {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  height: 40px;
  font-size: 0.8rem;
}

.auth-footer {
  padding: 16px 0 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 8px;
}

.forgot-link {
  color: rgba(0, 0, 0, 0.6);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem;
}

.forgot-link:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

.auth-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.auth-link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .auth-wrapper {
    padding: 16px 12px;
    align-items: flex-start;
  }
  
  .auth-card {
    padding: 20px 16px;
    border-radius: 10px;
  }
  
  .logo-text {
    font-size: 15px;
  }
  
  .focus-dot {
    display: none;
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 400px) {
  .auth-card {
    padding: 16px 12px;
  }
  
  .logo-wrapper {
    flex-direction: column;
    gap: 2px;
  }
  
  .auth-header {
    margin-bottom: 16px;
  }
}

@media (max-height: 700px) {
  .auth-wrapper {
    align-items: flex-start;
    padding-top: 40px;
    padding-bottom: 40px;
  }
  
  .separator,
  .social-buttons {
    display: none;
  }
}

:deep() {
  .v-text-field input {
    -webkit-user-select: text;
    user-select: text;
  }
  
  .v-field__outline {
    border-radius: 6px;
  }
}

.v-btn--loading {
  transform: none;
}
</style>