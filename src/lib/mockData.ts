import { Item, RestaurantConfig, InventoryStatus, Analytics } from '@/types';

// Mock items - prepped items only
export const MOCK_ITEMS: Item[] = [
  {
    id: 'item-1',
    name: 'Tomato Basil Soup',
    category: 'soup',
    description: 'Fresh daily soup',
    regularPrice: 8.99,
    isWasteRisk: true,
    typicalBatchSize: 20,
    earliestFlashTime: '21:00',
    ingredients: ['Tomatoes', 'Fresh Basil', 'Onions', 'Garlic', 'Vegetable Stock', 'Heavy Cream', 'Olive Oil']
  },
  {
    id: 'item-2',
    name: 'Grilled Chicken Breast',
    category: 'protein',
    description: 'Pre-grilled, ready to serve',
    regularPrice: 12.99,
    isWasteRisk: true,
    typicalBatchSize: 15,
    earliestFlashTime: '21:30',
    ingredients: ['Chicken Breast', 'Olive Oil', 'Lemon Juice', 'Garlic', 'Black Pepper', 'Sea Salt', 'Herbs']
  },
  {
    id: 'item-3',
    name: 'Caesar Salad (Prepped)',
    category: 'side',
    description: 'Pre-assembled salads',
    regularPrice: 6.99,
    isWasteRisk: true,
    typicalBatchSize: 25,
    earliestFlashTime: '21:00',
    ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Parmesan Cheese', 'Croutons', 'Lemon']
  },
  {
    id: 'item-4',
    name: 'Chocolate Croissant',
    category: 'pastry',
    description: 'Baked this morning',
    regularPrice: 4.99,
    isWasteRisk: true,
    typicalBatchSize: 30,
    earliestFlashTime: '20:00',
    ingredients: ['Butter', 'Flour', 'Dark Chocolate', 'Eggs', 'Sugar', 'Yeast', 'Salt']
  },
  {
    id: 'item-5',
    name: 'Roasted Vegetables',
    category: 'side',
    description: 'Seasonal roasted veggies',
    regularPrice: 5.99,
    isWasteRisk: true,
    typicalBatchSize: 20,
    earliestFlashTime: '21:30',
    ingredients: ['Carrots', 'Zucchini', 'Bell Peppers', 'Red Onion', 'Olive Oil', 'Thyme', 'Garlic']
  },
  {
    id: 'item-6',
    name: 'Chicken Fried Rice',
    category: 'side',
    description: 'Pre-cooked rice dishes',
    regularPrice: 9.99,
    isWasteRisk: true,
    typicalBatchSize: 18,
    earliestFlashTime: '21:00',
    ingredients: ['Jasmine Rice', 'Chicken', 'Eggs', 'Soy Sauce', 'Green Onions', 'Peas', 'Carrots', 'Sesame Oil']
  },
  {
    id: 'item-7',
    name: 'Fresh Lemonade',
    category: 'beverage',
    description: 'Made fresh today',
    regularPrice: 3.99,
    isWasteRisk: false,
    typicalBatchSize: 40,
    earliestFlashTime: '20:30',
    ingredients: ['Fresh Lemons', 'Water', 'Sugar', 'Ice']
  },
  {
    id: 'item-8',
    name: 'Beef Lasagna Slice',
    category: 'other',
    description: 'Pre-portioned slices',
    regularPrice: 11.99,
    isWasteRisk: true,
    typicalBatchSize: 12,
    earliestFlashTime: '21:30',
    ingredients: ['Ground Beef', 'Lasagna Noodles', 'Ricotta Cheese', 'Mozzarella', 'Tomato Sauce', 'Parmesan', 'Herbs']
  },
  {
    id: 'item-9',
    name: 'Cream of Mushroom Soup',
    category: 'soup',
    description: 'Rich and creamy',
    regularPrice: 9.99,
    isWasteRisk: true,
    typicalBatchSize: 18,
    earliestFlashTime: '21:00',
    ingredients: ['Mushrooms', 'Heavy Cream', 'Butter', 'Onions', 'Garlic', 'Vegetable Stock', 'Thyme', 'White Wine']
  },
  {
    id: 'item-10',
    name: 'BBQ Pulled Pork',
    category: 'protein',
    description: 'Slow-cooked, ready to serve',
    regularPrice: 13.99,
    isWasteRisk: true,
    typicalBatchSize: 12,
    earliestFlashTime: '21:30',
    ingredients: ['Pork Shoulder', 'BBQ Sauce', 'Brown Sugar', 'Apple Cider Vinegar', 'Paprika', 'Garlic Powder', 'Onion Powder']
  },
  {
    id: 'item-11',
    name: 'Greek Salad Bowl',
    category: 'side',
    description: 'Pre-portioned Greek salads',
    regularPrice: 7.99,
    isWasteRisk: true,
    typicalBatchSize: 20,
    earliestFlashTime: '21:00',
    ingredients: ['Cucumbers', 'Tomatoes', 'Feta Cheese', 'Kalamata Olives', 'Red Onion', 'Olive Oil', 'Oregano']
  },
  {
    id: 'item-12',
    name: 'Blueberry Muffin',
    category: 'pastry',
    description: 'Freshly baked today',
    regularPrice: 3.99,
    isWasteRisk: true,
    typicalBatchSize: 35,
    earliestFlashTime: '20:00',
    ingredients: ['Blueberries', 'Flour', 'Sugar', 'Eggs', 'Butter', 'Milk', 'Baking Powder', 'Vanilla Extract']
  },
  {
    id: 'item-13',
    name: 'Garlic Bread',
    category: 'side',
    description: 'Pre-baked garlic bread',
    regularPrice: 4.99,
    isWasteRisk: false,
    typicalBatchSize: 30,
    earliestFlashTime: '21:00',
    ingredients: ['French Bread', 'Butter', 'Garlic', 'Parsley', 'Parmesan Cheese']
  },
  {
    id: 'item-14',
    name: 'Quinoa Power Bowl',
    category: 'other',
    description: 'Pre-assembled healthy bowl',
    regularPrice: 10.99,
    isWasteRisk: true,
    typicalBatchSize: 15,
    earliestFlashTime: '21:30',
    ingredients: ['Quinoa', 'Kale', 'Sweet Potato', 'Chickpeas', 'Avocado', 'Tahini Dressing', 'Pumpkin Seeds']
  },
  {
    id: 'item-15',
    name: 'Iced Coffee',
    category: 'beverage',
    description: 'Cold brew coffee',
    regularPrice: 4.99,
    isWasteRisk: false,
    typicalBatchSize: 25,
    earliestFlashTime: '20:30',
    ingredients: ['Coffee Beans', 'Water', 'Ice', 'Milk']
  },
  {
    id: 'item-16',
    name: 'Vegetable Spring Rolls',
    category: 'side',
    description: 'Pre-fried spring rolls',
    regularPrice: 6.99,
    isWasteRisk: true,
    typicalBatchSize: 24,
    earliestFlashTime: '21:00',
    ingredients: ['Spring Roll Wrappers', 'Cabbage', 'Carrots', 'Glass Noodles', 'Mushrooms', 'Soy Sauce', 'Ginger']
  },
  {
    id: 'item-17',
    name: 'Salmon Fillet',
    category: 'protein',
    description: 'Pan-seared salmon',
    regularPrice: 16.99,
    isWasteRisk: true,
    typicalBatchSize: 10,
    earliestFlashTime: '21:30',
    ingredients: ['Salmon', 'Lemon', 'Dill', 'Butter', 'Garlic', 'White Wine', 'Sea Salt', 'Black Pepper']
  },
  {
    id: 'item-18',
    name: 'Apple Pie Slice',
    category: 'pastry',
    description: 'Homemade apple pie',
    regularPrice: 5.99,
    isWasteRisk: true,
    typicalBatchSize: 16,
    earliestFlashTime: '20:00',
    ingredients: ['Apples', 'Flour', 'Butter', 'Sugar', 'Cinnamon', 'Nutmeg', 'Lemon Juice']
  },
  {
    id: 'item-19',
    name: 'Mashed Potatoes',
    category: 'side',
    description: 'Creamy mashed potatoes',
    regularPrice: 4.99,
    isWasteRisk: true,
    typicalBatchSize: 25,
    earliestFlashTime: '21:30',
    ingredients: ['Potatoes', 'Butter', 'Milk', 'Cream', 'Garlic', 'Salt', 'Black Pepper', 'Chives']
  },
  {
    id: 'item-20',
    name: 'Fruit Smoothie',
    category: 'beverage',
    description: 'Mixed berry smoothie',
    regularPrice: 5.99,
    isWasteRisk: false,
    typicalBatchSize: 20,
    earliestFlashTime: '20:30',
    ingredients: ['Strawberries', 'Blueberries', 'Banana', 'Yogurt', 'Honey', 'Ice']
  },
  // New non-waste-risk items
  {
    id: 'item-21',
    name: 'Bottled Water',
    category: 'beverage',
    description: 'Premium spring water',
    regularPrice: 2.49,
    isWasteRisk: false,
    typicalBatchSize: 100,
    earliestFlashTime: '20:00',
    ingredients: ['Spring Water']
  },
  {
    id: 'item-22',
    name: 'Soft Drink (Can)',
    category: 'beverage',
    description: 'Assorted sodas',
    regularPrice: 2.99,
    isWasteRisk: false,
    typicalBatchSize: 80,
    earliestFlashTime: '20:00',
    ingredients: ['Carbonated Water', 'Sugar', 'Natural Flavors', 'Caffeine']
  },
  {
    id: 'item-23',
    name: 'Chips & Salsa',
    category: 'side',
    description: 'Tortilla chips with fresh salsa',
    regularPrice: 5.49,
    isWasteRisk: false,
    typicalBatchSize: 50,
    earliestFlashTime: '20:00',
    ingredients: ['Corn Tortilla Chips', 'Tomatoes', 'Onions', 'Cilantro', 'Lime Juice', 'Jalapeños']
  },
  {
    id: 'item-24',
    name: 'Hot Tea',
    category: 'beverage',
    description: 'Assorted tea selection',
    regularPrice: 2.99,
    isWasteRisk: false,
    typicalBatchSize: 60,
    earliestFlashTime: '20:00',
    ingredients: ['Tea Leaves', 'Hot Water', 'Honey']
  },
  {
    id: 'item-25',
    name: 'French Fries',
    category: 'side',
    description: 'Crispy frozen fries',
    regularPrice: 4.49,
    isWasteRisk: false,
    typicalBatchSize: 40,
    earliestFlashTime: '20:00',
    ingredients: ['Potatoes', 'Vegetable Oil', 'Sea Salt']
  }
];

