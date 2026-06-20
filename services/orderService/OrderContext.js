'use client';

import { createContext, useContext, useState } from 'react';
import { orderService } from './orderService';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalOrders: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  });

  const loadOrders = async (params = {}) => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(params);
      if (data && Array.isArray(data)) {
        setOrders(data);
        setPagination({
          totalOrders: data.length,
          totalPages: 1,
          currentPage: 1,
          limit: data.length
        });
      } else if (data && data.orders) {
        setOrders(data.orders);
        setPagination({
          totalOrders: data.totalOrders,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          limit: data.limit
        });
      } else {
        setOrders([]);
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status, rxVerified) => {
    try {
      const res = await orderService.updateOrderStatus(id, status, rxVerified);
      // reload to reflect changes
      await loadOrders();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const cancelOrder = async (id) => {
    try {
      const res = await orderService.cancelOrder(id);
      await loadOrders();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateOrder = async (id, data) => {
    try {
      const res = await orderService.updateOrder(id, data);
      await loadOrders();
      return res;
    } catch (error) {
      throw error;
    }
  };

  const deleteOrder = async (id) => {
    try {
      const res = await orderService.deleteOrder(id);
      await loadOrders();
      return res;
    } catch (error) {
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        pagination,
        loadOrders,
        updateOrderStatus,
        cancelOrder,
        updateOrder,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
