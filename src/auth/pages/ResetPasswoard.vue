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
                Recuperar contraseña
              </v-card-title>
              <v-card-subtitle class="text-center text-caption mt-1">
                Ingresa tus datos para restablecer tu contraseña
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

            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mb-2 mx-1"
              density="compact"
              :icon="false"
            >
              <div class="d-flex align-center">
                <v-icon color="success" size="16" class="me-1">mdi-check-circle-outline</v-icon>
                <span class="text-caption">{{ successMessage }}</span>
              </div>
            </v-alert>

            <!-- Paso 1: Validar credenciales -->
            <div v-if="currentStep === 1" class="recovery-step">
              <v-form ref="requestFormRef" v-model="isRequestValid" @submit.prevent="handleRequestReset" class="auth-form">
                <v-text-field
                  v-model="requestData.email"
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
                  :disabled="loading"
                  @input="clearError"
                />

                <v-text-field
                  v-model="requestData.securityPhrase"
                  :append-inner-icon="showSecurityPhrase ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  :type="showSecurityPhrase ? 'text' : 'password'"
                  label="Frase de seguridad"
                  prepend-inner-icon="mdi-shield-key-outline"
                  :rules="securityPhraseRules"
                  variant="outlined"
                  color="primary"
                  density="compact"
                  autocomplete="current-password"
                  required
                  class="mb-3"
                  :disabled="loading"
                  @click:append-inner="toggleSecurityPhrase"
                  @input="clearError"
                  hint="Ingresa la frase de seguridad que creaste al registrarte"
                  persistent-hint
                />

                <v-btn
                  type="submit"
                  color="primary"
                  class="auth-button"
                  size="large"
                  block
                  :loading="loading"
                  :disabled="!isRequestValid || loading"
                >
                  <template v-slot:loader>
                    <v-progress-circular
                      indeterminate
                      size="20"
                      width="2"
                    ></v-progress-circular>
                  </template>
                  <v-icon start size="18">mdi-key</v-icon>
                  Verificar credenciales
                </v-btn>
              </v-form>
            </div>

            <!-- Paso 2: Nueva contraseña -->
            <div v-if="currentStep === 2" class="recovery-step">
              <v-form ref="confirmFormRef" v-model="isConfirmValid" @submit.prevent="handleConfirmReset" class="auth-form">
                <v-text-field
                  v-model="confirmData.newPassword"
                  :append-inner-icon="showNewPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  :type="showNewPassword ? 'text' : 'password'"
                  label="Nueva contraseña"
                  prepend-inner-icon="mdi-lock-outline"
                  :rules="passwordRules"
                  variant="outlined"
                  color="primary"
                  density="compact"
                  autocomplete="new-password"
                  required
                  class="mb-3"
                  :disabled="loading"
                  @click:append-inner="toggleNewPassword"
                  @input="onPasswordInput"
                />

                <v-text-field
                  v-model="confirmData.confirmPassword"
                  :append-inner-icon="showConfirmNewPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  :type="showConfirmNewPassword ? 'text' : 'password'"
                  label="Confirmar nueva contraseña"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :rules="confirmNewPasswordRules"
                  variant="outlined"
                  color="primary"
                  density="compact"
                  autocomplete="new-password"
                  required
                  class="mb-3"
                  :disabled="loading"
                  @click:append-inner="toggleConfirmNewPassword"
                  @input="clearError"
                />

                <div class="password-strength" v-if="confirmData.newPassword && showPasswordStrength">
                  <div class="strength-bar">
                    <div 
                      class="strength-fill" 
                      :class="passwordStrength.class"
                      :style="{ width: passwordStrength.percentage + '%' }"
                    ></div>
                  </div>
                  <span class="text-caption strength-text" :class="passwordStrength.class + '--text'">
                    {{ passwordStrength.text }}
                  </span>
                </div>

                <div class="d-flex gap-2">
                  <v-btn
                    color="secondary"
                    variant="outlined"
                    class="auth-button"
                    size="large"
                    :disabled="loading"
                    @click="currentStep = 1"
                  >
                    <v-icon start size="18">mdi-arrow-left</v-icon>
                    Atrás
                  </v-btn>
                  
                  <v-btn
                    type="submit"
                    color="primary"
                    class="auth-button"
                    size="large"
                    :loading="loading"
                    :disabled="!isConfirmValid || loading"
                  >
                    <template v-slot:loader>
                      <v-progress-circular
                        indeterminate
                        size="20"
                        width="2"
                      ></v-progress-circular>
                    </template>
                    <v-icon start size="18">mdi-lock-reset</v-icon>
                    Restablecer contraseña
                  </v-btn>
                </div>
              </v-form>
            </div>

            <v-card-actions class="auth-footer">
              <p class="text-center text-caption mb-0 w-100">
                ¿Recordaste tu contraseña?
                <RouterLink to="/auth/login" class="auth-link">
                  Inicia sesión
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
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const router = useRouter();
const authStore = useAuthStore();

