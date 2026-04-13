import { NextRequest, NextResponse } from 'next/server';
import { PLANS } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const isProd = process.env.CASHFREE_ENV === 'production';

    if (!appId || !secretKey) {
      return NextResponse.json({ error: 'Cashfree not configured' }, { status: 500 });
    }

    const host = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

    const res = await fetch(`${host}/orders/${order_id}`, {
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch order status' }, { status: res.status });
    }

    const data = await res.json();
    const isPaid = data.order_status === 'PAID';

    if (isPaid) {
      // Trigger success email via internal API call to /api/email
      // In a real app, you'd also update your database here
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`;
      try {
        await fetch(`${baseUrl}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'payment',
            to: data.customer_details.customer_email,
            customerName: data.customer_details.customer_name,
            planName: data.order_note.split(': ')[1] || 'Pro',
            amount: data.order_amount,
            orderId: order_id,
          }),
        });
      } catch (err) {
        console.warn('[Verify] Email delivery failed (non-critical):', err);
      }
    }

    return NextResponse.json({
      success: true,
      status: data.order_status,
      isPaid,
    });
  } catch (error: any) {
    console.error('[Cashfree Verify] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
