import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

type NotificationType = 'build' | 'payment';

interface BuildNotificationPayload {
  type: 'build';
  to: string;
  appName: string;
  platform: 'android' | 'ios';
  buildId: string;
  status: 'queued' | 'completed' | 'failed';
  downloadUrl?: string;
  sha256?: string;
  githubUrl?: string;
  errorMessage?: string;
}

interface PaymentNotificationPayload {
  type: 'payment';
  to: string;
  customerName: string;
  planName: string;
  amount: number;
  orderId: string;
}

type NotificationPayload = BuildNotificationPayload | PaymentNotificationPayload;

function buildEmailHtml(payload: BuildNotificationPayload): string {
  const { appName, platform, buildId, status, downloadUrl, sha256, githubUrl, errorMessage } = payload;

  const platformLabel = platform === 'ios' ? 'iOS IPA' : 'Android APK';
  const statusColor = status === 'completed' ? '#10b981' : status === 'failed' ? '#ef4444' : '#8b5cf6';
  const statusLabel = status === 'completed' ? '✅ Build Complete' : status === 'failed' ? '❌ Build Failed' : '⏳ Build Queued';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kinetix Build Notification</title>
</head>
<body style="margin:0;padding:0;background:#020617;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#020617;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#0f172a;border-radius:20px;border:1px solid rgba(139,92,246,0.2);overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(6,182,212,0.1));padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:16px;">
                <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="47" stroke="rgba(139,92,246,0.5)" stroke-width="1.5" fill="none"/>
                  <rect x="25" y="22" width="10" height="56" rx="3" fill="url(#hg1)"/>
                  <path d="M35 50L63 22H76L48 50" stroke="url(#hg2)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M35 50L63 78H76L48 50" stroke="url(#hg2)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <circle cx="50" cy="50" r="4" fill="#22d3ee"/>
                  <defs>
                    <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient>
                    <linearGradient id="hg2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient>
                  </defs>
                </svg>
                <span style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#a78bfa,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Kinetix</span>
              </div>
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#f1f5f9;">${statusLabel}</h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:14px;">${platformLabel} for <strong style="color:#a78bfa;">${appName}</strong></p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${status === 'completed' ? `
              <!-- Success Actions -->
              <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#34d399;">🔐 Signed & Verified</p>
                ${sha256 ? `<p style="margin:4px 0 0;font-size:11px;color:#94a3b8;font-family:monospace;word-break:break-all;">SHA-256: ${sha256}</p>` : ''}
              </div>
              ${downloadUrl ? `
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${downloadUrl}" style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#06b6d4);color:white;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:-0.01em;">
                  ⬇ Download ${platformLabel}
                </a>
              </div>` : ''}
              ` : status === 'failed' ? `
              <!-- Error message -->
              <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#f87171;">Build Error</p>
                <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">${errorMessage || 'An unexpected error occurred during the build process.'}</p>
              </div>
              <div style="text-align:center;margin-bottom:24px;">
                <a href="https://kinetixapp.com/#generate" style="display:inline-block;background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.4);color:#a78bfa;font-weight:600;font-size:14px;padding:12px 28px;border-radius:12px;text-decoration:none;">
                  🔄 Try Again
                </a>
              </div>
              ` : `
              <!-- Queued -->
              <div style="background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#94a3b8;">Your app is in the build queue. We&apos;ll email you when it&apos;s ready. Typical build time: <strong style="color:#a78bfa;">60–90 seconds</strong>.</p>
              </div>
              ${githubUrl ? `
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${githubUrl}" style="display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;font-weight:600;font-size:14px;padding:12px 28px;border-radius:12px;text-decoration:none;">
                  View Build Progress on GitHub
                </a>
              </div>` : ''}
              `}

              <!-- Build Details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">
                <tr><td colspan="2" style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:12px;font-weight:600;color:#475569;letter-spacing:0.08em;text-transform:uppercase;">Build Details</td></tr>
                <tr>
                  <td style="padding:10px 16px;font-size:13px;color:#94a3b8;border-bottom:1px solid rgba(255,255,255,0.04);">App Name</td>
                  <td style="padding:10px 16px;font-size:13px;color:#f1f5f9;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;">${appName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:13px;color:#94a3b8;border-bottom:1px solid rgba(255,255,255,0.04);">Platform</td>
                  <td style="padding:10px 16px;font-size:13px;color:#f1f5f9;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;">${platformLabel}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:13px;color:#94a3b8;">Build ID</td>
                  <td style="padding:10px 16px;font-size:11px;color:#94a3b8;font-family:monospace;text-align:right;">${buildId}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                You received this because you submitted a build request on Kinetix.<br/>
                <a href="https://kinetixapp.com/privacy" style="color:#8b5cf6;text-decoration:none;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="https://kinetixapp.com/terms" style="color:#8b5cf6;text-decoration:none;">Terms of Service</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function buildPaymentEmailHtml(payload: PaymentNotificationPayload): string {
  const { customerName, planName, amount, orderId } = payload;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#020617;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#020617;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#0f172a;border-radius:20px;border:1px solid rgba(34,211,238,0.2);overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(34,211,238,0.15),rgba(139,92,246,0.1));padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#f1f5f9;">Payment Successful!</h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:14px;">Welcome to the <strong style="color:#22d3ee;">${planName} Plan</strong>, ${customerName}!</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#94a3b8;">Your payment of <strong style="color:#f1f5f9;">₹${amount}</strong> has been processed successfully. You now have full access to your plan benefits.</p>
              
              <div style="background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.2);border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
                <p style="margin:0 0 12px;font-size:14px;color:#94a3b8;">Ready to build something amazing?</p>
                <a href="https://kinetixapp.com/dashboard" style="display:inline-block;background:linear-gradient(135deg,#22d3ee,#8b5cf6);color:white;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">
                  Launch Kinetix Dashboard
                </a>
              </div>

              <!-- Transaction details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">
                <tr><td colspan="2" style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:11px;font-weight:800;color:#475569;letter-spacing:0.1em;text-transform:uppercase;">Transaction Details</td></tr>
                <tr>
                  <td style="padding:10px 16px;font-size:13px;color:#94a3b8;">Order ID</td>
                  <td style="padding:10px 16px;font-size:12px;color:#f1f5f9;font-family:monospace;text-align:right;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:13px;color:#94a3b8;">Amount Paid</td>
                  <td style="padding:10px 16px;font-size:13px;color:#22d3ee;font-weight:800;text-align:right;">₹${amount}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(req: NextRequest) {
  try {
    const payload: NotificationPayload = await req.json();

    if (!payload.to) {
      return NextResponse.json({ error: 'Missing recipient' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set — skipping email notification');
      return NextResponse.json({ skipped: true, reason: 'No API key configured' });
    }

    let subject = '';
    let html = '';

    if (payload.type === 'build') {
      const { appName, status } = payload;
      const subjectMap = {
        queued: `⏳ Building ${appName} — Kinetix`,
        completed: `✅ Your ${appName} app is ready to download!`,
        failed: `❌ Build failed for ${appName} — Kinetix`,
      };
      subject = subjectMap[status];
      html = buildEmailHtml(payload);
    } else if (payload.type === 'payment') {
      subject = `🎉 Payment Successful! Welcome to Kinetix ${payload.planName}`;
      html = buildPaymentEmailHtml(payload);
    }

    const { data, error } = await resend.emails.send({
      from: 'Kinetix <noreply@kinetixapp.com>',
      to: [payload.to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('Email API error:', err);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
