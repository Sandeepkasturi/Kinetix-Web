'use client';

import React from 'react';

interface KinetixLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  animated?: boolean;
}

export function KinetixLogo({ size = 40, className = '', showText = false, animated = true }: KinetixLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Icon Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'kinetix-logo-spin' : ''}
      >
        <defs>
          <linearGradient id="kg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="kg2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="kglow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="kg3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Outer glow ring */}
        <circle cx="50" cy="50" r="47" stroke="url(#kg3)" strokeWidth="1.5" fill="none" opacity="0.7" />
        <circle cx="50" cy="50" r="43" stroke="url(#kg1)" strokeWidth="0.5" fill="none" opacity="0.4" strokeDasharray="4 8" />

        {/* Background hex */}
        <path
          d="M50 8L87 28V72L50 92L13 72V28L50 8Z"
          fill="url(#kg1)"
          fillOpacity="0.08"
          stroke="url(#kg1)"
          strokeWidth="1"
          filter="url(#kglow)"
        />

        {/* K letter - left vertical bar */}
        <rect x="25" y="22" width="10" height="56" rx="3" fill="url(#kg1)" filter="url(#kglow)" />

        {/* K letter - upper diagonal arm */}
        <path
          d="M35 50L63 22H76L48 50"
          stroke="url(#kg2)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#kglow)"
        />

        {/* K letter - lower diagonal arm */}
        <path
          d="M35 50L63 78H76L48 50"
          stroke="url(#kg2)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#kglow)"
        />

        {/* Center accent dot */}
        <circle cx="50" cy="50" r="4" fill="#22d3ee" filter="url(#kglow)" opacity="0.9" />
      </svg>

      {showText && (
        <span className="font-black text-white tracking-tight" style={{ fontSize: size * 0.55 }}>
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Kinetix
          </span>
        </span>
      )}
    </div>
  );
}

/* Inline logo icon only (no text) */
export function KinetixIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return <KinetixLogo size={size} className={className} showText={false} animated={false} />;
}
