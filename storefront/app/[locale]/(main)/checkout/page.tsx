"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";
import OrderSummary from "@/components/order/OrderSummary";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useRouter } from "next/navigation";
import { processDirectOrder } from "@/actions/checkout";
import { Package, Truck, Search, ChevronDown, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, medusaCartId } = useCartStore();
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGovDropdownOpen, setIsGovDropdownOpen] = useState(false);
  const [govSearch, setGovSearch] = useState("");
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const govDropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "بني سويف",
    address: "",
  });

  // Arabic governorate name to shipping option code mapping
  // Maps Arabic governorate name to the shipping option type code in Dashboard
  const GOVERNORATE_TO_SHIPPING_CODE: Record<string, string> = {
    "القاهرة": "cairo",
    "الجيزة": "giza",
    "الإسكندرية": "alexandria",
    "القليوبية": "qalyubia",
    "الفيوم": "fayoum",
    "الفايوم": "fayoum", // Alternative spelling
    "بني سويف": "beni-suef",
    "المنيا": "minya",
    "أسيوط": "assiut",
    "سوهاج": "sohag",
    "قنا": "qena",
    "الأقصر": "luxor",
    "أسوان": "aswan",
    "الدقهلية": "dakahlia",
    "الشرقية": "sharqia",
    "كفر الشيخ": "kafr-el-sheikh",
    "الغربية": "gharbia",
    "المنوفية": "monufia",
    "البحيرة": "beheira",
    "دمياط": "damietta",
    "بورسعيد": "port-said",
    "الإسماعيلية": "ismailia",
    "السويس": "suez",
    "شمال سيناء": "north-sinai",
    "جنوب سيناء": "south-sinai",
    "البحر الأحمر": "red-sea",
    "الوادي الجديد": "new-valley",
    "مطروح": "matrouh",
  };

  // Governorates ordered by proximity to Beni Suef (store HQ)
  const governorates: [string, string][] = [
    ["بني سويف", "beniSuef"],
    ["الفيوم", "fayoum"],
    ["المنيا", "minya"],
    ["الجيزة", "giza"],
    ["القاهرة", "cairo"],
    ["القليوبية", "qalyubia"],
    ["المنوفية", "monufia"],
    ["الشرقية", "sharqia"],
    ["الدقهلية", "dakahlia"],
    ["كفر الشيخ", "kafrElSheikh"],
    ["الغربية", "gharbia"],
    ["البحيرة", "beheira"],
    ["الإسكندرية", "alexandria"],
    ["دمياط", "damietta"],
    ["بورسعيد", "portSaid"],
    ["الإسماعيلية", "ismailia"],
    ["السويس", "suez"],
    ["أسيوط", "assiut"],
    ["سوهاج", "sohag"],
    ["قنا", "qena"],
    ["الأقصر", "luxor"],
    ["أسوان", "aswan"],
    ["البحر الأحمر", "redSea"],
    ["الوادي الجديد", "newValley"],
    ["مطروح", "matrouh"],
    ["شمال سيناء", "northSinai"],
    ["جنوب سيناء", "southSinai"],
  ];

  // Fetch shipping price when governorate changes or cart is created
  useEffect(() => {
    const fetchShippingPrice = async () => {
      if (!formData.city) return;
      
      setIsLoadingShipping(true);
      try {
        // Use medusaCartId if available, otherwise fetch shipping options without cart
        const cartId = medusaCartId;
        const url = cartId 
          ? `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipping-options?cart_id=${cartId}`
          : `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipping-options?region_id=${process.env.NEXT_PUBLIC_MEDUSA_REGION_ID}`;
        
        const response = await fetch(url, {
          headers: {
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
          },
        });
        const data = await response.json();
        const options = data.shipping_options || [];
        
        // Detailed logging to show all fields
        console.log('=== SHIPPING OPTIONS DEBUG ===');
        console.log('Total options:', options.length);
        console.log('Full API response:', JSON.stringify(data, null, 2));
        options.forEach((opt: any, index: number) => {
          console.log(`--- Option ${index + 1} ---`);
          console.log('id:', opt.id);
          console.log('name:', opt.name);
          console.log('amount:', opt.amount);
          console.log('type:', opt.type);
          console.log('type?.id:', opt.type?.id);
          console.log('type?.code:', opt.type?.code);
          console.log('type?.label:', opt.type?.label);
          console.log('Full option:', JSON.stringify(opt, null, 2));
        });
        console.log('Looking for governorate:', formData.city);
        console.log('=============================');
        
        // Find matching shipping option by type code
        const shippingOptionCode = GOVERNORATE_TO_SHIPPING_CODE[formData.city];
        const selectedOption = options.find((opt: any) =>
          shippingOptionCode && opt.type?.code === shippingOptionCode
        );
        
        console.log('Selected option:', selectedOption, 'Code:', shippingOptionCode);
        
        if (selectedOption?.amount) {
          // API returns amount in EGP directly (not minor units)
          setShippingPrice(selectedOption.amount);
        } else {
          // Fallback to first option or default
          const fallbackOption = options[0];
          if (fallbackOption?.amount) {
            setShippingPrice(fallbackOption.amount);
          } else {
            setShippingPrice(30); // Default fallback
          }
        }
      } catch (error) {
        console.error("Failed to fetch shipping price:", error);
        setShippingPrice(30); // Default fallback
      } finally {
        setIsLoadingShipping(false);
      }
    };
    
    fetchShippingPrice();
  }, [formData.city, medusaCartId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (govDropdownRef.current && !govDropdownRef.current.contains(e.target as Node)) {
        setIsGovDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tax = 0; // Tax comes from Medusa cart, not calculated locally

  const breadcrumbItems = [
    { label: tCommon("home"), href: "/" },
    { label: tCommon("cart"), href: "/cart" },
    { label: tCommon("checkout"), href: "/checkout" },
  ];

  // Redirect empty carts (but NOT after placing an order - navigating to success page)
  useEffect(() => {
    if (items.length === 0 && !isOrderPlaced) {
      router.push("/shop");
    }
  }, [items, router, isOrderPlaced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t("fullNameRequired");
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t("phoneRequired");
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t("phoneInvalid");
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t("addressRequired");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await processDirectOrder({
        items: items,
        shippingAddress: formData,
        medusaCartId: medusaCartId,
      });

      // Navigate to Success Page FIRST, then clear cart (clearing triggers redirect to /shop)
      const orderId = response.orderId || Math.floor(1000 + Math.random() * 9000);
      const cartData = response.cartSummary;
      // Store order info in sessionStorage for success page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lastOrder', JSON.stringify({
          orderId,
          items: items.map(i => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
          shippingAddress: formData,
          cartSummary: cartData,
        }));
      }
      setIsOrderPlaced(true);
      clearCart();
      router.push(`/checkout/success?order_id=${orderId}`);

    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <Container className="py-4 md:py-8 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-8 hidden md:block">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        {/* Left Side - Checkout Form */}
        <div>
          <h1 className="font-outfit text-2xl md:text-3xl font-extrabold text-neutral-900 mb-4 md:mb-6 uppercase tracking-tight">
            {t("checkout")}
          </h1>

          <div className="rounded-2xl border border-neutral-200 shadow-xl p-4 md:p-6 bg-white shrink-0">
            <h2 className="font-outfit text-xl font-bold text-neutral-900 mb-6 uppercase tracking-wide border-b pb-4">
               {t("shippingDetails")}
            </h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-neutral-800 mb-2">
                  {t("fullName")} *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={`w-full rounded-xl border px-4 py-3 font-medium focus:outline-none focus:ring-2 transition-all ${errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20'}`}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-red-600 text-sm mt-1" role="alert">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-neutral-800 mb-2">
                  {t("phoneNumber")} *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : "phone-helper"}
                  className={`w-full rounded-xl border px-4 py-3 font-medium focus:outline-none focus:ring-2 transition-all ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20'}`}
                />
                {errors.phone ? (
                  <p id="phone-error" className="text-red-600 text-sm mt-1" role="alert">
                    {errors.phone}
                  </p>
                ) : (
                  <p id="phone-helper" className="text-xs text-neutral-500 mt-1">{t("phoneHelper")}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-bold text-neutral-800 mb-2">
                  {t("city")} *
                </label>
                {/* Searchable Governorate Dropdown */}
                <div className="relative" ref={govDropdownRef}>
                  <button
                    type="button"
                    id="city"
                    onClick={() => setIsGovDropdownOpen(!isGovDropdownOpen)}
                    className={`w-full rounded-xl border px-4 py-3 font-medium focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between bg-white ${!formData.city ? 'text-neutral-400' : 'text-neutral-900'} ${errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20'}`}
                    aria-required="true"
                  >
                    <span>{formData.city || t("selectGovernorate")}</span>
                    <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${isGovDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isGovDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-neutral-100">
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input
                            type="text"
                            value={govSearch}
                            onChange={(e) => setGovSearch(e.target.value)}
                            placeholder={t("searchGovernorate")}
                            className="w-full pr-9 pl-3 py-2 text-sm rounded-lg border border-neutral-200 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {governorates.filter(([ar, en]) => ar.includes(govSearch) || en.toLowerCase().includes(govSearch.toLowerCase())).map(([arValue, enKey]) => (
                          <button
                            key={arValue}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, city: arValue }));
                              setIsGovDropdownOpen(false);
                              setGovSearch("");
                            }}
                            className={`w-full px-4 py-2.5 text-sm text-right flex items-center justify-between hover:bg-primary-50 transition-colors ${formData.city === arValue ? 'bg-primary-50 text-primary-700 font-bold' : 'text-neutral-700'}`}
                          >
                            <span>{t(enKey)}</span>
                            {formData.city === arValue && <Check className="h-4 w-4 text-primary-600" />}
                          </button>
                        ))}
                        {governorates.filter(([ar, en]) => ar.includes(govSearch) || en.toLowerCase().includes(govSearch.toLowerCase())).length === 0 && (
                          <div className="px-4 py-3 text-sm text-neutral-400 text-center">{t("noGovernorateFound")}</div>
                        )}
                      </div>
                    </div>
                  )}
                  <input type="hidden" name="city" value={formData.city} required />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-bold text-neutral-800 mb-2">
                  {t("detailedAddress")} *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.address ? "true" : "false"}
                  aria-describedby={errors.address ? "address-error" : undefined}
                  className={`w-full rounded-xl border px-4 py-3 font-medium focus:outline-none focus:ring-2 transition-all ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20'}`}
                />
                {errors.address && (
                  <p id="address-error" className="text-red-600 text-sm mt-1" role="alert">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Payment Section - Forced COD */}
              <div className="pt-4 border-t border-neutral-100 mt-6">
                <h3 className="font-outfit font-bold text-neutral-900 mb-4 uppercase">{t("paymentMethod")}</h3>
                <div className="flex items-center gap-4 p-4 border-2 border-primary-500 bg-primary-50 rounded-xl">
                  <div className="h-6 w-6 rounded-full border-4 border-primary-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-neutral-900 text-lg">{t("cashOnDelivery")}</p>
                    <p className="text-sm text-primary-800 font-medium mt-1">{t("cashOnDeliveryDesc")}</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 rounded-xl bg-[#FF4F01] px-6 py-4 text-white text-xl font-extrabold transition-all hover:bg-[#e04500] hover:scale-[1.02] shadow-xl shadow-[#FF4F01]/30 flex items-center justify-center gap-3 uppercase disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? t("processingOrder") : t("completeOrder")}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary
              items={items}
              shippingPrice={shippingPrice ?? undefined}
              tax={tax}
            />
            {isLoadingShipping && (
              <p className="text-xs text-neutral-500 mt-2 text-center">{t("loadingShipping")}</p>
            )}
            
            {/* Trust Policies */}
            <div className="mt-6 space-y-3 px-4">
              <div className="flex items-center gap-3 text-sm text-neutral-600 font-medium">
                <Truck className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span>{t("fastDelivery")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-600 font-medium">
                <Package className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span>{t("inspectBeforePay")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
