import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  DarkStore,
  CartItem,
  DeliveryAddress,
  Order,
  OrderStatus,
  SubstitutionPolicy,
  Promotion,
  Subscription,
  AdminStats,
} from '../types';
import {
  DARK_STORES,
  INITIAL_PRODUCTS,
  INITIAL_ADDRESSES,
  INITIAL_PROMOTIONS,
  INITIAL_SUBSCRIPTIONS,
} from '../data/mockData';

interface StoreContextType {
  // Products & Inventory
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id' | 'sku'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductStock: (id: string, newPhysicalStock: number) => void;
  triggerReorderStock: (id: string, unitsToOrder: number) => void;

  // Dark Stores
  darkStores: DarkStore[];
  selectedDarkStore: DarkStore;
  setSelectedDarkStore: (store: DarkStore) => void;

  // Addresses
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress;
  setSelectedAddress: (addr: DeliveryAddress) => void;
  addAddress: (newAddr: Omit<DeliveryAddress, 'id'>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, delta: number) => { success: boolean; message?: string };
  clearCart: () => void;
  cartSubtotal: number;
  cartSavings: number;
  deliveryFee: number;
  promoDiscount: number;
  cartTotal: number;

  // Substitution Policy
  substitutionPolicy: SubstitutionPolicy;
  setSubstitutionPolicy: (policy: SubstitutionPolicy) => void;

  // Promotions
  promotions: Promotion[];
  appliedPromo: Promotion | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  addPromotion: (promo: Omit<Promotion, 'id' | 'usageCount'>) => void;

  // Orders
  orders: Order[];
  currentActiveOrder: Order | null;
  setCurrentActiveOrder: (order: Order | null) => void;
  createOrder: (paymentMethod: Order['paymentMethod'], deliveryType: Order['deliveryType']) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceOrderStatus: (orderId: string) => void;

  // Subscriptions
  subscriptions: Subscription[];
  toggleSubscriptionPause: (id: string) => void;
  cancelSubscription: (id: string) => void;
  createSubscription: (sub: Omit<Subscription, 'id'>) => void;

  // Discovery & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrandFilter: string | null;
  setSelectedBrandFilter: (b: string | null) => void;
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'discount' | 'rating';
  setSortBy: (sort: 'relevance' | 'price_low' | 'price_high' | 'discount' | 'rating') => void;

