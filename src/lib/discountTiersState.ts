import { DiscountTier } from '@/types';

// Default discount tiers - can be customized via API
export let customDiscountTiers: DiscountTier[] | null = null;

export function setCustomDiscountTiers(tiers: DiscountTier[]) {
  customDiscountTiers = tiers;
}

export function getCustomDiscountTiers(): DiscountTier[] | null {
  return customDiscountTiers;
}

export function resetDiscountTiers() {
  customDiscountTiers = null;
}
