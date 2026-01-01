'use client';

import { useState, useEffect } from 'react';
import styles from './BuildAnimation.module.css';

const SUBTITLES = [
    "Awesome apps take good amount of time...",
    "Compiling your vision into reality...",
    "Injecting native superpowers...",
    "Optimizing performance molecules...",
    "Almost there, stay tuned...",
    "Warming up the engines...",
    "Connecting to the multiverse..."
];

export function BuildAnimation() {
    const [subtitleIndex, setSubtitleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
        }, 3000); // Change subtitles every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-64 bg-slate-950 overflow-hidden rounded-xl border border-purple-500/20 shadow-inner flex flex-col items-center justify-center group">

            {/* Background Animation Layers */}
            <div className={styles.clouds}>
                <div className={`${styles.cloud} ${styles.cloud1}`}></div>
                <div className={`${styles.cloud} ${styles.cloud2}`}></div>
                <div className={`${styles.cloud} ${styles.cloud3}`}></div>
                <div className={`${styles.cloud} ${styles.cloud4}`}></div>
                <div className={`${styles.cloud} ${styles.cloud5}`}></div>
            </div>

            <div className={styles.longfazers}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Speeder Loader */}
            <div className={styles.loader}>
                <span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                <div className={styles.base}>
                    <span></span>
                    <div className={styles.face}></div>
                </div>
            </div>

            {/* Subtitles */}
            <div className="absolute bottom-8 left-0 right-0 text-center z-30 px-4">
                <p
                    key={subtitleIndex}
                    className="text-purple-300 font-medium text-lg animate-in slide-in-from-bottom-2 fade-in duration-500"
                >
                    {SUBTITLES[subtitleIndex]}
                </p>
            </div>
        </div>
    );
}