  // Navigation & Modals
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (p: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  isSubscriptionsOpen: boolean;
  setIsSubscriptionsOpen: (open: boolean) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;

  // View / Role Mode
  currentRole: 'customer' | 'admin' | 'picker';
  setCurrentRole: (role: 'customer' | 'admin' | 'picker') => void;

  // Operational KPI stats
  adminStats: AdminStats;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage if available
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('veloxmart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [darkStores] = useState<DarkStore[]>(DARK_STORES);
  const [selectedDarkStore, setSelectedDarkStore] = useState<DarkStore>(DARK_STORES[0]);

  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('veloxmart_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(addresses[0]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('veloxmart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [substitutionPolicy, setSubstitutionPolicy] = useState<SubstitutionPolicy>('BEST_ALTERNATIVE');

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('veloxmart_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('veloxmart_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentActiveOrder, setCurrentActiveOrder] = useState<Order | null>(null);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('veloxmart_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'discount' | 'rating'>('relevance');

  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState<'customer' | 'admin' | 'picker'>('customer');
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('veloxmart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('veloxmart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('veloxmart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('veloxmart_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('veloxmart_promotions', JSON.stringify(promotions));
  }, [promotions]);

  // Flash notification helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartSavings = cart.reduce((sum, item) => sum + (item.product.mrp - item.product.price) * item.quantity, 0);

  // Free delivery over ₹499, otherwise ₹25 (or ₹0 if free ship coupon)
  let promoDiscount = 0;
  let deliveryFee = cartSubtotal >= 499 ? 0 : cartSubtotal > 0 ? 25 : 0;

  if (appliedPromo) {
    if (appliedPromo.discountType === 'FREE_DELIVERY') {
      deliveryFee = 0;
    } else if (appliedPromo.discountType === 'FLAT') {
      promoDiscount = appliedPromo.discountValue;
    } else if (appliedPromo.discountType === 'PERCENTAGE') {
      promoDiscount = Math.round((cartSubtotal * appliedPromo.discountValue) / 100);
      if (appliedPromo.maxDiscount && promoDiscount > appliedPromo.maxDiscount) {
        promoDiscount = appliedPromo.maxDiscount;
      }
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - promoDiscount + deliveryFee);

  // Cart Handlers with True Inventory Validation
  const addToCart = (product: Product, qty: number = 1): { success: boolean; message?: string } => {
    const liveProd = products.find((p) => p.id === product.id) || product;
    const available = liveProd.stockQuantity - liveProd.reservedQuantity;

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;

    if (currentQtyInCart + qty > available) {
      showToast(`⚠️ Only ${available} available in ${selectedDarkStore.name}`);
      return { success: false, message: `Only ${available} available` };
    }

    // Atomically reserve inventory
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, reservedQuantity: p.reservedQuantity + qty } : p))
    );

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += qty;
      setCart(updated);
    } else {
      setCart([...cart, { product: liveProd, quantity: qty, reservedAt: Date.now() }]);
    }

    showToast(`Added ${liveProd.name.slice(0, 24)}... to cart`);
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    // Release reserved inventory
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, reservedQuantity: Math.max(0, p.reservedQuantity - item.quantity) } : p
      )
    );
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('Item removed from cart');
  };

  const updateCartQty = (productId: string, delta: number): { success: boolean; message?: string } => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return { success: false };

    const liveProd = products.find((p) => p.id === productId) || item.product;
    const available = liveProd.stockQuantity - liveProd.reservedQuantity;

    if (delta > 0 && available < delta) {
      showToast(`⚠️ Cannot add more. Only ${liveProd.stockQuantity} in stock.`);
      return { success: false, message: 'Stock limit reached' };
    }

    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    // Update reserved stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, reservedQuantity: Math.max(0, p.reservedQuantity + delta) } : p
      )
    );

    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: newQty } : i))
    );

    return { success: true };
  };

  const clearCart = () => {
    // Release all reserved stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.product.id === p.id);
        if (cartItem) {
          return { ...p, reservedQuantity: Math.max(0, p.reservedQuantity - cartItem.quantity) };
        }
        return p;
      })
    );
    setCart([]);
    setAppliedPromo(null);
  };

  // Promotion Handlers
  const applyPromo = (code: string): { success: boolean; message: string } => {
    const promo = promotions.find((p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive);
    if (!promo) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartSubtotal < promo.minOrderValue) {
      return {
        success: false,
        message: `Min order value for ${promo.code} is ₹${promo.minOrderValue}. Add ₹${promo.minOrderValue - cartSubtotal} more!`,
      };
    }
    setAppliedPromo(promo);
    showToast(`🎉 Coupon ${promo.code} applied! Saved extra.`);
    return { success: true, message: `Promo applied: ${promo.title}` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    showToast('Promo code removed');
  };

  const addPromotion = (promo: Omit<Promotion, 'id' | 'usageCount'>) => {
    const newPromo: Promotion = {
      ...promo,
      id: `prm-${Date.now()}`,
      usageCount: 0,
    };
    setPromotions([newPromo, ...promotions]);
    showToast(`Promotion ${newPromo.code} created successfully`);
  };

  // Order Placement & Inventory Deduction
  const createOrder = (
    paymentMethod: Order['paymentMethod'],
    deliveryType: Order['deliveryType']
  ): Order | null => {
    if (cart.length === 0) return null;

    const orderNum = `VM-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();

    const orderItems = cart.map((c) => ({
      productId: c.product.id,
      productName: c.product.name,
      brand: c.product.brand,
      packSize: c.product.packSize,
      unitPrice: c.product.price,
      quantity: c.quantity,
      totalPrice: c.product.price * c.quantity,
      image: c.product.images[0],
      isPicked: false,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: now.toISOString(),
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartSavings + promoDiscount,
      deliveryFee,
      totalAmount: cartTotal,
      status: 'PLACED',
      deliveryAddress: selectedAddress,
      darkStore: selectedDarkStore,
      substitutionPolicy,
      deliveryType,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      pickerName: 'Ramesh Kumar (Dark Store #01 Picker)',
      riderName: 'Vikram Singh',
      riderPhone: '+91 98112 43210',
      riderVehicle: 'Ather 450X (KA-01-EQ-4421)',
      riderTemp: '98.4°F (Verified)',
      estimatedDeliveryTime: deliveryType === 'EXPRESS_10_MIN' ? '10 mins' : 'Today, 2:00 PM - 4:00 PM',
    };

    // Permanently deduct physical stock and clear reserved
    setProducts((prev) =>
      prev.map((p) => {
        const item = cart.find((c) => c.product.id === p.id);
        if (item) {
          const newPhysical = Math.max(0, p.stockQuantity - item.quantity);
          const newReserved = Math.max(0, p.reservedQuantity - item.quantity);
          return {
            ...p,
            stockQuantity: newPhysical,
            reservedQuantity: newReserved,
            dailyVelocity: p.dailyVelocity + 1,
          };
        }
        return p;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentActiveOrder(newOrder);

    // Clear cart without releasing stock
    setCart([]);
    setAppliedPromo(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsOrderTrackingOpen(true);

    showToast(`🎉 Order ${orderNum} confirmed! Dark store is picking items.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, status };
          if (status === 'DELIVERED') {
            updated.deliveredAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          if (currentActiveOrder?.id === orderId) {
            setCurrentActiveOrder(updated);
          }
          return updated;
        }
        return o;
      })
    );
  };

  const advanceOrderStatus = (orderId: string) => {
    const sequence: OrderStatus[] = ['PLACED', 'PICKING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const currentIndex = sequence.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
      showToast(`Order status updated to: ${nextStatus.replace(/_/g, ' ')}`);
    }
  };

  // Subscriptions
  const toggleSubscriptionPause = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : s))
    );
    showToast('Subscription status updated');
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    showToast('Subscription cancelled');
  };

  const createSubscription = (sub: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...sub,
      id: `sub-${Date.now()}`,
    };
    setSubscriptions([newSub, ...subscriptions]);
    showToast(`Recurring delivery scheduled for ${newSub.productName}`);
  };

  // Product CRUD
  const addProduct = (newProd: Omit<Product, 'id' | 'sku'>) => {
    const sku = `${newProd.category.slice(0, 3).toUpperCase()}-${newProd.brand.slice(0, 4).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900
    )}`;
    const product: Product = {
      ...newProd,
      id: `fmcg-${Date.now()}`,
      sku,
    };
    setProducts([product, ...products]);
    showToast(`New SKU ${product.sku} added to catalog`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product updated successfully');
  };

  const updateProductStock = (id: string, newPhysicalStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQuantity: newPhysicalStock } : p))
    );
    showToast('Inventory level adjusted');
  };

  const triggerReorderStock = (id: string, unitsToOrder: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQuantity: p.stockQuantity + unitsToOrder } : p))
    );
    showToast(`Stock replenished: +${unitsToOrder} units received at ${selectedDarkStore.name}`);
  };

  const addAddress = (newAddr: Omit<DeliveryAddress, 'id'>) => {
    const addr: DeliveryAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    const updated = [addr, ...addresses];
    setAddresses(updated);
    setSelectedAddress(addr);
    setIsAddressModalOpen(false);
    showToast('New delivery address saved');
  };

  // Admin KPI metrics
  const adminStats: AdminStats = {
    todaySales: orders.reduce((sum, o) => sum + o.totalAmount, 0) + 48250,
    yesterdaySales: 41800,
    todayOrders: orders.length + 128,
    aov: Math.round((orders.reduce((sum, o) => sum + o.totalAmount, 0) + 48250) / (orders.length + 128)),
    stockOutCount: products.filter((p) => p.stockQuantity <= 0).length,
    lowStockCount: products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.reorderLevel).length,
    activeRiders: 14,
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        updateProductStock,
        triggerReorderStock,
        darkStores,
        selectedDarkStore,
        setSelectedDarkStore,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartSubtotal,
        cartSavings,
        deliveryFee,
        promoDiscount,
        cartTotal,
        substitutionPolicy,
        setSubstitutionPolicy,
        promotions,
        appliedPromo,
        applyPromo,
        removePromo,
        addPromotion,
        orders,
        currentActiveOrder,
        setCurrentActiveOrder,
        createOrder,
        updateOrderStatus,
        advanceOrderStatus,
        subscriptions,
        toggleSubscriptionPause,
        cancelSubscription,
        createSubscription,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBrandFilter,
        setSelectedBrandFilter,
        sortBy,
        setSortBy,
        selectedProductForModal,
        setSelectedProductForModal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        isSubscriptionsOpen,
        setIsSubscriptionsOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        currentRole,
        setCurrentRole,
        adminStats,
        notification,
        setNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
