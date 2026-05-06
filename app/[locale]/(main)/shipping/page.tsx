"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ShippingPage() {
  const t = useTranslations("shipping");
  const tCommon = useTranslations("common");

  const breadcrumbItems = [
    { label: tCommon('home'), href: "/" },
    { label: t('title'), href: "/shipping" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="font-outfit text-4xl font-extrabold text-neutral-900 mb-8 uppercase tracking-tight">{t('title')}</h1>
        
        <div className="space-y-8">
          {/* Shipping Methods */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('methods')}</h2>
            
            <div className="space-y-4">
              <div className="border-b border-neutral-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-neutral-900">{t('standard')}</h3>
                  <span className="text-neutral-600 font-medium">{t('standardFree')}</span>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t('standardDesc')}
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t('standardPrice')}
                </p>
              </div>
              
              <div className="border-b border-neutral-200 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-neutral-900">{t('express')}</h3>
                  <span className="text-neutral-600 font-medium">{t('expressPrice')}</span>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t('expressDesc')}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-neutral-900">{t('sameDay')}</h3>
                  <span className="text-neutral-600 font-medium">{t('sameDayPrice')}</span>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t('sameDayDesc')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Shipping Policy */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('policy')}</h2>
            
            <div className="prose prose-lg max-w-none text-neutral-600">
              <p className="mb-4 leading-relaxed">
                {t('policy1')}
              </p>
              
              <p className="mb-4 leading-relaxed">
                {t('policy2')}
              </p>
              
              <p className="mb-4 leading-relaxed">
                {t('policy3')}
              </p>
              
              <p className="leading-relaxed">
                {t('policy4')}
              </p>
            </div>
          </div>
          
          {/* Delivery Areas */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('deliveryAreas')}</h2>
            
            <div className="space-y-2 text-neutral-600">
              <p><strong className="text-neutral-900">{t('majorCities')}</strong></p>
              <p><strong className="text-neutral-900">{t('sameDayAvailable')}</strong></p>
              <p><strong className="text-neutral-900">{t('expressAvailable')}</strong></p>
              <p><strong className="text-neutral-900">{t('standardAvailable')}</strong></p>
            </div>
          </div>
          
          {/* Tracking Your Order */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('tracking')}</h2>
            
            <div className="text-neutral-600">
              <p className="mb-4 leading-relaxed">
                {t('tracking1')}
              </p>
              
              <p className="leading-relaxed">
                {t('tracking2')}
              </p>
            </div>
          </div>
          
          {/* Questions */}
          <div className="bg-primary-50 rounded-xl border border-primary-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-2 uppercase tracking-wide">{t('haveQuestions')}</h2>
            <p className="text-neutral-600 mb-4 leading-relaxed">
              {t('haveQuestionsDesc')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
            >
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
