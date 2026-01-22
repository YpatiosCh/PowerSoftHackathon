import { InventoryBucket, DiscountTier } from '@/types';

// Image base URL from PowerSoft
export const IMAGE_BASE_URL = "https://app.mintqr.com";

/**
 * Format price in euros
 */
export function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}

/**
 * Format currency (alias for formatPrice)
 */
export function formatCurrency(price: number): string {
  return formatPrice(price);
}

/**
 * Format time
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

/**
 * Calculate current discount based on time and tiers
 */
export function getCurrentDiscount(
  currentTime: Date,
  discountTiers: DiscountTier[],
  earliestFlashTime: string
): number {
  const current = currentTime.getHours() * 60 + currentTime.getMinutes();
  const [earliestHour, earliestMin] = earliestFlashTime.split(':').map(Number);
  const earliestMinutes = earliestHour * 60 + earliestMin;

  // Not yet flash time
  if (current < earliestMinutes) {
    return 0;
  }

  // Find applicable discount
  let applicableDiscount = 0;
  
  for (const tier of discountTiers) {
    const [hour, min] = tier.startTime.split(':').map(Number);
    const tierMinutes = hour * 60 + min;
    
    if (current >= tierMinutes) {
      applicableDiscount = tier.discountPercent;
    }
  }

  return applicableDiscount;
}

/**
 * Auto-decay inventory bucket based on time
 */
export function autoDecayBucket(
  currentBucket: InventoryBucket,
  lastUpdated: Date,
  currentTime: Date,
  closingTime: string
): InventoryBucket {
  if (currentBucket === 'sold-out') {
    return 'sold-out';
  }

  const hoursSinceUpdate = (currentTime.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
  const [closingHour] = closingTime.split(':').map(Number);
  const currentHour = currentTime.getHours();
  const hoursUntilClose = closingHour - currentHour;

  // Decay logic based on time to close
  if (hoursUntilClose <= 1) {
    // Last hour - aggressive decay
    if (currentBucket === 'high' && hoursSinceUpdate > 0.5) return 'medium';
    if (currentBucket === 'medium' && hoursSinceUpdate > 0.25) return 'low';
  } else if (hoursUntilClose <= 2) {
    // 2 hours to close - moderate decay
    if (currentBucket === 'high' && hoursSinceUpdate > 1) return 'medium';
    if (currentBucket === 'medium' && hoursSinceUpdate > 0.5) return 'low';
  } else {
    // Normal decay
    if (currentBucket === 'high' && hoursSinceUpdate > 2) return 'medium';
    if (currentBucket === 'medium' && hoursSinceUpdate > 1) return 'low';
  }

  return currentBucket;
}

/**
 * Calculate final price with discount
 */
export function calculateFinalPrice(regularPrice: number, discountPercent: number): number {
  return Number((regularPrice * (1 - discountPercent / 100)).toFixed(2));
}

/**
 * Check if flash sale should be active
 */
export function isFlashActive(
  currentTime: Date,
  earliestFlashTime: string,
  bucket: InventoryBucket
): boolean {
  if (bucket === 'sold-out') return false;
  
  const current = currentTime.getHours() * 60 + currentTime.getMinutes();
  const [hour, min] = earliestFlashTime.split(':').map(Number);
  const flashMinutes = hour * 60 + min;
  
  return current >= flashMinutes;
}

/**
 * Get bucket display info
 */
export function getBucketInfo(bucket: InventoryBucket): {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
} {
  switch (bucket) {
    case 'high':
      return {
        label: 'Plenty',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: '✓'
      };
    case 'medium':
      return {
        label: 'Medium',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        icon: '⚠'
      };
    case 'low':
      return {
        label: 'Low',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        icon: '!'
      };
    case 'sold-out':
      return {
        label: 'Sold Out',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: '✕'
      };
  }
}
