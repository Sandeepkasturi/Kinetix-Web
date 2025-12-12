
import { BuildEngine } from '../lib/BuildEngine';
import path from 'path';
import fs from 'fs-extra';

async function run() {
    const appName = process.env.APP_NAME;
    const appUrl = process.env.APP_URL;
    const buildId = process.env.BUILD_ID;

    if (!appName || !appUrl || !buildId) {
        console.error('Missing required environment variables: APP_NAME, APP_URL, BUILD_ID');
        process.exit(1);
    }

    // In GitHub Actions, the icon is saved as 'icon.png' in the root workspace
    const iconPath = path.resolve(process.cwd(), 'icon.png');

    // We want the output to be in a predictable place.
    // BuildEngine uses `os.tmpdir()` by default, let's override logic or use a specific workingDir.
    // BuildEngine interface takes 'workingDir'. Let's set it to 'android_project' in CWD.
    const workingDir = path.resolve(process.cwd(), 'android_project');

    console.log('Starting GitHub Action Build...');
    console.log(`App: ${appName}, URL: ${appUrl}`);

    const builder = new BuildEngine({
        appName,
        appUrl,
        appIconPath: iconPath,
        buildId,
        workingDir
    });

    try {
        const result = await builder.run();
        console.log('Build Success!');
        console.log(`APK created at: ${result.apkPath}`);

        // Output Asset Links fingerprint for the logs
        console.log(`::notice title=Asset Links Fingerprint::${result.sha256Fingerprint}`);

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

run();
