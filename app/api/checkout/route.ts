import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { PLANS, PlanKey } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const { plan, customerEmail, customerName } = await req.json();

    const planKey = (plan || 'pro').toLowerCase() as PlanKey;
    const selectedPlan = PLANS[planKey];

    if (!selectedPlan || planKey === 'starter') {
      return NextResponse.json({ error: 'Invalid or missing plan.' }, { status: 400 });
    }

    const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

    let productId = '';
    if (planKey === 'pro') {
      productId = process.env.DODO_PRODUCT_ID_PRO || '';
    } else if (planKey === 'premium') {
      productId = process.env.DODO_PRODUCT_ID_PREMIUM || '';
    }

    if (!productId) {
      console.warn(`[Checkout] Missing DODO_PRODUCT_ID for plan ${planKey}. Falling back to placeholder.`);
      productId = `dodo_${planKey}_placeholder`;
    }

    if (!process.env.DODO_PAYMENTS_API_KEY) {
      console.error('[Checkout] Missing DODO_PAYMENTS_API_KEY environment variable');
      return NextResponse.json({ error: 'Payment service not configured. Please contact support.' }, { status: 500 });
    }

    const client = new DodoPayments({
      environment: isProd ? 'live_mode' : 'test_mode',
      // DODO_PAYMENTS_API_KEY is picked up automatically
    });

    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing?checkout_status=success`;

    console.log('[Checkout] Creating session for plan:', planKey, 'productId:', productId);

    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1
        }
      ],
      return_url: returnUrl,
      customer: {
        email: customerEmail || 'hello@kinetixapp.com',
        name: customerName || 'Kinetix User',
      }
    });

    console.log('[Checkout] Session created:', session.session_id);

    return NextResponse.json({
      url: session.checkout_url || (session as any).url,
      session_id: session.session_id,
    });
  } catch (err: any) {
    console.error('[DodoPayments] Checkout error:', err?.message || err);
    console.error('[DodoPayments] Error details:', JSON.stringify(err, null, 2));
    return NextResponse.json({ error: err?.message || 'Order creation failed' }, { status: 500 });
  }
}
