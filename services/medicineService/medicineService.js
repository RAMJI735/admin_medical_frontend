import { api } from '@/utils/api';

export const medicineService = {
  getMedicines: async (limit = 100) => {
    try {
      return await api.get(`/medicines?limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },

  addMedicine: async (body) => {
    try {
      return await api.post('/medicines', body);
    } catch (error) {
      throw error;
    }
  },

  updateMedicine: async (id, body) => {
    try {
      return await api.put(`/medicines/${id}`, body);
    } catch (error) {
      throw error;
    }
  },

  deleteMedicine: async (id) => {
    try {
      return await api.delete(`/medicines/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getCategories: async () => {
    try {
      return await api.get('/categories');
    } catch (error) {
      throw error;
    }
  },

  addCategory: async (body) => {
    try {
      return await api.post('/categories', body);
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (id, body) => {
    try {
      return await api.put(`/categories/${id}`, body);
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      return await api.delete(`/categories/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getBrands: async () => {
    try {
      return await api.get('/brands');
    } catch (error) {
      throw error;
    }
  },

  addBrand: async (body) => {
    try {
      return await api.post('/brands', body);
    } catch (error) {
      throw error;
    }
  },

  updateBrand: async (id, body) => {
    try {
      return await api.put(`/brands/${id}`, body);
    } catch (error) {
      throw error;
    }
  },

  deleteBrand: async (id) => {
    try {
      return await api.delete(`/brands/${id}`);
    } catch (error) {
      throw error;
    }
  }
};
