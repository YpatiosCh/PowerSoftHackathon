import { PowerSoftMenu } from '@/menu/menu';
import { MOCK_CONFIG } from '@/lib/mockData';
import { ItemWithStatus, MenuItemBase } from '@/types';
import { getCurrentDiscount, autoDecayBucket, calculateFinalPrice, isFlashActive } from '@/lib/utils';
import { manualDiscounts } from '@/lib/discountState';
import { autoSaleEnabled } from '@/lib/autoSaleState';
import { getCurrentTime } from '@/lib/testClock';
import { getCustomDiscountTiers } from '@/lib/discountTiersState';
import { getOrCreateInventory } from '@/lib/inventoryState';

// Extract all menu items from PowerSoft menu
function extractAllMenuItems(): MenuItemBase[] {
  const allItems: MenuItemBase[] = [];

  for (const category of PowerSoftMenu.categories) {
    if (category.items) {
      allItems.push(...category.items);
    }
    if (category.subcategories) {
      for (const sub of category.subcategories) {
        allItems.push(...sub.items);
      }
    }
  }

  return allItems;
}

const allMenuItems = extractAllMenuItems();

/**
 * Get all menu items with their current status (discounts, inventory, etc.)
 */
export function getItemsWithStatus(): ItemWithStatus[] {
  const currentTime = getCurrentTime();
  const discountTiers = getCustomDiscountTiers() || MOCK_CONFIG.discountTiers;

  const itemsWithStatus: ItemWithStatus[] = allMenuItems.map(item => {
    const inventoryStatus = getOrCreateInventory(item.id);

    const currentBucket = autoDecayBucket(
      inventoryStatus.bucket,
      inventoryStatus.lastUpdated,
      currentTime,
      MOCK_CONFIG.closingTime
    );

    const hasAutoSale = autoSaleEnabled.get(item.id) ?? false;
    const manualDiscount = manualDiscounts.get(item.id);

    // Default earliest flash time (can be customized per item)
    const earliestFlashTime = '20:00';

    const autoDiscount = hasAutoSale
      ? getCurrentDiscount(currentTime, discountTiers, earliestFlashTime)
      : 0;

    const currentDiscount = manualDiscount !== undefined ? manualDiscount : autoDiscount;

    const regularPrice = item.price || item.pricing?.bottle || item.pricing?.glass || 0;
    const finalPrice = calculateFinalPrice(regularPrice, currentDiscount);

    const flashActive = manualDiscount !== undefined
      ? true
      : (hasAutoSale && isFlashActive(currentTime, earliestFlashTime, currentBucket));

    return {
      ...item,
      regularPrice,
      category: 'other' as const,
      isWasteRisk: hasAutoSale,
      typicalBatchSize: 10,
      earliestFlashTime,
      currentBucket,
      currentDiscount,
      finalPrice,
      lastUpdated: inventoryStatus.lastUpdated,
      isFlashActive: flashActive
    };
  });

  return itemsWithStatus;
}

/**
 * Get only flash sale items (items with active discounts)
 */
export function getFlashSaleItems(): ItemWithStatus[] {
  return getItemsWithStatus().filter(item => item.isFlashActive && item.currentDiscount > 0);
}

/**
 * Get items by stock status
 */
export function getItemsByStock(status: 'high' | 'medium' | 'low' | 'sold-out'): ItemWithStatus[] {
  return getItemsWithStatus().filter(item => item.currentBucket === status);
}
