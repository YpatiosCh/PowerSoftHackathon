// Inventory bucket levels
export type InventoryBucket = 'high' | 'medium' | 'low' | 'sold-out';

// Item category
export type ItemCategory = 'soup' | 'protein' | 'side' | 'pastry' | 'beverage' | 'breakfast-brunch' | 'salads' | 'lunch-light-dinner' | 'sides' | 'desserts' | 'coffee' | 'not-coffee' | 'smoothies' | 'wines' | 'cocktails' | 'other';

// Menu item addon
export interface MenuItemAddon {
  name: string;
  price: number;
}

// Menu item pricing (for drinks)
export interface MenuItemPricing {
  glass?: number;
  bottle?: number;
}

// Base menu item interface (from PowerSoft menu)
export interface MenuItemBase {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  tags?: string[];
  pricing?: MenuItemPricing;
  addons?: MenuItemAddon[];
}

// FlashBite-specific item fields
export interface FlashBiteFields {
  isWasteRisk?: boolean;
  typicalBatchSize?: number;
  earliestFlashTime?: string; // HH:MM format
  ingredients?: string[];
  category?: ItemCategory;
}

// Combined item type
export interface Item extends MenuItemBase, FlashBiteFields {
  regularPrice: number; // maps to price or calculated from pricing
}

// Inventory status for an item
export interface InventoryStatus {
  itemId: string;
  bucket: InventoryBucket;
  lastUpdated: Date;
  updatedBy?: string;
  autoDecayed: boolean;
}

// Flash sale discount tier
export interface DiscountTier {
  startTime: string; // HH:MM format
  discountPercent: number;
}

// Complete item with current status
export interface ItemWithStatus extends Item {
  currentBucket: InventoryBucket;
  currentDiscount: number;
  finalPrice: number;
  lastUpdated: Date;
  isFlashActive: boolean;
}

// Analytics data
export interface Analytics {
  totalSaved: number;
  mealsRescued: number;
  revenueGenerated: number;
  wasteReduced: number; // percentage
  topItems: {
    itemId: string;
    itemName: string;
    unitsSold: number;
    revenue: number;
  }[];
  dailyTrend: {
    date: string;
    saved: number;
    meals: number;
  }[];
}

// Restaurant configuration
export interface RestaurantConfig {
  id: string;
  name: string;
  closingTime: string; // HH:MM format
  discountTiers: DiscountTier[];
  activeItems: string[]; // Item IDs enabled for flash sales
}

// Staff update action
export interface StaffUpdate {
  itemId: string;
  action: 'plenty' | 'low' | 'sold-out' | 'add-batch';
  timestamp: Date;
  staffName?: string;
}

// Menu structure types
export interface MenuSubcategory {
  id: string;
  name: string;
  items: MenuItemBase[];
}

export interface MenuCategory {
  id: string;
  name: string;
  note?: string;
  items?: MenuItemBase[];
  subcategories?: MenuSubcategory[];
}

export interface Restaurant {
  name: string;
  logo: string;
}

export interface Menu {
  restaurant: Restaurant;
  categories: MenuCategory[];
}

// Cart item type
export interface CartItem extends MenuItemBase {
  quantity: number;
  currentDiscount?: number;
  finalPrice?: number;
  currentBucket?: string;
}
