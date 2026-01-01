import Link from 'next/link';
import { Github, Linkedin, Heart } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Logo className="w-8 h-8" />
                            <h3 className="text-xl font-bold text-slate-100">Kinetix</h3>
                        </div>
                        <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                            Empowering small businesses and creators to own their mobile presence. Turn any website into a high-performance Android application in minutes.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/sandeepkasturi"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-slate-900 rounded-full hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-400 transition-all"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.in/sandeepkasturi9"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-slate-900 rounded-full hover:bg-indigo-500/20 hover:text-indigo-400 text-slate-400 transition-all"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-100 mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                            <li><Link href="/developer" className="hover:text-indigo-400 transition-colors">API</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-100 mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><span className="cursor-not-allowed opacity-50">Privacy Policy</span></li>
                            <li><span className="cursor-not-allowed opacity-50">Terms of Service</span></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <span>A project by</span>
                        <a href="https://skavtechs.vercel.app" target="_blank" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">SKAV TECH</a>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Developed with</span>
                        <Heart className="w-3 h-3 text-red-500 fill-current" />
                        <span>by Sandeep Kasturi</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
