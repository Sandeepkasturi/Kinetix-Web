import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash is configured 
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
  });
}

// ─── Rate limiter ──────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;       // max 5 builds
const RATE_LIMIT_WINDOW = 60_000; // per 60 seconds

async function rateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (ratelimit) {
    const { success, reset } = await ratelimit.limit(`build_limit_${ip}`);
    return { allowed: success, retryAfter: success ? undefined : Math.ceil((reset - Date.now()) / 1000) };
  }

  // Fallback to in-memory
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

// ─── Input Sanitization ─────────────────────────────────────────────────────
function sanitizeAppName(name: string): string {
  return name
    .replace(/[<>"'&\\/]/g, '')
    .replace(/[^\w\s\-_.]/g, '')
    .trim()
    .substring(0, 30);
}

function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) &&
           !!parsed.hostname &&
           !parsed.hostname.includes('localhost') &&
           !parsed.hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/); // block raw IPs
  } catch {
    return false;
  }
}

function validateEmail(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email);
}

// ─── Email Notification Helper ──────────────────────────────────────────────
async function sendEmailNotification(payload: {
  to: string;
  appName: string;
  platform: string;
  buildId: string;
  status: 'queued' | 'completed' | 'failed';
  downloadUrl?: string;
  sha256?: string;
  githubUrl?: string;
  errorMessage?: string;
}, baseUrl: string) {
  try {
    await fetch(`${baseUrl}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Email notification failed (non-critical):', err);
  }
}

// ─── POST /api/build ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = req.headers.get('x-real-ip')
    || req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    || 'unknown';

  const rateLimitResult = await rateLimit(ip);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: `Too many requests. Try again in ${rateLimitResult.retryAfter}s.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.retryAfter),
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
        }
      }
    );
  }

  try {
    // 2. Parse & validate form data
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid form data' }, { status: 400 });
    }

    const rawAppName = (formData.get('appName') as string) || '';
    const rawAppUrl = (formData.get('appUrl') as string) || '';
    const rawEmail = (formData.get('email') as string) || '';
    const platform = ((formData.get('platform') as string) || 'android').toLowerCase();
    const enableDeepLinks = formData.get('enableDeepLinks') === 'true';
    const enableNotifications = formData.get('enableNotifications') === 'true';
    const iconFile = formData.get('icon') as File | null;

    // Validate required fields
    const appName = sanitizeAppName(rawAppName);
    if (!appName) {
      return NextResponse.json({ success: false, error: 'App name is required' }, { status: 400 });
    }

    if (!rawAppUrl || !validateUrl(rawAppUrl)) {
      return NextResponse.json({
        success: false,
        error: 'A valid, publicly accessible HTTPS URL is required.'
      }, { status: 400 });
    }
    const appUrl = rawAppUrl.trim();

    if (rawEmail && !validateEmail(rawEmail)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    if (!['android', 'ios'].includes(platform)) {
      return NextResponse.json({ success: false, error: 'Invalid platform' }, { status: 400 });
    }

    // Validate icon file if provided
    if (iconFile && iconFile.size > 0) {
      if (iconFile.size > 5 * 1024 * 1024) { // 5MB max
        return NextResponse.json({ success: false, error: 'Icon file must be under 5MB' }, { status: 400 });
      }
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(iconFile.type)) {
        return NextResponse.json({ success: false, error: 'Icon must be PNG, JPEG, or WebP' }, { status: 400 });
      }
    }

    const buildId = uuidv4();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`;

    // ─── 3a. CIRCLECI MODE ─────────────────────────────────────────────────────
    if (process.env.CIRCLECI_TOKEN) {
      const circleToken = process.env.CIRCLECI_TOKEN;
      const vcs   = process.env.CIRCLECI_VCS  || 'github';
      const org   = process.env.CIRCLECI_ORG;
      const repo  = process.env.CIRCLECI_REPO;

      if (!org || !repo) {
        return NextResponse.json({
          success: false,
          error: 'Server configuration error: CIRCLECI_ORG or CIRCLECI_REPO missing.'
        }, { status: 500 });
      }

      // Upload icon to a temp public URL if provided (CircleCI can't read your repo directly)
      // We store it in the repo via GitHub API as before, but it's optional — CircleCI
      // pulls the icon via `icon-url` pipeline parameter using a public download URL.
      // If no icon, leave icon-url blank; BuildEngine uses the default.
      let iconPublicUrl = '';
      if (iconFile && iconFile.size > 0 && process.env.GITHUB_PAT && process.env.GITHUB_OWNER && process.env.GITHUB_REPO) {
        try {
          const iconBuffer = Buffer.from(await iconFile.arrayBuffer());
          const iconBase64 = iconBuffer.toString('base64');
          const iconPath   = `temp_icons/${buildId}.png`;
          const uploadRes  = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${iconPath}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${process.env.GITHUB_PAT}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: `[kinetix] icon for build ${buildId}`,
                content: iconBase64,
              }),
            }
          );
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            iconPublicUrl = uploadData?.content?.download_url || '';
          }
        } catch (e) {
          console.warn('Icon upload for CircleCI (non-fatal):', e);
        }
      }

      // Trigger CircleCI pipeline
      const circleRes = await fetch(
        `https://circleci.com/api/v2/project/${vcs}/${org}/${repo}/pipeline`,
        {
          method: 'POST',
          headers: {
            'Circle-Token': circleToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parameters: {
              'run-build':          true,
              'app-name':           appName,
              'app-url':            appUrl,
              'build-id':           buildId,
              'platform':           platform,
              'enable-deep-links':  String(enableDeepLinks),
              'enable-notifications': String(enableNotifications),
              'email':              rawEmail,
              'base-url':           baseUrl,
              'icon-url':           iconPublicUrl,
            },
          }),
        }
      );

      if (!circleRes.ok) {
        const errText = await circleRes.text();
        console.error('CircleCI pipeline trigger failed:', errText);
        return NextResponse.json({
          success: false,
          error: 'Failed to queue build on CircleCI. Please try again.'
        }, { status: 500 });
      }

      const circleData = await circleRes.json();
      const pipelineId: string = circleData?.id || '';

      // Send "queued" email
      if (rawEmail) {
        await sendEmailNotification({
          to: rawEmail,
          appName,
          platform: platform as any,
          buildId,
          status: 'queued',
          githubUrl: `https://app.circleci.com/pipelines/${vcs}/${org}/${repo}`,
        }, baseUrl);
      }

      return NextResponse.json({
        success: true,
        mode: 'cloud-circleci',
        message: 'Build queued on CircleCI',
        pipelineId,
        dashboardUrl: `https://app.circleci.com/pipelines/${vcs}/${org}/${repo}`,
        buildId,
      });
    }

    // ─── 3b. GITHUB ACTIONS FALLBACK MODE ─────────────────────────────────────
    if (process.env.VERCEL || process.env.USE_GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAT) {
      const githubToken = process.env.GITHUB_PAT;
      const owner = process.env.GITHUB_OWNER;
      const repo = process.env.GITHUB_REPO;

      if (!githubToken || !owner || !repo) {
        return NextResponse.json({
          success: false,
          error: 'Server configuration error. Please contact support.'
        }, { status: 500 });
      }

      // Upload icon to GitHub (best-effort, non-fatal)
      let iconRepoPath = '';
      if (iconFile && iconFile.size > 0) {
        try {
          const iconBuffer = Buffer.from(await iconFile.arrayBuffer());
          const iconBase64 = iconBuffer.toString('base64');
          iconRepoPath = `temp_icons/${buildId}.png`;

          const uploadRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${iconRepoPath}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${githubToken}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: `[kinetix] icon upload for build ${buildId}`,
                content: iconBase64,
              }),
            }
          );

          if (!uploadRes.ok) {
            const txt = await uploadRes.text();
            console.warn(`Icon upload to GitHub failed (non-fatal): ${txt}`);
            iconRepoPath = '';
          }
        } catch (e) {
          console.warn('Icon upload error (non-fatal):', e);
          iconRepoPath = '';
        }
      }

      // Dispatch GitHub Actions workflow
      const dispatchRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'build-apk',
            client_payload: {
              appName,
              appUrl,
              buildId,
              platform,
              iconRepoPath,
              enableDeepLinks: String(enableDeepLinks),
              enableNotifications: String(enableNotifications),
              email: rawEmail,
              baseUrl,
            },
          }),
        }
      );

      if (!dispatchRes.ok) {
        const errText = await dispatchRes.text();
        console.error('GitHub dispatch failed:', errText);
        return NextResponse.json({
          success: false,
          error: 'Failed to queue build. Please try again.'
        }, { status: 500 });
      }

      // Send "queued" email if email was provided
      if (rawEmail) {
        await sendEmailNotification({
          to: rawEmail,
          appName,
          platform: platform as any,
          buildId,
          status: 'queued',
          githubUrl: `https://github.com/${owner}/${repo}/actions`,
        }, baseUrl);
      }

      return NextResponse.json({
        success: true,
        mode: 'cloud-github',
        message: 'Build queued on GitHub Actions',
        githubUrl: `https://github.com/${owner}/${repo}/actions`,
        buildId,
      });
    }

    // 4. LOCAL / DOCKER mode
    const { BuildEngine } = await import('@/lib/BuildEngine');

    const workingDir = path.join(os.tmpdir(), 'native-bridge', buildId);
    await fs.ensureDir(workingDir);

    let iconPath = '';
    if (iconFile && iconFile.size > 0) {
      iconPath = path.join(workingDir, 'icon.png');
      const iconBuffer = Buffer.from(await iconFile.arrayBuffer());
      await fs.writeFile(iconPath, iconBuffer);
    }

    const engine = new BuildEngine({
      appName,
      appUrl,
      appIconPath: iconPath,
      buildId,
      workingDir,
      platform: platform as 'android' | 'ios',
      enableDeepLinks,
    });

    const result = await engine.run();

    // Send "completed" email
    if (rawEmail) {
      await sendEmailNotification({
        to: rawEmail,
        appName,
        platform: platform as any,
        buildId,
        status: 'completed',
        downloadUrl: `${baseUrl}/api/download?id=${buildId}`,
        sha256: result.sha256Fingerprint,
      }, baseUrl);
    }

    return NextResponse.json({
      success: true,
      mode: 'local',
      downloadUrl: `/api/download?id=${buildId}`,
      packageId: result.packageId,
      sha256Fingerprint: result.sha256Fingerprint,
      assetLinksJson: result.assetLinksJson,
    });

  } catch (error: any) {
    console.error('Build API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
