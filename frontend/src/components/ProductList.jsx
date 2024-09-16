import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Typography, Space } from 'antd';
import { FaTag, FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/place-order', { state: { product } });
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <Card
        hoverable
        className="h-full"
        onClick={handleCardClick}
        cover={
          <div className="relative">
            <img
              alt={product.name}
              src={product.image}
              className="object-cover h-48 w-full"
            />
            <div className="absolute top-2 left-2 flex gap-2">
              {product.discount && (
                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <FaTag className="mr-1" /> {product.discount}% OFF
                </div>
              )}
              {product.freeDelivery && (
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <FaTruck className="mr-1" /> Free Delivery
                </div>
              )}
            </div>
          </div>
        }
      >
        <Meta
          title={
            <div>
              <Text className="text-sm text-gray-500">{product.category}</Text>
              <Text strong className="text-lg block">{product.name}</Text>
            </div>
          }
          description={
            <Space direction="vertical" className="w-full">
              <Text className="text-gray-500">
                {product.description.length > 60
                  ? `${product.description.slice(0, 60)}...`
                  : product.description}
              </Text>
              <div className="flex justify-between items-center mt-2">
                <Text className="text-lg font-semibold">
                  {product.price} AED
                </Text>
                <Text type="secondary" className="text-sm">
                  VAT included
                </Text>
              </div>
              
            </Space>
          }
        />
      </Card>
    </div>
  );
};

const productData = [
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },
  {
    name: 'Jet3D Screen',    
    category: 'Ring Enlarger',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '10 inch or 12 inch 3D Screen Enlarger',
    price: 39,
    discount: 39,
    freeDelivery: true,
  },

  
];

const ProductList = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('productList.recommendedProducts')}</h2>
        <div className="flex flex-wrap -mx-2">
          {productData.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;