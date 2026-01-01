'use client';

import { useState, useEffect } from 'react';
import { Smartphone, RotateCcw, Wifi, Battery } from 'lucide-react';

interface MobileEmulatorProps {
    url: string;
}

export function MobileEmulator({ url }: MobileEmulatorProps) {
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Debounce the URL update to avoid reloading iframe on every keystroke
    useEffect(() => {
        if (!url) {
            setIframeUrl(null);
            return;
        }

        // Validate URL lightly
        if (!url.startsWith('http')) {
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            setIframeUrl(url);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [url]);

    return (
        <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl flex flex-col overflow-hidden">
            {/* Notch / Status Bar */}
            <div className="h-[32px] w-full bg-slate-950 absolute top-0 left-0 right-0 z-20 rounded-t-[2rem]">
                <div className="absolute top-0 w-full h-full flex items-center justify-between px-6">
                    <span className="text-[10px] text-white font-medium">9:41</span>
                    <div className="h-4 w-20 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0" />
                    <div className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-white" />
                        <Battery className="w-3 h-3 text-white" />
                    </div>
                </div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 bg-white relative mt-[32px] rounded-b-[2rem] overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-slate-100 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                )}

                {!iframeUrl ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                        <Smartphone className="w-12 h-12 mb-4 text-slate-300" />
                        <p className="text-sm">Enter a URL to see a live preview</p>
                    </div>
                ) : (
                    <iframe
                        src={iframeUrl}
                        className="w-full h-full border-0"
                        title="App Preview"
                        sandbox="allow-scripts allow-same-origin"
                    // Note: Many sites will still block this due to X-Frame-Options
                    />
                )}

                {/* Overlay Hint if iframe is likely blocked (Not easily detectable in client-side JS without proxy, displaying generic hint) */}
                {iframeUrl && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur text-white text-[10px] p-2 rounded text-center pointer-events-none">
                        If not loading, site may block previews.
                    </div>
                )}
            </div>

            {/* Home Indicator */}
            <div className="h-[5px] w-[100px] bg-slate-800 rounded-full absolute bottom-2 left-1/2 -translate-x-1/2 z-20" />

            {/* Side Buttons (Visual only, CSS borders/shadows usually handle this but we use absolute divs) */}
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -right-[17px] top-[140px] rounded-r-md" />
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[100px] rounded-l-md" />
        </div>
    );
}
