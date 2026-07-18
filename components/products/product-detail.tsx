"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  ShoppingBag,
  Heart,
  Share2,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Store,
} from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { getProductById } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useProductFly } from "@/hooks/use-product-fly";
import { ProductCard } from "@/components/cards/product-card";
import { RelatedProductCard } from "@/components/products/related-product-card";
import {
  FulfillmentDatePicker,
  type FulfillmentSelection,
} from "@/components/products/fulfillment-date-picker";
import { ProductVariantSelector } from "@/components/products/product-variant-selector";
import { ProductInfoSections } from "@/components/products/product-info-sections";
import { inferProductVariants, productRequiresPreOrder } from "@/lib/product-variants";
import { LIGHT } from "@/lib/page-theme";

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const variants = useMemo(
    () => product.variants ?? inferProductVariants(product),
    [product]
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [fulfillmentMode, setFulfillmentMode] = useState<"delivery" | "pickup">("delivery");
  const [fulfillment, setFulfillment] = useState<FulfillmentSelection | null>(null);
  const updateCheckoutForm = useCartStore((s) => s.updateCheckoutForm);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const { flyAddToCart, flyToggleWishlist } = useProductFly();

  const requiresPreOrder = productRequiresPreOrder(product);
  const displayPrice = selectedVariant?.price ?? product.price;
  const stockLeft =
    typeof selectedVariant?.stock === "number" ? selectedVariant.stock : null;
  const outOfStock = stockLeft !== null && stockLeft <= 0;
  const maxQty = stockLeft !== null ? Math.max(1, stockLeft) : 99;
  const variantLabel =
    product.category === "celebration-cakes" ? "Select weight" : "Select size";

  useEffect(() => {
    const v = product.variants ?? inferProductVariants(product);
    setSelectedVariant(v[0]);
    setQuantity(1);
    setFulfillment(null);
  }, [product]);

  useEffect(() => {
    if (stockLeft !== null && quantity > stockLeft) {
      setQuantity(Math.max(1, stockLeft));
    }
  }, [selectedVariant, stockLeft, quantity]);

  const images = product.images ?? [product.image];
  const boughtTogether = (product.frequentlyBoughtWith ?? [])
    .map((id) => getProductById(id))
    .filter(Boolean) as Product[];

  const handleAddToCart = (event?: React.MouseEvent) => {
    if (outOfStock) return;
    if (requiresPreOrder && !fulfillment) {
      return;
    }
    if (fulfillment) {
      updateCheckoutForm({
        deliveryMethod: fulfillmentMode,
        deliveryDate: fulfillment.date,
        deliverySlot: fulfillment.slotLabel,
      });
    }
    const cartProduct: Product = {
      ...product,
      price: displayPrice,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
    };
    flyAddToCart(cartProduct, {
      quantity,
      event,
    });
  };

  return (
    <div className={LIGHT.bg}>
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-16 lg:px-10">
        <nav className={cn("mb-8 flex items-center gap-2 text-xs", LIGHT.muted)} aria-label="Breadcrumb">
          <Link href="/" className="hover:text-maroon">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="capitalize hover:text-maroon">{product.category.replace("-", " ")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-maroon/70">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div data-fly-source className="relative aspect-square overflow-hidden bg-brown/20">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.badge && (
                <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] uppercase tracking-widest text-black">
                  {product.badge}
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative h-20 w-20 overflow-hidden border-2 transition-colors",
                      selectedImage === i ? "border-gold" : "border-transparent"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-6 flex items-center justify-center border border-dashed border-maroon/15 p-8 text-center text-xs text-maroon/45">
              360° Preview — Coming Soon
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] uppercase tracking-[0.3em] text-light-blue capitalize">
              {product.category.replace("-", " ")}
            </p>
            <h1 className={cn(LIGHT.title, "mt-2 text-4xl md:text-5xl")}>{product.name}</h1>

            {product.rating && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating!) ? "fill-light-blue text-light-blue" : "text-maroon/20"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-maroon/55">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            <p className="mt-6 text-2xl text-light-blue">{formatPrice(displayPrice)}</p>

            <ProductVariantSelector
              variants={variants}
              selectedId={selectedVariant.id}
              onSelect={setSelectedVariant}
              label={variantLabel}
            />

            <p className={cn("mt-4 leading-relaxed", LIGHT.body)}>
              {product.description}
            </p>

            {requiresPreOrder && (
              <p className="mt-3 text-sm text-maroon/50">Pre-order 1–2 days ahead</p>
            )}

            {product.preparationTime && (
              <p className={cn("mt-4 flex items-center gap-2", LIGHT.muted)}>
                <Clock className="h-4 w-4" />
                {product.preparationTime}
              </p>
            )}

            <div className="mt-4 space-y-2 text-sm">
              {product.isAvailableToday && (
                <p className="text-light-blue">Available for pickup and delivery today</p>
              )}
              {product.shipsPanIndia && (
                <p className="text-maroon/55">Ships PAN India in 2–4 business days</p>
              )}
            </div>

            {(requiresPreOrder || product.category !== "retail") && (
              <div className={cn("mt-8 border p-5", LIGHT.border)}>
                <p className="mb-4 text-xs uppercase tracking-widest text-light-blue">
                  Schedule your order
                </p>
                <div className="mb-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentMode("delivery");
                      setFulfillment(null);
                    }}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 border py-3 text-xs uppercase tracking-widest transition-colors",
                      fulfillmentMode === "delivery"
                        ? "border-light-blue bg-mist-blue text-maroon"
                        : "border-maroon/15 text-maroon/50 hover:border-maroon/30"
                    )}
                  >
                    <Truck className="h-4 w-4" />
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentMode("pickup");
                      setFulfillment(null);
                    }}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 border py-3 text-xs uppercase tracking-widest transition-colors",
                      fulfillmentMode === "pickup"
                        ? "border-light-blue bg-mist-blue text-maroon"
                        : "border-maroon/15 text-maroon/50 hover:border-maroon/30"
                    )}
                  >
                    <Store className="h-4 w-4" />
                    Store Pickup
                  </button>
                </div>
                <FulfillmentDatePicker
                  mode={fulfillmentMode}
                  value={fulfillment}
                  onChange={setFulfillment}
                />
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className={cn("flex items-center border", LIGHT.borderStrong)}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-12 w-12 items-center justify-center text-maroon hover:text-light-blue"
                  aria-label="Decrease"
                  disabled={outOfStock}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-maroon">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  className="flex h-12 w-12 items-center justify-center text-maroon hover:text-light-blue"
                  aria-label="Increase"
                  disabled={outOfStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                variant="gold"
                size="lg"
                className="flex-1"
                onClick={(e) => handleAddToCart(e)}
                disabled={outOfStock || (requiresPreOrder && !fulfillment)}
              >
                <ShoppingBag className="h-4 w-4" />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
            {stockLeft !== null && !outOfStock && stockLeft <= 5 && (
              <p className="mt-2 text-xs text-amber-700">Only {stockLeft} left</p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={(e) => flyToggleWishlist(product, { event: e })}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 border py-3 text-xs uppercase tracking-widest transition-colors",
                  LIGHT.borderStrong,
                  "text-maroon/70 hover:border-light-blue hover:text-light-blue"
                )}
              >
                <Heart className={cn("h-4 w-4", isInWishlist && "fill-light-blue text-light-blue")} />
                Wishlist
              </button>
              <button
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 border py-3 text-xs uppercase tracking-widest transition-colors",
                  LIGHT.borderStrong,
                  "text-maroon/70 hover:border-light-blue hover:text-light-blue"
                )}
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {/* <button
                onClick={() => setGiftWrap(!giftWrap)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 border py-3 text-xs uppercase tracking-widest transition-colors",
                  giftWrap ? "border-gold text-gold" : "border-ivory/20 hover:border-gold"
                )}
              >
                <Gift className="h-4 w-4" />
                Gift Wrap +₹99
              </button> */}
            </div>

            <ProductInfoSections />

            {product.ingredients && (
              <div className={cn("mt-10 border-t pt-8", LIGHT.border)}>
                <h3 className="text-xs uppercase tracking-widest text-light-blue">Ingredients</h3>
                <p className={cn("mt-3", LIGHT.body)}>{product.ingredients.join(", ")}</p>
              </div>
            )}
            {product.allergens && (
              <div className="mt-6">
                <h3 className="text-xs uppercase tracking-widest text-light-blue">Allergens</h3>
                <p className={cn("mt-3", LIGHT.body)}>{product.allergens.join(", ")}</p>
              </div>
            )}
          </div>
        </div>

        {boughtTogether.length > 0 && (
          <section className={cn("mt-24 border-t pt-16", LIGHT.border)}>
            <h2 className={cn(LIGHT.title, "mb-8 text-3xl")}>Frequently Bought Together</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {boughtTogether.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} variant="compact" theme="light" />
              ))}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className={cn("mt-24 border-t pt-16", LIGHT.border)}>
            <h2 className={cn(LIGHT.title, "mb-8 text-2xl font-light md:text-3xl")}>
              You may also like
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
              {relatedProducts.map((p, i) => (
                <RelatedProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-maroon/10 bg-white/95 p-4 backdrop-blur-xl lg:hidden"
      >
        <div className="flex items-center gap-4">
          <p className="text-lg text-light-blue">{formatPrice(displayPrice * quantity)}</p>
          <Button variant="gold" className="flex-1" onClick={(e) => handleAddToCart(e)}>
            Add to Cart
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
