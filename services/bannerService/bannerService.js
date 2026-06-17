import { api } from '@/utils/api';

export const bannerService = {
  getBanners: async (isActive) => {
    try {
      const query = isActive !== undefined ? `?isActive=${isActive}` : '';
      return await api.get(`/banners${query}`);
    } catch (error) {
      throw error;
    }
  },

  createBanner: async (body) => {
    try {
      return await api.post('/banners', body);
    } catch (error) {
      throw error;
    }
  },

  updateBanner: async (id, body) => {
    try {
      return await api.put(`/banners/${id}`, body);
    } catch (error) {
      throw error;
    }
  },

  deleteBanner: async (id) => {
    try {
      return await api.delete(`/banners/${id}`);
    } catch (error) {
      throw error;
    }
  }
};
