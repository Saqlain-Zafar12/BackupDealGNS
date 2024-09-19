import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const OrderContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/v1';

export const OrderProvider = ({ children }) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const token = Cookies.get('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchPendingOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/orders/pending`, { headers });
      setPendingOrders(response.data);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchConfirmedOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/orders/confirmed`, { headers });
      setConfirmedOrders(response.data);
    } catch (error) {
      console.error('Error fetching confirmed orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchDeliveredOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/orders/delivered`, { headers });
      setDeliveredOrders(response.data);
    } catch (error) {
      console.error('Error fetching delivered orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchCancelledOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/orders/cancelled`, { headers });
      setCancelledOrders(response.data);
    } catch (error) {
      console.error('Error fetching cancelled orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  const confirmOrder = async (id) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`${API_URL}/orders/confirm/${id}`, null, { headers });
      await fetchPendingOrders();
      await fetchConfirmedOrders();
    } catch (error) {
      console.error('Error confirming order:', error);
      throw error;
    }
  };

  const cancelOrder = async (id) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`${API_URL}/orders/cancel/${id}`, null, { headers });
      await fetchPendingOrders();
      await fetchCancelledOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  };

  const getOrderDetails = async (id) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/orders/details/${id}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  };

  const deliverOrder = async (id) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`${API_URL}/orders/deliver/${id}`, null, { headers });
      await fetchConfirmedOrders();
      await fetchDeliveredOrders();
    } catch (error) {
      console.error('Error delivering order:', error);
      throw error;
    }
  };

  const value = {
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    isLoading,
    fetchPendingOrders,
    fetchConfirmedOrders,
    fetchDeliveredOrders,
    fetchCancelledOrders,
    confirmOrder,
    cancelOrder,
    getOrderDetails,
    deliverOrder, // Add this new function to the context value
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

