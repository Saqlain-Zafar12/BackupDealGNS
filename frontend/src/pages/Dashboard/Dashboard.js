import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard';


const Dashboard = () => {
  const { user } = useAuth();
  console.log(user,'user');
  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'manager') {
    return <ManagerDashboard />;
  } else {
    return <div>Access Denied</div>;
  }
};

export default Dashboard;