'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Check, Rocket, Zap, Crown, ArrowRight, Globe, IndianRupee } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Region = 'IN' | 'INTL';

interface Plan {
  name: string;
  icon: React.ReactNode;
  priceUSD: string;
  priceINR: string;
  periodUSD: string;
  periodINR: string;
  desc: string;
  features: string[];
  highlight: boolean;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
}

const plans: Plan[] = [
  {
    name: 'Starter',
    icon: <Rocket className="w-5 h-5" />,
    priceUSD: '$0',
    priceINR: 'Free',
    periodUSD: '/month',
    periodINR: '',
    desc: 'Perfect for side projects and MVPs.',
    features: [
      '3 Builds per month',
      'Standard Android APK',
      '1 iOS Download',
      'Shared Build Queue',
      'Kinetix Branding',
      'Basic Support',
    ],
    highlight: false,
    ctaLabel: 'Start for free',
    ctaHref: '/#generate',
  },
  {
    name: 'Pro',
    icon: <Zap className="w-5 h-5" />,
    priceUSD: '$19.99',
    priceINR: '₹399',
    periodUSD: '/month',
    periodINR: '/month',
    desc: 'For serious apps scaling fast.',
    features: [
      '25 Builds per month',
      'Android + iOS (Beta)',
      'No Branding',
      'Priority Queue',
      'Deep Linking Support',
      'Email Marketing',
      'Publish on 10+ Stores',
    ],
    highlight: true,
    badge: 'Most Popular',
    ctaLabel: 'Get Pro',
    ctaHref: '/pricing/checkout?plan=pro',
  },
  {
    name: 'Premium',
    icon: <Crown className="w-5 h-5" />,
    priceUSD: '$39.99',
    priceINR: '₹799',
    periodUSD: '/month',
    periodINR: '/month',
    desc: 'Everything you need to go pro-grade.',
    features: [
      'Unlimited Builds per month',
      'Android + iOS (Beta)',
      'No Branding',
      'Priority Queue',
      'Deep Linking Support',
      'Email Marketing',
      'Publish on 10+ Stores',
      'Custom Integrations',
      'Branding Support',
    ],
    highlight: false,
    ctaLabel: 'Get Premium',
    ctaHref: '/pricing/checkout?plan=premium',
  },
];

function PricingContent() {
  const [detected, setDetected] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setDetected(true);
  }, []);

  useEffect(() => {
    const status = searchParams.get('checkout_status');
    
    // We expect Dodo Payments checkout flow to return success. Check local storage for the cached session_id
    if (status === 'success') {
      const sessionId = localStorage.getItem('dodo_session_id');
      
      if (sessionId) {
        // Verify payment on backend
        fetch('/api/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })
        .then(r => r.json())
        .then(data => {
          if (data.isPaid) {
            alert('Payment verified! Welcome to Kinetix Pro.');
            localStorage.removeItem('dodo_session_id');
            router.replace('/pricing'); // Clear params
          }
        })
        .catch(e => console.error('Verification failed', e));
      } else {
        router.replace('/pricing'); // Clear params if no session
      }
    }
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-[#020617] text-[#f1f5f9]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%)' }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Simple, Transparent Pricing
            </span>
          </div>

          <h1 className="text-5xl md:text-[64px] font-black tracking-[-0.03em] text-white leading-[1.05] mb-5 max-w-3xl">
            Choose your plan.<br />
            <span className="text-emerald-400">Start for free.</span>
          </h1>
          <p className="text-lg text-[#64748b] max-w-xl leading-relaxed mb-10">
            Scale as you grow. No hidden fees, no surprises. Cancel anytime.
          </p>

        </div>
      </section>

      {/* Plans Grid */}
      <section className="pb-24 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
                  plan.highlight
                    ? 'border-emerald-500/30 bg-[#051a10] shadow-[0_0_48px_rgba(16,185,129,0.1)]'
                    : 'border-white/[0.06] bg-[#020617] hover:border-white/[0.1] hover:bg-white/[0.015]'
                }`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-grow">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                      plan.highlight
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-white/[0.04] border-white/[0.06] text-[#64748b]'
                    }`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-[#475569]">{plan.desc}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black tracking-tight ${
                        plan.highlight ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {plan.priceINR}
                      </span>
                      <span className="text-sm text-[#475569]">
                        {plan.periodINR}
                      </span>
                    </div>

                    {/* Payment processor badge */}
                    <div className="mt-3">
                      {(plan.name === 'Starter') ? (
                        <span className="text-[10px] text-[#334155] font-medium">No payment required</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#475569] border border-white/[0.05] rounded-md px-2 py-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          Powered by Dodo Payments
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-grow mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.highlight
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-white/[0.04] text-[#475569]'
                        }`}>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-sm text-[#94a3b8]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.name === 'Starter' ? (
                    <Link
                      href={plan.ctaHref}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#94a3b8] font-semibold text-sm transition-colors"
                    >
                      {plan.ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                        plan.highlight
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_32px_rgba(16,185,129,0.4)] hover:-translate-y-0.5'
                          : 'border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#94a3b8]'
                      }`}
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              plan: plan.name.toLowerCase(),
                              customerEmail: 'hello@kinetixapp.com',
                            }),
                          });

                          if (!res.ok) throw new Error('Session creation failed');
                          const { url, session_id } = await res.json();
                          
                          if (session_id) {
                            localStorage.setItem('dodo_session_id', session_id);
                          }

                          if (url) {
                            window.location.href = url;
                          } else {
                            throw new Error('No checkout URL returned');
                          }
                        } catch (err: any) {
                          console.error('Checkout failed:', err);
                          const message = err?.message || 'Checkout failed to initialize. Please try again.';
                          alert(message);
                        }
                      }}
                    >
                      {plan.ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ strip / Trust signals */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes. No long-term contracts. Cancel from your dashboard at any moment.' },
              { q: 'What counts as a build?', a: 'Each successful Android or iOS compile counts as one build against your monthly quota.' },
              { q: 'What is iOS Beta?', a: 'iOS builds via ad-hoc distribution. App Store submission workflows coming soon.' },
            ].map((item) => (
              <div key={item.q} className="bg-[#020617] px-8 py-7 group hover:bg-white/[0.015] transition-colors">
                <h4 className="text-sm font-semibold text-white mb-2">{item.q}</h4>
                <p className="text-sm text-[#475569] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div
            className="rounded-2xl border border-white/[0.06] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{ background: 'rgba(10,15,30,0.5)' }}
          >
            <div className="max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Not sure which plan?</h2>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Start free and upgrade when you need more builds. No credit card required to get started.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/#generate"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors"
              >
                Start free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#94a3b8] font-medium text-sm transition-colors"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}

