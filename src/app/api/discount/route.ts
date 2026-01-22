import { NextRequest, NextResponse } from 'next/server';
import { manualDiscounts } from '@/lib/discountState';

export async function POST(request: NextRequest) {
  try {
    const { itemId, discount } = await request.json();
    
    if (!itemId || typeof discount !== 'number' || discount < 0 || discount > 100) {
      return NextResponse.json(
        { error: 'Invalid itemId or discount value' },
        { status: 400 }
      );
    }

    manualDiscounts.set(itemId, discount);
    
    return NextResponse.json({ 
      success: true,
      itemId,
      discount
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set discount' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json();
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Invalid itemId' },
        { status: 400 }
      );
    }

    manualDiscounts.delete(itemId);
    
    return NextResponse.json({ 
      success: true,
      itemId
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear discount' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(Object.fromEntries(manualDiscounts));
}
