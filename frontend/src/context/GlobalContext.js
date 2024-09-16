import React from 'react';
import { AuthProvider } from './AuthContext';
// Import other context providers as needed
// import { SomeOtherProvider } from './SomeOtherContext';

export const GlobalProvider = ({ children, navigate }) => {
  return (
    <AuthProvider navigate={navigate}>
      {/* Wrap with other providers as needed */}
      {/* <SomeOtherProvider> */}
        {children}
      {/* </SomeOtherProvider> */}
    </AuthProvider>
  );
};
