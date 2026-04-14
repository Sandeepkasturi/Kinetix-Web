import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/github-debug
 * Test if GitHub PAT is configured and has correct permissions
 */
export async function GET(req: NextRequest) {
  const githubToken = process.env.GITHUB_PAT;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!githubToken) {
    return NextResponse.json({
      success: false,
      error: 'GITHUB_PAT is not configured',
      required: ['GITHUB_PAT', 'GITHUB_OWNER', 'GITHUB_REPO']
    }, { status: 500 });
  }

  if (!owner || !repo) {
    return NextResponse.json({
      success: false,
      error: 'GITHUB_OWNER or GITHUB_REPO is not configured',
      required: ['GITHUB_PAT', 'GITHUB_OWNER', 'GITHUB_REPO']
    }, { status: 500 });
  }

  try {
    // Test API connection
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      return NextResponse.json({
        success: false,
        error: 'GitHub API authentication failed',
        status: userRes.status,
        statusText: userRes.statusText,
        message: 'Check if GITHUB_PAT is valid and has not expired'
      }, { status: 401 });
    }

    const user = await userRes.json();

    // Test repository access
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!repoRes.ok) {
      return NextResponse.json({
        success: false,
        error: 'Cannot access repository',
        status: repoRes.status,
        message: 'Check if repository exists and PAT has repo access'
      }, { status: 403 });
    }

    // Test workflow dispatch permission
    const workflowRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/build-twa.yml`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!workflowRes.ok) {
      return NextResponse.json({
        success: false,
        error: 'Cannot access GitHub Actions workflows',
        status: workflowRes.status,
        message: 'Ensure PAT has "repo" scope for workflow access'
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: 'GitHub PAT is configured correctly',
      user: {
        login: user.login,
        name: user.name,
      },
      repository: {
        owner,
        repo,
      },
      scopes: {
        note: 'Ensure your PAT has "repo" scope for full workflow access',
        required_scopes: ['repo (full control)']
      }
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: err?.message || 'Unknown error'
    }, { status: 500 });
  }
}
