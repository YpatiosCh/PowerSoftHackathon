import { NextRequest, NextResponse } from 'next/server';
import { InventoryBucket } from '@/types';
import { inventoryState, updateInventory } from '@/lib/inventoryState';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, action } = body;

    if (!itemId || !action) {
      return NextResponse.json(
        { error: 'Missing itemId or action' },
        { status: 400 }
      );
    }

    // Determine new bucket based on action
    let newBucket: InventoryBucket;

    switch (action) {
      case 'plenty':
      case 'add-batch':
        newBucket = 'high';
        break;
      case 'low':
        newBucket = 'low';
        break;
      case 'sold-out':
        newBucket = 'sold-out';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update inventory using shared state
    const updatedStatus = updateInventory(itemId, newBucket);

    return NextResponse.json({
      success: true,
      itemId,
      newBucket,
      timestamp: updatedStatus.lastUpdated
    });

  } catch (error) {
    console.error('Update inventory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    inventory: inventoryState
  });
}
