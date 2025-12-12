import { Config } from '@bubblewrap/core/dist/lib/Config';
import { JdkHelper } from '@bubblewrap/core/dist/lib/jdk/JdkHelper';
import { AndroidSdkTools } from '@bubblewrap/core/dist/lib/androidSdk/AndroidSdkTools';
import { GradleWrapper } from '@bubblewrap/core/dist/lib/GradleWrapper';
import { TwaManifest } from '@bubblewrap/core/dist/lib/TwaManifest';
import { TwaGenerator } from '@bubblewrap/core/dist/lib/TwaGenerator';
import { ConsoleLog } from '@bubblewrap/core/dist/lib/Log';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import process from 'process';

export interface BuildConfig {
    appName: string;
    appUrl: string;
    appIconPath: string; // Path to the uploaded icon
    buildId: string;
    workingDir: string;
}

export class BuildEngine {
    private config: BuildConfig;
    private log: ConsoleLog;
    private jdkPath = 'C:\\Program Files\\Java\\jdk-22';
    private androidSdkPath = 'C:\\Users\\Sandeep Kasturi\\AppData\\Local\\Android\\Sdk';

    constructor(config: BuildConfig) {
        this.config = config;
        this.log = new ConsoleLog('BuildEngine');
    }

    async run() {
        try {
            await this.setupEnvironment();
            await this.generateProject();
            await this.buildApk();
            await this.signApk();

            const fingerPrint = this.getSha256Fingerprint();

            return {
                success: true,
                apkPath: this.getSignedApkPath(),
                packageId: `com.nativebridge.app${this.config.buildId.replace(/-/g, '')}`,
                sha256Fingerprint: fingerPrint
            };
        } catch (error) {
            console.error('Build failed:', error);
            throw error;
        }
    }

    private getSha256Fingerprint(): string {
        try {
            const keystorePath = path.join(this.config.workingDir, 'android.keystore');
            const keytool = path.join(this.jdkPath, 'bin', 'keytool.exe');
            // Command to list keystore details including certificate fingerprints
            const cmd = `"${keytool}" -list -v -keystore "${keystorePath}" -alias android -storepass password`;
            const output = execSync(cmd).toString();

            // Regex to find SHA256: AA:BB:CC...
            const match = output.match(/SHA256:\s*([A-Fa-f0-9:]+)/);
            return match ? match[1] : '';
        } catch (e) {
            console.error('Failed to extract SHA-256 fingerprint', e);
            return '';
        }
    }

    private async setupEnvironment() {
        console.log(`[${this.config.buildId}] Setting up environment...`);
        // Ensure working directory exists
        await fs.ensureDir(this.config.workingDir);
    }

    private async generateProject() {
        console.log(`[${this.config.buildId}] Generating Project...`);

        // Hostname extraction
        const url = new URL(this.config.appUrl);
        const host = url.hostname;

        // Manifest Configuration
        const manifestConfig = {
            packageId: `com.nativebridge.app${this.config.buildId.replace(/-/g, '')}`, // Sanitize package name
            host: host,
            name: this.config.appName,
            launcherName: this.config.appName.substring(0, 12), // Short name
            display: 'standalone',
            themeColor: '#000000',
            navigationColor: '#000000',
            backgroundColor: '#ffffff',
            startUrl: '/',
            iconUrl: this.config.appIconPath, // We will hack this later or serve it
            maskableIconUrl: undefined,
            appVersion: '1.0.0',
            appVersionCode: 1,
            shortcuts: [],
            splashScreenFadeOutDuration: 300,
            enableNotifications: true,
            signingKey: {
                path: path.join(this.config.workingDir, 'android.keystore'),
                alias: 'android'
            },
            generatorApp: 'NativeBridge'
        };

        const manifest = new TwaManifest(manifestConfig);
        const generator = new TwaGenerator();

        // We need to trick Bubblewrap's icon fetching if we are using a local path that looks like a URL or just bypass it.
        // TwaGenerator expects to download the icon.
        // However, we are going to use the `downloadIcon` method override or just mock the input if possible.
        // Easier approach: Start a temp local server to serve the icon, OR manually place the icon after generation?
        // Actually, TwaGenerator.createTwaProject takes the manifest.
        // Let's rely on a small hack: We will manually copy the icon to the expected location in the generated project logic 
        // OR we start a tiny ephemeral server.
        // BETTER: We can mock the ImageHelper or just serve it locally.

        // Strategy: Use a tiny local server for the build duration.
        // For now, let's implement the serverless fallback:
        // We will pass a dummy URL, let it fail (if it doesn't crash everything), then overwrite.
        // No, Bubblewrap throws.
        // Let's overwrite `ImageHelper.fetchIcon`? No, complex.
        // Let's use the local file URI if supported? Bubblewrap might not support `file://` on Windows correctly in all versions.

        // Valid Strategy: Spin up a static file server on a random port.
        // Actually, let's just use the `builder.js` strategy: local server.

        // For this implementation, I will assume we can pass a localhost URL. 
        // I'll skip the server implementation inside this class for brevity and assume the caller handles serving OR 
        // we implement a simple workaround: 
        // We will skip TwaGenerator's icon step if possible? No.

        // Let's try `file:///` URI. Bubblewrap uses `got` or `fetch`. `got` creates http requests.
        // OK, I'll implement a fast http server here.

        const port = 3000 + Math.floor(Math.random() * 10000);
        const http = require('http');
        const iconServer = http.createServer((req: any, res: any) => {
            const stream = fs.createReadStream(this.config.appIconPath);
            res.writeHead(200, { 'Content-Type': 'image/png' });
            stream.pipe(res);
        }).listen(port);

        manifest.iconUrl = `http://localhost:${port}/icon.png`;

        try {
            await generator.createTwaProject(this.config.workingDir, manifest, this.log);
        } finally {
            iconServer.close();
        }

        // Fix build.gradle syntax if needed (Though we patched the manifest input so it might be fine)
        // Check for missing properties just in case.
        // The previous issue was `enableNotifications: ,` which we fixed by passing `enableNotifications: true` in manifestConfig.
    }

