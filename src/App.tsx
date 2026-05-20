/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  MapPin, 
  Briefcase, 
  Users, 
  Award, 
  Star, 
  ChevronRight, 
  Phone, 
  Mail, 
  Linkedin, 
  Twitter, 
  Facebook,
  Menu,
  X,
  Building2,
  Tv,
  Flame,
  Zap,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { initialNewsData, NewsItem } from './data/news';
import { PasscodeModal } from './components/PasscodeModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { GenericFormModal } from './components/FormsModal';
import { ArticleModal } from './components/ArticleModal';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

// --- Components ---

const Navbar = ({ 
  user, 
  onAdminClick, 
  onLoginClick,
  onLogoutClick 
}: { 
  user: User | null;
  onAdminClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'News', href: '#news' },
    { name: 'GDIR', href: '#gdir' },
    { name: 'Initiatives', href: '#initiatives' },
    { name: 'Partners', href: '#partners' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-brand-navy border-b-4 border-brand-emerald py-3 text-white' : 'bg-transparent py-5 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded shadow-sm">
            <img src="/logo.jpg" alt="News Nigeria USA Logo" className="w-10 h-10 object-contain rounded-sm" />
          </div>
          <div>
            <h1 className="text-sm md:text-lg font-bold tracking-tight uppercase leading-none">
              News Nigeria USA
            </h1>
            <p className="text-[8px] md:text-[10px] text-brand-emerald font-bold tracking-[0.2em] uppercase mt-0.5">
              International LLC
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-xs font-bold uppercase tracking-widest transition-colors hover:text-brand-emerald"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onAdminClick}
            className="text-xs font-bold uppercase tracking-widest transition-colors hover:text-brand-emerald"
          >
            Admin Access
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold font-mono text-brand-emerald">{user.email}</span>
              <button 
                onClick={onLogoutClick}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded font-bold uppercase tracking-widest text-[11px] transition-all border border-white/20"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="bg-brand-emerald hover:bg-emerald-600 text-white px-5 py-2 rounded font-bold uppercase tracking-widest text-[11px] transition-all shadow-lg"
            >
              Login / Subscribe
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button 
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className={isScrolled ? 'text-zinc-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-zinc-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t p-6 shadow-xl lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-zinc-800 font-medium py-2 border-b border-zinc-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => { onAdminClick(); setMobileMenuOpen(false); }}
                  className="w-full text-left text-brand-navy font-bold py-2 border-b border-zinc-100 flex items-center gap-2 uppercase tracking-widest text-xs hover:text-brand-emerald transition-colors"
                >
                  Admin Access
                </button>
              </div>
              {user ? (
                <button 
                  onClick={() => { onLogoutClick(); setMobileMenuOpen(false); }}
                  className="bg-zinc-100 text-brand-navy py-3 rounded-lg font-semibold mt-2 uppercase tracking-widest text-xs"
                >
                  Sign Out ({user.email})
                </button>
              ) : (
                <button 
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="bg-brand-emerald text-white py-3 rounded-lg font-semibold mt-2 uppercase tracking-widest text-xs"
                >
                  Login / Subscribe
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ 
  newsData, 
  onEngagementClick, 
  onReadStory,
  onPartnerClick 
}: { 
  newsData: NewsItem[]; 
  onEngagementClick: () => void;
  onReadStory: (item: NewsItem) => void;
  onPartnerClick: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Take top 5 news items for carousel, or fallback to an array of 1 item using a default image if empty
  const carouselItems = newsData && newsData.length > 0 
    ? newsData.slice(0, 5) 
    : [];

  useEffect(() => {
    if (carouselItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <section className="relative min-h-screen pt-32 pb-12 md:pb-20 flex flex-col overflow-hidden bg-black">
      {/* Background Slideshow */}
      <AnimatePresence mode="popLayout">
        {carouselItems.length > 0 ? (
          <motion.div
            key={carouselItems[currentIndex]?.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={carouselItems[currentIndex]?.image} 
              alt={carouselItems[currentIndex]?.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 backdrop-blur-[1px]"></div>
          </motion.div>
        ) : (
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=2000" 
              alt="International bridge" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center mb-12">
        <AnimatePresence mode="wait">
          {carouselItems.length > 0 ? (
            <motion.div
              key={carouselItems[currentIndex]?.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="bg-brand-emerald text-white px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Top Story</span>
                <span className="bg-white/20 text-white px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm border border-white/10">{carouselItems[currentIndex]?.category}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-6 drop-shadow-lg">
                {carouselItems[currentIndex]?.title}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 font-serif mb-10 leading-relaxed max-w-2xl line-clamp-3">
                {carouselItems[currentIndex]?.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onReadStory(carouselItems[currentIndex])}
                  className="px-8 py-4 bg-brand-emerald text-white rounded font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group"
                >
                  Read Full Story
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('news');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  Browse All News
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-brand-emerald/10 border border-brand-emerald/30 rounded text-brand-emerald mb-6">
                <span className="text-[10px] font-bold tracking-widest uppercase">Global Policy Linkage</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1] mb-6">
                CONNECTING <span className="text-brand-emerald">NIGERIANS</span> <br />
                <span className="italic font-light">GLOBALLY.</span>
              </h1>
              
              <p className="text-xl text-slate-300 font-serif mb-10 leading-relaxed max-w-2xl">
                A globally positioned media and engagement company committed to connecting the diaspora with news, institutional opportunities, and strategic partnerships.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onEngagementClick}
                  className="px-8 py-4 bg-brand-emerald text-white rounded font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group"
                >
                  Strategic Engagement
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onPartnerClick}
                  className="px-8 py-4 bg-white/5 text-white border border-white/20 backdrop-blur-md rounded font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                >
                  View Institutions
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Indicators */}
        {carouselItems.length > 1 && (
          <div className="absolute bottom-0 left-6 flex gap-2">
            {carouselItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-brand-emerald' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Diaspora Reach', value: '150k+' },
              { label: 'Strategic Partners', value: '25+' },
              { label: 'Nations Covered', value: '12' },
              { label: 'Programs Launched', value: '10' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-4 glass-morphism rounded-xl border-white/10"
              >
                <div className="text-2xl font-bold text-brand-emerald">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
    </section>
  );
};

const SectionHeading = ({ subtitle, title, description, light = false }: { subtitle: string, title: string, description?: string, light?: boolean }) => (
  <div className="mb-16">
    <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-1 rounded uppercase tracking-widest">{subtitle}</span>
    <h2 className={`text-3xl md:text-5xl font-serif font-bold leading-tight max-w-2xl mt-4 ${light ? 'text-white' : 'text-brand-navy'}`}>
      {title}
    </h2>
    {description && (
      <p className={`mt-6 text-lg max-w-3xl font-serif ${light ? 'text-slate-400' : 'text-slate-600'}`}>
        {description}
      </p>
    )}
  </div>
);

const NewsSection = ({ newsData, onReadStory }: { newsData: NewsItem[], onReadStory: (item: NewsItem) => void }) => {
  const categories = ['Nigeria News', 'USA News', 'Global African Diaspora News'];
  const subCategories = ['All', 'Politics', 'Business', 'Culture', 'Technology', 'Social Impact'];
  
  const [activeCategory, setActiveCategory] = useState('Nigeria News');
  const [activeSubCategory, setActiveSubCategory] = useState('All');

  const filteredNews = newsData.filter(news => 
    news.category === activeCategory && 
    (activeSubCategory === 'All' || news.subCategory === activeSubCategory)
  );

  const handleBrowseAll = () => {
    setActiveCategory('Nigeria News');
    setActiveSubCategory('All');
    window.scrollTo({
      top: document.getElementById('news')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  return (
    <section id="news" className="py-24 bg-zinc-50 border-y border-zinc-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          subtitle="News Feed"
          title="Bridging Information Across Borders"
          description="Stay updated with the latest developments directly affecting Nigerians at home and in the diaspora."
        />

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveSubCategory('All'); }}
              className={`px-6 py-2.5 rounded font-bold uppercase tracking-widest text-[10px] transition-all border ${
                activeCategory === cat 
                  ? 'bg-brand-navy text-white border-brand-navy shadow-md' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-brand-emerald hover:text-brand-emerald'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-categories Chips */}
        <div className="flex flex-wrap gap-2 mb-12">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                activeSubCategory === sub
                  ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30 shadow-sm'
                  : 'bg-transparent text-slate-400 border-slate-200 hover:text-slate-600 hover:border-slate-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((news) => (
              <motion.article
                key={news.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-slate-200 group overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-brand-emerald text-white text-[9px] font-bold uppercase tracking-widest">
                      {news.subCategory}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    {news.date}
                  </p>
                  <h3 className="text-xl font-serif font-bold text-brand-navy mb-4 leading-tight group-hover:text-brand-emerald transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-serif flex-1">
                    {news.excerpt}
                  </p>
                  <button 
                    onClick={() => onReadStory(news)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy hover:text-brand-emerald transition-colors"
                  >
                    Read Full Story <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded">
            <p className="text-slate-400 font-serif italic text-lg">No news found in this category at this time.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <button 
            onClick={handleBrowseAll}
            className="px-8 py-4 bg-brand-navy text-white rounded font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            Browse All Reports <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

const GDIRSection = ({ onEngagementClick }: { onEngagementClick: () => void }) => {
  const functions = [
    'Facilitate engagement with government institutions',
    'Build structured relationships with embassies',
    'Support diaspora policy dialogue',
    'Develop institutional partnerships',
    'Coordinate participation in summits',
    'Promote awareness of public-sector opportunities',
    'Media diplomacy and strategic support'
  ];

  return (
    <section id="gdir" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionHeading 
              subtitle="The Core Department"
              title="Government, Diplomatic & Institutional Relations (GDIR)"
              description="A strategic engagement arm dedicated to building and managing structured relationships with global stakeholders across Nigeria, the USA, and the wider African diaspora ecosystem."
            />
            
            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              <div className="p-6 bg-white border border-slate-200 shadow-sm">
                <div className="emerald-accent-line"></div>
                <h3 className="font-bold text-sm uppercase tracking-widest mb-3">Core Purpose</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Serving as a structured engagement bridge for policy dialogue, diaspora integration, and development partnerships.
                </p>
              </div>
              <div className="strategic-border bg-slate-100 p-6">
                <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Institutional Link</h3>
                <p className="text-sm italic font-serif text-brand-navy leading-relaxed">
                  Positioning News Nigeria USA International LLC as a credible platform for international cooperation.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="bg-brand-navy rounded-sm p-8 text-white shadow-2xl relative overflow-hidden border-b-8 border-brand-emerald">
              <h4 className="font-serif font-bold text-2xl mb-8 flex items-center gap-3">
                <Zap className="text-brand-emerald" />
                Strategic Areas
              </h4>

              <div className="space-y-4">
                {functions.map((func, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-3 rounded hover:bg-white/5 transition-colors group"
                  >
                    <div className="h-1 w-6 bg-brand-emerald mt-2.5 shrink-0"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">{func}</span>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={onEngagementClick}
                className="w-full mt-10 bg-brand-emerald text-white py-4 rounded-sm font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all"
              >
                Request Engagement
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InitiativesSection = () => {
  const mainInitiatives = [
    { title: 'MEDIA & ENGAGEMENT', items: ['NEWS NIGERIA BUSINESS TV', 'DIASPORA SPOTLIGHT SERIES', 'CULTURE & HERITAGE CAMPAIGNS'], icon: Tv },
    { title: 'SUMMITS & PLATFORMS', items: ['GOOD NEWS AFRICA SUMMITS', 'NEW NIGERIA LEADERSHIP FORUM', 'FABIA AWARDS'], icon: Globe },
    { title: 'YOUTH DEVELOPMENT', items: ['LEMONADE INITIATIVE', 'PROFESSIONAL EMPOWERMENT', 'SKILLS TRAINING'], icon: Users }
  ];

  return (
    <section id="initiatives" className="py-24 bg-zinc-950 text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          light
          subtitle="Programs"
          title="Strategic Initiatives for Global Good"
          description="We run multidimensional platforms delivering fact-based reporting, leadership development, and social transformation."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {mainInitiatives.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group p-8 bg-brand-navy border border-white/10 hover:border-brand-emerald transition-all shadow-xl"
            >
              <div className="emerald-accent-line"></div>
              <h3 className="font-serif font-bold text-xl mb-6 tracking-tight text-white">{cat.title}</h3>
              <ul className="space-y-4">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-400 group-hover:text-white transition-colors">
                    <span className="text-brand-emerald">●</span>
                    <span className="text-xs font-bold uppercase tracking-widest leading-normal">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => {
  const partners = [
    "Nigerian Diaspora Chamber of Commerce (DC USA)", "Timeswatch Magazine", "NEGV Institute", "Christian Benefits Magazine",
    "GLOZ Africa Multimedia", "International Faith-Based Council", "SESS Africa", "Ecclesia Health Foundation",
    "FAITHBRIDGE", "WASEM Foundation (UK)", "African Professional Women Network", "Jeho Films DC USA",
    "Ladybird Global Business Solutions", "Music Therapy Initiative", "African Heritage House", "Mothers of the Nations",
    "KOGA Faith USA", "Green Crystals Initiative"
  ];

  return (
    <section id="partners" className="py-24 bg-zinc-50 border-y border-zinc-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-1 rounded uppercase tracking-widest">Our Ecosystem</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mt-4 text-brand-navy">Strategic Partners Network</h2>
        </div>

        <div className="relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {partners.map((partner, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-4 bg-white border border-slate-200 flex items-center justify-center text-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all group"
              >
                <span className="text-[10px] font-black text-brand-navy uppercase leading-snug tracking-tighter">{partner}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = ({ onPartnerClick }: { onPartnerClick: () => void }) => {
  const benefits = [
    { title: 'Credible News', desc: 'Access to reliable diaspora-focused news and updates.', icon: Tv },
    { title: 'Visibility', desc: 'Promotion for businesses, entrepreneurs, and creatives.', icon: Star },
    { title: 'Trade & Investment', desc: 'Promoting economic opportunities across Africa.', icon: Briefcase },
    { title: 'Leadership', desc: 'Platforms for development and governance engagement.', icon: Award },
    { title: 'Culture & Heritage', desc: 'Promotion of Nigerian identity and African culture.', icon: Globe },
    { title: 'Trusted Partnerships', desc: 'A vetted platform for global collaboration.', icon: Users }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <SectionHeading 
              subtitle="Value Proposition"
              title="Why Engage with Us?"
              description="We provide more than just information; we build bridges for influence, opportunities, and social transformation."
            />
            <button 
              onClick={onPartnerClick}
              className="mt-4 px-6 py-3 border-2 border-brand-emerald text-brand-emerald font-bold uppercase tracking-widest text-[10px] rounded hover:bg-brand-emerald hover:text-white transition-all"
            >
              Become a Partner
            </button>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded border border-slate-200 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-brand-emerald" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy mb-1">{benefit.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-serif">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white p-1 rounded shadow-sm border border-slate-200">
                <img src="/logo.jpg" alt="News Nigeria USA Logo" className="w-12 h-12 object-contain rounded-sm" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl text-brand-navy tracking-tight">NEWS NIGERIA</h2>
                <p className="text-[10px] text-brand-emerald font-bold tracking-[0.2em] uppercase">USA International LLC</p>
              </div>
            </div>
            <p className="text-slate-600 max-w-md mb-8 italic font-serif">
              "Connecting Nigerians globally through structured institutional engagement and media diplomacy."
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded bg-brand-navy flex items-center justify-center text-white hover:bg-slate-800 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded bg-brand-navy flex items-center justify-center text-white hover:bg-slate-800 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded bg-brand-navy flex items-center justify-center text-white hover:bg-slate-800 transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 font-sans">Strategic Portals</h4>
            <ul className="space-y-4 text-slate-700 text-xs font-bold uppercase tracking-widest">
              <li><a href="#about" className="hover:text-brand-emerald transition-colors">Mission Overview</a></li>
              <li><a href="#gdir" className="hover:text-brand-emerald transition-colors">GDIR Department</a></li>
              <li><a href="#initiatives" className="hover:text-brand-emerald transition-colors">Institutional Initiatives</a></li>
              <li><a href="#partners" className="hover:text-brand-emerald transition-colors">Partner Network</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 font-sans">Contact Unit</h4>
            <ul className="space-y-4 text-slate-700 text-xs font-bold uppercase tracking-widest">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-brand-emerald" /> info@newsnigeriausa.com</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-emerald" /> +1 (202) 555-0123</li>
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-brand-emerald shrink-0" /> Washington D.C. HQ</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <p>© 2026 NEWS NIGERIA USA INTERNATIONAL LLC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 items-center">
            <span>NIGERIA</span>
            <span className="text-slate-300">|</span>
            <span>USA</span>
            <span className="text-slate-300">|</span>
            <span>UK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Global Server Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showEngagementModal, setShowEngagementModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const [newsData, setNewsData] = useState<NewsItem[]>(initialNewsData);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchNews();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAdminClick = () => {
    if (!user) {
      alert("You need to be authenticated first to request admin access.");
      setShowAuthModal(true);
    } else {
      setShowPasscodeModal(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAdminDashboard(false);
  };

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      // Assuming 'news' table exists with similar columns as NewsItem
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) {
        console.error('Error fetching news from Supabase', error);
      } else if (data && data.length === 0) {
        // Automatically seed the database with the initial template data if it's completely empty!
        const { error: seedError } = await supabase.from('news').insert(initialNewsData);
        if (!seedError) {
           setNewsData(initialNewsData);
        } else {
           console.error('Error seeding data:', seedError);
           setNewsData(initialNewsData); // fallback to displaying it anyway
        }
      } else if (data) {
        setNewsData(data as NewsItem[]);
      }
    } catch (err) {
      console.error('Failed to fetch from Supabase', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showAdminDashboard) {
    return (
      <div className="font-sans">
        <AdminDashboard 
          newsData={newsData} 
          setNewsData={setNewsData} 
          onLogout={() => setShowAdminDashboard(false)} 
        />
      </div>
    );
  }

  return (
    <div className="font-sans">
      <Navbar 
        user={user}
        onAdminClick={handleAdminClick} 
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
      />
      <Hero 
        newsData={newsData} 
        onEngagementClick={() => setShowEngagementModal(true)} 
        onReadStory={(article) => setSelectedArticle(article)} 
        onPartnerClick={() => setShowPartnerModal(true)}
      />
      
      <main>
        {/* Intro Section */}
        <section id="about" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  subtitle="Our Mission"
                  title="A Multi-Dimensional Media & Engagement Hub"
                  description="Promoting visibility, collaboration, investment, and strategic partnerships across Africa and the diaspora. We operate in strategic collaboration with KOGA Faith USA to amplify social impact and global development."
                />
                
                <div className="flex gap-8 items-center pt-4 border-t border-zinc-100">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Join our growing ecosystem</p>
                    <p className="text-zinc-500 text-sm">Empowering Nigerian leaders worldwide</p>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="h-64 overflow-hidden border border-slate-200">
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80" alt="News studio" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="h-32 bg-brand-emerald flex items-center justify-center p-6 text-white">
                    <p className="font-bold uppercase text-[10px] text-center tracking-widest">Bridge to the Homeland</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-48 bg-brand-navy flex flex-col justify-end p-6 text-white relative overflow-hidden border-b-4 border-brand-emerald">
                    <Flame className="w-10 h-10 text-brand-emerald mb-4" />
                    <p className="font-bold text-lg relative z-10 uppercase tracking-tight">Innovation</p>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald/10 rounded-full blur-3xl"></div>
                  </div>
                  <div className="h-64 overflow-hidden border border-slate-200">
                    <img src="https://images.unsplash.com/photo-1542744173-8e7e5381bb04?auto=format&fit=crop&q=80" alt="Discussion" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <NewsSection 
          newsData={newsData} 
          onReadStory={(article) => setSelectedArticle(article)} 
        />
        <GDIRSection onEngagementClick={() => setShowEngagementModal(true)} />
        <InitiativesSection />
        <PartnersSection />
        <BenefitsSection onPartnerClick={() => setShowPartnerModal(true)} />
        
        {/* Call to Action */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto nigeria-gradient rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 uppercase tracking-tight">Let's Connect Nigerians Globally</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 font-serif italic">
                Join our network of diplomats, professionals, and entrepreneurs building the future of the Nigerian diaspora.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-10 py-5 bg-brand-emerald text-white rounded font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl">
                  Institutional Engagement
                </button>
                <a href="#initiatives" className="px-10 py-5 bg-white/10 border border-white/20 backdrop-blur-md rounded font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center gap-2">
                  Strategic Portals <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
        
        {showPartnerModal && (
          <GenericFormModal type="partner" onClose={() => setShowPartnerModal(false)} />
        )}
        
        {showEngagementModal && (
          <GenericFormModal type="engagement" onClose={() => setShowEngagementModal(false)} />
        )}

        {showPasscodeModal && (
          <PasscodeModal 
            onSuccess={() => {
              setShowPasscodeModal(false);
              setShowAdminDashboard(true);
            }} 
            onClose={() => setShowPasscodeModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
