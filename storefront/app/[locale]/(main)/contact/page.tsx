"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");

  const breadcrumbItems = [
    { label: tCommon('home'), href: "/" },
    { label: t('title'), href: "/contact" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="font-outfit text-4xl font-extrabold text-neutral-900 mb-8 uppercase tracking-tight">{t('title')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-6 uppercase tracking-wide">{t('sendMessage')}</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-1">
                  {t('name')}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t('namePlaceholder')}
                  required
                  className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1">
                  {t('email')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  required
                  className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-1">
                  {t('subject')}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder={t('subjectPlaceholder')}
                  required
                  className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-1">
                  {t('message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder={t('messagePlaceholder')}
                  required
                />
              </div>
              
              <Button type="submit" size="md" className="w-full font-bold">
                {t('sendMessageBtn')}
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
              <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('getInTouch')}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('email')}</h3>
                  <p className="text-neutral-600">info@magicofit.com</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('phone')}</h3>
                  <p className="text-neutral-600">
                    <a href="tel:+2001009784410" className="hover:text-primary-600 transition-colors">01009784410</a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('whatsapp')}</h3>
                  <p className="text-neutral-600">
                    <a href="https://wa.me/2001148161968" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">01148161968</a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900">{t('businessHours')}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Saturday - Thursday: 9:00 AM - 9:00 PM
                    <br />
                    Friday: 2:00 PM - 9:00 PM
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
              <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">{t('followUs')}</h2>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/share/18hLJiTUda/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">
                  {t('facebook')}
                </a>
                <a href="https://www.tiktok.com/@almageko58" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary-600 font-medium transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
