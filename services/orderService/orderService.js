import { api } from '@/utils/api';

export const orderService = {
  getOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders${queryString ? `?${queryString}` : ''}`;
      return await api.get(url);
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (id, status, rxVerified) => {
    try {
      const body = { status };
      if (rxVerified !== undefined) {
        body.rxVerified = rxVerified;
      }
      return await api.put(`/orders/${id}/status`, body);
    } catch (error) {
      throw error;
    }
  },

  cancelOrder: async (id) => {
    try {
      return await api.patch(`/orders/${id}/cancel`);
    } catch (error) {
      throw error;
    }
  },

  updateOrder: async (id, data) => {
    try {
      return await api.put(`/orders/${id}`, data);
    } catch (error) {
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      return await api.delete(`/orders/${id}`);
    } catch (error) {
      throw error;
    }
  }
};
