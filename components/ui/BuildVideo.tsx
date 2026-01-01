'use client';

import { useState, useEffect } from 'react';

const MOVIE_SUBTITLES = [
    { time: 0, text: "Initializing Build Engine..." },
    { time: 2000, text: "Compiling Native Assets..." },
    { time: 4000, text: "Optimizing Performance..." },
    { time: 6000, text: "Injecting Superpowers..." },
    { time: 8000, text: "Finalizing APK..." }
];

export function BuildVideo() {
    const [subtitle, setSubtitle] = useState(MOVIE_SUBTITLES[0].text);

    useEffect(() => {
        const interval = setInterval(() => {
            const timeInLoop = (Date.now() % 10000); // 10s loop roughly matching video?
            const currentSub = MOVIE_SUBTITLES.reduce((prev, curr) => {
                return (curr.time <= timeInLoop) ? curr : prev;
            });
            setSubtitle(currentSub.text);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[300px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
            {/* Video Player */}
            <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/animation.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Cinematic Overlay (Vignette) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            {/* Subtitles Overlay */}
            <div className="absolute bottom-6 left-0 right-0 text-center z-20">
                <span className="inline-block px-6 py-2 bg-black/70 backdrop-blur-md rounded-full text-cyan-400 font-mono text-sm tracking-widest uppercase border border-cyan-500/30 animate-pulse">
                    {subtitle}
                </span>
            </div>
        </div>
    );
}
