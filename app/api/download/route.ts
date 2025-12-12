import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Sanitize ID basic check
    if (!/^[a-zA-Z0-9-]+$/.test(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const workingDir = path.join(os.tmpdir(), 'native-bridge', id);
    // Based on BuildEngine.ts:
    const apkPath = path.join(workingDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-signed.apk');

    if (!fs.existsSync(apkPath)) {
        return NextResponse.json({ error: 'APK not found or build expired' }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(apkPath);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Disposition': `attachment; filename="app-release.apk"`,
        },
    });
}
