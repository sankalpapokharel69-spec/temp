import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Code2, 
  Star, 
  Quote, 
  Utensils, 
  Hotel, 
  Sparkles as SalonIcon, 
  Armchair, 
  Building2, 
  Dumbbell, 
  Camera, 
  Briefcase, 
  TrendingUp,
  Download,
  Layers
} from 'lucide-react';
import { Template } from '../types';
import { StorageService } from '../utils/storage';
import { TemplateCard } from '../components/TemplateCard';

interface HomePageProps {
  navigate: (route: string) => void;
  onPreview: (template: Template) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  restaurant: <Utensils className="w-5 h-5" />,
  hotel: <Hotel className="w-5 h-5" />,
  salon: <SalonIcon className="w-5 h-5" />,
  furniture: <Armchair className="w-5 h-5" />,
  realestate: <Building2 className="w-5 h-5" />,
  gym: <Dumbbell className="w-5 h-5" />,
  photography: <Camera className="w-5 h-5" />,
  portfolio: <Briefcase className="w-5 h-5" />,
  business: <TrendingUp className="w-5 h-5" />,
};

export const HomePage: React.FC<HomePageProps> = ({ navigate, onPreview }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const templates = StorageService.getTemplates();
  const categories = StorageService.getCategories();

  const featuredTemplates = templates.filter(t => t.isFeatured).slice(0, 6);
  if (featuredTemplates.length < 3) {
    featuredTemplates.push(...templates.slice(0, 3));
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`#/templates?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('#/templates');
    }
  };

  const totalSalesCount = templates.reduce((sum, t) => sum + (t.salesCount || 0), 1200);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-amber-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Over {templates.length * 15}+ handcrafted layouts ready for deployment</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Poppins'] max-w-4xl mx-auto leading-[1.15]">
            World-class website templates. Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500">zero bloated code.</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The marketplace for production-grade HTML5, CSS3, and vanilla JS website templates. Designed for high conversion, instant downloads, and 100% Lighthouse performance.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 max-w-2xl mx-auto relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant, hotel, real estate, gym, portfolio..."
              className="w-full px-3 py-2 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
            >
              Search Templates
            </button>
          </form>

          {/* Popular Search Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Trending:</span>
            {['Restaurant', 'Real Estate', 'Boutique Hotel', 'Gym & Fitness', 'Portfolio'].map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`#/templates?q=${encodeURIComponent(tag)}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Key Metrics Row */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
                {totalSalesCount}+
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Template Licenses Sold</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-['Poppins']">
                100 / 100
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Lighthouse Speed Score</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-['Poppins']">
                4.95 / 5.0
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Average Customer Rating</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-['Poppins']">
                Instant
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Full Source ZIP Delivery</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORIES BROWSE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Poppins'] mt-1">
              Explore by Industry & Niche
            </h2>
          </div>
          <button
            onClick={() => navigate('#/templates')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition"
          >
            <span>View all 9 categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map(cat => {
            const count = templates.filter(t => t.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`#/templates?category=${cat.id}`)}
                className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors">
                  {CATEGORY_ICONS[cat.id] || <Layers className="w-5 h-5" />}
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {count > 0 ? `${count} premium template${count > 1 ? 's' : ''}` : 'Fresh templates coming'}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED TEMPLATES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked by Designers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Poppins'] mt-1">
              Featured Website Templates
            </h2>
          </div>
          <button
            onClick={() => navigate('#/templates')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={onPreview}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE WEBCRAFT STUDIO */}
      <section className="bg-slate-50 dark:bg-slate-900/60 py-16 sm:py-24 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Engineering Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-['Poppins'] mt-2">
              Why Engineers & Agencies Choose Us Over Bloated Themes
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Most themes are bogged down with 50 unnecessary plugins and slow page weights. We craft pure, lightweight, responsive templates you can deploy immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
                Zero Framework Lock-in
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Built with semantic HTML5, pure CSS variables, and vanilla JavaScript. Edit easily in any code editor (VS Code, Cursor, Sublime) without complex build configs.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Works on GitHub Pages & Render</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
                Blazing Fast Sub-1-Second Speeds
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Optimized asset pipelines, lazy loading, and minimal bundle footprints guarantee scores of 95–100 on Google Core Web Vitals, elevating your organic SEO ranking.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Green Core Web Vitals Certified</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
                Commercial Royalty-Free License
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Every purchase includes unlimited commercial deployment rights. Build websites for your clients, monetize them, or launch software landing pages with full confidence.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Unlimited Client Deployments</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Client Success
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-['Poppins'] mt-1">
            Loved by Developers, Agencies & Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative flex flex-col justify-between">
            <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-900/60 mb-2" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "We bought Gourmet Haven for a fine dining client in downtown Austin. The CSS was so clean that we customized their brand typography and menu items in just two hours. Delivered a $4,500 project the same weekend!"
            </p>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Marcus Vance"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Marcus Vance</h4>
                <p className="text-[11px] text-slate-400">Founder, Vance Digital Agency</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative flex flex-col justify-between">
            <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-900/60 mb-2" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "Finally, a template store that doesn’t force a bloated 20MB node_modules folder or 40 jQuery plugins on you. Pure HTML5 and vanilla JavaScript that loads instantly. Skyline Realty is simply brilliant."
            </p>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Elena Rostova"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Elena Rostova</h4>
                <p className="text-[11px] text-slate-400">Senior Frontend Architect</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative flex flex-col justify-between">
            <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-900/60 mb-2" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "The eSewa and QR bank payment workflow was completely hassle-free. Uploaded our receipt screenshot, admin verified it quickly, and downloaded the complete ZIP archive right from My Account."
            </p>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Prakash Thapa"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Prakash Thapa</h4>
                <p className="text-[11px] text-slate-400">Tech Entrepreneur, Kathmandu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
              Special Launch Offer: Save 10%
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] leading-tight">
              Ready to launch your next project with pristine code?
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Use promo coupon <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-amber-300">WEBCRAFT10</span> at checkout to get an instant 10% discount on any template today.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('#/templates')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition shadow-lg"
              >
                <span>Browse All Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('#/support')}
                className="px-6 py-3 rounded-2xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm border border-indigo-500/40 transition"
              >
                Read Licensing FAQ
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
