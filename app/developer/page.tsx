import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Terminal } from 'lucide-react';

export default function DeveloperPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-white mb-6 flex items-center gap-4">
                        <Terminal className="w-10 h-10 text-indigo-400" />
                        Developer API
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed border-b border-slate-800 pb-8">
                        Build programmatically with the NativeBridge Engine.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-12">
                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">POST /api/build</h3>
                        <p className="text-slate-400 mb-6">
                            Trigger a new application build. Returns a build ID and status URL.
                        </p>
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 font-mono text-sm overflow-x-auto">
                            <div className="text-slate-500 mb-2"># Request</div>
                            <div className="text-indigo-400">curl -X POST https://nativebridge.app/api/build \</div>
                            <div className="text-slate-300 pl-4">-F "appName=My App" \</div>
                            <div className="text-slate-300 pl-4">-F "appUrl=https://example.com" \</div>
                            <div className="text-slate-300 pl-4">-F "icon=@logo.png"</div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">Building on Vercel?</h3>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                            <p className="text-yellow-200 text-sm">
                                <strong>Note:</strong> The core build engine requires the Android SDK and JDK environments.
                                We provide a Docker image for self-hosting the worker node.
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
