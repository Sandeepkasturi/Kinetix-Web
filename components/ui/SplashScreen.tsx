'use client';

import { useEffect, useState } from 'react';
import { KinetixLogo } from '@/components/ui/KinetixLogo';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + 4;
      });
    }, 80); // ~2s to reach 100%

    const timer1 = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }, 2200);

    const timer2 = setTimeout(() => {
      setShouldRender(false);
    }, 2900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(progressInterval);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] transition-opacity duration-700 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.25) 0%, transparent 70%),
          linear-gradient(to right, rgba(148,163,184,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.03) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 48px 48px, 48px 48px',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Ambient glow behind logo */}
        <div
          className="absolute"
          style={{
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
            transform: 'translateY(-20px)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 mb-6" style={{ animation: 'splashLogoIn 0.6s ease-out forwards' }}>
          <KinetixLogo size={80} animated />
        </div>

        {/* Brand Name */}
        <h1
          className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2"
          style={{ animation: 'splashTextIn 0.6s 0.15s ease-out both' }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #8b5cf6, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Kinetix
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="text-sm tracking-widest uppercase font-medium"
          style={{
            color: '#475569',
            animation: 'splashTextIn 0.6s 0.3s ease-out both',
          }}
        >
          Web to Native.{' '}
          <span style={{ color: '#8b5cf6' }}>Instantly.</span>
        </p>

        {/* Progress track */}
        <div
          className="mt-10 overflow-hidden rounded-full"
          style={{
            width: '120px',
            height: '2px',
            background: 'rgba(148,163,184,0.1)',
            animation: 'splashTextIn 0.4s 0.4s ease-out both',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
              borderRadius: '99px',
              transition: 'width 80ms linear',
            }}
          />
        </div>
      </div>

      {/* Copyright */}
      <p
        className="absolute bottom-8 text-xs"
        style={{
          color: '#1e293b',
          animation: 'splashTextIn 0.4s 0.5s ease-out both',
        }}
      >
        by SKAV TECH
      </p>

      <style>{`
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.7) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splashTextIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
