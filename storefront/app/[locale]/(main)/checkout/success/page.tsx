"use client";

import { Container } from "@/components/layout/Container";
import { CheckCircle2, Package, Truck, CreditCard, MapPin, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  orderId: string | number;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  cartSummary?: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    currency_code: string;
  } | null;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("checkoutSuccess");
  const tCheckout = useTranslations("checkout");
  const orderId = searchParams.get('order_id') || Math.floor(100000 + Math.random() * 900000);

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lastOrder');
      if (stored) {
        setOrderData(JSON.parse(stored));
        sessionStorage.removeItem('lastOrder');
      }
    } catch {}
  }, []);

  const items = orderData?.items || [];
  // item.price is already in pounds (divided by 100 when added to cart)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // cartSummary values come from Medusa in cents, need /100
  const shipping = orderData?.cartSummary ? orderData.cartSummary.shipping : 50;
  const tax = orderData?.cartSummary ? orderData.cartSummary.tax : 0;
  const discount = orderData?.cartSummary && (orderData.cartSummary as any).discount ? (orderData.cartSummary as any).discount : 0;
  const totalFromMedusa = orderData?.cartSummary ? orderData.cartSummary.total : subtotal + shipping;
  // Use Medusa total if available (includes tax, shipping, discounts), otherwise calculate
  const total = orderData?.cartSummary ? totalFromMedusa : subtotal + shipping + tax - discount;
  const addr = orderData?.shippingAddress;

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle2 className="w-20 h-20 text-[#FF4F01] mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-3 font-outfit uppercase tracking-tighter">
          {t('title')}
        </h1>
        <p className="text-neutral-600">
          {t('subtitle', { orderId })}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <h2 className="font-bold text-neutral-900 px-6 py-4 border-b border-neutral-200 uppercase tracking-wide">
              {t('orderItems')}
            </h2>
            <div className="divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="relative h-16 w-16 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                    <img
                      src={imageErrors[item.id] ? '/placeholder-product.png' : item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                      onError={() => handleImageError(item.id)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-neutral-600">{t('qty')} {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="font-bold text-neutral-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary-600" />
              {t('shippingInfo')}
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-neutral-900">{addr?.fullName || ''}</p>
                  <p className="text-sm text-neutral-600">
                    {addr?.address || ''}
                  </p>
                  <p className="text-sm text-neutral-600">{addr?.city || ''}, Egypt</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                <p className="text-sm text-neutral-600">{tCheckout('cashOnDelivery')}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                <p className="text-sm text-neutral-600">{addr?.phone || ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h2 className="font-bold text-neutral-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary-600" />
              {t('paymentSummary')}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">{t('subtotal')}</span>
                <span className="text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{tCheckout('tax') || t('tax')}</span>
                  <span className="text-neutral-900">{formatPrice(tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">{t('shipping')}</span>
                <span className="text-neutral-900">{formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold text-lg">
                <span className="text-neutral-900">{t('total')}</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-6">
            <h2 className="font-bold text-primary-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('orderStatus')}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-primary-800">
                <div className="w-2 h-2 rounded-full bg-primary-600" />
                <span className="font-medium">{t('statusConfirmed')}</span>
                <span className="text-primary-600 ml-auto">{t('timeNow')}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-700">
                <div className="w-2 h-2 rounded-full bg-primary-400" />
                <span>{t('statusProcessing')}</span>
                <span className="text-primary-600 ml-auto">{t('time1-2days')}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-700">
                <div className="w-2 h-2 rounded-full bg-primary-300" />
                <span>{t('statusShipped')}</span>
                <span className="text-primary-600 ml-auto">{t('time3-5days')}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-700">
                <div className="w-2 h-2 rounded-full bg-primary-200" />
                <span>{t('statusDelivered')}</span>
                <span className="text-primary-600 ml-auto">{t('time5-7days')}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/shop"
            className="block w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors text-center uppercase tracking-wide"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Container className="min-h-[70vh] flex items-center justify-center">
      <Suspense fallback={<div className="h-20 w-20 animate-pulse bg-neutral-200 rounded-full mx-auto" />}>
        <SuccessContent />
      </Suspense>
    </Container>
  );
}
