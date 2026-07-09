"use client";

import { useState, useEffect } from "react";
import { loginWithGoogle } from "@/actions/auth";
import { Chrome } from "lucide-react"; // Nice Google icon fallback

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

  // Determine current locale for inline translations fallbacks
  useEffect(() => {
    const isAr = document.documentElement.lang === "ar" || window.location.pathname.startsWith("/ar");
    setLocale(isAr ? "ar" : "en");
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    setGoogleLoading(true);
    setError("");
    setSuccessMessage("");
    try {
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
    const initializeGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1030972978-dummy.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "filled_blue", 
            size: "large", 
            width: "320", // Fixed width for centered premium look
            text: "continue_with",
            shape: "pill"
          }
        );
      }
    };

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initializeGoogleSignIn();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [locale]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-100">
            <Chrome className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase mb-2">
            {locale === "ar" ? "تسجيل الدخول السريع" : "Quick Sign-In"}
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mx-auto">
            {locale === "ar" 
              ? "سجل دخولك أو أنشئ حساباً جديداً بنقرة واحدة باستخدام حساب جوجل" 
              : "Sign in or create a new account with a single click using Google"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center gap-2 animate-pulse">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center gap-2">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google SSO Container */}
        <div className="w-full flex flex-col items-center justify-center py-6 min-h-[50px]">
          {googleLoading ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="text-sm text-neutral-500 font-bold">
                {locale === "ar" ? "جاري التحقق..." : "Verifying account..."}
              </span>
            </div>
          ) : (
            <div id="google-signin-btn" className="w-full flex justify-center"></div>
          )}
        </div>

        {/* Temporarily Disabled Phone Indicator */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-400 font-semibold flex items-center justify-center gap-1.5">
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
