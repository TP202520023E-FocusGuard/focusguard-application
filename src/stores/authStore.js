import { defineStore } from "pinia";
import { apiService } from "../services/api/api";

const STORAGE_KEYS = {
  token: "focusguard-token",
  user: "focusguard-user"
};

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const readJSON = (key, fallback = null) => {
  const storage = getStorage();
  if (!storage) return fallback;
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("No se pudo leer el almacenamiento local", error);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
};

const removeItem = key => {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(key);
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: readJSON(STORAGE_KEYS.user),
    token: getStorage() ? getStorage().getItem(STORAGE_KEYS.token) : null,
    resetToken: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: state => Boolean(state.token),
    // GETTER PARA OBTENER EL USER ID
    userId: (state) => state.user?.id || null
  },

  actions: {
    async register(userData) {
      this.error = null;
      this.loading = true;

      try {
        const response = await apiService.register(userData);
        
        // OBTENER Y GUARDAR EL USUARIO CON SU ID
        await this.fetchUserByEmail(userData.email);

        // HACER LOGIN AUTOMÁTICO
        await this.login({
          email: userData.email,
          password: userData.password
        });

        return response;
      } catch (error) {
        this.error = error.message || "Error al registrarse.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.error = null;
      this.loading = true;

      try {
        const response = await apiService.login(credentials);
        
        // Guardar token JWT
        this.token = response.access_token;
        
        // OBTENER DATOS DEL USUARIO CON SU ID
        await this.fetchUserByEmail(credentials.email);
        
        // Guardar en localStorage
        if (this.token) {
          getStorage()?.setItem(STORAGE_KEYS.token, this.token);
        }
        if (this.user) {
          writeJSON(STORAGE_KEYS.user, this.user);
        }

        console.log("✅ Login exitoso. User ID:", this.user?.id); // Debug
        return response;
      } catch (error) {
        this.error = error.message || "Error al iniciar sesión.";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserByEmail(email) {
      try {
        const userProfile = await apiService.getUserByEmail(email);
        
        // GUARDAR TODOS LOS DATOS INCLUYENDO EL ID
        this.user = {
          id: userProfile.id,
          email: userProfile.correo,
          firstName: userProfile.nombres,
          lastName: userProfile.apellidos,
          phone: userProfile.telefono,
          registrationDate: userProfile.fecha_registro
        };
        
        console.log("Usuario obtenido por email. ID:", this.user.id);
      } catch (error) {
        console.error("Error al obtener usuario por email:", error);
        throw new Error("No se pudo obtener la información del usuario");
      }
    },

    async requestPasswordReset(resetData) {
      this.error = null;
      this.loading = true;

      try {
        const response = await apiService.requestPasswordReset(resetData);
        return response;
      } catch (error) {
        this.error = error.message || "Error al solicitar recuperación de contraseña";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async confirmPasswordReset(confirmData) {
      this.error = null;
      this.loading = true;

      try {
        const response = await apiService.confirmPasswordReset({
          token: this.resetToken, 
          new_password: confirmData.new_password
        });
        return response;
      } catch (error) {
        this.error = error.message || "Error al confirmar recuperación de contraseña";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    checkAuth() {
      const hasToken = Boolean(this.token);
      const hasUser = Boolean(this.user?.id);
      console.log("Estado de autenticación:", { hasToken, hasUser, user: this.user });
      return hasToken && hasUser;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.error = null;
      removeItem(STORAGE_KEYS.token);
      removeItem(STORAGE_KEYS.user);
    },

    clearError() {
      this.error = null;
    }
  }
});