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
                {/* Simplified Logo SVG for Icon size */}
                <svg
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M25 15 V85 M25 50 L75 15 M25 50 L75 85"
                        stroke="#8b5cf6"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M45 10 L35 45 L55 45 L40 90"
                        fill="#06b6d4"
                    />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}
