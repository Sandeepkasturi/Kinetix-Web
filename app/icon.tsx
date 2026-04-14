import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                {/* New advanced SVG Logo */}
                <svg
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                        <linearGradient id="kg3" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>

                    <circle cx="50" cy="50" r="47" stroke="url(#kg3)" strokeWidth="1.5" fill="none" opacity="0.7" />
                    <circle cx="50" cy="50" r="43" stroke="url(#kg1)" strokeWidth="0.5" fill="none" opacity="0.4" strokeDasharray="4 8" />

                    <path
                        d="M50 8L87 28V72L50 92L13 72V28L50 8Z"
                        fill="url(#kg1)"
                        fillOpacity="0.08"
                        stroke="url(#kg1)"
                        strokeWidth="1"
                    />

                    <rect x="25" y="22" width="10" height="56" rx="3" fill="url(#kg1)" />

                    <path
                        d="M35 50L63 22H76L48 50"
                        stroke="url(#kg2)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />

                    <path
                        d="M35 50L63 78H76L48 50"
                        stroke="url(#kg2)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />

                    <circle cx="50" cy="50" r="4" fill="#22d3ee" opacity="0.9" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}
