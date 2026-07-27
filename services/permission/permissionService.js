import { api } from '@/utils/api';

export const PermissionService = {
  getPermissions: async () => {
    try {
      return await api.get('/permissions');
    } catch (error) {
      throw error;
    }
  },

  getPermissionByRole: async (role) => {
    try {
      return await api.get(`/permissions/${role}`);
    } catch (error) {
      throw error;
    }
  },

  savePermission: async (payload) => {
    try {
      return await api.post('/permissions', payload);
    } catch (error) {
      throw error;
    }
  },

  deletePermission: async (role) => {
    try {
      return await api.delete(`/permissions/${role}`);
    } catch (error) {
      throw error;
    }
  }
};

export default PermissionService;
