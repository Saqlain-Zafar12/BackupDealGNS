import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaBox, FaShoppingBag, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWebRelated } from '../context/WebRelatedContext';
setTimeout(() => {
  window.scrollTo(0, 0);
}, 100);
const OrderConfirmation = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getUserOrders } = useWebRelated();
  const [orderDetails, setOrderDetails] = useState(null);
 
  useEffect(() => {
    const storedLanguage = sessionStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }

    const fetchOrderDetails = async () => {
      try {
        const order = await getUserOrders();
        setOrderDetails(order);
      } catch (error) {
        console.error('Error fetching user order:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchOrderDetails();
  }, [i18n, getUserOrders]);

  const isRTL = i18n.language === 'ar';
  const backendUrl = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000').replace(/\/api\/v1$/, '');

  if (!orderDetails) {
    return <div>Loading...</div>; // Or a more sophisticated loading state
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FaCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('orderConfirmation.title')}</h1>
          <p className="text-xl text-gray-600">{t('orderConfirmation.message')}</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-green-500 p-6">
            <h2 className="text-2xl font-semibold text-white flex items-center justify-between">
              <span>{t('orderConfirmation.orderDetails')}</span>
              <FaBox className="text-3xl" />
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-600">{t('orderConfirmation.fullName')}: <span className="font-semibold">{orderDetails.full_name}</span></p>
                <p className="text-gray-600">{t('orderConfirmation.mobileNumber')}: <span className="font-semibold">+{orderDetails.mobilenumber}</span></p>
                <p className="text-gray-600">{t('orderConfirmation.payment')}: <span className="font-semibold">{t('orderConfirmation.cashOnDelivery')}</span></p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('orderConfirmation.shippingAddress')}</h3>
                <p className="text-gray-600">{orderDetails.shipping_address}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              {orderDetails.products.map((product, index) => (
                <div key={index} className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                      <img src={`${product.main_image}`} alt={product.title} className="w-full h-full object-cover rounded-md" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{isRTL ? product.ar_title : product.en_title}</h4>
                      <p className="text-gray-500">{t('orderConfirmation.quantity')}: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{product.total} AED</p>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>{t('orderConfirmation.subtotal')}</span>
                  <span>{orderDetails.subtotal} AED</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('orderConfirmation.shippingFee')}</span>
                  <span>{orderDetails.shipping_fee > 0 ? `${orderDetails.shipping_fee} AED` : t('orderConfirmation.free')}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('orderConfirmation.grandTotal')}</span>
                  <span>{orderDetails.grand_total} AED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition duration-300"
          >
            <FaShoppingBag className="mr-2" />
            {t('orderConfirmation.viewMoreOffers')}
            {isRTL ? <FaArrowLeft className="mr-2" /> : <FaArrowRight className="ml-2" />}
          </button>
          <p className="mt-4 text-gray-600">{t('orderConfirmation.thankYou')}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;