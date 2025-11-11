const API_BASE = 'http://localhost:8080/api/v1'; // Tu FastAPI

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
    async getSites(userId = 1) {
        try {
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

    async updateSiteClassification(siteId, categoryName, userId = null) {
        try {
            const effectiveUserId = userId || 1;
            const siteResponse = await fetch(`${API_BASE}/website-users/${siteId}`);
            const siteData = await handleResponse(siteResponse);

            const categoryResponse = await fetch(`${API_BASE}/categories/web/nombre/${encodeURIComponent(categoryName)}`);
            const categoryData = await handleResponse(categoryResponse);

            const body = {
                id_usuarios: effectiveUserId,
                id_sitios_web_usuario: siteData.id, 
                id_categorias_web_nuevo: categoryData.id
            };

            const response = await fetch(`${API_BASE}/change-category/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await handleResponse(response);
            return result;

        } catch (error) {
            console.error("Error en updateSiteClassification:", error.message);
            throw error;
        }
    },

    async getTimeConfiguration(userId = 1) {
        try {
            const response = await fetch(`${API_BASE}/configuration/${userId}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error al obtener configuración de tiempo:", error.message);
            throw error;
        }
    },

    async updateTimeConfiguration(configData, userId = 1) {
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

    async getGoalsByUser(userId = 1){
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
    }
};
