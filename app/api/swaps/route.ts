import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'active',
    pipeline: ['Requested', 'Approved', 'Dispatched', 'Delivered', 'Completed']
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = `swap-${Date.now().toString().slice(-4)}`;
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Swap order registered with Ancora dispatch.'
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Could not create swap order' }, { status: 400 });
  }
}
