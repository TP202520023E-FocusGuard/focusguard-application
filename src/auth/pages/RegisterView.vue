<template>
  <div class="auth-wrapper">
    <v-container class="fill-height" fluid>
      <v-row class="ma-0 fill-height" align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="auth-card" elevation="12">
            <v-card-title class="text-h5 font-weight-medium text-center mb-2">
              Crea tu cuenta
            </v-card-title>
            <v-card-subtitle class="text-center mb-6">
              Únete a FocusGuard y lleva un seguimiento inteligente de tu tiempo.
            </v-card-subtitle>

            <v-alert
              v-if="formError"
              type="error"
              variant="tonal"
              class="mb-4"
              border="start"
            >
              {{ formError }}
            </v-alert>

            <v-form ref="formRef" v-model="isValid" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="form.name"
                label="Nombre completo"
                prepend-inner-icon="mdi-account-outline"
                :rules="nameRules"
                variant="outlined"
                density="comfortable"
                autocomplete="name"
                required
              />

              <v-text-field
                v-model="form.email"
                label="Correo electrónico"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                variant="outlined"
                density="comfortable"
                autocomplete="email"
                required
              />

              <v-text-field
                v-model="form.password"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                prepend-inner-icon="mdi-lock-outline"
                :rules="passwordRules"
                variant="outlined"
                density="comfortable"
                autocomplete="new-password"
                required
                @click:append-inner="togglePassword"
              />

              <v-text-field
                v-model="form.confirmPassword"
                :append-inner-icon="showConfirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :type="showConfirm ? 'text' : 'password'"
                label="Confirmar contraseña"
                prepend-inner-icon="mdi-lock-check-outline"
                :rules="confirmPasswordRules"
                variant="outlined"
                density="comfortable"
                autocomplete="new-password"
                required
                @click:append-inner="toggleConfirmPassword"
              />

              <v-btn
                type="submit"
                color="primary"
                class="mt-4"
                size="large"
                block
                :loading="authStore.loading"
              >
                Crear cuenta
              </v-btn>
            </v-form>

            <p class="text-center text-body-2 mt-6 mb-0">
              ¿Ya tienes una cuenta?
              <RouterLink to="/auth/login" class="auth-link">
                Inicia sesión
              </RouterLink>
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
authStore.clearError();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const showPassword = ref(false);
const showConfirm = ref(false);
const isValid = ref(false);
const formRef = ref(null);

const nameRules = [value => !!value || "El nombre es obligatorio."];
const emailRules = [
  value => !!value || "El correo es obligatorio.",
  value => /\S+@\S+\.\S+/.test(value) || "Ingresa un correo válido."
];
const passwordRules = [
  value => !!value || "La contraseña es obligatoria.",
  value => value.length >= 6 || "Debe tener al menos 6 caracteres.",
  value => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(value) || "Usa letras y números para una contraseña más segura."
];
const confirmPasswordRules = [
  value => !!value || "Confirma tu contraseña.",
  value => value === form.password || "Las contraseñas no coinciden."
];

const formError = computed(() => authStore.error);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirm.value = !showConfirm.value;
};

const handleSubmit = async () => {
  const formEl = formRef.value;
  if (!formEl) return;

  const { valid } = await formEl.validate();
  if (!valid) return;

  try {
    await authStore.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password
    });
    router.push("/tracking");
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => [form.name, form.email, form.password, form.confirmPassword],
  () => {
    if (authStore.error) {
      authStore.clearError();
    }
  }
);
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #373b44, #4286f4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
}

.auth-card {
  border-radius: 22px;
  padding: 32px 28px;
  backdrop-filter: blur(8px);
}

.auth-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
