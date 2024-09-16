import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import OrderConfirmation from "./pages/ConfirmOrder";
import PlaceOrder from "./pages/PlaceOrder";
import Store from "./pages/Store";
import DashboardLayout from './pages/Dashboard/DashboardLayouts';
import ProductList from './pages/Dashboard/ProductList';
import NonActiveProduct from './pages/Dashboard/NonActiveProduct';
import AddProduct from './pages/Dashboard/AddProducts';
import EditProduct from './pages/Dashboard/EditProduct';
import AttributeManagement from './pages/Dashboard/AttributeManagement';
import OrderList from './pages/Dashboard/OrderList';
import ConfirmOrderList from './pages/Dashboard/ConfirmOrderList';
import DeliveredOrderList from './pages/Dashboard/DeliveredOrderList';
import CancelledOrderList from './pages/Dashboard/CancelledOrderList';
import CategoryList from './pages/Dashboard/CategoryList';
import BrandList from './pages/Dashboard/BrandList';
import Login from './pages/Login/Login';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/store" replace />} />

      <Route path="/store" element={
        <>
          <Navbar />
          <Store />
          <Footer />
        </>
      } />

      <Route path="/place-order" element={
        <>
          <Navbar />
          <PlaceOrder />
          <Footer />
        </>
      } />

      <Route path="/order-confirmation" element={
        <>
          <Navbar />
          <OrderConfirmation />
          <Footer />
        </>
      } />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<h1 className="text-2xl font-bold">Welcome to Dashboard</h1>} />
        <Route path="products" element={<ProductList />} />
        <Route path="non-active-products" element={<NonActiveProduct />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:id" element={<EditProduct />} /> 
        <Route path="attributes" element={<AttributeManagement />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="brands" element={<BrandList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="confirmed-orders" element={<ConfirmOrderList />} />
        <Route path="delivered-orders" element={<DeliveredOrderList />} />
        <Route path="cancelled-orders" element={<CancelledOrderList />} />
      </Route>

      <Route path="*" element={<h1 className="text-2xl font-bold text-center mt-10">404: Page Not Found</h1>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;