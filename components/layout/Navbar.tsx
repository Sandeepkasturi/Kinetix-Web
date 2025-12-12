import Link from 'next/link';
import { Smartphone, Github, Linkedin } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-indigo-500/10 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                        <Smartphone className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-100">NativeBridge</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <Link href="/about" className="hover:text-indigo-400 transition-colors">About</Link>
                    <Link href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link>
                    <Link href="/developer" className="hover:text-indigo-400 transition-colors">Developers</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com/sandeepkasturi"
                        target="_blank"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <Github className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/#generate"
                        className="hidden sm:flex bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-900/20"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
