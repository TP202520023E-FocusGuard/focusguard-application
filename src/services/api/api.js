const API_BASE = 'http://localhost:8080/api/v1';

async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
            const data = await response.json();
            if (data?.detail) errorMessage += ` - ${data.detail}`;
        } catch {
        }
        throw new Error(errorMessage);
    }
    return response.json();
}

export const apiService = {

    async getUserByEmail(email) {
        try {
            const response = await fetch(`${API_BASE}/users/by-email/${encodeURIComponent(email)}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener usuario por email:", error.message);
            throw error;
        }
    },

    async getUserById(userId) {
        try {
            const response = await fetch(`${API_BASE}/users/${userId}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener usuario por ID:", error.message);
            throw error;
        }
    },

    async getSites(userId) {
        try {
            if (!userId) {
                throw new Error("Se requiere userId para obtener sitios");
            }
            const response = await fetch(`${API_BASE}/website-users/website-with-category/user/${userId}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener sitios:", error.message);
            throw error;
        }
    },

    async predictFocus(navigationData) {
        if (!navigationData || !Array.isArray(navigationData) || navigationData.length === 0) {
            throw new Error("navigationData inválido o vacío");
        }

        try {
            const response = await fetch(`${API_BASE}/sequential/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(navigationData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al predecir foco:", error.message);
            throw error;
        }
    },

    async getModelStatus() {
        try {
            const response = await fetch(`${API_BASE}/sequential/status`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener estado del modelo:", error.message);
            throw error;
        }
    },

    async updateSiteClassification(siteId, categoryName, userId) {
        try {
            if (!userId) {
                throw new Error("Se requiere userId para actualizar clasificación");
            }

            // 1. Obtener la categoría por nombre
            const categoryResponse = await fetch(`${API_BASE}/categories/web/nombre/${encodeURIComponent(categoryName)}`);
            const categoryData = await handleResponse(categoryResponse);

            // 2. Preparar el body según lo que espera el backend
            const body = {
                id_categorias_web: categoryData.id
            };

            console.log("🔄 Enviando PUT a /website-users/users/{userId}/sites/{siteId} con body:", body);

            // 3. Hacer la actualización
            const response = await fetch(`${API_BASE}/website-users/users/${userId}/sites/${siteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await handleResponse(response);
            console.log("✅ Clasificación actualizada exitosamente:", result);
            return result;

        } catch (error) {
            console.error("❌ Error en updateSiteClassification:", error.message, error);
            throw error;
        }
    },

    async getTimeConfiguration(userId) {
        try {
            const response = await fetch(`${API_BASE}/configuration/${userId}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener configuración de tiempo:", error.message);
            throw error;
        }
    },

    async updateTimeConfiguration(configData, userId) {
        try {
            const response = await fetch(`${API_BASE}/configuration/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al actualizar configuración de tiempo:", error.message);
            throw error;
        }
    },

    async getGoalsByUser(userId){
        try {
            const response = await fetch(`${API_BASE}/goals/user/${userId}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener metas:", error.message);
            throw error;
        }
    },

    async createGoal(goalData){
        try {
            const response = await fetch(`${API_BASE}/goals/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData)
            });
            return await handleResponse(response);
        }
        catch (error) {
            console.error("Error al crear meta:", error.message);
            throw error;
        }
    },

    async updateGoal(goalId, goalData){
        try {
            const response = await fetch(`${API_BASE}/goals/${goalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData)
            });
            return await handleResponse(response);
        }
        catch (error) {
            console.error("Error al actualizar meta:", error.message);
            throw error;
        }
    },

    async deleteGoal(goalId){
        try {
            const response = await fetch(`${API_BASE}/goals/${goalId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return true;
        }
        catch (error) {
            console.error("Error al eliminar meta:", error.message);
            throw error;
        }
    },

    async getWeeklyGoalsByUser(userId) {
        try {
            const response = await fetch(`${API_BASE}/weekly-goals/user/${userId}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener objetivos semanales:", error.message);
            return []; // devuelvo array vacío si falla
        }
    },

    async createWeeklyGoal(goalData) {
        try {
            const response = await fetch(`${API_BASE}/weekly-goals/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al crear objetivo semanal:", error.message);
            throw error;
        }
    },

    async updateWeeklyGoal(goalId, goalData) {
        try {
            const response = await fetch(`${API_BASE}/weekly-goals/${goalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al actualizar objetivo semanal:", error.message);
            throw error;
        }
    },

    async deleteWeeklyGoal(goalId) {
        try {
            const response = await fetch(`${API_BASE}/weekly-goals/${goalId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar objetivo semanal:", error.message);
            throw error;
        }
    },


    async register(userData) {
        try {
            const response = await fetch(`${API_BASE}/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo: userData.email,
                    nombres: userData.firstName,
                    apellidos: userData.lastName,
                    telefono: userData.phone,
                    password: userData.password,
                    frase_seguridad: userData.frase_seguridad
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en registro:", error.message);
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo: credentials.email,
                    password: credentials.password
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en login:", error.message);
            throw error;
        }
    },

    async requestPasswordReset(resetData) {
        try {
            const response = await fetch(`${API_BASE}/users/password-reset-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo: resetData.email,
                    frase_seguridad: resetData.frase_seguridad
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en solicitud de recuperación:", error.message);
            throw error;
        }
    },

    async confirmPasswordReset(confirmData) {
        try {
            const response = await fetch(`${API_BASE}/users/password-reset-confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    new_password: confirmData.new_password
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en confirmación de recuperación:", error.message);
            throw error;
        }
    },

    async getUserById(userId) {
        try {
            const response = await fetch(`${API_BASE}/users/${userId}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener usuario:", error.message);
            throw error;
        }
    }

};
