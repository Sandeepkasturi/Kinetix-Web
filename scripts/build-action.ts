import { BuildEngine } from '../lib/BuildEngine';
import type { BuildResult } from '../lib/BuildEngine';
import path from 'path';
import fs from 'fs-extra';

async function run() {
    const appName = process.env.APP_NAME;
    const appUrl = process.env.APP_URL;
    const buildId = process.env.BUILD_ID;
    const platform = (process.env.BUILD_PLATFORM || 'android') as 'android' | 'ios';
    const enableDeepLinks = process.env.ENABLE_DEEP_LINKS !== 'false';
    const email = process.env.BUILD_EMAIL || '';

    if (!appName || !appUrl || !buildId) {
        console.error('❌ Missing required environment variables: APP_NAME, APP_URL, BUILD_ID');
        process.exit(1);
    }

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  Kinetix Build Engine`);
    console.log(`${'─'.repeat(60)}`);
    console.log(`  App Name  : ${appName}`);
    console.log(`  URL       : ${appUrl}`);
    console.log(`  Platform  : ${platform.toUpperCase()}`);
    console.log(`  Build ID  : ${buildId}`);
    console.log(`  DeepLinks : ${enableDeepLinks}`);
    console.log(`${'─'.repeat(60)}\n`);

    // Icon is optionally saved as 'icon.png' in the workspace root by the GitHub Action
    const iconPath = path.resolve(process.cwd(), 'icon.png');
    const iconExists = fs.existsSync(iconPath);

    if (iconExists) {
        console.log(`✅ Custom icon found at: ${iconPath}`);
    } else {
        console.log(`ℹ️  No custom icon found — using default`);
    }

    const workingDir =
        platform === 'ios'
            ? path.resolve(process.cwd(), 'ios_project')
            : path.resolve(process.cwd(), 'android_project');

    const builder = new BuildEngine({
        appName,
        appUrl,
        appIconPath: iconExists ? iconPath : '',
        buildId,
        workingDir,
        platform,
        enableDeepLinks,
    });

    try {
        const result = await builder.run();

        console.log(`\n${'─'.repeat(60)}`);
        console.log('  ✅ BUILD SUCCESS');
        console.log(`${'─'.repeat(60)}`);

        if (result.apkPath) {
            console.log(`  APK: ${result.apkPath}`);
        }
        if (result.ipaPath) {
            console.log(`  IPA: ${result.ipaPath}`);
        }

        console.log(`  Package ID: ${result.packageId}`);

        if (result.sha256Fingerprint) {
            console.log(`  SHA-256: ${result.sha256Fingerprint}`);
            // GitHub Actions annotation for easy access in logs
            console.log(`::notice title=SHA256 Fingerprint::${result.sha256Fingerprint}`);
        }

        // Write assetlinks.json if deep links enabled
        if (result.assetLinksJson) {
            const assetLinksPath = path.resolve(process.cwd(), 'assetlinks.json');
            fs.writeFileSync(assetLinksPath, result.assetLinksJson);
            console.log(`  ✅ assetlinks.json written for Android deep linking`);
            console.log(`     Host it at: https://${new URL(appUrl).hostname}/.well-known/assetlinks.json`);
        }

        // Write apple-app-site-association if iOS deep links enabled
        if (result.appleSiteAssociation) {
            const aasaPath = path.resolve(process.cwd(), 'apple-app-site-association');
            fs.writeFileSync(aasaPath, result.appleSiteAssociation);
            console.log(`  ✅ apple-app-site-association written for iOS universal links`);
        }

        console.log(`${'─'.repeat(60)}\n`);
    } catch (error) {
        console.error('\n❌ BUILD FAILED:', error);
        process.exit(1);
    }
}

run().then(() => {
    console.log('Build script complete.');
    process.exit(0);
}).catch((err) => {
    console.error('Fatal script error:', err);
    process.exit(1);
});
