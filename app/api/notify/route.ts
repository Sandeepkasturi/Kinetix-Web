import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/notify
 * Called by the CI system (GitHub Actions OR CircleCI) once a build completes or fails.
 * Triggers the final email notification to the user.
 *
 * CircleCI sends:  { buildId, status, artifactUrl, sha256, appName, email, platform }
 * GitHub Actions:  { buildId, status, artifactId,  sha256, appName, email, platform, error }
 */
export async function POST(req: NextRequest) {
  try {
    const notifySecret = req.headers.get('x-notify-secret');
    if (notifySecret !== process.env.NOTIFY_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      buildId,
      status,
      artifactId,    // GitHub Actions artifact ID (legacy)
      artifactUrl,   // CircleCI direct artifact URL
      sha256,
      appName,
      email,
      platform,
      error,
    } = body;

    if (!buildId || !status) {
      return NextResponse.json({ error: 'Missing buildId or status' }, { status: 400 });
    }

    console.log(`[Notify] Build ${buildId} → ${status}`, { artifactId, artifactUrl, sha256, email });

    if (email) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`;

      // Build the download URL depending on which CI system reported back
      let downloadUrl: string | undefined;
      if (status === 'success') {
        if (artifactUrl) {
          // CircleCI: proxy via /api/artifact?url=<encoded>
          downloadUrl = `${baseUrl}/api/artifact?url=${encodeURIComponent(artifactUrl)}`;
        } else if (artifactId) {
          // GitHub Actions: proxy via /api/artifact?artifactId=<id>
          downloadUrl = `${baseUrl}/api/artifact?artifactId=${artifactId}`;
        }
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
        errorMessage: error,
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
