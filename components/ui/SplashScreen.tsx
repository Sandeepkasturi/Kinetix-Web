'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';

export function SplashScreen() {
    // Start visible, then fade out
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Prevent scrolling while splash is active
        document.body.style.overflow = 'hidden';

        const timer1 = setTimeout(() => {
            setIsVisible(false); // Start fade out
            document.body.style.overflow = 'unset'; // Restore scrolling
        }, 2500);

        const timer2 = setTimeout(() => {
            setShouldRender(false); // Unmount
        }, 3000); // 2.5s + 0.5s transition

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="relative flex flex-col items-center">
                {/* Logo with Glow */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                    <Logo className="w-24 h-24 md:w-32 md:h-32 relative z-10" />
                </div>

                {/* Brand Name */}
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 animate-fade-in-up">
                    Kinetix
                </h1>

                {/* Tagline */}
                <p className="text-slate-400 text-sm md:text-lg tracking-wide uppercase font-medium animate-fade-in-up delay-100">
                    Web to Native. <span className="text-purple-400">Instantly.</span>
                </p>

                {/* Loading Bar (Decorative) */}
                <div className="w-32 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 w-1/2 animate-[shimmer_1s_infinite_linear]" />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                    transform: translateY(10px);
                }
                .delay-100 {
                    animation-delay: 0.1s;
                }
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
