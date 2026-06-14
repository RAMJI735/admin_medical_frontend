import { api } from "@/utils/api";

export const AuthService = {
    login: async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            return response;
        } catch (error) {
            throw error;
        }
    },
    signup: async (userData) => {
        try {
            const response = await api.post("/auth/signup", userData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    logout: async () => {
        return true;
    }
};
