import { NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { createAlert, deleteAlert, getAlerts, updateAlert } from '@/lib/actions/alert.actions';

async function requireUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return null;
  const userId = (session.user.id as string) || (session.user.email as string) || '';
  return userId;
}

export async function GET(request: Request) {
  const userId = await requireUser(request);
  if (!userId) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

  const alerts = await getAlerts(userId);
  return NextResponse.json({ success: true, data: alerts });
}

export async function POST(request: Request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { symbol, company, alertName, alertType, threshold } = body || {};
    if (!symbol || !company || !alertName || !alertType) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const result = await createAlert(userId, { symbol, company, alertName, alertType, threshold });
    if (!result.success) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  } catch (err) {
    console.error('alerts POST error', err);
    return NextResponse.json({ success: false, message: 'Failed to create alert' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { id, ...updates } = body || {};
    if (!id) return NextResponse.json({ success: false, message: 'Missing alert id' }, { status: 400 });

    const result = await updateAlert(userId, id, updates);
    if (!result.success) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  } catch (err) {
    console.error('alerts PATCH error', err);
    return NextResponse.json({ success: false, message: 'Failed to update alert' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    const body = await request.json();
    const { id } = body || {};
    if (!id) return NextResponse.json({ success: false, message: 'Missing alert id' }, { status: 400 });

    await deleteAlert(userId, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('alerts DELETE error', err);
    return NextResponse.json({ success: false, message: 'Failed to delete alert' }, { status: 500 });
  }
}
