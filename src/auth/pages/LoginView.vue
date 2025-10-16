<template>
  <div class="auth-wrapper">
    <v-container class="fill-height" fluid>
      <v-row class="ma-0 fill-height" align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="auth-card" elevation="12">
            <v-card-title class="text-h5 font-weight-medium text-center mb-2">
              ¡Bienvenido de nuevo!
            </v-card-title>
            <v-card-subtitle class="text-center mb-6">
              Inicia sesión para continuar gestionando tu productividad.
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
                autocomplete="current-password"
                required
                @click:append-inner="togglePassword"
              />

              <v-btn
                type="submit"
                color="primary"
                class="mt-4"
                size="large"
                block
                :loading="authStore.loading"
              >
                Iniciar sesión
              </v-btn>
            </v-form>

            <p class="text-center text-body-2 mt-6 mb-0">
              ¿No tienes una cuenta?
              <RouterLink to="/auth/register" class="auth-link">
                Regístrate aquí
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
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

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
  value => !!value || "El correo es obligatorio.",
  value => /\S+@\S+\.\S+/.test(value) || "Ingresa un correo válido."
];

const passwordRules = [
  value => !!value || "La contraseña es obligatoria.",
  value => value.length >= 6 || "Debe tener al menos 6 caracteres."
];

const formError = computed(() => authStore.error);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

watch(
  () => [form.email, form.password],
  () => {
    if (authStore.error) {
      authStore.clearError();
    }
  }
);

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
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
}

.auth-card {
  border-radius: 22px;
  padding: 32px 28px;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.25);
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