// Initial inventory status
export const INITIAL_INVENTORY: InventoryStatus[] = MOCK_ITEMS.map(item => ({
  itemId: item.id,
  bucket: 'high',
  lastUpdated: new Date(),
  autoDecayed: false
}));

// Restaurant configuration
export const MOCK_CONFIG: RestaurantConfig = {
  id: 'restaurant-1',
  name: 'The Daily Bistro',
  closingTime: '23:00',
  discountTiers: [
    { startTime: '20:00', discountPercent: 10 },
    { startTime: '21:00', discountPercent: 20 },
    { startTime: '22:00', discountPercent: 35 },
    { startTime: '22:30', discountPercent: 50 }
  ],
  activeItems: MOCK_ITEMS.map(item => item.id)
};

// Mock analytics
export const MOCK_ANALYTICS: Analytics = {
  totalSaved: 1247.50,
  mealsRescued: 156,
  revenueGenerated: 3892.25,
  wasteReduced: 32,
  topItems: [
    {
      itemId: 'item-1',
      itemName: 'Tomato Basil Soup',
      unitsSold: 45,
      revenue: 324.55
    },
    {
      itemId: 'item-2',
      itemName: 'Grilled Chicken Breast',
      unitsSold: 38,
      revenue: 394.62
    },
    {
      itemId: 'item-4',
      itemName: 'Chocolate Croissant',
      unitsSold: 62,
      revenue: 247.38
    }
  ],
  dailyTrend: [
    { date: '2026-01-10', saved: 142.50, meals: 18 },
    { date: '2026-01-11', saved: 167.25, meals: 21 },
    { date: '2026-01-12', saved: 156.00, meals: 19 },
    { date: '2026-01-13', saved: 189.75, meals: 24 },
    { date: '2026-01-14', saved: 198.50, meals: 26 },
    { date: '2026-01-15', saved: 223.25, meals: 28 },
    { date: '2026-01-16', saved: 170.25, meals: 20 }
  ]
};
