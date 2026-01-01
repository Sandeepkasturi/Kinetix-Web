import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const buildId = searchParams.get('buildId');

    if (!buildId) {
        return NextResponse.json({ error: 'Missing buildId' }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_PAT;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!githubToken || !owner || !repo) {
        return NextResponse.json({ error: 'Server config missing' }, { status: 500 });
    }

    try {
        // List artifacts
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/artifacts`, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.statusText}`);
        }

        const data = await res.json();
        const artifacts = data.artifacts || [];

        // Look for our specific artifact
        // Name format from workflow: app-release-${buildId}
        const targetName = `app-release-${buildId}`;
        const artifact = artifacts.find((a: any) => a.name === targetName);

        if (artifact) {
            return NextResponse.json({
                status: 'completed',
                // We can't download directly from GitHub API without token in header (which browser doesn't have).
                // So we usually need a proxy route.
                // For now, let's return the artifact ID so the frontend can request a proxy download.
                artifactId: artifact.id,
                downloadUrl: `https://github.com/${owner}/${repo}/actions/runs/${artifact.workflow_run.id}` // Link to the run UI as fallback
            });
        }

        // If not found, it's either pending or failed.
        return NextResponse.json({ status: 'pending' });

    } catch (error: any) {
        console.error('Status check failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
