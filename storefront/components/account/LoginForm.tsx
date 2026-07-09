"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, MessageSquare, Phone, Key } from "lucide-react";
import { useTranslations } from "next-intl";
import { sendWhatsAppOTP, verifyWhatsAppOTP, loginWithGoogle } from "@/actions/auth";

declare global {
  interface Window {
    google?: any;
  }
}

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onLoginSuccess: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function LoginForm({ onLogin, onLoginSuccess, loading = false, disabled = false }: LoginFormProps) {
  const t = useTranslations("account.login");
  
  // Auth state
  const [loginMethod, setLoginMethod] = useState<"email" | "whatsapp">("email");
  const [whatsappStep, setWhatsappStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // WhatsApp state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // Google state
  const [googleLoading, setGoogleLoading] = useState(false);

  // Determine current locale for inline translations fallbacks
  const [locale, setLocale] = useState("ar");
  useEffect(() => {
    const isAr = document.documentElement.lang === "ar" || window.location.pathname.startsWith("/ar");
    setLocale(isAr ? "ar" : "en");
  }, []);

  // Inline fallback helper
  const translateFallback = (key: string, enText: string, arText: string) => {
    try {
      return t(key);
    } catch {
      return locale === "ar" ? arText : enText;
    }
  };

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
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "110465550-dummy.apps.googleusercontent.com", // dummy fallback
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "100%", 
            text: locale === "ar" ? "signup_with" : "signin_with",
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError(t("fillAllFields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("invalidEmail"));
      return;
    }

    try {
      await onLogin(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(t("invalidCredentials"));
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!phone) {
      setError(locale === "ar" ? "يرجى إدخال رقم الهاتف" : "Please enter your phone number");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await sendWhatsAppOTP(phone);
      if (res.success) {
        setWhatsappStep("otp");
        setSuccessMessage(
          locale === "ar" 
            ? `تم إرسال رمز التحقق إلى الرقم ${phone}` 
            : `Verification code sent to ${phone}`
        );
      } else {
        setError(res.message || (locale === "ar" ? "فشل إرسال رمز التحقق" : "Failed to send code"));
      }
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otp) {
      setError(locale === "ar" ? "يرجى إدخال رمز التحقق" : "Please enter verification code");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await verifyWhatsAppOTP(phone, otp);
      if (res.success) {
        setSuccessMessage(locale === "ar" ? "تم التحقق بنجاح!" : "Verified successfully!");
        onLoginSuccess();
      } else {
        setError(res.message || (locale === "ar" ? "رمز التحقق غير صحيح" : "Invalid verification code"));
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase mb-2">
            {loginMethod === "email" ? t("title") : translateFallback("whatsappTitle", "Login with WhatsApp", "تسجيل الدخول عبر واتساب")}
          </h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            {loginMethod === "email" ? t("subtitle") : translateFallback("whatsappSubtitle", "Verify your identity via WhatsApp OTP", "أدخل رقم هاتفك لتلقي رمز التحقق")}
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

        {/* 1. Email/Password Flow */}
        {loginMethod === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                {t("emailLabel")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  required
                  disabled={disabled || loading || googleLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                {t("passwordLabel")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="w-full pl-10 pr-12 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  required
                  disabled={disabled || loading || googleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-neutral-600 font-medium">{t("rememberMe")}</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                {t("forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full uppercase font-bold tracking-wider" 
              loading={loading} 
              disabled={disabled || googleLoading}
            >
              {t("signIn")}
            </Button>
          </form>
        )}

        {/* 2. WhatsApp OTP Flow */}
        {loginMethod === "whatsapp" && (
          <div className="space-y-5">
            {whatsappStep === "phone" ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    {translateFallback("phoneLabel", "WhatsApp Phone Number", "رقم واتساب للهاتف")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={translateFallback("phonePlaceholder", "e.g. 01148161968", "مثال: 01148161968")}
                      className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                      required
                      disabled={otpLoading || googleLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full uppercase font-bold tracking-wider" 
                  loading={otpLoading}
                  disabled={googleLoading}
                >
                  {translateFallback("sendOtp", "Send Verification Code", "إرسال رمز التحقق")}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    {translateFallback("otpLabel", "Verification Code (OTP)", "رمز التحقق (OTP)")}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder={translateFallback("otpPlaceholder", "Enter 6-digit code", "أدخل الرمز المكون من 6 أرقام")}
                      className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none text-center tracking-widest text-lg font-bold transition-colors"
                      maxLength={6}
                      required
                      disabled={otpLoading || googleLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full uppercase font-bold tracking-wider" 
                  loading={otpLoading}
                  disabled={googleLoading}
                >
                  {translateFallback("verifyOtp", "Verify & Sign In", "تأكيد وتسجيل الدخول")}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setWhatsappStep("phone")}
                    className="text-neutral-500 hover:text-neutral-700 font-semibold"
                  >
                    ← {translateFallback("changeNumber", "Change Number", "تغيير الرقم")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-primary-600 hover:text-primary-700 font-bold"
                    disabled={otpLoading}
                  >
                    {translateFallback("resendOtp", "Resend Code", "إعادة إرسال الرمز")}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-3 bg-white text-neutral-400 font-bold">{t("orContinueWith")}</span>
            </div>
          </div>
        </div>

        {/* Auth Provider Toggles */}
        <div className="space-y-3">
          {/* Google SSO Container */}
          <div className="w-full flex justify-center">
            {googleLoading ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div id="google-signin-btn" className="w-full flex justify-center"></div>
            )}
          </div>

          {/* Toggle between Email and WhatsApp */}
          {loginMethod === "email" ? (
            <Button 
              type="button" 
              variant="outline" 
              size="md" 
              className="w-full flex items-center justify-center gap-2 border-2 border-neutral-200 rounded-xl hover:bg-neutral-50 font-bold text-sm"
              onClick={() => {
                setError("");
                setSuccessMessage("");
                setLoginMethod("whatsapp");
                setWhatsappStep("phone");
              }}
              disabled={loading || googleLoading}
            >
              <MessageSquare className="h-5 w-5 text-green-500" />
              <span>{t("loginWithWhatsApp")}</span>
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              size="md" 
              className="w-full flex items-center justify-center gap-2 border-2 border-neutral-200 rounded-xl hover:bg-neutral-50 font-bold text-sm"
              onClick={() => {
                setError("");
                setSuccessMessage("");
                setLoginMethod("email");
              }}
              disabled={otpLoading || googleLoading}
            >
              <Mail className="h-5 w-5 text-primary-500" />
              <span>{translateFallback("loginWithEmail", "Login with Email", "تسجيل الدخول بالبريد")}</span>
            </Button>
          )}
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-sm text-neutral-500 font-medium">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
            {t("signUp")}
          </Link>
        </p>

      </div>
    </div>
  );
}
