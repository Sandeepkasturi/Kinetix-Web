import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AppGeneratorForm } from '@/components/home/AppGeneratorForm';
import { Shield, Link2, Smartphone, Apple, Globe, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '10K+', label: 'Apps generated' },
  { value: '99.8%', label: 'Build success rate' },
  { value: '<90s', label: 'Average build time' },
  { value: 'Android & iOS', label: 'Platforms supported' },
];

const features = [
  {
    icon: Smartphone,
    title: 'Android & iOS',
    description: 'One URL submission. Two production-ready app binaries. Compiled in GitHub Actions.',
  },
  {
    icon: Link2,
    title: 'Deep Linking',
    description: 'Any link associated with your domain opens directly inside your installed app — not the browser.',
  },
  {
    icon: Shield,
    title: 'Signed & Verified',
    description: 'Every APK is signed with a unique RSA keystore. SHA-256 fingerprint included for trust verification.',
  },
  {
    icon: Zap,
    title: 'Cloud Builds',
    description: 'Serverless build infrastructure on GitHub Actions. No setup, no VMs, no configuration required.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Enter your URL',
    desc: 'Paste any https:// URL. Name your app. That\'s the starting point.',
  },
  {
    num: '02',
    title: 'Configure',
    desc: 'Pick Android or iOS. Optionally add your icon, email, and advanced settings.',
  },
  {
    num: '03',
    title: 'Download & ship',
    desc: 'Cloud builds complete in under 90 seconds. Your signed app file is ready to distribute.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-[#f1f5f9] font-sans">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        {/* Subtle grid */}
        <div className="bg-grid-pattern absolute inset-0 opacity-40" />
        {/* Single subtle glow, not centered */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Kinetix Engine v2 — Android builds powered by GitHub Actions
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-[68px] font-black tracking-[-0.03em] text-white leading-[1.05] mb-6 max-w-3xl animate-fade-in-up"
          >
            Turn any website into a native mobile app.
          </h1>

          <p className="text-lg text-[#64748b] max-w-xl leading-relaxed mb-10 animate-fade-in-up animate-delay-100">
            No code, no app store registration. Paste your URL and get a signed{' '}
            <span className="text-[#94a3b8]">Android APK</span> or{' '}
            <span className="text-[#94a3b8]">iOS IPA</span>{' '}
            with deep linking in under 90 seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-20 animate-fade-in-up animate-delay-200">
            <Link
              href="/#generate"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors"
            >
              Build my app — it&apos;s free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#94a3b8] font-medium text-sm transition-colors"
            >
              How it works
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.04] animate-fade-in-up animate-delay-300">
            {stats.map((s) => (
              <div
                key={s.label}
                className="px-6 py-5 bg-[#020617]"
              >
                <div className="text-xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-[#475569]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GENERATOR ────────────────────────────────────────── */}
      <section id="generate" className="py-20 scroll-mt-16 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl animate-fade-in-up animate-delay-200">
          <div className="mb-10">
            <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-widest mb-2">App Builder</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Generate your app</h2>
            <p className="text-[#64748b] mt-1.5 text-sm max-w-sm">
              Fill in the details. Your app builds in the cloud and is ready in minutes.
            </p>
          </div>
          <AppGeneratorForm />
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12 animate-fade-in-up">
            <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-widest mb-2">Platform</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Everything included</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden animate-fade-in-up animate-delay-100">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-[#020617] p-7 flex gap-4 group hover:bg-white/[0.015] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-emerald-500/20 transition-colors">
                    <Icon className="w-4 h-4 text-[#64748b] group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12">
            <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Three steps to shipped</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {/* connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-3 left-full w-full h-px bg-white/[0.06] z-0" style={{ width: 'calc(100% - 2rem)' }} />
                )}
                <div className="text-[11px] font-mono font-semibold text-[#334155] mb-4 relative z-10">{step.num}</div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="rounded-2xl border border-white/[0.06] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{ background: 'rgba(10, 15, 30, 0.5)' }}>
            <div className="max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to go mobile?</h2>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Join thousands of businesses that launched native apps with Kinetix. Free to start, no credit card required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/#generate"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors"
              >
                Start for free <ArrowRight className="w-4 h-4" />
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
