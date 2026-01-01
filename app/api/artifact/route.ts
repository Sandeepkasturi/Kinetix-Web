import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const artifactId = searchParams.get('artifactId');

    if (!artifactId) {
        return NextResponse.json({ error: 'Missing artifactId' }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_PAT;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!githubToken || !owner || !repo) {
        return NextResponse.json({ error: 'Server config missing' }, { status: 500 });
    }

    try {
        // GitHub API to download artifact (returns a zip)
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifactId}/zip`, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Download failed' }, { status: res.status });
        }

        // Stream the response back to the client
        const headers = new Headers(res.headers);
        headers.set('Content-Disposition', `attachment; filename="app-release.zip"`);

        return new NextResponse(res.body, {
            status: 200,
            headers,
        });

    } catch (error: any) {
        console.error('Download proxy error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
