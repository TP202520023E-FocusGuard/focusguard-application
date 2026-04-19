import { apiService } from "../../services/api/api.js";
import { useAuthStore } from "../../stores/authStore.js";

export const weeklyLeisureHoursService = {

    async getWeeklyLeisureHours(startDate = null, endDate = null) {

        const authStore = useAuthStore();
        const userId = 1;

        try {
            const data = await apiService.getWeeklyLeisureHoursByUser(
                userId,
                startDate,
                endDate
            );

            return data || [];

        } catch (error) {
            console.error("Error obteniendo horas de ocio semanales:", error);
            return [];
        }
    }
};