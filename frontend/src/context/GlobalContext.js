import React from 'react';
import { AuthProvider } from './AuthContext';
import { CategoryProvider } from './CategoryContext';
import { BrandProvider } from './BrandContext';
import { ProductProvider } from './ProductContext';
import { AttributeProvider } from './AttributesContext';

export const GlobalProvider = ({ children }) => {
  return (
    <AuthProvider>
      <CategoryProvider>
        <BrandProvider>
          <ProductProvider>
            <AttributeProvider>
              {children}
            </AttributeProvider>
          </ProductProvider>
        </BrandProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};
