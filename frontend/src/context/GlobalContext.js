import React from 'react';
import { AuthProvider } from './AuthContext';
import { CategoryProvider } from './CategoryContext';
import { BrandProvider } from './BrandContext';
import { ProductProvider } from './ProductContext';
import { AttributeProvider } from './AttributesContext';
import { OrderProvider } from './OrderContext';
import { WebRelatedProvider } from './WebRelatedContext';
import { DashboardProvider } from './dashboardContext'; // Add this import

export const GlobalProvider = ({ children }) => {
  return (
    <AuthProvider>
      <CategoryProvider>
        <BrandProvider>
          <ProductProvider>
            <AttributeProvider>
              <OrderProvider>
                <WebRelatedProvider>
                  <DashboardProvider> {/* Add DashboardProvider here */}
                    {children}
                  </DashboardProvider>
                </WebRelatedProvider>
              </OrderProvider>
            </AttributeProvider>
          </ProductProvider>
        </BrandProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};
