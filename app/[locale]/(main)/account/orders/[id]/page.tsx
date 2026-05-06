"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { useTranslations } from "next-intl";

export default function OrderDetailPage() {
  const t = useTranslations("common");
  const breadcrumbItems = [
    { label: t("home"), href: "/" },
    { label: t("account"), href: "/account" },
    { label: t("orders"), href: "/account/orders" },
    { label: t("order"), href: "/account/orders/order-id" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <Breadcrumb items={breadcrumbItems} />
      <p className="text-neutral-500">{t("loading")}</p>
    </div>
  );
}
