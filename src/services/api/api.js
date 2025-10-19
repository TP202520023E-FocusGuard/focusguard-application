// frontend/src/services/api.js
const API_BASE = 'http://localhost:8000/api/v1'; // Tu FastAPI


export const apiService = {
    // ✅ PARA EL LISTADO DE SITIOS (usando tu endpoint actual)
    async getSites(userId = 1) {
        const response = await fetch(`${API_BASE}/sites/user/${userId}/combined`);
        return await response.json();
    },

    // ✅ PARA LA PREDICCIÓN GRU (nuevo endpoint)
    async predictFocus(navigationData) {
        const response = await fetch(`${API_BASE}/sequential/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(navigationData)
        });
        return await response.json();
    },

    // ✅ PARA EL ESTADO DEL MODELO GRU
    async getModelStatus() {
        const response = await fetch(`${API_BASE}/sequential/status`);
        return await response.json();
    },

    // ✅ ACTUALIZAR CATEGORÍA (mantener tu endpoint actual)
    async updateSiteClassification(classificationData) {
        const user_id = 1;
        
        const response = await fetch(`${API_BASE}/sites/user/${user_id}/classification`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(classificationData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    },

    async getTimeConfiguration() {
        const user_id = 1;
        const response = await fetch(`${API_BASE}/configuration/${user_id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    },

    async updateTimeConfiguration(configData) {
        const user_id = 1;

        const response = await fetch(`${API_BASE}/configuration/${user_id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(configData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }

};