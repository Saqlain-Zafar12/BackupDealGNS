import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "./Input";
import TopBanner from "./TopBanner";
import { Select } from 'antd';
import { Button } from './Botton';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  }, [i18n]);

  const changeLanguage = (value) => {
    i18n.changeLanguage(value);
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
    sessionStorage.setItem('language', value);
  };

  return (
    <>
      <TopBanner />
      <header className="w-full bg-white shadow-sm font-sans">
        <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 w-full mb-4 sm:mb-0">
            <div className="bg-red-600 text-white font-bold py-1 px-3 rounded-md mx-2">
              DealsGNS
            </div>
            <div className="flex-grow flex items-center">
              <Input
                className="w-full rounded-s-md rounded-e-none border-e-0 focus:ring-red-600 focus:border-red-600"
                placeholder={t('search.placeholder')}
                type="search"
              />
              <Button className="rounded-s-none bg-red-600 hover:bg-red-700 text-white">
                {t('search.button')}
              </Button>
            </div>
          </div>
          <div className='px-3'>
          <Select
            defaultValue={i18n.language}
            style={{ width: 120 }}
            onChange={changeLanguage}
            className="self-end sm:self-auto"
          >
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="ar">عربي</Select.Option>
          </Select>
          </div>
        </div>
        <nav className="border-t border-gray-200">
          <div className="container mx-auto px-4">
            <ul className="flex flex-wrap justify-center space-x-4 rtl:space-x-reverse py-4">
              <li>
                <a href="#" className="text-gray-700 hover:text-red-600 font-medium text-lg transition-colors duration-300 pb-2 focus:outline-none rounded-md relative group">
                  {t('navbar.home')}
                  <span className="absolute bottom-0 start-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-red-600 font-medium text-lg transition-colors duration-300 pb-2 focus:outline-none rounded-md relative group">
                  {t('navbar.allProducts')}
                  <span className="absolute bottom-0 start-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start"></span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-red-600 font-medium text-lg transition-colors duration-300 pb-2 focus:outline-none rounded-md relative group">
                  {t('navbar.deals')}
                  <span className="absolute bottom-0 start-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start"></span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}