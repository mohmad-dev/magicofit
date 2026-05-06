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
      <section className="py-12 md:py-16 bg-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-700/20 via-transparent to-green-500/20" />
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12">
              <div className="bg-gradient-to-br from-green-500 to-green-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-3 uppercase tracking-tight">
                {t('subscribed')}
              </h2>
              <p className="text-green-100">
                {t('subscribedDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-green-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-700/20 via-transparent to-green-500/20 animate-gradient-x" />
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-400 to-green-500 opacity-0 hover:opacity-20 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-green-500 to-green-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div className="relative">
              <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-3 uppercase tracking-tight">
                {effectiveTitle}
              </h2>
              <p className="text-green-100 mb-8">{effectiveSubtitle}</p>
              <div className="inline-block bg-white/10 border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="font-bold text-green-200">{t('discount')}</span>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={effectivePlaceholder}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-green-200/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    dir="ltr"
                    required
                  />
                  {error && (
                    <p className="text-red-300 text-sm mt-1 text-left">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  className="sm:w-auto w-full bg-white text-green-700 hover:bg-green-50 font-bold tracking-wide uppercase"
                >
                  {effectiveButtonText}
                </Button>
              </form>
              <p className="text-green-200/60 text-xs mt-4">
                {t('privacyNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
