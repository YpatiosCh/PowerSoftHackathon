import { NextResponse } from 'next/server';
import { orders, Order } from '@/lib/ordersState';

// GET - Get all orders or filter by status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let filteredOrders = orders;
  if (status) {
    filteredOrders = orders.filter(order => order.status === status);
  }

  return NextResponse.json({
    orders: filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  });
}

// POST - Create a new order
export async function POST(request: Request) {
  try {
    const { items, totalRegular, totalFinal, totalSavings } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items,
      totalRegular,
      totalFinal,
      totalSavings,
      status: 'pending',
      createdAt: new Date()
    };

    orders.push(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// PATCH - Update order status (accept/decline)
export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'orderId and status are required' },
        { status: 400 }
      );
    }

    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be "accepted" or "declined"' },
        { status: 400 }
      );
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    order.status = status;

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
