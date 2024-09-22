import React, { useEffect } from 'react'
import Carousel from '../components/Carousel'
import ProductList from '../components/ProductList'
import SuperDeals from '../components/SuperDeals'
import { useWebRelated } from '../context/WebRelatedContext'
import { Spin } from 'antd';

function Store() {
  const { currentView, getRecommendedProducts, isLoadingRecommended } = useWebRelated();

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        await getRecommendedProducts();
      } catch (error) {
        console.error('Error fetching initial products:', error);
      }
    };

    fetchInitialProducts();
  }, []);

  if (isLoadingRecommended && currentView === 'home') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {currentView === 'home' && (
        <>
          <Carousel />
          <ProductList />
          <SuperDeals />
        </>
      )}
      {currentView === 'searchResults' && <ProductList />}
      {currentView === 'allProducts' && <ProductList />}
      {currentView === 'deals' && <SuperDeals />}
    </div>
  );
}

export default Store
