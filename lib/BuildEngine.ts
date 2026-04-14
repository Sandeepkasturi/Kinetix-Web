import type { Config as ConfigType } from '@bubblewrap/core/dist/lib/Config';
import type { JdkHelper as JdkHelperType } from '@bubblewrap/core/dist/lib/jdk/JdkHelper';
import type { AndroidSdkTools as AndroidSdkToolsType } from '@bubblewrap/core/dist/lib/androidSdk/AndroidSdkTools';
import type { GradleWrapper as GradleWrapperType } from '@bubblewrap/core/dist/lib/GradleWrapper';
import type { TwaManifest as TwaManifestType } from '@bubblewrap/core/dist/lib/TwaManifest';
import type { TwaGenerator as TwaGeneratorType } from '@bubblewrap/core/dist/lib/TwaGenerator';
import type { ConsoleLog as ConsoleLogType } from '@bubblewrap/core/dist/lib/Log';
import fs from 'fs-extra';
import path from 'path';
import { execSync, execFileSync } from 'child_process';
import process from 'process';
import os from 'os';

export interface BuildConfig {
  appName: string;
  appUrl: string;
  appIconPath: string;          // Path to uploaded icon (empty string = use default)
  buildId: string;
  workingDir: string;
  platform?: 'android' | 'ios';
  enableDeepLinks?: boolean;
}

export interface BuildResult {
  success: boolean;
  apkPath?: string;
  ipaPath?: string;
  packageId: string;
  sha256Fingerprint: string;
  assetLinksJson?: string;       // Android app-links verification file content
  appleSiteAssociation?: string; // iOS universal-links verification file content
}

export class BuildEngine {
  private config: BuildConfig;
  private log: ConsoleLogType;
  private jdkPath: string;
  private androidSdkPath: string;
  private platform: 'android' | 'ios';

  constructor(config: BuildConfig) {
    this.config = config;
    const { ConsoleLog } = require('@bubblewrap/core/dist/lib/Log');
    this.log = new ConsoleLog('BuildEngine');
    this.platform = config.platform ?? 'android';

    const findJavaWin = () => {
      const javaDir = 'C:\\Program Files\\Java';
      if (fs.existsSync(javaDir)) {
        const parseVersion = (name: string): number => {
          // Handle 'jdk-22', 'jdk-1.8', 'jdk-22.0.1' etc.
          const m = name.match(/jdk[-_]?([\d.]+)/);
          if (!m) return 0;
          const parts = m[1].split('.');
          // Convert 1.8 -> 8, 22 -> 22, 22.0.1 -> 22
          const major = parts[0] === '1' ? Number(parts[1] || 0) : Number(parts[0]);
          return major;
        };
        const dirs = fs.readdirSync(javaDir)
          .filter(d => /^jdk/i.test(d) && fs.statSync(path.join(javaDir, d)).isDirectory())
          .sort((a, b) => parseVersion(b) - parseVersion(a)); // highest first
        // Require Java 11+ for Android Gradle Plugin 8.x
        const suitable = dirs.find(d => parseVersion(d) >= 11);
        if (suitable) return path.join(javaDir, suitable);
        if (dirs.length) return path.join(javaDir, dirs[0]);
      }
      return 'C:\\Program Files\\Java\\jdk-22';
    };

    this.jdkPath =
      process.env.JAVA_HOME ||
      (process.platform === 'win32'
        ? findJavaWin()
        : '/usr/lib/jvm/java-21-openjdk-amd64');

    console.log(`[BuildEngine] Resolved JDK: ${this.jdkPath}`);

    this.androidSdkPath =
      process.env.ANDROID_HOME ||
      process.env.ANDROID_SDK_ROOT ||
      (process.platform === 'win32'
        ? path.join(os.homedir(), 'AppData', 'Local', 'Android', 'Sdk')
        : path.join(os.homedir(), 'Android', 'Sdk'));
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private getExecutable(binName: string): string {
    const isWin = process.platform === 'win32';
    const ext = isWin ? '.exe' : '';
    return `${path.join(this.jdkPath, 'bin', `${binName}${ext}`)}`;
  }

  private get packageId(): string {
    const clean = this.config.buildId.replace(/-/g, '').substring(0, 16);
    return `com.kinetix.app${clean}`;
  }

  private get appHostname(): string {
    try { return new URL(this.config.appUrl).hostname; }
    catch { return 'app.example.com'; }
  }

  // ─── Default Icon Generation ─────────────────────────────────────────────

  private async ensureIcon(): Promise<string> {
    if (this.config.appIconPath && fs.existsSync(this.config.appIconPath)) {
      return this.config.appIconPath;
    }

    const defaultIconPath = path.join(this.config.workingDir, 'default-icon.png');

    // Copy bundled default 512x512 icon if it exists 
    const builtinDefault = path.resolve(process.cwd(), 'public', 'icon-512.png');
    if (fs.existsSync(builtinDefault)) {
      await fs.copy(builtinDefault, defaultIconPath);
    } else {
      // Create a fallback transparent 512x512 PNG using the native crypto/zlib buffer 
      const w = 512, h = 512;
      const zlib = require('zlib');
      const IHDR = Buffer.alloc(13);
      IHDR.writeUInt32BE(w, 0); IHDR.writeUInt32BE(h, 4);
      IHDR.writeUInt8(8, 8); IHDR.writeUInt8(6, 9);
      IHDR.writeUInt8(0, 10); IHDR.writeUInt8(0, 11); IHDR.writeUInt8(0, 12);
      const rawData = Buffer.alloc(h * (w * 4 + 1));
      const IDAT = zlib.deflateSync(rawData);
      function chunk(type: string, data: Buffer) {
        const length = Buffer.alloc(4); length.writeUInt32BE(data.length, 0);
        const typeBuf = Buffer.from(type);
        const crc = zlib.crc32(Buffer.concat([typeBuf, data]));
        const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc, 0);
        return Buffer.concat([length, typeBuf, data, crcBuf]);
      }
      const minimalPng = Buffer.concat([
        Buffer.from('89504E470D0A1A0A', 'hex'),
        chunk('IHDR', IHDR), chunk('IDAT', IDAT), chunk('IEND', Buffer.alloc(0))
      ]);
      await fs.writeFile(defaultIconPath, minimalPng);
    }

    return defaultIconPath;
  }

