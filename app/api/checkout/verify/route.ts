import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import { PLANS } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
    const client = new DodoPayments({
      environment: isProd ? 'live_mode' : 'test_mode',
      // DODO_PAYMENTS_API_KEY is picked up automatically
    });

    const sessionData = await client.checkoutSessions.retrieve(session_id);

    const isPaid = sessionData.payment_status === 'succeeded';

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
            to: sessionData.customer_email || 'hello@kinetixapp.com',
            customerName: sessionData.customer_name || 'Kinetix Customer',
            planName: 'Paid Plan', // Can be dynamically mapped based on product_cart if needed
            amount: 0, // Optionally extract the payment amount from the payment intent
            orderId: session_id,
          }),
        });
      } catch (err) {
        console.warn('[Verify] Email delivery failed (non-critical):', err);
      }
    }

    return NextResponse.json({
      success: true,
      status: sessionData.payment_status,
      isPaid,
    });
  } catch (error: any) {
    console.error('[DodoVerify] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
