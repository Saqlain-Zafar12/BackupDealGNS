import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaBox, FaShoppingBag, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  const isRTL = i18n.language === 'ar';


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
                <p className="text-gray-600">{t('orderConfirmation.orderDate')}: <span className="font-semibold">14 Sep, 2024</span></p>
                <p className="text-gray-600">{t('orderConfirmation.orderNo')}: <span className="font-semibold">688564</span></p>
                <p className="text-gray-600">{t('orderConfirmation.payment')}: <span className="font-semibold">{t('orderConfirmation.cashOnDelivery')}</span></p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('orderConfirmation.shippingAddress')}</h3>
                <p className="text-gray-600">Odette Stafford</p>
                <p className="text-gray-600">Soluta consectetur a, Al ain</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <FaShoppingBag className="text-3xl text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('orderConfirmation.productName')}</h4>
                    <p className="text-gray-500">{t('orderConfirmation.quantity')}: 1</p>
                  </div>
                </div>
                <p className="font-semibold">59 AED</p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>{t('orderConfirmation.subtotal')}</span>
                  <span>59 AED</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('orderConfirmation.shippingFee')}</span>
                  <span className="text-green-500">{t('orderConfirmation.free')}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('orderConfirmation.grandTotal')}</span>
                  <span>59 AED</span>
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