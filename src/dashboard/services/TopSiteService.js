import { apiService } from '../../services/api/api.js';
import { useAuthStore } from '../../stores/authStore.js';

export const topSiteService = {
  async getTopSites() {
    const authStore = useAuthStore();
    const userId = authStore.user?.id;
    try {
      const data = await apiService.getTopSitesByUser(userId);
      return data || [];
    } catch (error) {
      console.error("Error obteniendo sitios más visitados:", error);
      return [];
    }
    }
};