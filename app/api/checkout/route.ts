import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { amount, planName, customerPhone, customerEmail, customerName } = await req.json();

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const isProd = process.env.CASHFREE_ENV === 'production';

    if (!appId || !secretKey) {
      console.error('[Cashfree] Missing CASHFREE_APP_ID or CASHFREE_SECRET_KEY');
      return NextResponse.json({ error: 'Payment gateway is not configured.' }, { status: 500 });
    }

    const host = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

    const orderId = `ORDER_${Date.now()}_${uuidv4().split('-')[0]}`;

    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      order_note: `Kinetix Subscription: ${planName} Plan`,
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_name: customerName || 'Kinetix User',
        customer_email: customerEmail || 'hello@kinetixapp.com', // Replace with auth user later
        customer_phone: customerPhone || '9999999999',           // Require phone later
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing?checkout=success&order_id={order_id}`
      }
    };

    const res = await fetch(`${host}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('[Cashfree] Create order error:', errorData);
      return NextResponse.json({ error: 'Failed to create payment order.' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
    });
  } catch (err: any) {
    console.error('[Cashfree] Checkout error:', err);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
