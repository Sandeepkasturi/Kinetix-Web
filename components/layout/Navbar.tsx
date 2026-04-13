'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { KinetixLogo } from '@/components/ui/KinetixLogo';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/developer', label: 'Developers' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled
            ? 'w-[calc(100%-2rem)] max-w-4xl'
            : 'w-[calc(100%-4rem)] max-w-5xl'
        }`}
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 via-transparent to-blue-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative glass-float rounded-2xl px-2 py-1.5">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-0 group" aria-label="Kinetix Home">
                <KinetixLogo size={36} showText animated />
              </Link>

              <div className="hidden md:flex items-center">
                <div className="flex items-center gap-0.5 px-1.5 py-1 bg-white/5 rounded-xl">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/5"
                    >
                      {link.label}
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="https://github.com/sandeepkasturi"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </Link>
                <div className="w-px h-6 bg-white/10" />
                <Link
                  href="/#generate"
                  className="btn-primary text-sm py-2.5 px-5"
                >
                  <Zap className="w-4 h-4" />
                  Build App Free
                </Link>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-24 left-4 right-4">
            <div className="glass-float rounded-2xl p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10">
                <Link
                  href="/#generate"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-sm justify-center"
                >
                  <Zap className="w-4 h-4" />
                  Build App Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
