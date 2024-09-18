import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import {
  HomeOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CarOutlined,
  StopOutlined,
  EyeInvisibleOutlined,
  AppstoreOutlined,
  TrademarkOutlined,
} from '@ant-design/icons';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const NavLink = ({ to, icon, children }) => (
    <Link to={to} className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors duration-200">
      {icon}
      {(!collapsed || mobileMenuOpen) && <span className="ml-3">{children}</span>}
    </Link>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white"> {/* Light background color */}
      <aside className={`bg-green-50 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'} md:block ${collapsed ? 'md:w-16' : 'md:w-64'} overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-100`}> {/* Light green sidebar */}
        <div className="p-4 flex justify-between items-center">
          {(!collapsed || mobileMenuOpen) && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mr-2 text-green-600">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <h1 className="text-xl font-semibold text-green-800">Dashboard</h1>
            </div>
          )}
          <button onClick={mobileMenuOpen ? toggleMobileMenu : toggle} className="p-2 rounded-full hover:bg-green-200 transition-colors duration-200 md:hidden">
            {mobileMenuOpen ? <FiX className="text-green-800" /> : <FiMenu className="text-green-800" />}
          </button>
          <button onClick={toggle} className="p-2 rounded-full hover:bg-green-200 transition-colors duration-200 hidden md:block">
            <FiMenu className="text-green-800" />
          </button>
        </div>
        <nav className="mt-4">
          <NavLink to="/dashboard" icon={<HomeOutlined className="mr-3 text-green-600" />}>Home</NavLink>
          <NavLink to="/dashboard/products" icon={<UnorderedListOutlined className="mr-3 text-green-600" />}>Product List</NavLink>
          <NavLink to="/dashboard/non-active-products" icon={<EyeInvisibleOutlined className="mr-3 text-green-600" />}>Non-Active Products</NavLink>
          <NavLink to="/dashboard/add-product" icon={<PlusOutlined className="mr-3 text-green-600" />}>Add Product</NavLink>
          <NavLink to="/dashboard/attributes" icon={<TagsOutlined className="mr-3 text-green-600" />}>Attributes</NavLink>
          <NavLink to="/dashboard/orders" icon={<ShoppingCartOutlined className="mr-3 text-green-600" />}>Orders</NavLink>
          <NavLink to="/dashboard/confirmed-orders" icon={<CheckCircleOutlined className="mr-3 text-green-600" />}>Confirmed Orders</NavLink>
          <NavLink to="/dashboard/delivered-orders" icon={<CarOutlined className="mr-3 text-green-600" />}>Delivered Orders</NavLink>
          <NavLink to="/dashboard/cancelled-orders" icon={<StopOutlined className="mr-3 text-green-600" />}>Cancelled Orders</NavLink>
          <NavLink to="/dashboard/categories" icon={<AppstoreOutlined className="mr-3 text-green-600" />}>Categories</NavLink>
          <NavLink to="/dashboard/brands" icon={<TrademarkOutlined className="mr-3 text-green-600" />}>Brands</NavLink>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-green-100 shadow-md p-4 flex justify-between items-center"> {/* Light green header */}
          <h2 className="text-xl font-semibold text-green-800">Dashboard</h2>
          <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-green-200 transition-colors duration-200 md:hidden">
            <FiMenu className="text-green-800" />
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-green-50 p-6 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-100" style={{ maxHeight: '90vh' }}> {/* Light green main content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;