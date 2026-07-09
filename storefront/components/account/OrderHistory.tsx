"use client";

import Link from "next/link";
import { Button } from "../ui/Button";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatPrice, getProductImageUrl } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
}

interface OrderHistoryProps {
  orders: Order[];
}

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50", key: "statusPending" },
  processing: { icon: Package, color: "text-blue-600", bgColor: "bg-blue-50", key: "statusProcessing" },
  shipped: { icon: Truck, color: "text-purple-600", bgColor: "bg-purple-50", key: "statusShipped" },
  delivered: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", key: "statusDelivered" },
  cancelled: { icon: XCircle, color: "text-red-600", bgColor: "bg-red-50", key: "statusCancelled" },
};

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const t = useTranslations("account.orders");

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noOrders")}</h3>
        <p className="text-gray-600 mb-4">
          {t("noOrdersDesc")}
        </p>
        <Link href="/shop">
          <Button variant="primary" size="md">
            {t("continueShopping")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const status = statusConfig[order.status] || statusConfig.pending;
        const StatusIcon = status.icon;

        return (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {t("orderId")}{order.orderNumber}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {t(status.key)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatPrice(order.total)}
                </p>
                <p className="text-sm text-gray-600">
                  {order.items.length === 1 ? t("itemCount", { count: order.items.length }) : t("itemCountPlural", { count: order.items.length })}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={getProductImageUrl(item.image)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{t("qty", { count: item.quantity })}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-sm text-gray-600 text-center">
                  {t("moreItems", { count: order.items.length - 3 })}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href={`/account/orders/${order.id}`} className="flex-1">
                <Button variant="outline" size="md" className="w-full">
                  {t("viewDetails")}
                </Button>
              </Link>
              {order.status === "pending" && (
                <Button variant="outline" size="md" className="flex-1">
                  {t("cancelOrder")}
                </Button>
              )}
              {(order.status === "delivered" || order.status === "shipped") && (
                <Button variant="outline" size="md" className="flex-1">
                  {t("trackOrder")}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
