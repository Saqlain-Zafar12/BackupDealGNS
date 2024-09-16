import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Progress } from 'antd';
import { FaFire, FaPercent, FaShoppingCart, FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const SuperDealCard = ({ deal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/place-order', { state: { product: deal } });
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-2">
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden">
          <img
            src={deal.image}
            alt={deal.name}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-0 start-0 bg-red-500 text-white px-2 py-1 text-xs font-bold flex items-center">
            <FaFire className="me-1" /> {t('superDeals.hotDeal')}
          </div>
          <div className="absolute top-0 end-0 bg-green-500 text-white px-2 py-1 text-xs font-bold flex items-center">
            <FaTruck className="me-1" /> {t('product.freeDelivery')}
          </div>
          <div className="absolute bottom-0 start-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold flex items-center">
            <FaPercent className="me-1" /> {Math.round((deal.originalPrice - deal.price) / deal.originalPrice * 100)}% {t('product.off')}
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center">
              <FaShoppingCart className="me-2" /> {t('superDeals.viewDeal')}
            </button>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <Text strong className="text-sm block truncate group-hover:text-red-500 transition-colors duration-300">{deal.name}</Text>
            <div className="flex justify-between items-center mt-2">
              <Text className="text-red-500 font-bold text-lg">${deal.price}</Text>
              <Text delete type="secondary" className="text-xs">
                ${deal.originalPrice}
              </Text>
            </div>
          </div>
          <div className="mt-auto">
            <div className="mt-2">
              <Progress 
                percent={deal.soldPercentage} 
                size="small" 
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={() => (
                  <span className="text-xs flex items-center">
                    <FaShoppingCart className="me-1" /> {deal.soldCount} {t('superDeals.sold')}
                  </span>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const superDealsData = [
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  {
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1711567008221-4a85cb7acc70?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 29.99,
    originalPrice: 59.99,
    soldCount: 152,
    soldPercentage: 76,
  },
  
  // Add 5 more deals here to have a total of 6
];

const SuperDeals = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-100 py-4 sm:pb-11">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <FaFire className="text-red-500 text-2xl sm:text-3xl mr-2" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{t('superDeals.title')}</h2>
        </div>
        <div className="flex flex-wrap -mx-2">
          {superDealsData.map((deal, index) => (
            <SuperDealCard key={index} deal={deal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperDeals;