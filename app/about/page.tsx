import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, Brain, Cpu, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-white mb-6">
                        About SKAV TECH
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        Delivering innovative software development and AI integration to empower digital transformation.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6">
                            <Brain className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Founded in 2022 by Sandeep Kasturi, SKAV TECH is dedicated to bridging the gap between complex technology and everyday business needs. We specialize in Android development, Machine Learning, and Generative AI solutions.
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Our Innovations</h3>
                        <p className="text-slate-400 leading-relaxed">
                            From **StudentAI** for personalized learning to **MedClauseX** for medical research, and advanced **Blood Cancer Detection** systems, we push the boundaries of what's possible with AI.
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-white mb-8">Meet the Founder</h2>
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 inline-block text-left">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-400">SK</div>
                            <div>
                                <h4 className="text-lg font-bold text-white">Sandeep Kasturi</h4>
                                <span className="text-indigo-400 text-sm">Lead Engineer & Founder</span>
                            </div>
                        </div>
                        <p className="text-slate-400">
                            Sandeep is an expert software developer with deep expertise in modern tech stacks, AI solutions, and product engineering.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
