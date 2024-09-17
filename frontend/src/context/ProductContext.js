import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProductContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [nonActiveProducts, setNonActiveProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const token = Cookies.get('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const [activeResponse, nonActiveResponse] = await Promise.all([
        axios.get(`${API_URL}/products/active`, { headers }),
        axios.get(`${API_URL}/products/deactivated/all`, { headers })
      ]);
      setProducts(activeResponse.data);
      setNonActiveProducts(nonActiveResponse.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  const addProduct = async (productData) => {
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      };
      const formData = createFormData(productData);
      const response = await axios.post(`${API_URL}/products`, formData, { headers });
      setProducts(prevProducts => [...prevProducts, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      };
      const formData = createFormData(productData);
      const response = await axios.put(`${API_URL}/products/${id}`, formData, { headers });
      setProducts(prevProducts => prevProducts.map(product => product.id === id ? response.data : product));
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const createFormData = (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (['attributes', 'tabs_image_url'].includes(key)) {
        formData.append(key, productData[key]);
      } else if (key === 'mainImage' && productData[key]) {
        formData.append('mainImage', productData[key]);
      } else if (key === 'tabImages' && productData[key] && productData[key].length > 0) {
        productData[key].forEach(file => formData.append('tabImages', file));
      } else {
        formData.append(key, productData[key]);
      }
    });
    return formData;
  };

  const deleteProduct = async (id) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`${API_URL}/products/deactivate/${id}`,null, { headers });
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const getProductById = useCallback(async (id) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/products/${id}`, { headers });
      setSelectedProduct(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }, [getAuthHeaders]);

  const reactivateProduct = async (id) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.put(`${API_URL}/products/activate/${id}`, null, { headers });
      
      // Update the products and nonActiveProducts states immediately
      setProducts(prevProducts => [...prevProducts, response.data]);
      setNonActiveProducts(prevNonActive => prevNonActive.filter(product => product.id !== id));
      
      return response.data;
    } catch (error) {
      console.error('Error reactivating product:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    nonActiveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    reactivateProduct,
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
