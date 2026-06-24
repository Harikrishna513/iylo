import { create } from "zustand";
import { Product, CartItem, CheckoutFormData, CheckoutStep } from "@/types";
import {
  calculateDeliveryFee,
  findDeliveryZone,
  FREE_DELIVERY_THRESHOLD,
} from "@/lib/delivery";

const defaultCheckoutForm: CheckoutFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "Bangalore",
  pincode: "",
  deliveryMethod: "delivery",
  deliveryDate: "",
  deliverySlot: "",
  coupon: "",
  giftWrap: false,
  notes: "",
};

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  selectedProduct: Product | null;
  isQuickViewOpen: boolean;
  isCheckoutOpen: boolean;
  checkoutStep: CheckoutStep;
  checkoutForm: CheckoutFormData;
  isLoggedIn: boolean;
  deliveryZone: ReturnType<typeof findDeliveryZone>;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleGiftWrap: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setCheckoutStep: (step: CheckoutStep) => void;
  updateCheckoutForm: (data: Partial<CheckoutFormData>) => void;
  setLoggedIn: (value: boolean) => void;
  setDeliveryZone: (pincode: string) => void;
  applyCoupon: (code: string) => boolean;
  totalItems: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
  resetCheckout: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  selectedProduct: null,
  isQuickViewOpen: false,
  isCheckoutOpen: false,
  checkoutStep: "cart",
  checkoutForm: defaultCheckoutForm,
  isLoggedIn: false,
  deliveryZone: null,
  couponDiscount: 0,

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    }));
  },

  toggleGiftWrap: (productId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId
          ? { ...i, giftWrap: !i.giftWrap }
          : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  openQuickView: (product) =>
    set({ selectedProduct: product, isQuickViewOpen: true }),
  closeQuickView: () =>
    set({ selectedProduct: null, isQuickViewOpen: false }),

  openCheckout: () =>
    set({ isCheckoutOpen: true, isOpen: false, checkoutStep: "login" }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  setCheckoutStep: (step) => set({ checkoutStep: step }),

  updateCheckoutForm: (data) =>
    set((state) => ({
      checkoutForm: { ...state.checkoutForm, ...data },
    })),

  setLoggedIn: (value) => set({ isLoggedIn: value }),

  setDeliveryZone: (pincode) => {
    const zone = findDeliveryZone(pincode);
    set({ deliveryZone: zone });
  },

  applyCoupon: (code) => {
    const normalized = code.toUpperCase().trim();
    if (normalized === "IYLOLOVE" || normalized === "BANGALORE10") {
      set({ couponDiscount: 0.1 });
      return true;
    }
    return false;
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  deliveryFee: () => {
    const { checkoutForm, subtotal, deliveryZone } = get();
    if (checkoutForm.deliveryMethod === "pickup") return 0;
    if (checkoutForm.deliveryMethod === "retail-shipping") return 149;
    return calculateDeliveryFee(subtotal(), deliveryZone);
  },

  total: () => {
    const sub = get().subtotal();
    const fee = get().deliveryFee();
    const discount = sub * get().couponDiscount;
    const giftWrapFee = get().items.filter((i) => i.giftWrap).length * 99;
    return Math.max(0, sub - discount + fee + giftWrapFee);
  },

  resetCheckout: () =>
    set({
      checkoutStep: "login",
      checkoutForm: defaultCheckoutForm,
      couponDiscount: 0,
      deliveryZone: null,
    }),
}));

export { FREE_DELIVERY_THRESHOLD };
