import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const DashboardContext = createContext();
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/v1';

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});
  const [revenueStats, setRevenueStats] = useState({});
  const [productStats, setProductStats] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);

  const token = Cookies.get('token');

  const fetchData = useCallback(async (endpoint, setter) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching from: ${API_URL}/dashboard${endpoint}`);
      const response = await axios.get(`${API_URL}/dashboard${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`${endpoint} response:`, response);
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (typeof response.data === 'string') {
        console.error(`Unexpected string response for ${endpoint}:`, response.data);
        throw new Error('Received HTML instead of JSON');
      }
      
      setter(response.data);
    } catch (err) {
      console.error(`Error fetching ${endpoint} data:`, err);
      setError(`Error fetching ${endpoint} data: ${err.message}`);
      if (err.response) {
        console.error('Error response:', err.response);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchDashboardStats = useCallback(() => fetchData('/stats', setDashboardStats), [fetchData]);
  const fetchRevenueStats = useCallback(() => fetchData('/revenue', setRevenueStats), [fetchData]);
  const fetchProductStats = useCallback(() => fetchData('/product-stats', setProductStats), [fetchData]);
  const fetchMonthlyRevenue = useCallback(() => fetchData('/monthly-revenue', setMonthlyRevenue), [fetchData]);
  const fetchMonthlySales = useCallback(() => fetchData('/monthly-sales', setMonthlySales), [fetchData]);
  const fetchWeeklyRevenue = useCallback(() => fetchData('/weekly-revenue', setWeeklyRevenue), [fetchData]);
  const fetchWeeklySales = useCallback(() => fetchData('/weekly-sales', setWeeklySales), [fetchData]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchRevenueStats(),
        fetchProductStats(),
        fetchMonthlyRevenue(),
        fetchMonthlySales(),
        fetchWeeklyRevenue(),
        fetchWeeklySales()
      ]);
    } catch (err) {
      console.error('Error fetching all dashboard data:', err);
      setError('Error fetching all dashboard data');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardStats, fetchRevenueStats, fetchProductStats, fetchMonthlyRevenue, fetchMonthlySales, fetchWeeklyRevenue, fetchWeeklySales]);

  const value = {
    loading,
    error,
    dashboardStats,
    revenueStats,
    productStats,
    monthlyRevenue,
    monthlySales,
    weeklyRevenue,
    weeklySales,
    fetchDashboardStats,
    fetchRevenueStats,
    fetchProductStats,
    fetchMonthlyRevenue,
    fetchMonthlySales,
    fetchWeeklyRevenue,
    fetchWeeklySales,
    fetchAllData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