    private async buildApk() {
        console.log(`[${this.config.buildId}] Building APK...`);

        // Create local.properties
        const localPropsPath = path.join(this.config.workingDir, 'local.properties');
        await fs.writeFile(localPropsPath, `sdk.dir=${this.androidSdkPath.replace(/\\/g, '\\\\')}`);

        // Setup Gradle Wrapper
        const bubblewrapConfig = new Config(this.jdkPath, this.androidSdkPath);
        const jdkHelper = new JdkHelper(process, bubblewrapConfig);
        // Direct constructor to bypass validation
        // @ts-ignore - Ignoring protected constructor access if any, or strict type checks for now
        const androidSdkTools = new AndroidSdkTools(process, bubblewrapConfig, jdkHelper);
        const gradleWrapper = new GradleWrapper(process, androidSdkTools, this.config.workingDir);

        // Generate Keystore if needed
        const keystorePath = path.join(this.config.workingDir, 'android.keystore');
        if (!fs.existsSync(keystorePath)) {
            const keytool = path.join(this.jdkPath, 'bin', 'keytool.exe');
            const cmd = `"${keytool}" -genkeypair -v -keystore "${keystorePath}" -alias android -keyalg RSA -keysize 2048 -validity 10000 -storepass password -keypass password -dname "CN=NativeBridge, OU=Engineering, O=NativeBridge, C=US"`;
            execSync(cmd);
        }

        await gradleWrapper.assembleRelease();
    }

    private async signApk() {
        console.log(`[${this.config.buildId}] Signing APK...`);
        const buildToolsRoot = path.join(this.androidSdkPath, 'build-tools');
        const versions = fs.readdirSync(buildToolsRoot).filter(f => fs.statSync(path.join(buildToolsRoot, f)).isDirectory());
        const latestVersion = versions.sort().pop();

        if (!latestVersion) throw new Error('No build-tools found');

        const apksignerJar = path.join(buildToolsRoot, latestVersion, 'lib', 'apksigner.jar');
        const javaExe = path.join(this.jdkPath, 'bin', 'java.exe');

        const apkDir = path.join(this.config.workingDir, 'app', 'build', 'outputs', 'apk', 'release');
        const inputApk = path.join(apkDir, 'app-release-unsigned.apk');
        const outputApk = path.join(apkDir, 'app-release-signed.apk');
        const keystorePath = path.join(this.config.workingDir, 'android.keystore');

        const cmd = `"${javaExe}" -Xmx1024M -Xss1m -jar "${apksignerJar}" sign --ks "${keystorePath}" --ks-key-alias android --ks-pass pass:password --key-pass pass:password --out "${outputApk}" "${inputApk}"`;
        execSync(cmd);
    }

    private getSignedApkPath() {
        return path.join(this.config.workingDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-signed.apk');
    }
}
