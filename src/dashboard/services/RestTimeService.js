import { apiService } from '../../services/api/api.js';
import { useAuthStore } from '../../stores/authStore.js';

export const restTimeService = {
  async getRestTime() {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;
    try {
      const data = await apiService.getLeisureTimeByUser(userId);
      return data?.tiempo_total ?? 60;
    } catch (error) {
      console.error("Error obteniendo tiempo de descanso:", error);
      return 60;
    }
  }
};