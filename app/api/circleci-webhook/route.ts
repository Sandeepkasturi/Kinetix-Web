import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/circleci-webhook
 * Receives workflow completion notifications from CircleCI webhooks.
 * 
 * CircleCI webhook payload structure:
 * {
 *   type: "workflow-completed" | "job-completed",
 *   id: "workflow-uuid",
 *   sequence: { number: 1, total: 1 },
 *   action: { name: "completed", ... },
 *   workflow: { id, name, status, url, ... },
 *   project: { id, name, slug, ... },
 *   organization: { id, name, slug, ... },
 *   resource_owner: { id, name, ... }
 * }
 */

interface CircleCIWorkflow {
  id: string;
  name: string;
  status: string;
  url: string;
}

interface CircleCIWebhookPayload {
  type: string;
  id: string;
  workflow: CircleCIWorkflow;
  project: {
    name: string;
    slug: string;
  };
  organization: {
    name: string;
    slug: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload: CircleCIWebhookPayload = await req.json();

    console.log('[CircleCI Webhook] Received:', JSON.stringify(payload, null, 2));

    if (payload.type !== 'workflow-completed') {
      return NextResponse.json({ received: true, message: 'Event type not handled' });
    }

    const workflow = payload.workflow;
    const workflowUrl = workflow?.url;
    const workflowId = workflow?.id;
    const workflowStatus = workflow?.status;

    if (!workflow) {
      return NextResponse.json({ error: 'Missing workflow data' }, { status: 400 });
    }

    console.log(`[CircleCI Webhook] Workflow ${workflowId}: ${workflowStatus}`);

    if (workflowStatus === 'success' || workflowStatus === 'failed' || workflowStatus === 'canceled') {
      const buildId = extractBuildIdFromWorkflow(workflow);

      if (buildId) {
        console.log(`[CircleCI Webhook] Build ${buildId} finished with status: ${workflowStatus}`);
      }
    }

    return NextResponse.json({ received: true, workflowId, status: workflowStatus });

  } catch (err) {
    console.error('[CircleCI Webhook] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function extractBuildIdFromWorkflow(workflow: CircleCIWorkflow): string | null {
  if (!workflow?.url) return null;

  try {
    const url = new URL(workflow.url);
    const pathParts = url.pathname.split('/');
    const workflowIndex = pathParts.indexOf('workflows');
    
    if (workflowIndex !== -1 && pathParts[workflowIndex + 1]) {
      return pathParts[workflowIndex + 1];
    }
  } catch {
    return null;
  }

  return null;
}
