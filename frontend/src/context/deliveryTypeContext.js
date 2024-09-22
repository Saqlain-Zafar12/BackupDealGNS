import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const DeliveryTypeContext = createContext();

export const useDeliveryType = () => useContext(DeliveryTypeContext);
const backendUrl = process.env.REACT_APP_BACKEND_URL;
export const DeliveryTypeProvider = ({ children }) => {
  const [deliveryTypes, setDeliveryTypes] = useState([]);

  const fetchDeliveryTypes = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/delivery-types`);
      setDeliveryTypes(response.data);
    } catch (error) {
      console.error('Error fetching delivery types:', error);
    }
  }, []);

  const addDeliveryType = async (deliveryType) => {
    try {
      const response = await axios.post(`${backendUrl}/delivery-types`, deliveryType);
      setDeliveryTypes([...deliveryTypes, response.data]);
    } catch (error) {
      console.error('Error adding delivery type:', error);
      throw error;
    }
  };

  const updateDeliveryType = async (id, updatedDeliveryType) => {
    try {
      const response = await axios.put(`${backendUrl}/delivery-types/${id}`, updatedDeliveryType);
      setDeliveryTypes(deliveryTypes.map(dt => dt.id === id ? response.data : dt));
    } catch (error) {
      console.error('Error updating delivery type:', error);
      throw error;
    }
  };

  const deleteDeliveryType = async (id) => {
    try {
      await axios.delete(`${backendUrl}/delivery-types/${id}`);
      setDeliveryTypes(deliveryTypes.filter(dt => dt.id !== id));
    } catch (error) {
      console.error('Error deleting delivery type:', error);
      throw error;
    }
  };

  return (
    <DeliveryTypeContext.Provider value={{
      deliveryTypes,
      fetchDeliveryTypes,
      addDeliveryType,
      updateDeliveryType,
      deleteDeliveryType
    }}>
      {children}
    </DeliveryTypeContext.Provider>
  );
};
