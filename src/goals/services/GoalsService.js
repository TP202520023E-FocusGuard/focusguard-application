    import { apiService } from '../../services/api/api';
    import { useAuthStore } from '../../stores/authStore';

    export const goalsService = {
        async getGoal() {
            try {
                const authStore = useAuthStore();
                const userId = authStore.user?.id;
                const goals = await apiService.getGoalsByUser(userId);
                return goals.length > 0 ? goals[0] : null;
            } catch (error) {
                console.error("Error al obtener meta:", error);
                throw error;
            }
        },

        async saveGoal(goalData) {
            try {
                const authStore = useAuthStore();
                const userId = authStore.user?.id;

                const goals = await apiService.getGoalsByUser(userId);
                const userGoal = goals.length > 0 ? goals[0] : null;
                
                const goalPayload = {
                    id_usuarios: userId,
                    texto: goalData.texto.trim()
                };

                if (userGoal) {
                    return await apiService.updateGoal(userGoal.id, { texto: goalData.texto });
                } else {
                    return await apiService.createGoal(goalPayload);
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