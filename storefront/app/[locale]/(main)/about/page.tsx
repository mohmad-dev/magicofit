"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");

  const breadcrumbItems = [
    { label: tCommon('home'), href: "/" },
    { label: t('title'), href: "/about" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="font-outfit text-4xl font-extrabold text-neutral-900 mb-8 uppercase tracking-tight">{t('title')}</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
            {t('intro')}
          </p>
          
          <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mt-8 mb-4 uppercase tracking-wide">{t('mission')}</h2>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            {t('missionDesc')}
          </p>
          
          <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mt-8 mb-4 uppercase tracking-wide">{t('values')}</h2>
          <ul className="list-disc pl-6 text-neutral-600 space-y-3">
            <li><strong className="text-neutral-900">{t('quality')}:</strong> {t('qualityDesc')}</li>
            <li><strong className="text-neutral-900">{t('performance')}:</strong> {t('performanceDesc')}</li>
            <li><strong className="text-neutral-900">{t('customerService')}:</strong> {t('customerServiceDesc')}</li>
            <li><strong className="text-neutral-900">{t('sustainability')}:</strong> {t('sustainabilityDesc')}</li>
          </ul>
          
          <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mt-8 mb-4 uppercase tracking-wide">{t('story')}</h2>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            {t('story1')}
          </p>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            {t('story2')}
          </p>
          
          <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mt-8 mb-4 uppercase tracking-wide">{t('contact')}</h2>
          <p className="text-neutral-600 leading-relaxed">
            {t('contactDesc')}{' '}
            <a href="mailto:info@magicofit.com" className="text-primary-600 hover:text-primary-700 font-semibold ml-1">
              info@magicofit.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
