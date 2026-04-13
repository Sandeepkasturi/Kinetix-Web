import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { KinetixLogo } from '@/components/ui/KinetixLogo';

const nav = [
  {
    heading: 'Product',
    links: [
      { href: '/pricing', label: 'Pricing' },
      { href: '/about', label: 'About' },
      { href: '/developer', label: 'API Docs' },
      { href: '/#generate', label: 'Build an app' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { href: 'https://github.com/sandeepkasturi', label: 'GitHub', external: true },
      { href: 'https://linkedin.com/in/sandeepkasturi9', label: 'LinkedIn', external: true },
      { href: 'mailto:hello@kinetixapp.com', label: 'hello@kinetixapp.com', external: true },
    ],
  },
] satisfies { heading: string; links: { href: string; label: string; external?: boolean }[] }[];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#020617]">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <KinetixLogo size={32} showText className="mb-4" />
            <p className="text-sm text-[#475569] leading-relaxed max-w-[220px]">
              Turn any website into a native mobile app. No code, no hassle.
            </p>

            <div className="flex items-center gap-2 mt-6">
              <a
                href="https://github.com/sandeepkasturi"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-[#475569] hover:text-white hover:border-white/[0.14] transition-all"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/sandeepkasturi9"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-[#475569] hover:text-white hover:border-white/[0.14] transition-all"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:hello@kinetixapp.com"
                aria-label="Email"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-[#475569] hover:text-white hover:border-white/[0.14] transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {nav.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] font-semibold text-[#334155] uppercase tracking-widest mb-4">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="inline-flex items-center gap-1 text-sm text-[#475569] hover:text-[#94a3b8] transition-colors"
                      >
                        {link.label}
                        {link.href.startsWith('http') && (
                          <ArrowUpRight className="w-3 h-3 opacity-50" />
                        )}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[#475569] hover:text-[#94a3b8] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[#334155]">
            © {new Date().getFullYear()} Kinetix. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#334155]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
            <span className="text-[#1e293b]">·</span>
            <a
              href="https://skavtechs.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#334155] hover:text-[#475569] transition-colors"
            >
              Built by SKAV TECH
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
