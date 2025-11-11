import { apiService } from '../../services/api/api';

export const goalsService = {
    // Métodos para metas (goals)
    async getGoal(userId = 1) {
        try {
            const goals = await apiService.getGoalsByUser(userId);
            return goals.length > 0 ? goals[0] : null;
        } catch (error) {
            console.error("Error al obtener meta:", error);
            throw error;
        }
    },

    async saveGoal(goalData) {
        try {
            // AHORA usa el endpoint específico por usuario
            const goals = await apiService.getGoalsByUser(goalData.id_usuarios);
            const userGoal = goals.length > 0 ? goals[0] : null;
            
            if (userGoal) {
                return await apiService.updateGoal(userGoal.id, { texto: goalData.texto });
            } else {
                return await apiService.createGoal(goalData);
            }
        } catch (error) {
            console.error("Error al guardar meta:", error);
            throw error;
        }
    },

    async deleteGoal(goalId) {
        try {
            return await apiService.deleteGoal(goalId);
        } catch (error) {
            console.error("Error al eliminar meta:", error);
            throw error;
        }
    }
};

export default goalsService;