const currentStep = ref(1);
const loading = ref(false);
const formError = ref("");
const successMessage = ref("");
const showSecurityPhrase = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);
const showPasswordStrength = ref(false);
const isRequestValid = ref(false);
const isConfirmValid = ref(false);
const requestFormRef = ref(null);
const confirmFormRef = ref(null);

const requestData = reactive({
  email: "",
  securityPhrase: ""
});

const confirmData = reactive({
  newPassword: "",
  confirmPassword: ""
});

// Reglas de validación
const emailRules = [
  value => !!value || "Correo obligatorio",
  value => /\S+@\S+\.\S+/.test(value) || "Correo válido"
];

const securityPhraseRules = [
  value => !!value || "Frase de seguridad obligatoria",
  value => (value && value.length >= 6) || "Mínimo 6 caracteres"
];

const passwordRules = [
  value => !!value || "Contraseña obligatoria",
  value => (value && value.length >= 8) || "Mínimo 8 caracteres",
  value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value) || "Mayúsculas, minúsculas y números"
];

const confirmNewPasswordRules = [
  value => !!value || "Confirma tu contraseña",
  value => value === confirmData.newPassword || "No coinciden"
];

// Calculador de fortaleza de contraseña
const passwordStrength = computed(() => {
  if (!confirmData.newPassword) return { percentage: 0, text: "", class: "" };
  
  let score = 0;
  const password = confirmData.newPassword;
  
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  
  if (score >= 80) return { percentage: 100, text: "Fuerte", class: "strong" };
  if (score >= 60) return { percentage: 75, text: "Buena", class: "good" };
  if (score >= 40) return { percentage: 50, text: "Regular", class: "medium" };
  return { percentage: 25, text: "Débil", class: "weak" };
});

const toggleSecurityPhrase = () => {
  showSecurityPhrase.value = !showSecurityPhrase.value;
};

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmNewPassword = () => {
  showConfirmNewPassword.value = !showConfirmNewPassword.value;
};

const clearError = () => {
  formError.value = "";
  successMessage.value = "";
};

const onPasswordInput = debounce(() => {
  clearError();
  showPasswordStrength.value = confirmData.newPassword.length > 0;
}, 100);

const handleRequestReset = async () => {
  const formEl = requestFormRef.value;
  if (!formEl) return;

  const { valid } = await formEl.validate();
  if (!valid) return;

  loading.value = true;
  formError.value = "";

  try {
    const response = await authStore.requestPasswordReset({
      email: requestData.email.trim().toLowerCase(),
      frase_seguridad: requestData.securityPhrase
    });

    if (response.message === "valid" && response.token) {
      authStore.resetToken = response.token; // guardar token temporal
      successMessage.value = "Credenciales verificadas correctamente. Ahora crea tu nueva contraseña.";
      currentStep.value = 2;
    } else {
      formError.value = "El email o la frase de seguridad son incorrectos.";
    }
  } catch (error) {
    formError.value = error.message || "Error al verificar credenciales";
  } finally {
    loading.value = false;
  }
};

const handleConfirmReset = async () => {
  const formEl = confirmFormRef.value;
  if (!formEl) return;

  const { valid } = await formEl.validate();
  if (!valid) return;

  loading.value = true;
  formError.value = "";

  try {
    await authStore.confirmPasswordReset({
      new_password: confirmData.newPassword
    });

    successMessage.value = "¡Contraseña restablecida exitosamente! Redirigiendo al login...";
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  } catch (error) {
    formError.value = error.message || "Error al restablecer contraseña";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  document.documentElement.style.overflow = 'auto';
  authStore.clearError();
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

.recovery-step {
  margin-bottom: 16px;
}

.password-strength {
  margin-top: 8px;
  margin-bottom: 16px;
}

.strength-bar {
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 2px;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: #f44336;
}

.strength-fill.medium {
  background: #ff9800;
}

.strength-fill.good {
  background: #2196f3;
}

.strength-fill.strong {
  background: #4caf50;
}

.strength-text {
  font-weight: 500;
  font-size: 0.75rem;
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

.d-flex.gap-2 {
  gap: 8px;
}

.auth-footer {
  padding: 16px 0 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 8px;
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
  
  .d-flex.gap-2 {
    flex-direction: column;
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