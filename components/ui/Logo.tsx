'use client';

export function Logo({ className = "w-8 h-8", animated = true }: { className?: string; animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 3D Glass Glow Filter */}
        <filter id="glass-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#8b5cf6" floodOpacity="0.5" />
        </filter>

        {/* Main Gradient Surface */}
        <linearGradient id="glass-surface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" /> {/* Lighter Purple */}
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" /> {/* Main Purple */}
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" /> {/* Cyan */}
        </linearGradient>

        {/* Side/Depth Gradient */}
        <linearGradient id="glass-depth" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4c1d95" /> {/* Dark Violet */}
          <stop offset="100%" stopColor="#0e7490" /> {/* Dark Cyan */}
        </linearGradient>

        {/* Rim Light Gradient */}
        <linearGradient id="rim-light" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Back Layer (Depth/Shadow) - Offset slightly for 3D effect */}
      <path
        d="M28 18 V88 M28 53 L78 18 M28 53 L78 88"
        stroke="url(#glass-depth)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2, 2)"
        className="opacity-80"
      />

      {/* Main Glass Layer */}
      <path
        d="M25 15 V85 M25 50 L75 15 M25 50 L75 85"
        stroke="url(#glass-surface)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glass-glow)"
        className="drop-shadow-xl"
      />

      {/* Rim Highlight (The "Edge" of the glass) */}
      <path
        d="M25 15 V85 M25 50 L75 15 M25 50 L75 85"
        stroke="url(#rim-light)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="opacity-90 mix-blend-overlay"
      />

      {/* Internal Bolt (Energy Source) */}
      <path
        d="M45 10 L35 45 L55 45 L40 90"
        fill="#e879f9"
        filter="drop-shadow(0 0 5px #d946ef)"
        className={animated ? "animate-pulse-fast" : ""}
        style={{
          opacity: 0.9,
          mixBlendMode: "screen"
        }}
      />

      <style jsx>{`
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 5px #d946ef); }
          50% { opacity: 1; filter: drop-shadow(0 0 12px #f0abfc); }
        }
        .animate-pulse-fast {
          animation: pulse-fast 2s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
}
