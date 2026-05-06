"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ReturnsPage() {
  const t = useTranslations("returns");
  const tCommon = useTranslations("common");

  const breadcrumbItems = [
    { label: tCommon('home'), href: "/" },
    { label: t('title'), href: "/returns" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="font-outfit text-4xl font-extrabold text-neutral-900 mb-8 uppercase tracking-tight">{t('title')}</h1>
        
        <div className="space-y-8">
          {/* Return Policy */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('policy')}</h2>
            
            <div className="prose prose-lg max-w-none text-neutral-600">
              <p className="mb-4 leading-relaxed">
                {t('policy1')}
              </p>
              
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{t('policy2')}</li>
                <li>{t('policy3')}</li>
                <li>{t('policy4')}</li>
                <li>{t('policy5')}</li>
              </ul>
              
              <p className="leading-relaxed">
                {t('policy6')}
              </p>
            </div>
          </div>
          
          {/* How to Return */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('howTo')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('step1Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('step1Desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('step2Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('step2Desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('step3Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('step3Desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('step4Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('step4Desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('step5Title')}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {t('step5Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Refund Options */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('refundOptions')}</h2>
            
            <div className="space-y-4 text-neutral-600">
              <div>
                <h3 className="font-semibold text-neutral-900">{t('originalPayment')}</h3>
                <p className="text-sm leading-relaxed">
                  {t('originalPaymentDesc')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900">{t('storeCredit')}</h3>
                <p className="text-sm leading-relaxed">
                  {t('storeCreditDesc')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-neutral-900">{t('exchange')}</h3>
                <p className="text-sm leading-relaxed">
                  {t('exchangeDesc')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Non-Returnable Items */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('nonReturnable')}</h2>
            
            <div className="text-neutral-600">
              <p className="mb-4 leading-relaxed">{t('nonReturnableDesc')}</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>{t('nonReturnable1')}</li>
                <li>{t('nonReturnable2')}</li>
                <li>{t('nonReturnable3')}</li>
                <li>{t('nonReturnable4')}</li>
                <li>{t('nonReturnable5')}</li>
              </ul>
            </div>
          </div>
          
          {/* Damaged or Defective Items */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('damaged')}</h2>
            
            <div className="text-neutral-600">
              <p className="mb-4 leading-relaxed">
                {t('damaged1')}
              </p>
              <p className="leading-relaxed">
                {t('damaged2')}
              </p>
            </div>
          </div>
          
          {/* Questions */}
          <div className="bg-primary-50 rounded-xl border border-primary-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-2 uppercase tracking-wide">{t('needHelp')}</h2>
            <p className="text-neutral-600 mb-4 leading-relaxed">
              {t('needHelpDesc')}
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
