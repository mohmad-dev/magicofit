"use client";

import { notFound, useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useUIStore } from "@/stores/ui-store";
import { useTranslations } from "next-intl";
import ProductGallery from "@/components/product/ProductGallery";
import SizeSelector from "@/components/product/SizeSelector";
import ColorSelector from "@/components/product/ColorSelector";
import AddToCartButton from "@/components/product/AddToCartButton";
import StockIndicator from "@/components/product/StockIndicator";
import UrgencyBadge from "@/components/product/UrgencyBadge";
import CompleteTheLook from "@/components/product/CompleteTheLook";
import RelatedProductsCarousel from "@/components/product/RelatedProductsCarousel";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import ProductTabs from "@/components/product/ProductTabs";
import SizeGuideModal from "@/components/product/SizeGuideModal";
import { addToRecentlyViewed } from "@/components/product/RecentlyViewed";
import { formatPrice, getVariantOptionValue, cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Truck, RotateCcw, Package, Check, Minus, Plus, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { getProductByHandle, getProducts, getRegions } from "@/lib/store-api";
import type { MedusaProduct } from "@/lib/types/medusa";

export default function ProductPage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const openCart = useUIStore((state) => state.openCart);
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [product, setProduct] = useState<MedusaProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const params = useParams();
  const handle = params.handle as string;
  
  // Fetch product by handle
  useEffect(() => {
    async function fetchProduct() {
      if (!handle) return;
      
      try {
        setIsLoading(true);
        // Try to fetch region for pricing, but don't block product fetch if it fails
        let regionId: string | undefined;
        try {
          const regions = await getRegions();
          const egyptRegion = regions.find(r => r.currency_code === 'egp') || regions[0];
          regionId = egyptRegion?.id;
        } catch (regionError) {
          console.warn('Failed to fetch regions, proceeding without region:', regionError);
        }
        
        const productData = await getProductByHandle(handle, regionId);
        setProduct(productData);
        
        // Set default selected options from first variant
        if (productData.variants && productData.variants.length > 0) {
          const firstVariant = productData.variants[0];
          const defaultSize = getVariantOptionValue(firstVariant.options, "Size");
          const defaultColor = getVariantOptionValue(firstVariant.options, "Color");
          if (defaultSize) setSelectedSize(defaultSize);
          if (defaultColor) setSelectedColor(defaultColor);
          // Set defaults for all other options (Fabric, Material, etc.)
          if (productData.options) {
            const initialOpts: Record<string, string> = {};
            productData.options.forEach((opt) => {
              const val = getVariantOptionValue(firstVariant.options, opt.title);
              if (val) initialOpts[opt.title] = val;
            });
            setSelectedOptions(initialOpts);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [handle]);

  // Add to recently viewed + fetch related products
  useEffect(() => {
    if (product) {
      const firstVariant = product.variants?.[0];
      
      const getPrice = (variant: any) => {
        if (variant?.calculated_price) {
          return variant.calculated_price.calculated_amount;
        }
        if (variant?.prices && variant.prices.length > 0) {
          return variant.prices[0].amount;
        }
        return 0;
      };

      const price = getPrice(firstVariant);
      addToRecentlyViewed({
        id: product.id,
        name: product.title || '',
        price: price,
        image: product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png',
        inStock: true,
      });

      // Fetch related products from same category
      const currentProductId = product.id;
      async function fetchRelated() {
        try {
          const categoryId = product!.categories?.[0]?.id;
          if (!categoryId) return;
          const data = await getProducts({ limit: 10, category_id: [categoryId] });
          const transformed = data.products
            .filter((p: MedusaProduct) => p.id !== currentProductId)
            .map((p: MedusaProduct) => {
              const v = p.variants?.[0];
              const img = p.thumbnail || p.images?.[0]?.url || '/placeholder-product.png';
              const pPrice = v?.calculated_price ? v.calculated_price.calculated_amount : (v?.prices?.[0]?.amount ? v.prices[0].amount : 0);
              const origPrice = v?.calculated_price?.original_amount ? v.calculated_price.original_amount : undefined;
              return { id: p.id, handle: p.handle || '', name: p.title || '', price: pPrice, originalPrice: origPrice, image: img, inStock: true };
            });
          setRelatedProducts(transformed);
        } catch (e) {
          console.warn('Failed to fetch related products:', e);
        }
      }
      fetchRelated();
    }
  }, [product]);

  // Handle scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Find matching variant based on ALL selected options
  const selectedVariant = product.variants?.find(
    (v) => {
      const sizeMatch = !selectedSize || getVariantOptionValue(v.options, "Size") === selectedSize;
      const colorMatch = !selectedColor || getVariantOptionValue(v.options, "Color") === selectedColor;
      // Match all other dynamic options (Fabric, Material, etc.)
      const otherMatch = Object.entries(selectedOptions).every(
        ([title, value]) => title === "Size" || title === "Color" || getVariantOptionValue(v.options, title) === value
      );
      return sizeMatch && colorMatch && otherMatch;
    }
  );

  // Use first variant price for all options (fixed price for product)
  const firstVariant = product.variants?.[0];

  const getPrice = (variant: any) => {
    if (variant?.calculated_price) {
      return variant.calculated_price.calculated_amount;
    }
    if (variant?.prices && variant.prices.length > 0) {
      return variant.prices[0].amount;
    }
    return 0;
  };

  const getOriginalPrice = (variant: any) => {
    if (variant?.calculated_price?.original_amount) {
      return variant.calculated_price.original_amount;
    }
    if (variant?.prices && variant.prices.length > 1) {
      return variant.prices[1].amount;
    }
    return 0;
  };

  // Always use first variant price (fixed price for all options)
  const price = getPrice(firstVariant);
  const originalPrice = getOriginalPrice(firstVariant);
  const inventoryQuantity = firstVariant?.inventory_quantity ?? 0;
  // Calculate discount from compare_at_price (originalPrice)
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const breadcrumbItems = [
    { label: tCommon("home"), href: "/" },
    { label: tCommon("shop"), href: "/shop" },
    { label: product.categories?.[0]?.name || tCommon("shop"), href: `/shop/${product.categories?.[0]?.handle}` },
    { label: product.title, href: `/products/${product.handle}` },
  ];

  const handleAddToCart = (productId: string) => {
    addItem({
      productId,
      name: product.title || "",
      image: product.thumbnail || "",
      price: price,
      quantity: 1,
    });
    openCart();
  };

  const handleBuyNow = () => {
    // Use selected variant or first variant
    const variantToUse = selectedVariant || firstVariant;
    if (!variantToUse) return;

    addItem({
      productId: product.id,
      name: product.title || "",
      image: product.thumbnail || "",
      price: price,
      quantity,
      variant: {
        size: selectedSize,
        color: selectedColor,
      },
      variantId: variantToUse.id,
    });

    router.push("/checkout");
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-8 lg:gap-16 lg:grid-cols-2 mt-6">
        {/* Product Gallery */}
        <div className="space-y-4">
          <ProductGallery
            images={product.images?.map((img, idx) => ({ ...img, id: img.id || idx.toString() })) || []}
            alt={product.title || ""}
            discount={discount}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Title & Brand */}
          <div className="space-y-3">
            {product.metadata?.brand && (
              <p className="text-xs text-primary-600 font-bold uppercase tracking-widest">{product.metadata?.brand}</p>
            )}
            <h1 className="font-outfit text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 uppercase tracking-tight leading-tight">{product.title}</h1>
            {product.subtitle && (
              <p className="text-base md:text-lg text-neutral-500 leading-relaxed">{product.subtitle}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline flex-wrap gap-3">
            <span className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-lg md:text-xl text-neutral-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
                  خصم {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status & Urgency */}
          <div className="flex items-center gap-3 py-3 px-4 bg-neutral-50 rounded-xl">
            <StockIndicator quantity={inventoryQuantity} manageInventory={selectedVariant?.manage_inventory} />
            {inventoryQuantity > 0 && inventoryQuantity <= 5 && (
              <UrgencyBadge stock={inventoryQuantity} />
            )}
          </div>

          {/* Variant Selectors - Dynamic for ALL product options */}
          <div className="space-y-4">
            {product.options?.filter((o) => {
              // Filter out default/empty options (e.g., "Default option", "Default Title")
              if (!o.values || o.values.length === 0) return false;
              // Hide options with only "Default" values
              const hasOnlyDefaults = o.values.every(v =>
                v.value?.toLowerCase().includes('default') ||
                v.value === 'Default Title' ||
                v.value === 'Default option'
              );
              return !hasOnlyDefaults;
            }).map((option) => {
              const isSize = option.title === "Size";
              const isColor = option.title === "Color";
              const selectedValue = isSize ? selectedSize : isColor ? selectedColor : selectedOptions[option.title];
              const onSelect = (val: string) => {
                if (isSize) setSelectedSize(val);
                else if (isColor) setSelectedColor(val);
                else setSelectedOptions((prev) => ({ ...prev, [option.title]: val }));
              };
              const availableValues = product.variants?.map((v) => getVariantOptionValue(v.options, option.title)).filter(Boolean) as string[];
              // If no available values found, allow all options (no inventory restriction)
              const finalAvailableValues = availableValues.length > 0 ? availableValues : undefined;

              if (isColor) {
                return (
                  <ColorSelector
                    key={option.id}
                    colors={option.values.map((v) => ({ name: v.value, value: v.value }))}
                    selectedColor={selectedValue}
                    onSelect={onSelect}
                    availableColors={finalAvailableValues}
                  />
                );
              }

              if (isSize) {
                return (
                  <div key={option.id}>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-neutral-900 uppercase tracking-wide">{t("size")}</label>
                      <button onClick={() => setIsSizeGuideOpen(true)} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium underline">
                        <Ruler className="h-3.5 w-3.5" />
                        {t("sizeGuide")}
                      </button>
                    </div>
                    <SizeSelector
                      sizes={option.values.map((v) => v.value)}
                      selectedSize={selectedValue}
                      onSelect={onSelect}
                      availableSizes={finalAvailableValues}
                    />
                  </div>
                );
              }

              // Generic option selector (Fabric, Material, etc.)
              return (
                <div key={option.id}>
                  <label className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-2 block">{option.title}</label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((v) => {
                      const isAvailable = !finalAvailableValues || finalAvailableValues.includes(v.value);
                      const isSelected = selectedValue === v.value;
                      return (
                        <button
                          key={v.id || v.value}
                          onClick={() => isAvailable && onSelect(v.value)}
                          disabled={!isAvailable}
                          className={cn(
                            "px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all",
                            isSelected
                              ? "border-primary-600 bg-primary-600 text-white"
                              : isAvailable
                              ? "border-neutral-300 bg-white text-neutral-900 hover:border-primary-600 hover:text-primary-600"
                              : "border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed"
                          )}
                        >
                          {v.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-900 uppercase tracking-wide">{t("quantity")}</label>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-xl border-2 border-neutral-200 hover:border-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all"
              >
                <Minus className="w-5 h-5 text-neutral-600" />
              </motion.button>
              <span className="w-16 text-center text-2xl font-bold text-neutral-900">{quantity}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-xl border-2 border-neutral-200 hover:border-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all"
              >
                <Plus className="w-5 h-5 text-neutral-600" />
              </motion.button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <AddToCartButton
              productId={product.id}
              name={product.title || ""}
              image={product.thumbnail || ""}
              price={price}
              productVariant={{
                size: selectedSize,
                color: selectedColor,
              }}
              variantId={selectedVariant?.id}
              inStock={true}
              quantity={quantity}
              fullWidth
              size="lg"
            />
            
            <button
              onClick={handleBuyNow}
              className="w-full h-14 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {t("buyNow")}
            </button>
          </div>

          {/* Add to Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (!product) return;
              const productId = product.id;
              if (wishlistItems.some((item) => item.productId === productId)) {
                removeFromWishlist(productId);
              } else {
                addToWishlist({
                  productId,
                  handle: product.handle || '',
                  name: product.title || '',
                  image: product.thumbnail || product.images?.[0]?.url || '/placeholder-product.png',
                  price: selectedSize && selectedColor ? 0 : (product.variants?.[0]?.calculated_price?.calculated_amount || 0),
                  variant: {
                    size: selectedSize,
                    color: selectedColor,
                  },
                });
              }
            }}
            className={`w-full h-12 border-2 font-bold rounded-lg transition-colors uppercase tracking-wide text-sm ${
              wishlistItems.some((item) => item.productId === (product?.id || ''))
                ? 'border-red-500 text-red-500 hover:bg-red-50'
                : 'border-primary-600 text-primary-600 hover:bg-primary-50'
            }`}
          >
            {wishlistItems.some((item) => item.productId === (product?.id || '')) ? tCommon('remove') : t("addToWishlist")}
          </motion.button>

          {/* Trust Badges */}
          <div className="space-y-3 pt-6 border-t border-neutral-100">
            <div className="flex items-center gap-3 text-sm text-neutral-600 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-primary-600" />
              </div>
              <span>{t("freeShippingOver")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-600 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 text-primary-600" />
              </div>
              <span>{t("freeReturns")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-600 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-primary-600" />
              </div>
              <span>{t("estimatedDelivery")}</span>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="pt-6">
            <ProductTabs
              tabs={[
                {
                  id: "description",
                  label: t("description"),
                  content: (
                    <div className="space-y-6">
                      <p className="text-neutral-600 leading-relaxed">{product.description}</p>
                      
                      {/* Dynamic Features from metadata */}
                      {product.metadata?.features && Array.isArray(product.metadata.features) && product.metadata.features.length > 0 && (
                        <div>
                          <h4 className="font-bold text-neutral-900 mb-4 uppercase tracking-wide">{t("keyFeatures")}</h4>
                          <ul className="space-y-3">
                            {(product.metadata.features as string[]).map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                <span className="text-neutral-600">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Dynamic Specifications */}
                      <div>
                        <h4 className="font-bold text-neutral-900 mb-4 uppercase tracking-wide">{t("specifications")}</h4>
                        <div className="border border-neutral-200 rounded-xl overflow-hidden">
                          <table className="w-full">
                            <tbody className="divide-y divide-neutral-100">
                              {product.material && (
                                <tr className="hover:bg-neutral-50">
                                  <td className="py-3 px-4 font-medium text-neutral-900 bg-neutral-50/50">{t("material")}</td>
                                  <td className="py-3 px-4 text-neutral-600">{product.material}</td>
                                </tr>
                              )}
                              {product.weight && (
                                <tr className="hover:bg-neutral-50">
                                  <td className="py-3 px-4 font-medium text-neutral-900 bg-neutral-50/50">{t("weight")}</td>
                                  <td className="py-3 px-4 text-neutral-600">{product.weight}g</td>
                                </tr>
                              )}
                              {product.metadata?.terrain && (
                                <tr className="hover:bg-neutral-50">
                                  <td className="py-3 px-4 font-medium text-neutral-900 bg-neutral-50/50">{t("terrain")}</td>
                                  <td className="py-3 px-4 text-neutral-600">{product.metadata.terrain as string}</td>
                                </tr>
                              )}
                              {product.metadata?.cushioning && (
                                <tr className="hover:bg-neutral-50">
                                  <td className="py-3 px-4 font-medium text-neutral-900 bg-neutral-50/50">{t("cushioning")}</td>
                                  <td className="py-3 px-4 text-neutral-600">{product.metadata.cushioning as string}</td>
                                </tr>
                              )}
                              {product.metadata?.drop && (
                                <tr className="hover:bg-neutral-50">
                                  <td className="py-3 px-4 font-medium text-neutral-900 bg-neutral-50/50">{t("drop")}</td>
                                  <td className="py-3 px-4 text-neutral-600">{product.metadata.drop as string}</td>
                                </tr>
                              )}
                              {/* Additional dynamic specs from metadata */}
                              {product.metadata?.fit && (
                                <tr className="hover:bg-neutral-50">
                                  <td className="py-3 px-4 font-medium text-neutral-900 bg-neutral-50/50">القصة</td>
                                  <td className="py-3 px-4 text-neutral-600">{product.metadata.fit as string}</td>
                                </tr>
                              )}
                              {product.metadata?.country && (
                                <tr className="hover:bg-neutral-50">
                                  <td className="py-3 px-4 font-medium text-neutral-900 bg-neutral-50/50">بلد المنشأ</td>
                                  <td className="py-3 px-4 text-neutral-600">{product.metadata.country as string}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "care",
                  label: "العناية",
                  content: (
                    <div className="space-y-4">
                      {product.metadata?.careInstructions ? (
                        <div className="space-y-3">
                          {(product.metadata.careInstructions as string[]).map((instruction, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                              <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-600">{instruction}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl text-center">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                              <span className="text-2xl">🧺</span>
                            </div>
                            <span className="text-sm font-medium text-neutral-900">غسيل آلي</span>
                            <span className="text-xs text-neutral-500 mt-1">درجة حرارة 30°</span>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl text-center">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                              <span className="text-2xl">☀️</span>
                            </div>
                            <span className="text-sm font-medium text-neutral-900">تجفيف بالهواء</span>
                            <span className="text-xs text-neutral-500 mt-1">في الظل</span>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl text-center">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                              <span className="text-2xl">🚫</span>
                            </div>
                            <span className="text-sm font-medium text-neutral-900">لا تبيض</span>
                            <span className="text-xs text-neutral-500 mt-1">تجنب الكلور</span>
                          </div>
                          <div className="flex flex-col items-center p-4 bg-neutral-50 rounded-xl text-center">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                              <span className="text-2xl">⚡</span>
                            </div>
                            <span className="text-sm font-medium text-neutral-900">كوي خفيف</span>
                            <span className="text-xs text-neutral-500 mt-1">درجة حرارة منخفضة</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  id: "shipping",
                  label: t("shippingReturns"),
                  content: (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Truck className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900 mb-1">{t("freeShippingTitle")}</h4>
                          <p className="text-neutral-600 text-sm">{t("freeShippingDesc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <RotateCcw className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900 mb-1">{t("returnsTitle")}</h4>
                          <p className="text-neutral-600 text-sm">{t("returnsDesc")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900 mb-1">{t("fastDeliveryTitle")}</h4>
                          <p className="text-neutral-600 text-sm">{t("fastDeliveryDesc")}</p>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-16 pt-8 border-t border-neutral-100">
        {/* Complete the Look */}
        <CompleteTheLook
          products={relatedProducts.slice(0, 4)}
        />

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProductsCarousel
            products={relatedProducts.slice(4)}
          />
        </div>

        {/* Recently Viewed */}
        <div className="mt-16">
          <RecentlyViewed currentProductId={product.id} />
        </div>
      </div>

      {/* Sticky Add-to-Cart Bar - Mobile only */}
      {isScrolled && selectedVariant && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-2xl z-50 py-3 px-4 lg:hidden safe-bottom">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-outfit font-bold text-sm text-neutral-900 truncate">{product.title}</h3>
              <p className="text-xs text-neutral-500">
                {selectedSize && `${t("size")}: ${selectedSize}`}
                {selectedColor && `${selectedSize ? " | " : ""}${selectedColor}`}
                {" | "}
                <span className="font-bold text-neutral-900">{formatPrice(price)}</span>
              </p>
            </div>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="flex-none px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-lg transition-colors uppercase tracking-wide"
            >
              {t("addToCart")}
            </button>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} category={product.options?.some(o => o.title === "Size") ? "clothing" : "shoes"} />
    </div>
  );
}
