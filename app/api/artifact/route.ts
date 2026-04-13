import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';

/**
 * GET /api/artifact
 *
 * Supports two modes:
 *
 * 1. CircleCI mode — pass `?url=<artifact-url>`
 *    The server proxies the CircleCI artifact URL using CIRCLECI_TOKEN.
 *    CircleCI artifact URLs look like:
 *    https://output.circle-artifacts.com/output/job/<job_num>/artifacts/0/app.apk
 *
 * 2. GitHub Actions mode — pass `?artifactId=<artifact-id>` (legacy)
 *    Downloads the zip artifact from GitHub, extracts the APK/IPA and serves it.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // ── CircleCI mode ─────────────────────────────────────────────────────────
  const artifactUrl = searchParams.get('url');
  if (artifactUrl) {
    const circleToken = process.env.CIRCLECI_TOKEN;

    if (!circleToken) {
      return NextResponse.json(
        { error: 'CIRCLECI_TOKEN not configured on this server.' },
        { status: 500 }
      );
    }

    // Validate the URL is a CircleCI artifact URL (security check)
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(decodeURIComponent(artifactUrl));
    } catch {
      return NextResponse.json({ error: 'Invalid artifact URL.' }, { status: 400 });
    }

    const allowedHosts = [
      'output.circle-artifacts.com',
      'circleci.com',
    ];
    if (!allowedHosts.some((host) => parsedUrl.hostname.endsWith(host))) {
      return NextResponse.json(
        { error: 'Artifact URL host is not allowed.' },
        { status: 403 }
      );
    }

    try {
      const res = await fetch(parsedUrl.toString(), {
        headers: {
          'Circle-Token': circleToken,
        },
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: `CircleCI artifact download failed (${res.status})` },
          { status: res.status }
        );
      }

      // Determine filename and content type from the URL path
      const urlPath = parsedUrl.pathname;
      const filename = urlPath.split('/').pop() || 'app.apk';
      const ext = filename.split('.').pop()?.toLowerCase();

      const contentTypeMap: Record<string, string> = {
        apk: 'application/vnd.android.package-archive',
        ipa: 'application/octet-stream',
        zip: 'application/zip',
      };
      const contentType = contentTypeMap[ext || ''] || 'application/octet-stream';

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);

      const contentLength = res.headers.get('Content-Length');
      if (contentLength) headers.set('Content-Length', contentLength);

      return new NextResponse(res.body as any, { status: 200, headers });

    } catch (error: any) {
      console.error('[Artifact] CircleCI proxy error:', error);
      console.error('[Artifact] Download error:', error);
      return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
  }

  // ── GitHub Actions mode (legacy) ──────────────────────────────────────────
  const artifactId = searchParams.get('artifactId');

  if (!artifactId) {
    return NextResponse.json(
      { error: 'Missing required parameter: url (CircleCI) or artifactId (GitHub).' },
      { status: 400 }
    );
  }

  const githubToken = process.env.GITHUB_PAT;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!githubToken || !owner || !repo) {
    return NextResponse.json({ error: 'GitHub server config missing' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifactId}/zip`,
      {
        headers: { Authorization: `Bearer ${githubToken}` },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'GitHub artifact download failed' },
        { status: res.status }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    const appEntry = zipEntries.find((entry) =>
      entry.entryName.endsWith('.apk') ||
      entry.entryName.endsWith('.ipa') ||
      entry.entryName.endsWith('.zip')
    );

    if (!appEntry) {
      return NextResponse.json(
        { error: 'No build artifact found in package' },
        { status: 404 }
      );
    }

    const fileBuffer = appEntry.getData();
    const headers = new Headers();

    if (appEntry.entryName.endsWith('.apk')) {
      headers.set('Content-Type', 'application/vnd.android.package-archive');
    } else if (appEntry.entryName.endsWith('.ipa')) {
      headers.set('Content-Type', 'application/octet-stream');
    } else {
      headers.set('Content-Type', 'application/zip');
    }

    headers.set('Content-Disposition', `attachment; filename="${appEntry.name}"`);
    headers.set('Content-Length', fileBuffer.length.toString());

    return new NextResponse(fileBuffer as any, { status: 200, headers });

  } catch (error: any) {
    console.error('[Artifact] GitHub proxy error:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
