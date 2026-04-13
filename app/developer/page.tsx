'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Zap, Share2, Lock, Terminal, ArrowRight, Code2, GitBranch, Webhook, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const features = [
  {
    icon: Zap,
    title: 'RESTful API',
    desc: 'Simple JSON-based endpoints for build automation and CI/CD integration.',
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    desc: 'Real-time push notifications the moment your build completes.',
    color: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: KeyRound,
    title: 'API Keys',
    desc: 'Scoped authentication tokens with fine-grained permission control.',
    color: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: Terminal,
    title: 'CLI Tool',
    desc: 'Trigger builds, check status, and download artifacts from your terminal.',
    color: 'text-orange-400',
    iconBg: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    icon: GitBranch,
    title: 'GitHub Actions',
    desc: 'Native integration — trigger Kinetix builds straight from your workflow YAML.',
    color: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/20',
  },
  {
    icon: Code2,
    title: 'SDKs',
    desc: 'Official Node.js and Python SDKs with full TypeScript support.',
    color: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
  },
];

const endpoints = [
  { method: 'POST',   path: '/v1/build',            desc: 'Trigger a new mobile app build.' },
  { method: 'GET',    path: '/v1/status/:id',        desc: 'Check build progress and download links.' },
  { method: 'GET',    path: '/v1/keystores',         desc: 'List your organisation signing keys.' },
  { method: 'DELETE', path: '/v1/artifacts/:id',     desc: 'Permanently delete a build artifact.' },
  { method: 'POST',   path: '/v1/webhook/register',  desc: 'Register a webhook endpoint.' },
  { method: 'GET',    path: '/v1/builds',            desc: 'Paginate through your build history.' },
];

export default function DeveloperPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#020617] text-[#f1f5f9] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />

        {/* Emerald glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%)' }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Developer API
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-[64px] font-black tracking-[-0.03em] text-white leading-[1.05] mb-5 max-w-3xl">
            Build apps.<br />
            <span className="text-emerald-400">Programmatically.</span>
          </h1>

          <p className="text-lg text-[#64748b] max-w-xl leading-relaxed mb-12">
            Integrate Kinetix into your CI/CD pipeline. Trigger native app builds, poll status,
            manage signing keys and receive webhooks — all from your own infrastructure.
          </p>

          {/* ── COMING SOON BANNER ── */}
          <div className="relative rounded-2xl border border-white/[0.06] overflow-hidden mb-14">
            {/* Background shimmer layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(105deg, rgba(16,185,129,0.04) 0%, rgba(59,130,246,0.03) 50%, rgba(139,92,246,0.04) 100%)',
              }}
            />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-8">
              {/* Left side */}
              <div className="flex items-center gap-5">
                {/* Big icon */}
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Coming Soon
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Developer APIs are in active development</h2>
                  <p className="text-sm text-[#64748b] mt-0.5">
                    Join the waitlist and be the first to get access when we launch.
                  </p>
                </div>
              </div>

              {/* Waitlist form / success */}
              <div className="flex-shrink-0 w-full md:w-auto">
                {submitted ? (
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm">
                    ✓ &nbsp;You&apos;re on the list!
                  </div>
                ) : (
                  <form onSubmit={handleNotify} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-[#475569] text-sm font-medium outline-none focus:border-emerald-500/40 transition-colors w-52"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors whitespace-nowrap"
                    >
                      Notify me <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Code preview */}
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#050b1a]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <span className="ml-3 font-mono text-[11px] text-[#334155]">build_app.sh</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <span className="text-[#475569]"># Trigger an Android build from your CI pipeline{'\n'}</span>
                <span className="text-emerald-400">curl</span>
                <span className="text-white"> -X POST https://api.kinetixapp.com/v1/build \{'\n'}</span>
                <span className="text-white">  -H </span>
                <span className="text-yellow-400">&quot;Authorization: Bearer $KINETIX_API_KEY&quot;</span>
                <span className="text-white"> \{'\n'}</span>
                <span className="text-white">  -H </span>
                <span className="text-yellow-400">&quot;Content-Type: application/json&quot;</span>
                <span className="text-white"> \{'\n'}</span>
                <span className="text-white">  -d </span>
                <span className="text-blue-400">&apos;&#123;{'\n'}</span>
                <span className="text-blue-400">    &quot;appName&quot;: &quot;My Pro App&quot;,{'\n'}</span>
                <span className="text-blue-400">    &quot;appUrl&quot;: &quot;https://myapp.com&quot;,{'\n'}</span>
                <span className="text-blue-400">    &quot;platform&quot;: &quot;android&quot;,{'\n'}</span>
                <span className="text-blue-400">    &quot;enableDeepLinking&quot;: true,{'\n'}</span>
                <span className="text-blue-400">    &quot;webhook&quot;: &quot;https://callback.com/kinetix&quot;{'\n'}</span>
                <span className="text-blue-400">  &#125;&apos;</span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12">
            <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-widest mb-2">Platform</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">What you&apos;ll get</h2>
            <p className="text-[#64748b] text-sm mt-1.5 max-w-sm">
              Full API access shipping with all of these capabilities built in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-[#020617] p-7 flex gap-4 group hover:bg-white/[0.015] transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${f.iconBg} border flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <Icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── API REFERENCE (blurred / locked) ─────────────── */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-10">
            <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-widest mb-2">API Reference</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Endpoints</h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
            {/* Blurred rows */}
            <div className="pointer-events-none select-none" aria-hidden="true">
              {endpoints.map((api, i) => (
                <div
                  key={api.path}
                  className={`px-6 py-4 flex items-center justify-between bg-[#020617] ${
                    i !== 0 ? 'border-t border-white/[0.04]' : ''
                  }`}
                  style={{ filter: `blur(${i < 2 ? '2px' : '5px'})`, opacity: i < 2 ? 0.6 : 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        api.method === 'POST'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : api.method === 'DELETE'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {api.method}
                    </span>
                    <div>
                      <code className="text-white font-mono text-sm">{api.path}</code>
                      <p className="text-xs text-[#475569] mt-0.5">{api.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#020617]/30 via-[#020617]/70 to-[#020617]">
              <div className="text-center px-6 py-10">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-5 h-5 text-[#475569]" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Coming Soon
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Full API docs unlocking soon</h3>
                <p className="text-sm text-[#64748b] max-w-xs mx-auto">
                  The API is in active development. Drop your email above to get early access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div
            className="rounded-2xl border border-white/[0.06] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{ background: 'rgba(10,15,30,0.5)' }}
          >
            <div className="max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to automate?</h2>
              <p className="text-[#64748b] text-sm leading-relaxed">
                While the API is cooking, you can still build apps instantly using our free web builder.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/#generate"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors"
              >
                Build my app free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#94a3b8] font-medium text-sm transition-colors"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
