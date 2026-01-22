import { NextRequest, NextResponse } from 'next/server';
import { autoSaleEnabled } from '@/lib/autoSaleState';

// POST - Enable auto-sale for an item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    autoSaleEnabled.set(itemId, true);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Auto-sale enabled for item',
      itemId,
      enabled: true
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE - Disable auto-sale for an item
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    autoSaleEnabled.set(itemId, false);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Auto-sale disabled for item',
      itemId,
      enabled: false
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// GET - Get all auto-sale settings
export async function GET() {
  const settings: Record<string, boolean> = {};
  autoSaleEnabled.forEach((value, key) => {
    settings[key] = value;
  });
  
  return NextResponse.json({ autoSaleSettings: settings });
}
