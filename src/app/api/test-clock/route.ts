import { NextRequest, NextResponse } from 'next/server';
import { setTestTimeByHourMinute, setTestTime, getTestTime } from '@/lib/testClock';

// POST - Set test time
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hour, minute } = body;

    if (hour !== undefined) {
      setTestTimeByHourMinute(hour, minute || 0);
      return NextResponse.json({ 
        success: true, 
        message: `Test time set to ${hour}:${String(minute || 0).padStart(2, '0')}`,
        testTime: getTestTime()
      });
    }

    return NextResponse.json({ error: 'Hour is required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE - Reset to real time
export async function DELETE() {
  setTestTime(null);
  return NextResponse.json({ 
    success: true, 
    message: 'Test time cleared, using real time' 
  });
}

// GET - Get current test time
export async function GET() {
  const testTime = getTestTime();
  return NextResponse.json({ 
    testTime,
    isTestMode: testTime !== null
  });
}