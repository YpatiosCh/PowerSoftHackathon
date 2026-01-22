import { InventoryStatus } from '@/types';
import { PowerSoftMenu } from '@/menu/menu';

// Extract all menu items from PowerSoft menu
function extractAllMenuItems() {
  const allItems: any[] = [];
  
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

// Shared in-memory inventory state
const allMenuItems = extractAllMenuItems();
export let inventoryState: InventoryStatus[] = allMenuItems.map(item => ({
  itemId: item.id,
  bucket: 'high' as const,
  lastUpdated: new Date(),
  autoDecayed: false
}));

// Helper to get or create inventory status
export function getOrCreateInventory(itemId: string): InventoryStatus {
  let status = inventoryState.find(inv => inv.itemId === itemId);
  if (!status) {
    status = {
      itemId,
      bucket: 'high',
      lastUpdated: new Date(),
      autoDecayed: false
    };
    inventoryState.push(status);
  }
  return status;
}

// Helper to update inventory
export function updateInventory(itemId: string, bucket: InventoryStatus['bucket']): InventoryStatus {
  const status = getOrCreateInventory(itemId);
  status.bucket = bucket;
  status.lastUpdated = new Date();
  status.autoDecayed = false;
  return status;
}
