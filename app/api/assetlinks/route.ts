import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/assetlinks?packageId=com.kinetix.app...&sha256=AA:BB:CC...
 *
 * Returns the assetlinks.json content for Android App Links deep linking.
 * The generated app must tell users to host this file at:
 *   https://yourdomain.com/.well-known/assetlinks.json
 *
 * This endpoint allows you to verify the generated content before hosting it.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const packageId = searchParams.get('packageId');
  const sha256 = searchParams.get('sha256');

  if (!packageId || !sha256) {
    return NextResponse.json(
      { error: 'Missing packageId or sha256 query parameters' },
      { status: 400 }
    );
  }

  // Validate packageId format (basic Android package name check)
  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(packageId)) {
    return NextResponse.json({ error: 'Invalid packageId format' }, { status: 400 });
  }

  // Validate SHA-256 fingerprint format (XX:XX:... pattern, 32 hex pairs)
  if (!/^([A-Fa-f0-9]{2}:){31}[A-Fa-f0-9]{2}$/.test(sha256)) {
    return NextResponse.json({ error: 'Invalid SHA-256 fingerprint format' }, { status: 400 });
  }

  const assetLinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: packageId,
        sha256_cert_fingerprints: [sha256.toUpperCase()],
      },
    },
  ];

  return new NextResponse(JSON.stringify(assetLinks, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
