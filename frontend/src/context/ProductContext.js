import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProductContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const token = Cookies.get('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!isLoading) return;
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/products/active`, { headers });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, isLoading]);

  const addProduct = async (productData) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.post(`${API_URL}/products`, productData, { headers });
      setProducts(prevProducts => [...prevProducts, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.put(`${API_URL}/products/${id}`, productData, { headers });
      setProducts(prevProducts => prevProducts.map(product => product.id === id ? response.data : product));
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`${API_URL}/products/${id}`, { headers });
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const getProductById = async (id) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/products/${id}`, { headers });
      setSelectedProduct(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    isLoading,
    getProductById,
    selectedProduct,
    setSelectedProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
