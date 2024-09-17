import React from 'react';
import { AuthProvider } from './AuthContext';
import { CategoryProvider } from './CategoryContext';
import { BrandProvider } from './BrandContext';
import { ProductProvider } from './ProductContext';
import { AttributeProvider } from './AttributesContext';
import { OrderProvider } from './OrderContext';
import { WebRelatedProvider } from './WebRelatedContext';

export const GlobalProvider = ({ children }) => {
  return (
    <AuthProvider>
      <CategoryProvider>
        <BrandProvider>
          <ProductProvider>
            <AttributeProvider>
              <OrderProvider>
                <WebRelatedProvider>
                  {children}
                </WebRelatedProvider>
              </OrderProvider>
            </AttributeProvider>
          </ProductProvider>
        </BrandProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};
