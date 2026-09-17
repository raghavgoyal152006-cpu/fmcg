export type UnitType = 'kg' | 'g' | 'L' | 'ml' | 'pack' | 'pcs';

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  packSize: string;
  unitQuantity: number;
  unitType: UnitType;
  mrp: number;
  price: number;
  unitPriceString: string; // e.g. "₹182.50/kg"
  images: string[];
  description: string;
  ingredients?: string;
  nutritionalInfo?: Record<string, string>;
  allergens?: string[];
  countryOfOrigin: string;
  manufacturer: string;
  rating: number;
  reviewCount: number;
  stockQuantity: number; // Physical Stock
  reservedQuantity: number; // In active carts/checkout
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
  isFastMover: boolean;
  dailyVelocity: number; // Average units sold per day
  tags: string[];
  shelfLife: string;
  frequentlyBoughtWith?: string[]; // array of product IDs
  similarProductIds?: string[];
  isVeg?: boolean;
}

export interface DarkStore {
  id: string;
  name: string;
  code: string;
  address: string;
  area: string;
  pinCodes: string[];
  deliveryEstimateMinutes: number;
  distanceKm: number;
  activePickers: number;
  operationalStatus: 'OPTIMAL' | 'BUSY' | 'SURGE';
}

export interface CartItem {
  product: Product;
  quantity: number;
  reservedAt: number;
}

export type SubstitutionPolicy = 'BEST_ALTERNATIVE' | 'CALL_CUSTOMER' | 'INSTANT_REFUND';

export interface DeliveryAddress {
  id: string;
  name: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  flatNo: string;
  street: string;
  landmark: string;
  area: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export type OrderStatus = 
  | 'PLACED' 
  | 'PICKING' 
  | 'PACKED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  packSize: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image: string;
  isPicked?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  darkStore: DarkStore;
  substitutionPolicy: SubstitutionPolicy;
  deliveryType: 'EXPRESS_10_MIN' | 'SCHEDULED_SLOT';
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD';
  paymentStatus: 'PAID' | 'PENDING';
  pickerName?: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
  riderTemp?: string;
  estimatedDeliveryTime: string;
  deliveredAt?: string;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validUntil: string;
  applicableCategories?: string[];
  usageCount: number;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  productId: string;
  productName: string;
  packSize: string;
  image: string;
  price: number;
  quantity: number;
  frequency: 'DAILY' | 'ALTERNATE_DAYS' | 'WEEKLY' | 'MONTHLY';
  timeSlot: '6:00 AM - 8:00 AM' | '6:00 PM - 8:00 PM';
  startDate: string;
  nextDeliveryDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  addressId: string;
}

export interface AdminStats {
  todaySales: number;
  yesterdaySales: number;
  todayOrders: number;
  aov: number;
  stockOutCount: number;
  lowStockCount: number;
  activeRiders: number;
}
