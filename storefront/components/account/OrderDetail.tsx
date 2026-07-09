"use client";

import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface OrderDetailProps {
  orderId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", key: "statusPending" },
  processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-50", key: "statusProcessing" },
  shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-50", key: "statusShipped" },
  delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", key: "statusDelivered" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", key: "statusCancelled" },
};

export default function OrderDetail({
  orderId,
  status,
  items,
  subtotal,
  shipping,
  tax,
  total,
  createdAt,
  shippingAddress,
}: OrderDetailProps) {
  const t = useTranslations("account.orderDetail");
  const tOrders = useTranslations("account.orders");
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{tOrders("orderId")}{orderId}</h3>
          <p className="text-sm text-gray-600">{tOrders("placedOn", { date: new Date(createdAt).toLocaleDateString() })}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
          <StatusIcon className={`h-4 w-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>{tOrders(config.key)}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <img
                src={getProductImageUrl(item.image)}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              {item.variant && (
                <p className="text-sm text-gray-600">{item.variant}</p>
              )}
              <p className="text-sm text-gray-600">{t("qty", { count: item.quantity })}</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("subtotal")}</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("shipping")}</span>
          <span className="font-medium text-gray-900">{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("tax")}</span>
          <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
          <span className="text-gray-900">{t("total")}</span>
          <span className="text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-900 mb-2">{t("shippingAddress")}</h4>
        <p className="text-sm text-gray-600">
          {shippingAddress.firstName} {shippingAddress.lastName}<br />
          {shippingAddress.address}<br />
          {shippingAddress.city}, {shippingAddress.state}<br />
          {shippingAddress.postalCode}<br />
          {shippingAddress.country}
        </p>
      </div>
    </div>
  );
}
