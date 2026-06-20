import { api } from '@/utils/api';

export const settingsService = {
  getSetting: async (key) => {
    try {
      return await api.get(`/settings/${key}`);
    } catch (error) {
      throw error;
    }
  },

  updateSetting: async (key, value) => {
    try {
      return await api.put(`/settings/${key}`, { value });
    } catch (error) {
      throw error;
    }
  }
};
