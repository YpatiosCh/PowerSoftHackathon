export interface Order {
  id: string;
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    regularPrice: number;
    discountPercent: number;
    finalPrice: number;
  }>;
  totalRegular: number;
  totalFinal: number;
  totalSavings: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

// In-memory storage for orders
export const orders: Order[] = [];
