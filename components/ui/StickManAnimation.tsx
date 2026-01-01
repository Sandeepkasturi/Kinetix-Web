'use client';

import { useState, useEffect } from 'react';
import styles from './StickMan.module.css';

const MOVIE_SUBTITLES = [
    { time: 0, text: "Initializing Build Engine..." },
    { time: 2000, text: "Detecting Legacy Code..." },
    { time: 3000, text: "SLASHING BUGS! ⚔️" },
    { time: 5000, text: "Optimizing Performance..." },
    { time: 6000, text: "KICKING LATENCY! 🦶" },
    { time: 8000, text: "Injecting Native Superpowers... ⚡" },
    { time: 10000, text: "COMPILE COMPLETE! 🛡️" }
];

export function StickManAnimation() {
    const [subtitle, setSubtitle] = useState(MOVIE_SUBTITLES[0].text);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            // Very simple sync based on expected loop time (12s)
            // Ideally we'd calculate this based on StartTime but for a loop simpler is better
            const timeInLoop = (Date.now() % 12000); // 12000ms loop

            // Find closest subtitle that has passed
            const currentSub = MOVIE_SUBTITLES.reduce((prev, curr) => {
                return (curr.time <= timeInLoop) ? curr : prev;
            });

            setSubtitle(currentSub.text);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.stage}>
            {/* Background Binary Rain (Simplified) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.particle}
                        style={{
                            left: `${i * 10}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        {Math.random() > 0.5 ? '1' : '0'}
                    </div>
                ))}
            </div>

            {/* Subtitles Area */}
            <div className="absolute top-4 left-0 right-0 text-center z-50">
                <span className="inline-block px-4 py-1 bg-black/50 backdrop-blur-sm rounded-full text-cyan-400 font-mono text-sm tracking-wider border border-cyan-500/30">
                    {subtitle}
                </span>
            </div>

            {/* Victory Shield */}
            <div className={styles.shield} />

            {/* HERO STICKMAN */}
            <div className={`${styles.character} ${styles.hero}`}>
                <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible">
                    {/* Head */}
                    <circle cx="50" cy="20" r="12" fill="#06b6d4" filter="drop-shadow(0 0 4px #06b6d4)" />
                    {/* Body */}
                    <line x1="50" y1="32" x2="50" y2="80" stroke="#8b5cf6" strokeWidth="4" />
                    {/* Arms (Animated via CSS classes on parent ideally, but simple for now) */}
                    <line x1="50" y1="40" x2="20" y2="60" stroke="#8b5cf6" strokeWidth="4" />
                    <line x1="50" y1="40" x2="80" y2="60" stroke="#8b5cf6" strokeWidth="4" />
                    {/* Legs */}
                    <line x1="50" y1="80" x2="20" y2="120" stroke="#8b5cf6" strokeWidth="4" />
                    <line x1="50" y1="80" x2="80" y2="120" stroke="#8b5cf6" strokeWidth="4" />

                    {/* Sword */}
                    <line x1="80" y1="60" x2="100" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <line x1="75" y1="55" x2="85" y2="65" stroke="#ffffff" strokeWidth="2" /> {/* Hilt */}
                </svg>
            </div>

            {/* BUG 1 */}
            <div className={`${styles.character} ${styles.bug} ${styles.bug1}`}>
                <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible">
                    <circle cx="50" cy="30" r="15" fill="#ef4444" />
                    <line x1="50" y1="45" x2="50" y2="90" stroke="#ef4444" strokeWidth="4" />
                    <line x1="50" y1="50" x2="20" y2="70" stroke="#ef4444" strokeWidth="4" />
                    <line x1="50" y1="50" x2="80" y2="70" stroke="#ef4444" strokeWidth="4" />
                    {/* Bug Eyes */}
                    <circle cx="45" cy="28" r="3" fill="#000" />
                    <circle cx="55" cy="28" r="3" fill="#000" />
                </svg>
            </div>

            {/* BUG 2 */}
            <div className={`${styles.character} ${styles.bug} ${styles.bug2}`}>
                <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible">
                    <circle cx="50" cy="30" r="15" fill="#ef4444" />
                    <line x1="50" y1="45" x2="50" y2="90" stroke="#ef4444" strokeWidth="4" />
                    <line x1="50" y1="50" x2="20" y2="70" stroke="#ef4444" strokeWidth="4" />
                    <line x1="50" y1="50" x2="80" y2="70" stroke="#ef4444" strokeWidth="4" />
                    {/* Bug Eyes */}
                    <circle cx="45" cy="28" r="3" fill="#000" />
                    <circle cx="55" cy="28" r="3" fill="#000" />
                </svg>
            </div>

            {/* Floor */}
            <div className={styles.floor} />
        </div>
    );
}
