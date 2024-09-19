import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const WebRelatedContext = createContext();
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
export const useWebRelated = () => useContext(WebRelatedContext);

export const WebRelatedProvider = ({ children }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [superDeals, setSuperDeals] = useState([]);
  const [productDetails, setProductDetails] = useState(null);

  const getRecommendedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/web/recommended-products`);
      return response.data.map(product => ({
        id: product.id,
        main_image_url: product.main_image_url,
        en_title: product.en_title,
        en_category: product.en_category,
        discount: product.discount,
        delivery_charges: product.delivery_charges,
        final_price: product.final_price,
        vat_included: product.vat_included,
        ar_title: product.ar_title,
        ar_category: product.ar_category,
      }));
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      throw error;
    }
  };

  const getSuperDeals = async () => {
    try {
      const response = await axios.get(`${API_URL}/web/super-deals`);
      return response.data.map(deal => ({
        id: deal.id,
        main_image: deal.main_image,
        en_title: deal.en_title,
        hot_deal: deal.hot_deal,
        delivery_charges: deal.delivery_charges,
        discount: deal.discount,
        actual_price: deal.actual_price,
        total_price: deal.total_price,
        sold: deal.sold,
        quantity: deal.quantity,
      }));
    } catch (error) {
      console.error('Error fetching super deals:', error);
      throw error;
    }
  };

  const getWebProductDataById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/web/product/${id}`);
      setProductDetails(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  };

  const createWebOrder = async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating web order:', error);
      throw error;
    }
  };

  const value = {
    recommendedProducts,
    superDeals,
    productDetails,
    getRecommendedProducts,
    getSuperDeals,
    getWebProductDataById,
    createWebOrder,
  };

  return (
    <WebRelatedContext.Provider value={value}>
      {children}
    </WebRelatedContext.Provider>
  );
};
