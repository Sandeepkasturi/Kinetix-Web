import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';

/**
 * GET /api/artifact
 * Downloads artifacts from GitHub Actions.
 * Pass `?artifactId=<artifact-id>` to download a specific artifact.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const artifactId = searchParams.get('artifactId');

  if (!artifactId) {
    return NextResponse.json(
      { error: 'Missing required parameter: artifactId' },
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
