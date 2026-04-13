import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Users, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />

      <section className="pt-40 pb-24 relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <div className="feature-pill mb-6">Our Mission</div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tight">Bridging the gap between <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent italic">Web & Native.</span></h1>
          <p className="text-xl text-[#94a3b8] leading-relaxed mb-16">
            We believe that the web is the most powerful platform ever created. Our mission is to give web developers
            the tools they need to reach their users where they spend most of their time: on mobile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="glass-card p-10">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Uncompromising Security</h3>
              <p className="text-[#94a3b8] leading-relaxed">
                Security isn't a feature; it's our foundation. Every build is sandboxed, every certificate 
                is encrypted, and our infrastructure is monitored 24/7 to ensure your users' trust.
              </p>
            </div>
            <div className="glass-card p-10">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8">
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Community Driven</h3>
              <p className="text-[#94a3b8] leading-relaxed">
                Kinetix was born out of a frustration with complex native toolchains. We listen to 
                our developers every day to build the platform they've always wanted.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#050b21] border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-black text-white mb-6">Born for the <br/>Modern Open Web.</h2>
              <p className="text-lg text-[#94a3b8] mb-8 leading-relaxed">
                Whether you're building with React, Vue, Next.js or plain HTML, Kinetix treats your web app 
                like the first-class citizen it deserves to be. We don't just wrap URLs; we optimize the 
                rendering bridge for smooth 60fps native performance.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-black text-white mb-1">100k+</div>
                  <p className="text-sm text-[#475569] font-bold">Apps Generated</p>
                </div>
                <div>
                  <div className="text-3xl font-black text-white mb-1">4.9/5</div>
                  <p className="text-sm text-[#475569] font-bold">User Rating</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="glass-card p-4 aspect-square flex items-center justify-center relative bg-slate-900/50">
                    <Sparkles className="w-32 h-32 text-white/5 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-8xl font-black text-white/10 select-none">KX</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
