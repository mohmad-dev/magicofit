import { Button } from "../ui/Button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  image: string;
  price: number;
  productVariant?: {
    size?: string;
    color?: string;
  };
  variantId?: string;
  disabled?: boolean;
  loading?: boolean;
  inStock?: boolean;
  quantity?: number;
  buttonVariant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function AddToCartButton({
  productId,
  name,
  image,
  price,
  productVariant,
  variantId,
  disabled = false,
  loading = false,
  inStock = true,
  quantity = 1,
  buttonVariant = "primary",
  size = "md",
  fullWidth = true,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const t = useTranslations("product");

  const handleClick = () => {
    addItem({
      productId,
      name,
      image,
      price,
      quantity,
      variant: productVariant,
      variantId,
    });
  };

  return (
    <Button
      variant={buttonVariant}
      size={size}
      loading={loading}
      disabled={disabled || !inStock || loading}
      onClick={handleClick}
      className={fullWidth ? "w-full rounded-xl" : ""}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      {inStock ? `${t("addToCart")} - ${formatPrice(price)}` : t("outOfStock")}
    </Button>
  );
}
