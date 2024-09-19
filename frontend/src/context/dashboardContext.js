import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const DashboardContext = createContext();
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/v1';

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalBrands: 0,
    ordersByStatus: { pending: 0, confirmed: 0, delivered: 0 },
    topSellingProducts: []
  });
  const [revenueStats, setRevenueStats] = useState({ dailyRevenue: [] });
  const [productStats, setProductStats] = useState({ lowStockProducts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = Cookies.get('token');

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardStats(prevStats => ({
        ...prevStats,
        ...data,
        ordersByStatus: data.ordersByStatus || { pending: 0, confirmed: 0, delivered: 0 }
      }));
      setError(null);
    } catch (err) {
      setError('Error fetching dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchRevenueStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/dashboard/revenue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRevenueStats({
        dailyRevenue: Array.isArray(data.dailyRevenue) ? data.dailyRevenue : []
      });
      setError(null);
    } catch (err) {
      setError('Error fetching revenue stats');
      console.error(err);
      setRevenueStats({ dailyRevenue: [] });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchProductStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/dashboard/product-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductStats({ lowStockProducts: data.lowStockProducts || [] });
      setError(null);
    } catch (err) {
      setError('Error fetching product stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const value = {
    dashboardStats,
    revenueStats,
    productStats,
    loading,
    error,
    fetchDashboardStats,
    fetchRevenueStats,
    fetchProductStats,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
