"use client";

import { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { medusaClient } from "@/lib/medusa-client";
import { usePathname } from "next/navigation";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const breadcrumbItems = [
    { label: tCommon('home'), href: "/" },
    { label: t('title'), href: "/contact" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await medusaClient.post("/store/contact-messages", formData);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Failed to submit contact message:", err);
      setError(
        locale === "ar"
          ? "حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى لاحقاً."
          : err.message || "Failed to send message. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8" dir={locale === "ar" ? "rtl" : "ltr"}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto mt-6">
        <h1 className="font-outfit text-4xl font-extrabold text-neutral-900 mb-8 uppercase tracking-tight">
          {t('title')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 md:p-8">
            <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-6 uppercase tracking-wide">
              {t('sendMessage')}
            </h2>

            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center space-y-4">
                <svg className="h-12 w-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold">
                  {locale === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message Sent Successfully!"}
                </h3>
                <p className="text-sm text-green-700">
                  {locale === "ar"
                    ? "نشكرك على تواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن."
                    : "Thank you for reaching out. We will get back to you as soon as possible."}
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="primary" className="mt-4">
                  {locale === "ar" ? "إرسال رسالة أخرى" : "Send Another Message"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-1">
                    {t('name')}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.subject}
                    onChange={handleChange}
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
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-neutral-900"
                    placeholder={t('messagePlaceholder')}
                    required
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full font-bold uppercase tracking-wide" loading={isLoading}>
                  {t('sendMessageBtn')}
                </Button>
              </form>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 md:p-8">
              <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-6 uppercase tracking-wide">
                {t('getInTouch')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{t('email')}</h3>
                  <p className="text-neutral-600">info@magicofit.com</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{t('phone')}</h3>
                  <p className="text-neutral-600">
                    <a href="tel:+201009784410" className="hover:text-primary-600 transition-colors font-semibold" dir="ltr">
                      +20 100 978 4410
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{t('whatsapp')}</h3>
                  <p className="text-neutral-600">
                    <a href="https://wa.me/201009784410" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors font-semibold" dir="ltr">
                      +20 100 978 4410
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{t('businessHours')}</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm">
                    {locale === "ar" ? "السبت - الخميس: 9:00 صباحاً - 9:00 مساءً" : "Saturday - Thursday: 9:00 AM - 9:00 PM"}
                    <br />
                    {locale === "ar" ? "الجمعة: 2:00 مساءً - 9:00 مساءً" : "Friday: 2:00 PM - 9:00 PM"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
              <h2 className="font-outfit text-xl font-extrabold text-neutral-900 mb-4 uppercase tracking-wide">
                {t('followUs')}
              </h2>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/201009784410"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 text-sm font-semibold transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href="https://www.tiktok.com/@almageko58?_r=1&_t=ZS-97tHN5U77An"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-800 px-4 py-2 text-sm font-semibold transition-colors"
                >
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
