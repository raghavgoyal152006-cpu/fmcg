// Fallback image helper for product images and banners

const CATEGORY_FALLBACKS: Record<string, string> = {
  'atta-dal-oil': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'dairy-bread': 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80',
  'snacks-munchies': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  'cold-drinks-juices': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  'instant-food': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
  'tea-coffee': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
  'cleaning-household': 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?auto=format&fit=crop&w=600&q=80',
  'personal-care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
};

export const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

export function getProductImageFallback(category?: string): string {
  if (category && CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }
  return DEFAULT_PRODUCT_FALLBACK;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, category?: string) {
  const target = e.currentTarget;
  const fallback = getProductImageFallback(category);
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
