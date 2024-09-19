import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Space, message, Spin } from 'antd';
import { FaTag, FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWebRelated } from '../context/WebRelatedContext';

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  if (!product) return null;

  const handleCardClick = () => {
    navigate('/place-order', { state: { product } });
  };

  // Function to check if delivery is free
  const isDeliveryFree = (charges) => {
    return parseFloat(charges) <= 0.01; // Consider charges less than or equal to 0.01 as free
  };

  // Use the appropriate language title and category
  console.log(product);
  
  const title = i18n.language === 'ar' ? product.ar_title : product.en_title;
  const category = i18n.language === 'ar' ? product.ar_category : product.en_category;
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <Card
        hoverable
        className="h-full"
        onClick={handleCardClick}
        cover={
          <div className="relative">
            <img
              alt={title || 'Product Image'}
              src={`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/v1'}/${product.main_image_url}`}
              className="object-cover h-48 w-full"
            />
            <div className="absolute top-2 left-2 flex gap-2">
              {parseFloat(product.discount) > 0 && (
                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <FaTag className="mr-1" /> {product.discount}% {t('product.off')}
                </div>
              )}
              {isDeliveryFree(product.delivery_charges) && (
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <FaTruck className="mr-1" /> {t('product.freeDelivery')}
                </div>
              )}
            </div>
          </div>
        }
      >
        <Meta
          title={
            <div>
              <Text className="text-sm text-gray-500">{category}</Text>
              <Text strong className="text-lg block">{title}</Text>
            </div>
          }
          description={
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between items-center mt-2">
                <Text className="text-lg font-semibold">
                  {product.final_price} AED
                </Text>
                <Text type="secondary" className="text-sm">
                  {product.vat_included ? t('product.vatIncluded') : t('product.vatNotIncluded')}
                </Text>
              </div>
            </Space>
          }
        />
      </Card>
    </div>
  );
};

const ProductList = () => {
  const { t } = useTranslation();
  const { getRecommendedProducts } = useWebRelated();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true);
        const products = await getRecommendedProducts();
        setProductData(products || []); // Ensure it's always an array
        setError(null);
      } catch (error) {
        console.error('Error fetching recommended products:', error);
        setError(t('errors.fetchRecommendedProducts'));
        message.error(t('errors.fetchRecommendedProducts'));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [getRecommendedProducts, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('productList.recommendedProducts')}</h2>
        {productData.length > 0 ? (
          <div className="flex flex-wrap -mx-2">
            {productData.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 p-4">
            {t('productList.noProductsAvailable')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;