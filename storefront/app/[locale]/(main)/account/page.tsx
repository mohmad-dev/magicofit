"use client";

import { useState, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import LoginForm from "@/components/account/LoginForm";
import ProfileForm from "@/components/account/ProfileForm";
import OrderHistory from "@/components/account/OrderHistory";
import { checkAuthStatus, logout } from "@/actions/auth";
import { getCustomer, getOrders, updateCustomer } from "@/actions/customer";
import { useTranslations } from "next-intl";

interface CustomerData {
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

interface OrderData {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

export default function AccountPage() {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [locale, setLocale] = useState("ar");

  useEffect(() => {
    const isAr = document.documentElement.lang === "ar" || window.location.pathname.startsWith("/ar");
    setLocale(isAr ? "ar" : "en");
  }, []);
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "EG",
  });
  const [orders, setOrders] = useState<OrderData[]>([]);

  const fetchCustomerData = useCallback(async () => {
    try {
      const { customer } = await getCustomer();
      if (customer) {
        setCustomerData({
          firstName: customer.first_name || "",
          lastName: customer.last_name || "",
          email: customer.email || "",
          phone: customer.phone || "",
          address: customer.shipping_addresses?.[0]?.address_1 || "",
          city: customer.shipping_addresses?.[0]?.city || "",
          state: customer.shipping_addresses?.[0]?.province || "",
          postalCode: customer.shipping_addresses?.[0]?.postal_code || "",
          country: customer.shipping_addresses?.[0]?.country_code || "EG",
        });
      }
    } catch (err) {
      console.error("Failed to fetch customer data", err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { orders: medusaOrders } = await getOrders(50, 0);
      const mappedOrders: OrderData[] = medusaOrders.map((order: any) => {
        const statusMap: Record<string, OrderData["status"]> = {
          pending: "pending",
          processing: "processing",
          shipped: "shipped",
          fulfilled: "delivered",
          delivered: "delivered",
          canceled: "cancelled",
          cancelled: "cancelled",
          archived: "cancelled",
        };
        return {
          id: order.id,
          orderNumber: order.display_id || order.id,
          date: order.created_at ? new Date(order.created_at).toLocaleDateString() : "",
          status: statusMap[order.status] || "pending",
          total: (order.total || 0),
          items: (order.items || []).map((item: any) => ({
            id: item.id,
            name: item.title || "",
            quantity: item.quantity || 1,
            price: (item.unit_price || 0),
            image: item.thumbnail || item.variant?.product?.thumbnail || "",
          })),
        };
      });
      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated } = await checkAuthStatus();
        setIsLoggedIn(authenticated);
        if (authenticated) {
          await Promise.all([fetchCustomerData(), fetchOrders()]);
        }
      } catch (err) {
        console.error("Failed to check auth status", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [fetchCustomerData, fetchOrders]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchCustomerData();
    fetchOrders();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const breadcrumbItems = [
    { label: tCommon("home"), href: "/" },
    { label: tCommon("account"), href: "/account" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : !isLoggedIn ? (
        <div className="max-w-md mx-auto py-12">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-outfit text-3xl font-extrabold text-neutral-900 uppercase tracking-tight">{t("myAccount")}</h1>
              <p className="text-neutral-600 leading-relaxed">{t("manageProfile")}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 transition-colors"
            >
              {t("signOut")}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-neutral-200 shadow-md p-6 bg-white transition-all duration-300">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
                  <h2 className="font-outfit text-lg font-extrabold text-neutral-900 uppercase tracking-wide">{t("profile")}</h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="text-xs text-primary-600 hover:text-primary-700 font-bold transition-colors font-cairo"
                    >
                      {locale === "ar" ? "تعديل البيانات" : "Edit Profile"}
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-4 font-cairo">
                    <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-neutral-50/60 border border-neutral-100/50">
                      <span className="text-xs text-neutral-400 font-extrabold tracking-wider">
                        {locale === "ar" ? "الاسم الكامل" : "FULL NAME"}
                      </span>
                      <span className="text-sm text-neutral-800 font-black">
                        {customerData.firstName || customerData.lastName 
                          ? `${customerData.firstName} ${customerData.lastName}` 
                          : (locale === "ar" ? "غير مسجل" : "Not set")}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-neutral-50/60 border border-neutral-100/50">
                      <span className="text-xs text-neutral-400 font-extrabold tracking-wider">
                        {locale === "ar" ? "البريد الإلكتروني" : "EMAIL ADDRESS"}
                      </span>
                      <span className="text-sm text-neutral-800 font-black break-all">
                        {customerData.email}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-neutral-50/60 border border-neutral-100/50">
                      <span className="text-xs text-neutral-400 font-extrabold tracking-wider">
                        {locale === "ar" ? "رقم الهاتف" : "PHONE NUMBER"}
                      </span>
                      <span className="text-sm text-neutral-800 font-black">
                        {customerData.phone || (locale === "ar" ? "غير مسجل" : "Not set")}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-neutral-50/60 border border-neutral-100/50">
                      <span className="text-xs text-neutral-400 font-extrabold tracking-wider">
                        {locale === "ar" ? "عنوان الشحن" : "SHIPPING ADDRESS"}
                      </span>
                      <span className="text-sm text-neutral-800 font-black">
                        {customerData.address 
                          ? `${customerData.address}, ${customerData.city}` 
                          : (locale === "ar" ? "لا يوجد عنوان مسجل" : "No address registered")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <ProfileForm
                    initialData={customerData}
                    onCancel={() => setIsEditingProfile(false)}
                    onSave={async (data) => {
                      try {
                        const result = await updateCustomer({
                          first_name: data.firstName,
                          last_name: data.lastName,
                          email: data.email,
                          phone: data.phone,
                        });
                        if (result.error) {
                          throw new Error(result.error);
                        }
                        setCustomerData(data);
                        setIsEditingProfile(false);
                      } catch (err) {
                        console.error("Failed to save profile:", err);
                        throw err;
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Orders Section */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-neutral-200 shadow-md p-6 bg-white">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
                  <h2 className="font-outfit text-lg font-extrabold text-neutral-900 uppercase tracking-wide">{t("orderHistory")}</h2>
                  <a
                    href="/account/wishlist"
                    className="text-xs text-primary-600 hover:text-primary-700 font-bold transition-colors font-cairo"
                  >
                    {t("viewWishlist")}
                  </a>
                </div>
                <OrderHistory orders={orders} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
