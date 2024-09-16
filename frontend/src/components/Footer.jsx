import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone } from "react-icons/fa";
import { Input } from './Input';
import { Button } from './Botton';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#2d3741] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">{t('footer.contactUs')}</h2>
            <p className="mb-2">{t('footer.companyInfo')}</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaFacebook className="w-4 h-4 me-2" />
                Jetronics.ae
              </li>
              <li className="flex items-center">
                <FaEnvelope className="w-4 h-4 me-2" />
                Nayeem@jetronics.ae
              </li>
              <li className="flex items-center">
                <FaInstagram className="w-4 h-4 me-2" />
                Jetronics.ae
              </li>
              <li className="flex items-center">
                <FaPhone className="w-4 h-4 me-2" />
                <span className="ltr:inline-block" dir="ltr">+971 589989090</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">{t('footer.information')}</h2>
            <ul className="space-y-2">
              <li>{t('footer.aboutUs')}</li>
              <li>{t('footer.unclaimableProducts')}</li>
              <li>{t('footer.whyUs')}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">{t('footer.newsletter')}</h2>
            <div className="flex mb-4">
              <Input type="email" placeholder={t('footer.emailPlaceholder')} className="rounded-e-none text-black" />
              <Button type="submit" className="bg-[#ff3e1d] hover:bg-[#ff3e1d]/90 rounded-s-none">
                {t('footer.subscribe')}
              </Button>
            </div>
            <p className="mb-2">{t('footer.followUs')}</p>
            <div className="flex space-x-2">
              <a href="#" className="bg-white p-2 rounded-full">
                <FaFacebook className="w-5 h-5 text-[#2d3741]" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full">
                <FaTwitter className="w-5 h-5 text-[#2d3741]" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full">
                <FaInstagram className="w-5 h-5 text-[#2d3741]" />
              </a>
              <a href="#" className="bg-white p-2 rounded-full">
                <FaYoutube className="w-5 h-5 text-[#2d3741]" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <a href="#" className="hover:underline">{t('footer.privacyPolicy')}</a>
          {' - '}
          <a href="#" className="hover:underline">{t('footer.termsOfUse')}</a>
          {' - '}
          <a href="#" className="hover:underline">{t('footer.legalEnquiryGuide')}</a>
        </div>
        <div className="mt-4 text-center text-sm">
          © 2021 Jetronics, {t('footer.allRightsReserved')}
        </div>
      </div>
    </footer>
  );
}