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
                Crear cuenta
              </v-card-title>
              <v-card-subtitle class="text-center text-caption mt-1">
                Comienza a gestionar tu productividad
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

            <!-- Único formulario -->
            <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit" class="auth-form">
              
              <!-- Información personal -->
              <div role="group" class="form-section">
                <div class="form-grid">
                  <v-text-field
                    v-model="form.firstName"
                    label="Nombre"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="firstNameRules"
                    variant="outlined"
                    color="primary"
                    density="compact"
                    autocomplete="given-name"
                    required
                    class="form-field"
                    :disabled="authStore.loading"
                    @input="clearError"
                  />

                  <v-text-field
                    v-model="form.lastName"
                    label="Apellido"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="lastNameRules"
                    variant="outlined"
                    color="primary"
                    density="compact"
                    autocomplete="family-name"
                    required
                    class="form-field"
                    :disabled="authStore.loading"
                    @input="clearError"
                  />

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
                    class="form-field full-width"
                    :disabled="authStore.loading"
                    @input="clearError"
                  />

                  <v-text-field
                    v-model="form.phone"
                    label="Teléfono"
                    type="tel"
                    prepend-inner-icon="mdi-phone-outline"
                    :rules="phoneRules"
                    variant="outlined"
                    color="primary"
                    density="compact"
                    autocomplete="tel"
                    required
                    class="form-field full-width"
                    :disabled="authStore.loading"
                    @input="formatPhone"
                    maxlength="9"
                  />
                </div>
              </div>

              <!-- Seguridad de la cuenta -->
              <div role="group" class="form-section">

                <div class="password-section">
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
                    autocomplete="new-password"
                    required
                    class="mb-1"
                    :disabled="authStore.loading"
                    @click:append-inner="togglePassword"
                    @input="clearError"
                  />

                  <v-text-field
                    v-model="form.confirmPassword"
                    :append-inner-icon="showConfirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="showConfirm ? 'text' : 'password'"
                    label="Confirmar contraseña"
                    prepend-inner-icon="mdi-lock-check-outline"
                    :rules="confirmPasswordRules"
                    variant="outlined"
                    color="primary"
                    density="compact"
                    autocomplete="new-password"
                    required
                    class="mb-1"
                    :disabled="authStore.loading"
                    @click:append-inner="toggleConfirmPassword"
                    @input="clearError"
                  />

                  <div class="password-strength" v-if="form.password">
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
                </div>

                <div class="security-phrase-section">
                  <v-text-field
                    v-model="form.securityPhrase"
                    :append-inner-icon="showSecurityPhrase ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="showSecurityPhrase ? 'text' : 'password'"
                    label="Frase de seguridad"
                    prepend-inner-icon="mdi-shield-key-outline"
                    :rules="securityPhraseRules"
                    variant="outlined"
                    color="primary"
                    density="compact"
                    required
                    class="mb-1"
                    :disabled="authStore.loading"
                    @click:append-inner="toggleSecurityPhrase"
                    @input="clearError"
                    hint="Esta frase te ayudará a recuperar tu contraseña si la olvidas"
                    persistent-hint
                  />

                  <v-text-field
                    v-model="form.confirmSecurityPhrase"
                    :append-inner-icon="showConfirmSecurityPhrase ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="showConfirmSecurityPhrase ? 'text' : 'password'"
                    label="Confirmar frase de seguridad"
                    prepend-inner-icon="mdi-shield-check-outline"
                    :rules="confirmSecurityPhraseRules"
                    variant="outlined"
                    color="primary"
                    density="compact"
                    required
                    class="mb-1"
                    :disabled="authStore.loading"
                    @click:append-inner="toggleConfirmSecurityPhrase"
                    @input="clearError"
                  />
                </div>
              </div>

              <!-- Botón de submit -->
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
                <v-icon start size="18">mdi-account-plus</v-icon>
                Crear cuenta
              </v-btn>
            </v-form>

            <v-card-actions class="auth-footer">
              <p class="text-center text-caption mb-0 w-100">
                ¿Ya tienes cuenta?
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

const router = useRouter();
const authStore = useAuthStore();
authStore.clearError();

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  securityPhrase: "",
  confirmSecurityPhrase: ""
});

const showPassword = ref(false);
const showConfirm = ref(false);
const showSecurityPhrase = ref(false);
const showConfirmSecurityPhrase = ref(false);
const isValid = ref(false);
const formRef = ref(null);

const firstNameRules = [
  value => !!value || "Nombre obligatorio",
  value => (value && value.length >= 2) || "Mínimo 2 caracteres",
  value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) || "Solo letras"
];

const lastNameRules = [
  value => !!value || "Apellido obligatorio",
  value => (value && value.length >= 2) || "Mínimo 2 caracteres",
  value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) || "Solo letras"
];

const emailRules = [
  value => !!value || "Correo obligatorio",
  value => /\S+@\S+\.\S+/.test(value) || "Correo válido"
];

const phoneRules = [
  value => !!value || "Teléfono obligatorio",
  value => /^9\d{8}$/.test(value) || "9 dígitos, empezar con 9"
];

const passwordRules = [
  value => !!value || "Contraseña obligatoria",
  value => (value && value.length >= 8) || "Mínimo 8 caracteres",
  value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value) || "Mayúsculas, minúsculas y números"
];

const confirmPasswordRules = [
  value => !!value || "Confirma tu contraseña",
  value => value === form.password || "No coinciden"
];

const securityPhraseRules = [
  value => !!value || "Frase de seguridad obligatoria",
  value => (value && value.length >= 6) || "Mínimo 6 caracteres",
  value => (value && value.length <= 50) || "Máximo 50 caracteres"
];

const confirmSecurityPhraseRules = [
  value => !!value || "Confirma tu frase de seguridad",
  value => value === form.securityPhrase || "No coinciden"
];

const formError = computed(() => authStore.error);

const passwordStrength = computed(() => {
  if (!form.password) return { percentage: 0, text: "", class: "" };
  
  const password = form.password;
  let score = 0;
  
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  
  if (score >= 80) return { percentage: 100, text: "Fuerte", class: "strong" };
  if (score >= 60) return { percentage: 75, text: "Buena", class: "good" };
  if (score >= 40) return { percentage: 50, text: "Regular", class: "medium" };
  return { percentage: 25, text: "Débil", class: "weak" };
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirm.value = !showConfirm.value;
};

const toggleSecurityPhrase = () => {
  showSecurityPhrase.value = !showSecurityPhrase.value;
};

const toggleConfirmSecurityPhrase = () => {
  showConfirmSecurityPhrase.value = !showConfirmSecurityPhrase.value;
};

const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  
  if (value.length > 9) {
    value = value.substring(0, 9);
  }
  
  if (value.length > 0 && value[0] !== '9') {
    value = '9' + value.substring(1);
  }
  
  form.phone = value;
  clearError();
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
    await authStore.register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone,
      password: form.password,
      frase_seguridad: form.securityPhrase
    });
    router.push("/tracking");
  } catch (error) {
    console.error(error);
  }
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.password-section {
  margin-bottom: 8px;
}

.security-phrase-section {
  margin-bottom: 16px;
}

.password-strength {
  margin-top: 8px;
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

@media (max-width: 960px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
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
  
  .form-grid {
    gap: 6px;
    margin-bottom: 12px;
  }
  
  .focus-dot {
    display: none;
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