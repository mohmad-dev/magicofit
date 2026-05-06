"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

interface NewsletterProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  onSuccess?: (email: string) => void;
}

export default function Newsletter({
  title,
  subtitle,
  placeholder,
  buttonText,
  onSuccess,
}: NewsletterProps) {
  const t = useTranslations("newsletter");
  const effectiveTitle = title || t('title');
  const effectiveSubtitle = subtitle || t('subtitle');
  const effectivePlaceholder = placeholder || t('placeholder');
  const effectiveButtonText = buttonText || t('subscribe');
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('invalidEmail'));
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubscribed(true);
    onSuccess?.(email);
    setEmail("");
  };

  if (isSubscribed) {
    return (
      <section className="py-12 md:py-16 bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/20" />
        
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
                <Mail className="h-8 w-8 text-white" />
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
    <section className="py-12 md:py-16 bg-neutral-950 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/20 animate-gradient-x" />
      
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 relative">
        <div className="max-w-2xl mx-auto">
          {/* Glassmorphism Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-0 hover:opacity-20 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative bg-gradient-to-br from-primary-500 to-accent-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
              <Mail className="h-8 w-8 text-white" />
            </div>

            {/* Content */}
            <div className="relative">
              <h2 className="font-outfit text-2xl md:text-3xl font-extrabold text-white mb-3 uppercase tracking-tight">
                {effectiveTitle}
              </h2>
              <p className="text-neutral-300 mb-8">{effectiveSubtitle}</p>

              {/* Discount Badge */}
              <div className="inline-block bg-accent-500/20 border border-accent-500/50 rounded-lg px-4 py-2 mb-6">
                <span className="font-bold text-accent-400">{t('discount')}</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={effectivePlaceholder}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                  className="sm:w-auto w-full bg-accent-500 hover:bg-accent-600 text-white font-bold tracking-wide uppercase"
                >
                  {effectiveButtonText}
                </Button>
              </form>

              {/* Privacy Note */}
              <p className="text-neutral-400 text-xs mt-4">
                {t('privacyNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
