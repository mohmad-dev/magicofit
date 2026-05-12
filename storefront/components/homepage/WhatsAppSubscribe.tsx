"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface WhatsAppSubscribeProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
}

export default function WhatsAppSubscribe({
  title,
  subtitle,
  placeholder,
  buttonText,
}: WhatsAppSubscribeProps) {
  const t = useTranslations("whatsappSubscribe");
  const effectiveTitle = title || t('title');
  const effectiveSubtitle = subtitle || t('subtitle');
  const effectivePlaceholder = placeholder || t('placeholder');
  const effectiveButtonText = buttonText || t('subscribe');
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Egypt phone validation: 01xxxxxxxxx (11 digits starting with 01)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      setError(t('invalidPhone'));
      return;
    }

    setIsLoading(true);
    // Simulate API call (replace with actual WhatsApp API integration)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubscribed(true);
    setPhone("");
  };

  if (isSubscribed) {
    return (
      <section className="py-12 md:py-16 bg-neutral-900 relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-xl mx-auto text-center">
            <div className="rounded-2xl p-8 md:p-12">
              <div className="bg-green-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-3 uppercase tracking-tight">
                {t('subscribed')}
              </h2>
              <p className="text-neutral-300">
                {t('subscribedDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-neutral-900 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl p-8 md:p-12 text-center">
            <div className="bg-green-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-3 uppercase tracking-tight">
              {effectiveTitle}
            </h2>
            <p className="text-neutral-300 mb-6">{effectiveSubtitle}</p>
            <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 mb-6">
              <span className="font-bold text-green-400">{t('discount')}</span>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={effectivePlaceholder}
                  className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  dir="ltr"
                  required
                />
                {error && (
                  <p className="text-red-400 text-sm mt-1 text-left">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="sm:w-auto w-full bg-green-500 text-white hover:bg-green-600 font-bold tracking-wide uppercase"
              >
                {effectiveButtonText}
              </Button>
            </form>
            <p className="text-neutral-300 text-xs mt-4">
              {t('privacyNote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
