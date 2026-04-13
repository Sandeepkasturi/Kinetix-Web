import { NextResponse } from 'next/server';

/**
 * GET /api/circleci-debug
 * Test CircleCI configuration and token validity
 */
export async function GET() {
  const results: Record<string, any> = {};

  results.circleToken = {
    set: !!process.env.CIRCLECI_TOKEN,
    prefix: process.env.CIRCLECI_TOKEN?.substring(0, 10) + '...',
    type: process.env.CIRCLECI_TOKEN?.startsWith('CCIPRJ_') ? 'project-specific' : 
          process.env.CIRCLECI_TOKEN?.startsWith('CCIX') ? 'context' : 'unknown'
  };

  results.circleOrg = process.env.CIRCLECI_ORG || '(not set)';
  results.circleRepo = process.env.CIRCLECI_REPO || '(not set)';
  results.circleVcs = process.env.CIRCLECI_VCS || '(not set, defaults to github)';

  const apiUrl = `https://circleci.com/api/v2/project/${results.circleVcs}/${results.circleOrg}/${results.circleRepo}/pipeline`;
  results.apiUrl = apiUrl;

  if (process.env.CIRCLECI_TOKEN && results.circleOrg !== '(not set)' && results.circleRepo !== '(not set)') {
    try {
      const testRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Circle-Token': process.env.CIRCLECI_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parameters: { 'test': true } }),
      });

      results.apiTest = {
        status: testRes.status,
        statusText: testRes.statusText,
        error: await testRes.text()
      };
    } catch (err: any) {
      results.apiTest = { error: err.message };
    }
  } else {
    results.apiTest = { skipped: 'Missing configuration' };
  }

  return NextResponse.json(results);
}
