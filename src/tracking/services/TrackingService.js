import { apiService } from '../../services/api/api';
import { useAuthStore } from '../../stores/authStore';

export const siteService = {
    // Obtener todos los sitios del usuario autenticado
    async getSites() {
        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;
            
            if (!userId) {
                throw new Error("Usuario no autenticado");
            }

            console.log("🔍 Obteniendo sitios para userId:", userId);
            const sites = await apiService.getSites(userId);
            
            return this.processSitesData(sites);
        } catch (error) {
            console.error("Error en siteService.getSites:", error);
            throw error;
        }
    },

    // Actualizar clasificación de un sitio
    async updateSiteClassification(siteId, newClassification) {
        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;
            
            console.log("🔍 DEBUG - TrackingService:", {
                userId, 
                siteId, 
                newClassification 
            });
            
            if (!userId) {
                throw new Error("Usuario no autenticado");
            }

            const backendCategoryName = this.getBackendClassificationName(newClassification);
            
            console.log("🔄 Actualizando clasificación - llamando a apiService:", {
                siteId,
                newClassification,
                userId, // ✅ userId está disponible aquí
                backendCategoryName
            });

            // ✅ Asegúrate de pasar TODOS los parámetros en el orden correcto
            const result = await apiService.updateSiteClassification(
                siteId, 
                backendCategoryName, 
                userId  // ✅ Pasar userId como tercer parámetro
            );

            console.log("✅ Clasificación actualizada:", result);
            return result;

        } catch (error) {
            console.error("❌ Error en siteService.updateSiteClassification:", error);
            throw error;
        }
    },
    // Mapear clasificación del backend al frontend
    mapBackendClassification(backendClassification) {
        if (!backendClassification) return "Sin Categoría";
        const map = {
            productivo: "Productivo",
            neutral: "Neutral",
            "doble filo": "Doble Filo",
            distractor: "Distractor",
            "sin categoria": "Sin Categoría",
            "sin categoría": "Sin Categoría"
        };
        return map[backendClassification.trim().toLowerCase()] || "Sin Categoría";
    },

    // Mapear clasificación del frontend al backend
    getBackendClassificationName(frontendClassification) {
        const map = {
            "Productivo": "productivo",
            "Neutral": "neutral", 
            "Doble Filo": "doble filo",
            "Distractor": "distractor",
            "Sin Categoría": "sin categoria"
        };
        return map[frontendClassification] || "sin categoria";
    },

    // Procesar datos de sitios para el frontend
    processSitesData(sites) {
        if (!Array.isArray(sites)) {
            throw new Error("Los sitios deben ser un array");
        }

        return sites.map(site => ({
            id: site.id || site.dominio,
            name: site.dominio,
            classification: this.mapBackendClassification(site.categoria?.toLowerCase()),
            rawData: site
        }));
    },

    // Obtener estadísticas de sitios
    getSiteStats(sites) {
        const total = sites.length;
        const classified = sites.filter(site => site.classification && site.classification !== "Sin Categoría").length;
        const productive = sites.filter(site => site.classification === "Productivo").length;
        
        return [
            { label: "Total Sitios", value: total, color: "primary--text" },
            { label: "Clasificados", value: classified, color: "green--text" },
            { label: "Productivos", value: productive, color: "success--text" }
        ];
    },

    // Filtrar sitios por categoría
    filterSites(sites, selectedFilter) {
        if (selectedFilter === "Todos") return sites;
        if (selectedFilter === "Sin Categoría") {
            return sites.filter(site => !site.classification || site.classification === "Sin Categoría");
        }
        return sites.filter(site => site.classification === selectedFilter);
    }
};

export default siteService;