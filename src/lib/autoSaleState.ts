// Shared state for tracking which items have auto-sale enabled
// Items with auto-sale enabled will get automatic time-based discounts
// Items without it will only show discounts if manually set by staff

export const autoSaleEnabled: Map<string, boolean> = new Map();
