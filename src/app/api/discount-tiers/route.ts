import { NextResponse } from 'next/server';
import { DiscountTier } from '@/types';
import { setCustomDiscountTiers, getCustomDiscountTiers, resetDiscountTiers } from '@/lib/discountTiersState';
import { MOCK_CONFIG } from '@/lib/mockData';

// GET - Get current discount tiers (custom or default)
export async function GET() {
  const customTiers = getCustomDiscountTiers();
  
  return NextResponse.json({
    tiers: customTiers || MOCK_CONFIG.discountTiers,
    isCustom: customTiers !== null
  });
}

// POST - Set custom discount tiers
export async function POST(request: Request) {
  try {
    const { tiers } = await request.json();

    if (!Array.isArray(tiers)) {
      return NextResponse.json(
        { error: 'Tiers must be an array' },
        { status: 400 }
      );
    }

    // Validate each tier
    for (const tier of tiers) {
      if (!tier.startTime || typeof tier.startTime !== 'string') {
        return NextResponse.json(
          { error: 'Each tier must have a valid startTime (HH:MM format)' },
          { status: 400 }
        );
      }

      if (typeof tier.discountPercent !== 'number' || tier.discountPercent < 0 || tier.discountPercent > 100) {
        return NextResponse.json(
          { error: 'Each tier must have a discountPercent between 0 and 100' },
          { status: 400 }
        );
      }

      // Validate time format
      const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(tier.startTime)) {
        return NextResponse.json(
          { error: 'Invalid time format. Use HH:MM (24-hour format)' },
          { status: 400 }
        );
      }
    }

    // Sort tiers by time
    const sortedTiers = [...tiers].sort((a, b) => {
      const [aHour, aMin] = a.startTime.split(':').map(Number);
      const [bHour, bMin] = b.startTime.split(':').map(Number);
      return (aHour * 60 + aMin) - (bHour * 60 + bMin);
    });

    setCustomDiscountTiers(sortedTiers);

    return NextResponse.json({
      success: true,
      tiers: sortedTiers
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE - Reset to default tiers
export async function DELETE() {
  resetDiscountTiers();
  
  return NextResponse.json({
    success: true,
    tiers: MOCK_CONFIG.discountTiers
  });
}
