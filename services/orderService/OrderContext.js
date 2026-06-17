'use client';

import { createContext, useContext, useState } from 'react';
import { orderService } from './orderService';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async (params = {}) => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(params);
      setOrders(data || []);
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

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        loadOrders,
        updateOrderStatus,
        cancelOrder,
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
