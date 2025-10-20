import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongoose';
import { Watchlist } from '@/db/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, company } = body || {};
    if (!symbol || !company) return NextResponse.json({ success: false, message: 'Missing symbol or company' }, { status: 400 });

    // authenticate
    const session = await auth.api.getSession({ headers: request.headers as any });
    if (!session?.user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    const mongoose = await connectToDatabase();

    const userId = session.user.id || String(session.user?.id || '');
    const payload = { userId: String(userId), symbol: String(symbol).toUpperCase(), company: String(company) };

    try {
      await Watchlist.create({ ...payload, addedAt: new Date() });
    } catch (err: any) {
      // ignore duplicate key (already in watchlist)
      if (err?.code === 11000) {
        return NextResponse.json({ success: true, message: 'Already in watchlist' });
      }
      console.error('watchlist add error', err);
      return NextResponse.json({ success: false, message: 'Failed to add to watchlist' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('watchlist POST error', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { symbol } = body || {};
    if (!symbol) return NextResponse.json({ success: false, message: 'Missing symbol' }, { status: 400 });

    const session = await auth.api.getSession({ headers: request.headers as any });
    if (!session?.user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    const userId = session.user.id || String(session.user?.id || '');

    await Watchlist.deleteOne({ userId: String(userId), symbol: String(symbol).toUpperCase() });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('watchlist DELETE error', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { symbol, company, category } = body || {};
    if (!symbol) return NextResponse.json({ success: false, message: 'Missing symbol' }, { status: 400 });

    const session = await auth.api.getSession({ headers: request.headers as any });
    if (!session?.user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    const userId = session.user.id || String(session.user?.id || '');

    const update: any = {};
    if (company) update.company = String(company);
    if (category !== undefined) update.category = category === null ? '' : String(category);

    await Watchlist.updateOne({ userId: String(userId), symbol: String(symbol).toUpperCase() }, { $set: update });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('watchlist PATCH error', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
