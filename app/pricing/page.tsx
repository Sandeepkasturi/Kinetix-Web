import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Construction } from 'lucide-react';

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
            <Navbar />

            <div className="min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-20 container mx-auto px-4 text-center">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <Construction className="w-10 h-10 text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Pricing Plans</h1>
                <p className="text-xl text-slate-400 mb-8">
                    Flexible options for every creator.
                </p>
                <div className="inline-block bg-slate-900 border border-slate-800 px-6 py-3 rounded-full text-indigo-400 font-medium">
                    Coming Soon
                </div>
            </div>

            <Footer />
        </main>
    );
}
