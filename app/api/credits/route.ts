import { NextResponse } from 'next/server';
import { SEEDED_USERS } from '../../../data/users';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const user = SEEDED_USERS.find((u) => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ userId: user.id, credits: user.credits });
  }

  return NextResponse.json({
    totalUsers: SEEDED_USERS.length,
    users: SEEDED_USERS.map((u) => ({ id: u.id, name: u.name, credits: u.credits }))
  });
}

export async function POST(request: Request) {
  try {
    const { userId, amount, reason } = await request.json();
    return NextResponse.json({
      success: true,
      transactionId: `tx-api-${Date.now()}`,
      userId,
      amount,
      reason,
      status: 'confirmed'
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to process credit transaction' }, { status: 400 });
  }
}