  // ─── Asset Links (Deep Linking) ──────────────────────────────────────────

  private generateAssetLinks(fingerprint: string): string {
    return JSON.stringify(
      [
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: this.packageId,
            sha256_cert_fingerprints: [fingerprint],
          },
        },
      ],
      null,
      2
    );
  }

  private generateAppleSiteAssociation(): string {
    return JSON.stringify(
      {
        applinks: {
          apps: [],
          details: [
            {
              appID: `TEAMID.${this.packageId}`,
              paths: ['*'],
            },
          ],
        },
      },
      null,
      2
    );
  }

  // ─── Main Runner ─────────────────────────────────────────────────────────

  async run(): Promise<BuildResult> {
    if (process.env.VERCEL) {
      throw new Error(
        'VERCEL ENVIRONMENT: Android/iOS Build Engine requires Java & Android SDK. ' +
        'Use GitHub Actions mode (set USE_GITHUB_ACTIONS=true).'
      );
    }

    await this.setupEnvironment();

    if (this.platform === 'ios') {
      return await this.buildIos();
    }

    return await this.buildAndroid();
  }

  // ─── Android Build ────────────────────────────────────────────────────────

  private async buildAndroid(): Promise<BuildResult> {
    const iconPath = await this.ensureIcon();
    await this.generateAndroidProject(iconPath);
    await this.compileAndroidApk();
    const fingerprint = await this.signAndroidApk();
    const apkPath = this.getSignedApkPath();

    const assetLinksJson = this.config.enableDeepLinks
      ? this.generateAssetLinks(fingerprint)
      : undefined;

    return {
      success: true,
      apkPath,
      packageId: this.packageId,
      sha256Fingerprint: fingerprint,
      assetLinksJson,
    };
  }

  // ─── iOS Build (Stub — real Xcode build needs macOS) ─────────────────────

  private async buildIos(): Promise<BuildResult> {
    /*
     * NOTE: Actual Xcode builds require macOS + Xcode CLI tools.
     * In GitHub Actions with `runs-on: macos-latest`, this is fully supported.
     * In Docker/Linux, we generate the Xcode project files for local building.
     *
     * For cloud mode (GitHub Actions macos-latest runner), the workflow handles
     * the actual xcodebuild commands. This method generates the project structure.
     */
    console.log(`[${this.config.buildId}] Generating iOS project structure...`);

    const iconPath = await this.ensureIcon();
    const iosProjectDir = path.join(this.config.workingDir, 'ios_project');
    await fs.ensureDir(iosProjectDir);

    // Write ios_config.json for the GitHub Actions runner to consume
    const iosConfig = {
      bundleId: this.packageId,
      appName: this.config.appName,
      appUrl: this.config.appUrl,
      iconPath: this.config.appIconPath || '',
      enableDeepLinks: this.config.enableDeepLinks ?? true,
      buildId: this.config.buildId,
    };
    await fs.writeJson(path.join(iosProjectDir, 'ios_config.json'), iosConfig, { spaces: 2 });

    const appleSiteAssociation = this.config.enableDeepLinks
      ? this.generateAppleSiteAssociation()
      : undefined;

    return {
      success: true,
      packageId: this.packageId,
      sha256Fingerprint: 'Generated by Xcode on macOS runner',
      appleSiteAssociation,
    };
  }

  // ─── Android Internals ────────────────────────────────────────────────────

  private async setupEnvironment() {
    console.log(`[${this.config.buildId}] Environment: JDK=${this.jdkPath}, SDK=${this.androidSdkPath}`);
    await fs.ensureDir(this.config.workingDir);
  }

  private async generateAndroidProject(iconPath: string) {
    console.log(`[${this.config.buildId}] Generating TWA project...`);

    const url = new URL(this.config.appUrl);
    const host = url.hostname;

    // Spin up a local icon server so bubblewrap can fetch it
    const port = 40000 + Math.floor(Math.random() * 10000);
    const http = require('http');

    const iconServer = http.createServer((_req: any, res: any) => {
      const stream = fs.createReadStream(iconPath);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      stream.pipe(res);
    }).listen(port);

    const manifestConfig = {
      packageId: this.packageId,
      host,
      name: this.config.appName,
      launcherName: this.config.appName.substring(0, 12),
      display: 'standalone',
      themeColor: '#8b5cf6',
      navigationColor: '#020617',
      backgroundColor: '#020617',
      startUrl: url.pathname || '/',
      iconUrl: `http://localhost:${port}/icon.png`,
      maskableIconUrl: undefined,
      appVersion: '1.0.0',
      appVersionCode: 1,
      shortcuts: [],
      splashScreenFadeOutDuration: 300,
      enableNotifications: this.config.enableDeepLinks ?? true,
      signingKey: {
        path: path.join(this.config.workingDir, 'android.keystore'),
        alias: 'kinetix',
      },
      generatorApp: 'Kinetix',
    };

    const { TwaManifest } = require('@bubblewrap/core/dist/lib/TwaManifest');
    const { TwaGenerator } = require('@bubblewrap/core/dist/lib/TwaGenerator');
    const manifest = new TwaManifest(manifestConfig);
    const generator = new TwaGenerator();

    try {
      await generator.createTwaProject(this.config.workingDir, manifest, this.log);
    } finally {
      iconServer.close();
    }
  }

  private async compileAndroidApk() {
    console.log(`[${this.config.buildId}] Compiling APK...`);

    const safeSdkPath = this.androidSdkPath.replace(/\\/g, '\\\\');
    await fs.writeFile(
      path.join(this.config.workingDir, 'local.properties'),
      `sdk.dir=${safeSdkPath}\n`
    );

    const keystorePath = path.join(this.config.workingDir, 'android.keystore');
    if (!fs.existsSync(keystorePath)) {
      execFileSync(
        this.getExecutable('keytool'),
        [
          '-genkeypair', '-v',
          '-keystore', keystorePath,
          '-alias', 'kinetix',
          '-keyalg', 'RSA',
          '-keysize', '2048',
          '-validity', '10000',
          '-storepass', process.env.KEYSTORE_PASS || 'kinetix123',
          '-keypass', process.env.KEYSTORE_PASS || 'kinetix123',
          '-dname', 'CN=Kinetix, OU=Apps, O=SKAV TECH, L=Hyderabad, ST=Telangana, C=IN'
        ],
        { stdio: 'inherit' }
      );
    }

    // Invoke gradlew directly so we can inject JAVA_HOME explicitly.
    // Bubblewrap's GradleWrapper inherits the system env which may have an
    // incompatible JVM (e.g. Java 8) on PATH.
    const isWin = process.platform === 'win32';
    const gradlewPath = path.join(this.config.workingDir, isWin ? 'gradlew.bat' : 'gradlew');

    // Make gradlew executable on Unix
    if (!isWin) {
      try { execFileSync('chmod', ['+x', gradlewPath]); } catch { /* ignore */ }
    }

    const gradleEnv = {
      ...process.env,
      JAVA_HOME: this.jdkPath,
      // Ensure JAVA_HOME/bin is first on PATH so Gradle picks our JVM
      PATH: `${path.join(this.jdkPath, 'bin')}${isWin ? ';' : ':'}${process.env.PATH}`,
      ANDROID_HOME: this.androidSdkPath,
      ANDROID_SDK_ROOT: this.androidSdkPath,
    };

    console.log(`[${this.config.buildId}] Running Gradle with JDK: ${this.jdkPath}`);

    if (isWin) {
      // On Windows, .bat files must be invoked via cmd.exe
      execFileSync('cmd.exe', ['/c', gradlewPath, 'assembleRelease', '--stacktrace'], {
        cwd: this.config.workingDir,
        stdio: 'inherit',
        env: gradleEnv,
      });
    } else {
      execFileSync('bash', [gradlewPath, 'assembleRelease', '--stacktrace'], {
        cwd: this.config.workingDir,
        stdio: 'inherit',
        env: gradleEnv,
      });
    }
  }

  private async signAndroidApk(): Promise<string> {
    console.log(`[${this.config.buildId}] Signing APK...`);

    const buildToolsRoot = path.join(this.androidSdkPath, 'build-tools');
    const versions = fs
      .readdirSync(buildToolsRoot)
      .filter(f => fs.statSync(path.join(buildToolsRoot, f)).isDirectory())
      .sort();
    const latestVersion = versions[versions.length - 1];
    if (!latestVersion) throw new Error('No Android build-tools found');

    const apksignerJar = path.join(buildToolsRoot, latestVersion, 'lib', 'apksigner.jar');
    const apkDir = path.join(this.config.workingDir, 'app', 'build', 'outputs', 'apk', 'release');
    const inputApk = path.join(apkDir, 'app-release-unsigned.apk');
    const outputApk = path.join(apkDir, 'app-release-signed.apk');
    const keystorePath = path.join(this.config.workingDir, 'android.keystore');

    execFileSync(
      this.getExecutable('java'),
      [
        '-Xmx1024M',
        '-jar', apksignerJar,
        'sign',
        '--ks', keystorePath,
        '--ks-key-alias', 'kinetix',
        '--ks-pass', `pass:${process.env.KEYSTORE_PASS || 'kinetix123'}`,
        '--key-pass', `pass:${process.env.KEYSTORE_PASS || 'kinetix123'}`,
        '--out', outputApk,
        inputApk
      ],
      { stdio: 'inherit' }
    );

    return this.getSha256Fingerprint(keystorePath);
  }

  private getSha256Fingerprint(keystorePath: string): string {
    try {
      const output = execFileSync(
        this.getExecutable('keytool'),
        [
          '-list', '-v',
          '-keystore', keystorePath,
          '-alias', 'kinetix',
          '-storepass', process.env.KEYSTORE_PASS || 'kinetix123'
        ],
        { stdio: 'pipe' }
      ).toString();
      const match = output.match(/SHA256:\s*([A-Fa-f0-9:]+)/);
      return match ? match[1] : '';
    } catch (e) {
      console.error('Failed to extract SHA-256 fingerprint:', e);
      return '';
    }
  }

  private getSignedApkPath(): string {
    return path.join(
      this.config.workingDir,
      'app', 'build', 'outputs', 'apk', 'release',
      'app-release-signed.apk'
    );
  }
}
