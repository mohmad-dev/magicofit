"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ProfileFormProps {
  initialData: ProfileData;
  onSave: (data: ProfileData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function ProfileForm({ initialData, onSave, onCancel, loading = false }: ProfileFormProps) {
  const t = useTranslations("account.profile");
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isEditing, setIsEditing] = useState(true); // Default to true when rendered as a toggle
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [locale, setLocale] = useState("ar");

  useEffect(() => {
    const isAr = document.documentElement.lang === "ar" || window.location.pathname.startsWith("/ar");
    setLocale(isAr ? "ar" : "en");
  }, []);

  const countries = [
    { value: "EG", label: locale === "ar" ? "مصر" : "Egypt" },
    { value: "SA", label: locale === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia" },
    { value: "AE", label: locale === "ar" ? "الإمارات العربية المتحدة" : "United Arab Emirates" },
    { value: "QA", label: locale === "ar" ? "قطر" : "Qatar" },
    { value: "KW", label: locale === "ar" ? "الكويت" : "Kuwait" },
    { value: "BH", label: locale === "ar" ? "البحرين" : "Bahrain" },
    { value: "OM", label: locale === "ar" ? "عمان" : "Oman" },
  ];

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError("");
    setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError(t("fillRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t("invalidEmail"));
      return;
    }

    try {
      await onSave(formData);
      setSuccess(true);
      if (onCancel) onCancel();
    } catch (err) {
      setError(t("saveFailed"));
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setError("");
    if (onCancel) {
      onCancel();
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-none p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">{t("profileInfo")}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" type="button" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button variant="primary" size="sm" type="submit" onClick={handleSave} loading={loading}>
            {t("save")}
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
          {t("profileUpdated")}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">{t("personalInfo")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("firstName")} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("lastName")} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">{t("contactInfo")}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("emailAddress")} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("phoneNumber")}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">{t("addressInfo")}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("streetAddress")}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  disabled={!isEditing}
                  placeholder={t("streetPlaceholder")}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("city")}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("state")}
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("postalCode")}
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("country")}
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
