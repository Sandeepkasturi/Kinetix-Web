
import { NextRequest, NextResponse } from 'next/server';
import { BuildEngine } from '@/lib/BuildEngine';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';
import { pipeline } from 'stream';
import { promisify } from 'util';
import os from 'os';

const pump = promisify(pipeline);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const appName = formData.get('appName') as string;
        const appUrl = formData.get('appUrl') as string;
        const iconFile = formData.get('icon') as File;

        if (!appName || !appUrl || !iconFile) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const buildId = uuidv4();

        // ------------------------------------------------------------------
        // VERCEL ADAPTER: Offload to GitHub Actions
        // ------------------------------------------------------------------
        if (process.env.VERCEL) {
            const githubToken = process.env.GITHUB_PAT;
            const owner = process.env.GITHUB_OWNER;
            const repo = process.env.GITHUB_REPO;

            if (!githubToken || !owner || !repo) {
                return NextResponse.json({
                    error: 'GitHub Deployment Config Missing. Set GITHUB_PAT, GITHUB_OWNER, and GITHUB_REPO env vars in Vercel.'
                }, { status: 500 });
            }

            // Convert icon to Base64
            const arrayBuffer = await iconFile.arrayBuffer();
            const base64Icon = Buffer.from(arrayBuffer).toString('base64');

            // Dispatch Event
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: 'build-apk',
                    client_payload: {
                        appName,
                        appUrl,
                        buildId,
                        iconBase64: base64Icon
                    }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`GitHub Dispatch Failed: ${errText}`);
            }

            return NextResponse.json({
                success: true,
                mode: 'cloud',
                message: 'Build Queued on GitHub Actions',
                githubUrl: `https://github.com/${owner}/${repo}/actions`,
                buildId
            });
        }

        // ------------------------------------------------------------------
        // LOCAL / DOCKER MODE
        // ------------------------------------------------------------------
        // Use system temp dir or a specific local dir
        const workingDir = path.join(os.tmpdir(), 'native-bridge', buildId);

        // Ensure dir
        await fs.ensureDir(workingDir);

        // Save icon
        const iconPath = path.join(workingDir, 'icon.png');
        const iconBuffer = Buffer.from(await iconFile.arrayBuffer());
        await fs.writeFile(iconPath, iconBuffer);

        // Initialize Engine
        const engine = new BuildEngine({
            appName,
            appUrl,
            appIconPath: iconPath,
            buildId,
            workingDir
        });

        // Run Build
        // Note: For MVP we await this. For prod we would offload to a queue.
        const result = await engine.run();

        // We return a download link that points to a route serving this file
        // For simplicity, we can pass the path via query param (insecure but works for prototype)
        // OR we store the mapping buildId -> path in a DB/Map.
        // For this prototype, I'll encode the path in the query param or just use the Build ID if I can deterministically find it.
        // Let's use Build ID. The download route will look in the temp dir/buildId location.

        return NextResponse.json({
            success: true,
            downloadUrl: `/api/download?id=${buildId}`,
            packageId: result.packageId,
            sha256Fingerprint: result.sha256Fingerprint
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Build failed' }, { status: 500 });
    }
}
