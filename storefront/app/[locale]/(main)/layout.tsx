"use client";

import { useRouter } from "next/navigation";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppFloating from "@/components/layout/WhatsAppFloating";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isCartOpen, closeCart } = useUIStore();
  const { items, updateQuantity, removeItem } = useCartStore();

  return (
    <>
      {children}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={() => {
          closeCart();
          router.push("/checkout");
        }}
      />
      <WhatsAppFloating />
    </>
  );
}
