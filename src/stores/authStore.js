import { defineStore } from "pinia";

const STORAGE_KEYS = {
  token: "focusguard-token",
  user: "focusguard-user",
  users: "focusguard-registered-users"
};

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: state => Boolean(state.token)
  },
  actions: {
    async register({ name, email, password }) {
      this.error = null;
      this.loading = true;

      try {
        await delay(800);
        const users = readJSON(STORAGE_KEYS.users, []);

        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("El correo electrónico ya está registrado.");
        }

        const newUser = { name, email, password };
        users.push(newUser);
        writeJSON(STORAGE_KEYS.users, users);

        await this.persistSession(newUser);
      } catch (error) {
        this.error = error.message || "Error al registrarse.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async login({ email, password }) {
      this.error = null;
      this.loading = true;

      try {
        await delay(600);
        const users = readJSON(STORAGE_KEYS.users, []);
        const foundUser = users.find(
          user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
        );

        if (!foundUser) {
          throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
        }

        await this.persistSession(foundUser);
      } catch (error) {
        this.error = error.message || "Error al iniciar sesión.";
        throw error;
      } finally {
        this.loading = false;
      }
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
    },
    async persistSession(user) {
      const token = `token_${Math.random().toString(36).slice(2)}${Date.now()}`;
      this.user = { name: user.name, email: user.email };
      this.token = token;
      writeJSON(STORAGE_KEYS.user, this.user);
      const storage = getStorage();
      if (storage) {
        storage.setItem(STORAGE_KEYS.token, token);
      }
    }
  }
});
