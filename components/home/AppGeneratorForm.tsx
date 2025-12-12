'use client';

import { useState } from 'react';
import { Loader2, Download, Smartphone, Globe, Upload, ArrowRight } from 'lucide-react';
import { MobileEmulator } from '@/components/ui/MobileEmulator';

export function AppGeneratorForm() {
    const [appName, setAppName] = useState('');
    const [appUrl, setAppUrl] = useState('');
    const [icon, setIcon] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'building' | 'success' | 'error' | 'active-cloud'>('idle');
    const [log, setLog] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!icon) return;

        setStatus('building');
        setLog('Starting build process...\n');

        const formData = new FormData();
        formData.append('appName', appName);
        formData.append('appUrl', appUrl);
        formData.append('icon', icon);

        try {
            const response = await fetch('/api/build', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                if (data.mode === 'cloud') {
                    setStatus('active-cloud');
                    setGithubUrl(data.githubUrl);
                    setLog(prev => prev + `Request sent to GitHub Actions!\nBuild ID: ${data.buildId}\n`);
                } else {
                    setStatus('success');
                    setDownloadUrl(data.downloadUrl);
                    setLog(prev => prev + `Build Complete!\npackageId: ${data.packageId}\nSHA256: ${data.sha256Fingerprint}\n`);
                }
            } else {
                setStatus('error');
                setLog(prev => prev + `Error: ${data.error}\n`);
            }
        } catch (err) {
            setStatus('error');
            setLog(prev => prev + 'Network error occurred.\n');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
            {/* Left Side: Form */}
            <div className="order-2 lg:order-1">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10">
                    {status === 'active-cloud' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Build Started on GitHub!</h2>
                            <p className="text-slate-400 mb-8 px-4">
                                Since you are on Vercel Free Tier, the build is running on GitHub Actions.
                            </p>

                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all w-full shadow-lg shadow-blue-900/20 mb-8"
                            >
                                <ArrowRight className="w-5 h-5" />
                                Track Build Progress
                            </a>

                            <div className="text-left bg-slate-950 p-6 rounded-xl border border-slate-800">
                                <p className="text-sm text-slate-300 mb-2">
                                    <strong>Next Steps:</strong>
                                </p>
                                <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2">
                                    <li>Click button above to open GitHub.</li>
                                    <li>Wait for the <strong>Build APK</strong> workflow to finish (approx 3-5 mins).</li>
                                    <li>Click on the run to find the <strong>Artifacts</strong> section at the bottom.</li>
                                    <li>Download your <strong>app-release-signed.apk</strong>.</li>
                                    <li>Copy the Asset Links SHA-256 fingerprint from the logs.</li>
                                </ol>
                            </div>

                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-6 text-slate-500 hover:text-slate-300 text-sm font-medium"
                            >
                                Build Another App
                            </button>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Download className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Build Successful!</h2>
                            <p className="text-slate-400 mb-8">Your APK is ready. To hide the browser bar, you must verify your domain.</p>

                            <a
                                href={downloadUrl}
                                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-xl transition-all w-full shadow-lg shadow-green-900/20 mb-8"
                            >
                                <Download className="w-5 h-5" />
                                Download APK
                            </a>

                            <div className="text-left bg-slate-950 p-6 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-indigo-400" />
                                    Domain Verification (Required)
                                </h4>
                                <p className="text-xs text-slate-400 mb-4">
                                    To remove the browser URL bar, upload this file to: <br />
                                    <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">https://{new URL(appUrl).hostname}/.well-known/assetlinks.json</code>
                                </p>
                                <div className="bg-black p-4 rounded-lg overflow-x-auto border border-slate-800 relative group">
                                    <pre className="text-xs text-slate-300 font-mono">
                                        {`[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.nativebridge.app${log.match(/packageId: (.*)/)?.[1] || ''}",
    "sha256_cert_fingerprints": [
      "${log.match(/SHA256: (.*)/)?.[1] || 'generating...'}"
    ]
  }
}]`}
                                    </pre>
                                </div>
                            </div>

                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-6 text-slate-500 hover:text-slate-300 text-sm font-medium"
                            >
                                Build Another App
                            </button>
                        </div>
                    )}

                    {status !== 'success' && status !== 'active-cloud' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Application Name
                                </label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        required
                                        maxLength={20}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                        placeholder="My Awesome App"
                                        value={appName}
                                        onChange={(e) => setAppName(e.target.value)}
                                        disabled={status === 'building'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Website URL
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                    <input
                                        type="url"
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                        placeholder="https://example.com"
                                        value={appUrl}
                                        onChange={(e) => setAppUrl(e.target.value)}
                                        disabled={status === 'building'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    App Icon (PNG, 512x512)
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-indigo-500/5 rounded-lg group-hover:bg-indigo-500/10 transition-colors" />
                                    <input
                                        type="file"
                                        accept="image/png"
                                        required
                                        className="w-full relative z-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 text-slate-400 py-3 px-4 cursor-pointer"
                                        onChange={(e) => setIcon(e.target.files?.[0] || null)}
                                        disabled={status === 'building'}
                                    />
                                    <Upload className="absolute right-4 top-3.5 w-5 h-5 text-slate-600 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'building'}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 mt-4 text-lg"
                            >
                                {status === 'building' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Building Engine Running...
                                    </>
                                ) : (
                                    <>
                                        Generate Application
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Logs Terminal */}
                    {(status === 'building' || status === 'error') && (
                        <div className="mt-8 bg-black rounded-lg border border-slate-800 p-4 font-mono text-xs text-green-400 h-48 overflow-y-auto shadow-inner">
                            <div className="flex items-center gap-2 text-slate-500 mb-2 pb-2 border-b border-slate-900">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="ml-auto">build_log.txt</span>
                            </div>
                            <pre className="whitespace-pre-wrap">{log}</pre>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Emulator */}
            <div className="order-1 lg:order-2 flex flex-col items-center">
                <div className="mb-8 text-center lg:text-left">
                    <span className="text-indigo-400 font-semibold tracking-wider text-sm uppercase mb-2 block">Live Preview</span>
                    <h3 className="text-2xl font-bold text-white mb-2">See It Before You Build</h3>
                    <p className="text-slate-400">Type your URL to preview how your app will look on a device.</p>
                </div>
                <MobileEmulator url={appUrl} />
            </div>
        </div>
    );
}
