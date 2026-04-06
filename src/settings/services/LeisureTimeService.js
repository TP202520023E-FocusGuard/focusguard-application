import { apiService } from '../../services/api/api';
import { useAuthStore } from '../../stores/authStore';

export const leisureTimeService = {
    async getLeisureTime() {
        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;
            return await apiService.getLeisureTimeByUser(userId);
        } catch (error) {
            console.error("Error al obtener tiempo de ocio:", error);
            throw error;
        }
    },

    async saveLeisureTime(leisureTimeData) {
        try {
            const authStore = useAuthStore();
            const userId = authStore.user?.id;
            return await apiService.updateLeisureTime(userId, {
            tiempo_total: tiempoTotal
            });
        } catch (error) {
            console.error("Error al guardar tiempo de ocio:", error);
            throw error;
        }
    }
};