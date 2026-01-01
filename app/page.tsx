import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AppGeneratorForm } from '@/components/home/AppGeneratorForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background - Midnight Glass Gradients */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-40 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6 border border-purple-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Kinetix Engine Live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-xl">
              Turn Your Website into a <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Native Android App</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Small business owners struggle with the high costs of native app development. <span className="text-slate-200 font-medium">Kinetix</span> bridges that gap effortlessly.
            </p>
          </div>

          <div id="generate" className="scroll-mt-24">
            <AppGeneratorForm />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
