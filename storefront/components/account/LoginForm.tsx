"use client";

import { useState, useEffect } from "react";
import { Chrome } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [locale, setLocale] = useState("ar");
  const [isClientConfigured, setIsClientConfigured] = useState(true);

  // Determine current locale for inline translations fallbacks
  useEffect(() => {
    const isAr = document.documentElement.lang === "ar" || window.location.pathname.startsWith("/ar");
    setLocale(isAr ? "ar" : "en");
    
    // Check if client ID is configured
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "356814453396-i2ubjdsh6qimhd50lr8dni6ejatl8bdf.apps.googleusercontent.com";
    if (!clientId || clientId.includes("dummy")) {
      setIsClientConfigured(false);
    }
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    setGoogleLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      // Call server action to verify Google ID token
      const { loginWithGoogle } = await import("@/actions/auth");
      const res = await loginWithGoogle(idToken);
      if (res.success) {
        setSuccessMessage(locale === "ar" ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!");
        onLoginSuccess();
      } else {
        setError(res.message || (locale === "ar" ? "فشل تسجيل الدخول عبر Google" : "Google login failed"));
      }
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Google Login Initialization
  useEffect(() => {
    let checkCount = 0;
    
    const initializeGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        try {
          const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "356814453396-i2ubjdsh6qimhd50lr8dni6ejatl8bdf.apps.googleusercontent.com";
          
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          const buttonContainer = document.getElementById("google-signin-btn");
          if (buttonContainer) {
            window.google.accounts.id.renderButton(
              buttonContainer,
              { 
                theme: "filled_blue", 
                size: "large", 
                width: "320", 
                text: locale === "ar" ? "signin_with" : "signin_with",
                shape: "pill",
                logo_alignment: "left"
              }
            );
            
            // Trigger Google One Tap popup automatically as a premium feature!
            window.google.accounts.id.prompt();
          }
        } catch (e) {
          console.error("Error initializing Google Identity Services:", e);
        }
      }
    };

    const interval = setInterval(() => {
      checkCount++;
      if (window.google?.accounts?.id) {
        initializeGoogleSignIn();
        clearInterval(interval);
      } else if (checkCount > 20) {
        // Stop checking after 10 seconds
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [locale]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-neutral-100/80 transition-all duration-300 hover:shadow-primary-100/30 hover:border-primary-100/50">
        
        {/* Glow Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100/40 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-primary-100/60 shadow-inner">
            <Chrome className="h-10 w-10 text-primary-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase mb-2 font-cairo">
            {locale === "ar" ? "بوابة تسجيل الدخول" : "Customer Portal"}
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mx-auto font-cairo">
            {locale === "ar" 
              ? "سجل دخولك أو أنشئ حساباً جديداً بنقرة واحدة عبر حساب جوجل الخاص بك" 
              : "Sign in or create a new account with a single click using your Google account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl text-xs font-bold mb-6 flex items-start gap-2.5 shadow-sm font-cairo">
            <span className="text-base leading-none">⚠️</span>
            <span className="flex-1 leading-relaxed">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3.5 rounded-2xl text-xs font-bold mb-6 flex items-start gap-2.5 shadow-sm font-cairo">
            <span className="text-base leading-none">✅</span>
            <span className="flex-1 leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Client ID Warning Notice */}
        {!isClientConfigured && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3.5 rounded-2xl text-xs font-semibold mb-6 shadow-sm font-cairo leading-relaxed">
            📢 {locale === "ar" 
              ? "تنبيه: يجب تهيئة متغير البيئة NEXT_PUBLIC_GOOGLE_CLIENT_ID في إعدادات Vercel وإعادة بناء النشر (Redeploy) لكي يظهر زر جوجل للعملاء." 
              : "Notice: Please configure NEXT_PUBLIC_GOOGLE_CLIENT_ID in Vercel settings and trigger a Redeploy for the Google button to render."}
          </div>
        )}

        {/* Google SSO Button Container */}
        <div className="w-full flex flex-col items-center justify-center py-8 min-h-[90px] border border-neutral-50 rounded-2xl bg-neutral-50/30">
          {googleLoading ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="text-xs text-neutral-500 font-bold font-cairo">
                {locale === "ar" ? "جاري التحقق من الحساب..." : "Verifying account..."}
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center px-4">
              <div id="google-signin-btn" className="min-w-[320px] h-[44px] flex justify-center shadow-md rounded-full overflow-hidden border border-neutral-100 hover:shadow-lg transition-all duration-200"></div>
            </div>
          )}
        </div>

        {/* Temporarily Disabled Phone Indicator */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-400 font-semibold flex items-center justify-center gap-1.5 font-cairo">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {locale === "ar" 
              ? "تسجيل الدخول برقم الهاتف متوقف مؤقتاً" 
              : "Phone login is temporarily disabled"}
          </p>
        </div>

      </div>
    </div>
  );
}
