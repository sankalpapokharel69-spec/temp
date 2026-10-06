import React from 'react';
import { Layers, ShieldCheck, Zap, Code2, Users, Award, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
          Our Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-['Poppins'] leading-tight">
          Handcrafted website templates built with pure code & zero bloat.
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          WebCraft Studio was founded on a simple conviction: modern websites don't need megabytes of cumbersome dependencies, complicated build scripts, or slow page loads. They need pristine markup, responsive CSS, and effortless customization.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
            Pure Vanilla Architecture
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every template is written in semantic HTML5, pure CSS custom properties, and modular vanilla JavaScript. You can open any file in your browser immediately without installing a single package.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
            Designed for 99+ Speed Scores
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We ruthlessly optimize performance. Fast-loading websites convert better, rank higher on Google Core Web Vitals, and deliver delight to your end users.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
            Commercial Freedom
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Freelancers and design studios use our templates to launch high-ticket client projects every month. We grant perpetual commercial licensing rights with no renewal fees.
          </p>
        </div>
      </div>

      {/* Story & Tech Standards */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Engineered For Developers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Poppins']">
            Compatibility with GitHub Pages, Cloudflare & Render
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Because our templates avoid server-side dependencies and complex routers, they are 100% compatible with static hosting providers like GitHub Pages, Cloudflare Pages, Vercel, Netlify, and Render. Push to your Git repository, and your live site is up in under 30 seconds.
          </p>
          <div className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero build tool requirement: pure HTML, CSS, JS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Includes complete documentation and source files</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Instant download access with automatic verification</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">WebCraft Studio Stats</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Live Metrics</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">100%</p>
              <p className="text-[11px] text-slate-400">Mobile Responsive</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <p className="text-2xl font-bold text-amber-500 font-mono">9</p>
              <p className="text-[11px] text-slate-400">Curated Categories</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <p className="text-2xl font-bold text-emerald-500 font-mono">&lt; 1s</p>
              <p className="text-[11px] text-slate-400">Average Load Time</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <p className="text-2xl font-bold text-purple-500 font-mono">24/7</p>
              <p className="text-[11px] text-slate-400">Helpdesk Support</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
