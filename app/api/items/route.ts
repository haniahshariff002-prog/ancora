import { NextResponse } from 'next/server';
import { SEEDED_ITEMS } from '../../../data/items';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search')?.toLowerCase();

  let results = [...SEEDED_ITEMS];

  if (category && category !== 'All') {
    results = results.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    results = results.filter(
      (i) =>
        i.name.toLowerCase().includes(search) ||
        i.brand.toLowerCase().includes(search) ||
        i.description.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    count: results.length,
    items: results
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = {
      ...body,
      id: `item-${Date.now()}`,
      status: 'available'
    };
    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
