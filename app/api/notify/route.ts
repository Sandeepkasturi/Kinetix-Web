import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/notify
 * Called by GitHub Actions once a build completes or fails.
 * Triggers the final email notification to the user.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      buildId,
      status,
      artifactId,
      sha256,
      appName,
      email,
      platform,
      error,
      message,
    } = body;

    if (!buildId || !status) {
      return NextResponse.json({ error: 'Missing buildId or status' }, { status: 400 });
    }

    console.log(`[Notify] Build ${buildId} → ${status}`, { artifactId, sha256, email, message });

    if (email) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`;

      let downloadUrl: string | undefined;
      if (status === 'success' && artifactId) {
        downloadUrl = `${baseUrl}/api/artifact?artifactId=${artifactId}`;
      }

      const emailPayload = {
        type: 'build' as const,
        to: email,
        appName: appName || 'Your App',
        platform: platform || 'android',
        buildId,
        status: status === 'success' ? 'completed' : 'failed',
        downloadUrl,
        sha256,
        errorMessage: error || message,
      };

      try {
        const emailRes = await fetch(`${baseUrl}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailPayload),
        });

        if (!emailRes.ok) {
          console.error('[Notify] Failed to trigger email via /api/email');
        }
      } catch (err) {
        console.error('[Notify] Error calling email API:', err);
      }
    }

  } catch (err: any) {
    console.error('[Notify] Error:', err);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
