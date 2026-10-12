import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Truck,
  ShieldCheck,
  CreditCard,
  PackageOpen,
  Headphones,
  CheckCircle2,
  Plus,
  Minus,
  Facebook,
  Instagram,
  Youtube,
  Share2,
  MessageCircle,
  Phone
} from 'lucide-react';

/* Vector 3D Toy Brick Logo Icon */
const ToyBrickLogo = () => (
  <svg
    viewBox="0 0 44 44"
    className="w-10 h-10 shrink-0 drop-shadow-md"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top Cube (Yellow) */}
    <path d="M22 2L34 8.5L22 15L10 8.5L22 2Z" fill="#FBBF24" />
    <path d="M10 8.5L22 15V27L10 20.5V8.5Z" fill="#0284C7" />
    <path d="M34 8.5L22 15V27L34 20.5V8.5Z" fill="#EA580C" />

    {/* Top Studs / Dots on isometric face */}
    <ellipse cx="22" cy="6" rx="3" ry="1.5" fill="#FDE68A" />
    <ellipse cx="16" cy="9.5" rx="2.5" ry="1.2" fill="#FDE68A" />
    <ellipse cx="28" cy="9.5" rx="2.5" ry="1.2" fill="#FDE68A" />

    {/* Lower Left Accent Cube */}
    <path d="M10 21L22 27.5L10 34L-2 27.5L10 21Z" fill="#38BDF8" opacity="0.9" />
    <path d="M10 34L22 27.5V39L10 44V34Z" fill="#0369A1" />

    {/* Lower Right Accent Cube */}
    <path d="M34 21L46 27.5L34 34L22 27.5L34 21Z" fill="#FB923C" opacity="0.9" />
    <path d="M22 27.5L34 34V44L22 39V27.5Z" fill="#C2410C" />
  </svg>
);

/* High-Fidelity Payment Badge Icons */
const PaymentBadges = () => (
  <div className="flex flex-wrap items-center gap-2">
    {/* VISA */}
    <div className="bg-white px-2.5 py-1.5 rounded-md flex items-center justify-center shadow-xs border border-gray-100 h-7 min-w-[50px]">
      <span className="text-[14px] font-black italic tracking-tighter text-[#1A1F71] font-sans">
        VISA
      </span>
    </div>

    {/* Mastercard */}
    <div className="bg-white px-2 py-1 rounded-md flex items-center justify-center shadow-xs border border-gray-100 h-7 min-w-[50px]">
      <svg className="w-8 h-4.5" viewBox="0 0 36 22" fill="none">
        <circle cx="13" cy="11" r="9" fill="#EB001B" />
        <circle cx="23" cy="11" r="9" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
    </div>

    {/* RuPay */}
    <div className="bg-white px-2.5 py-1 rounded-md flex items-center justify-center shadow-xs border border-gray-100 h-7 min-w-[50px]">
      <span className="text-[11px] font-extrabold italic text-[#09357B] font-sans flex items-center">
        RuPay<span className="text-[#097937] ml-0.5">❯</span>
      </span>
    </div>

    {/* UPI */}
    <div className="bg-white px-2.5 py-1 rounded-md flex items-center justify-center shadow-xs border border-gray-100 h-7 min-w-[50px]">
      <span className="text-[11px] font-black italic text-[#5C2D91] font-sans flex items-center gap-0.5">
        <span className="text-[#00833E]">U</span>PI
      </span>
    </div>

    {/* Paytm */}
    <div className="bg-white px-2.5 py-1 rounded-md flex items-center justify-center shadow-xs border border-gray-100 h-7 min-w-[50px]">
      <span className="text-[12px] font-extrabold text-[#002970] font-sans flex items-center">
        pay<span className="text-[#00BAF2]">tm</span>
      </span>
    </div>

    {/* Amazon Pay */}
    <div className="bg-white px-2.5 py-1 rounded-md flex items-center justify-center shadow-xs border border-gray-100 h-7 min-w-[50px]">
      <span className="text-[10px] font-black text-[#232F3E] font-sans tracking-tight flex items-center">
        amazon<span className="text-[#FF9900] ml-0.5 font-bold">pay</span>
      </span>
    </div>
  </div>
);

/* Google Play Store Badge */
const GooglePlayBadge = () => (
  <a
    href="#download"
    className="bg-black hover:bg-neutral-900 border border-slate-700/80 hover:border-slate-500 rounded-lg px-3 py-1.5 flex items-center gap-2.5 transition group cursor-pointer"
    aria-label="Get it on Google Play"
  >
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
      <path
        d="M3.6 1.7L13.8 12L3.6 22.3C3.2 21.9 3 21.3 3 20.6V3.4C3 2.7 3.2 2.1 3.6 1.7Z"
        fill="#00E676"
      />
      <path
        d="M17.3 8.6L13.8 12L3.6 1.7C4.1 1.4 4.8 1.4 5.3 1.7L17.3 8.6Z"
        fill="#FFD600"
      />
      <path
        d="M17.3 15.4L5.3 22.3C4.8 22.6 4.1 22.6 3.6 22.3L13.8 12L17.3 15.4Z"
        fill="#FF1744"
      />
      <path
        d="M21.5 11L17.3 8.6L13.8 12L17.3 15.4L21.5 13C22.2 12.6 22.2 11.4 21.5 11Z"
        fill="#00B0FF"
      />
    </svg>
    <div className="text-left leading-none">
      <span className="block text-[8px] uppercase tracking-wider text-slate-300 font-medium">
        GET IT ON
      </span>
      <span className="block text-[12px] font-bold text-white font-sans mt-0.5">
        Google Play
      </span>
    </div>
  </a>
);

/* Apple App Store Badge */
const AppStoreBadge = () => (
  <a
    href="#download"
    className="bg-black hover:bg-neutral-900 border border-slate-700/80 hover:border-slate-500 rounded-lg px-3 py-1.5 flex items-center gap-2.5 transition group cursor-pointer"
    aria-label="Download on the App Store"
  >
    <svg className="w-5 h-5 shrink-0 fill-white" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.01-.51 2.63-1.24z" />
    </svg>
    <div className="text-left leading-none">
      <span className="block text-[8px] text-slate-300 font-medium">
        Download on the
      </span>
      <span className="block text-[12px] font-bold text-white font-sans mt-0.5">
        App Store
      </span>
    </div>
  </a>
);

/* India Silhouette Map Vector */
const IndiaMapIcon = () => (
  <svg
    viewBox="0 0 64 74"
    className="w-10 h-12 text-slate-200 fill-current shrink-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
  >
    {/* Stylized Silhouette of India Map */}
    <path
      d="M28 2C32 2 34 5 36 8C38 11 40 12 43 14C45 16 43 19 40 21C38 23 39 26 44 26C49 26 53 28 55 31C57 34 54 37 50 37C46 37 46 39 49 41C52 43 50 47 46 47C43 47 41 50 39 53C37 56 34 60 33 65C32 68 31 71 30 72C29 71 27 67 26 63C25 59 23 55 22 51C21 47 18 45 15 44C12 43 10 40 11 37C12 34 9 32 7 30C5 28 6 25 10 24C14 23 16 20 18 17C20 14 23 11 25 7C26 4 27 2 28 2Z"
      opacity="0.95"
    />
    {/* Location Pin Point in Central India */}
    <circle cx="31" cy="36" r="3.5" fill="#F97316" />
    <circle cx="31" cy="36" r="1.5" fill="#FFFFFF" />
  </svg>
);

/* Isometric Lego Brick Background Watermark */
const LegoWatermark = () => (
  <svg
    viewBox="0 0 240 180"
    className="absolute bottom-2 right-2 w-64 md:w-80 h-auto pointer-events-none opacity-10 text-sky-400 stroke-current select-none"
    fill="none"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Main 2x4 Brick Body */}
    <path d="M120 20L220 70V130L120 180L20 130V70L120 20Z" />
    <path d="M120 70L220 70" />
    <path d="M120 70L20 70" />
    <path d="M120 70V180" />

    {/* Isometric Studs on Top */}
    <ellipse cx="60" cy="45" rx="14" ry="7" />
    <ellipse cx="100" cy="35" rx="14" ry="7" />
    <ellipse cx="140" cy="35" rx="14" ry="7" />
    <ellipse cx="180" cy="45" rx="14" ry="7" />

    <ellipse cx="60" cy="65" rx="14" ry="7" />
    <ellipse cx="100" cy="55" rx="14" ry="7" />
    <ellipse cx="140" cy="55" rx="14" ry="7" />
    <ellipse cx="180" cy="65" rx="14" ry="7" />
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Accordion state for mobile view
  const [openAccordions, setOpenAccordions] = useState({
    shop: false,
    categories: false,
    help: false,
    about: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="w-full font-sans antialiased mt-12 sm:mt-16">
      {/* ============================================================== */}
      {/* 1. TOP NEWSLETTER / SUBSCRIBE BANNER (Exact Reference Match)  */}
      {/* ============================================================== */}
      <section className="bg-[#FFF8F2] border-t border-b border-[#F7E7D9] py-10 lg:py-14 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-[1360px] mx-auto">
          {/* DESKTOP LAYOUT (>= md) */}
          <div className="hidden md:flex items-center justify-between gap-8 lg:gap-12">
            {/* Left Content Column */}
            <div className="max-w-xl lg:max-w-2xl space-y-4">
              <span className="text-[11px] lg:text-xs font-bold tracking-[0.18em] text-[#64748B] uppercase block">
                STAY IN THE LOOP
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#0D233A] tracking-tight leading-[1.2] font-title">
                Get the best toys;
                <br />
                offers and parenting tips.
              </h2>

              <p className="text-xs sm:text-sm text-[#64748B] font-normal">
                Subscribe to our newsletter and never miss an update.
              </p>

              {/* Form Input & Button */}
              <form onSubmit={handleSubscribe} className="pt-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center bg-white border border-[#D5DEE7] rounded-lg px-3.5 py-2.5 shadow-xs w-72 sm:w-80 lg:w-96 focus-within:border-toyOrange focus-within:ring-2 focus-within:ring-toyOrange/20 transition-all">
                    <Mail className="w-4.5 h-4.5 text-[#94A3B8] shrink-0 mr-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full text-xs sm:text-sm text-[#0D233A] placeholder-[#94A3B8] bg-transparent outline-none font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#F96515] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-lg shadow-sm transition active:scale-[0.98] cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </div>

                {isSubscribed && (
                  <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 size={14} /> Thank you! You have successfully subscribed.
                  </p>
                )}
              </form>

              {/* Checkmarks Row */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-[#334155] font-medium">
                  <CheckCircle2 size={15} className="text-[#334155] stroke-[2.2]" />
                  <span>New arrivals</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#334155] font-medium">
                  <CheckCircle2 size={15} className="text-[#334155] stroke-[2.2]" />
                  <span>Exclusive offers</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#334155] font-medium">
                  <CheckCircle2 size={15} className="text-[#334155] stroke-[2.2]" />
                  <span>Parenting tips</span>
                </div>
              </div>
            </div>

            {/* Right Illustration Column with Teddy, Blocks & Car */}
            <div className="relative shrink-0 flex items-center justify-center">
              {/* Handwritten Playful Script 'Play Learn Grow ♡' */}
              <div className="absolute -top-3 -right-2 lg:-right-4 z-20 font-caveat font-bold text-[#F96515] text-2xl lg:text-[28px] leading-[0.95] tracking-tight transform rotate-[8deg] select-none text-left">
                <span className="block">Play</span>
                <span className="block pl-2">Learn</span>
                <span className="block pl-4 flex items-center gap-1">
                  Grow <span className="text-xl">♡</span>
                </span>
                {/* Whimsical curved doodle rays */}
                <svg
                  className="w-7 h-5 text-[#F96515] ml-4 mt-0.5"
                  viewBox="0 0 28 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M4 14 C10 6, 18 6, 24 14" />
                </svg>
              </div>

              {/* Cute Toys Image Container */}
              <div className="relative w-72 lg:w-96 h-auto">
                <img
                  src="/footer-toys.jpg"
                  alt="Cute teddy bear, wooden building blocks and toy car"
                  className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT (< md) - Exact match to Mobile Footer (375px) */}
          <div className="flex md:hidden flex-col space-y-4">
            <span className="text-[11px] font-bold tracking-[0.16em] text-[#64748B] uppercase">
              STAY IN THE LOOP
            </span>

            <h2 className="text-[22px] font-extrabold text-[#0D233A] tracking-tight leading-tight font-title">
              Get the best toys;
              <br />
              offers and parenting tips.
            </h2>

            <p className="text-[12px] text-[#64748B] font-normal leading-relaxed">
              Subscribe to our newsletter and never miss an update.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3 pt-1">
              <div className="relative flex items-center bg-white border border-[#D5DEE7] rounded-lg px-3.5 py-3 shadow-xs w-full focus-within:border-toyOrange focus-within:ring-2 focus-within:ring-toyOrange/20">
                <Mail className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-xs text-[#0D233A] placeholder-[#94A3B8] bg-transparent outline-none font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F96515] hover:bg-[#EA580C] text-white font-bold text-sm py-3 rounded-lg shadow-sm transition active:scale-[0.98] cursor-pointer text-center"
              >
                Subscribe
              </button>

              {isSubscribed && (
                <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 size={14} /> Subscribed successfully!
                </p>
              )}
            </form>

            {/* Mobile Toys Image with 'Play Learn Grow ♡' */}
            <div className="relative pt-4 pb-2 flex items-center justify-center">
              <div className="absolute top-2 right-4 z-20 font-caveat font-bold text-[#F96515] text-xl leading-tight transform rotate-[8deg] select-none text-left">
                <span className="block">Play</span>
                <span className="block pl-1.5">Learn</span>
                <span className="block pl-3 flex items-center gap-0.5">
                  Grow <span className="text-base">♡</span>
                </span>
              </div>
              <img
                src="/footer-toys.jpg"
                alt="Cute teddy bear, wooden building blocks and toy car"
                className="w-64 max-w-full h-auto object-contain select-none pointer-events-none"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. MAIN DARK NAVY FOOTER SECTION                               */}
      {/* ============================================================== */}
      <section className="bg-[#08182B] text-slate-300 relative overflow-hidden pt-12 md:pt-16 pb-8 px-4 sm:px-6 lg:px-12">
        {/* Subtle Isometric Lego Brick Blueprint Watermark in Background */}
        <LegoWatermark />

        <div className="max-w-[1360px] mx-auto relative z-10">
          {/* Top Columns Grid (Desktop) */}
          <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-10 pb-12">
            {/* Col 1: Brand & Social Links */}
            <div className="md:col-span-4 lg:col-span-4 space-y-5 pr-4">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <ToyBrickLogo />
                <div>
                  <span className="text-lg lg:text-xl font-black text-white tracking-wider block font-sans leading-none">
                    TOY CULTURE
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-[0.22em] block mt-1">
                    Play • Learn • Grow
                  </span>
                </div>
              </Link>

              <p className="text-xs lg:text-[13px] text-slate-400 leading-relaxed max-w-sm">
                A wide range of toys from top brands to spark creativity, learning and endless fun for every child.
              </p>

              {/* Social Media Circular Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-xs"
                  aria-label="Facebook"
                >
                  <Facebook size={15} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-xs"
                  aria-label="Instagram"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-xs"
                  aria-label="YouTube"
                >
                  <Youtube size={15} />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-xs"
                  aria-label="Pinterest"
                >
                  <Share2 size={15} />
                </a>
                <a
                  href="https://wa.me/917907012345"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-xs"
                  aria-label="WhatsApp Support"
                >
                  <MessageCircle size={15} />
                </a>
              </div>
            </div>

            {/* Col 2: Shop */}
            <div className="md:col-span-2 lg:col-span-2 space-y-3.5">
              <h3 className="text-sm font-bold text-white tracking-wide font-sans">
                Shop
              </h3>
              <ul className="space-y-2.5 text-xs lg:text-[13px] text-slate-400">
                <li>
                  <Link to="/shop" className="hover:text-toyOrange transition-colors">
                    All Toys
                  </Link>
                </li>
                <li>
                  <Link to="/shop?filter=new" className="hover:text-toyOrange transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to="/shop?filter=bestsellers" className="hover:text-toyOrange transition-colors">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link to="/shop?filter=offers" className="hover:text-toyOrange transition-colors">
                    Offers
                  </Link>
                </li>
                <li>
                  <Link to="/shop?filter=gift-ideas" className="hover:text-toyOrange transition-colors">
                    Gift Ideas
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-toyOrange transition-colors">
                    Find a Toy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div className="md:col-span-2 lg:col-span-2 space-y-3.5">
              <h3 className="text-sm font-bold text-white tracking-wide font-sans">
                Categories
              </h3>
              <ul className="space-y-2.5 text-xs lg:text-[13px] text-slate-400">
                <li>
                  <Link to="/category/diecast-toys" className="hover:text-toyOrange transition-colors">
                    Diecast Toys
                  </Link>
                </li>
                <li>
                  <Link to="/category/construction-toys" className="hover:text-toyOrange transition-colors">
                    Construction Toys
                  </Link>
                </li>
                <li>
                  <Link to="/category/puzzles" className="hover:text-toyOrange transition-colors">
                    Puzzles
                  </Link>
                </li>
                <li>
                  <Link to="/category/role-play-toys" className="hover:text-toyOrange transition-colors">
                    Role Play Toys
                  </Link>
                </li>
                <li>
                  <Link to="/category/stem-diy" className="hover:text-toyOrange transition-colors">
                    STEM & DIY
                  </Link>
                </li>
                <li>
                  <Link to="/category/activity-toys" className="hover:text-toyOrange transition-colors">
                    Activity Toys
                  </Link>
                </li>
                <li>
                  <Link to="/category/arts-crafts" className="hover:text-toyOrange transition-colors">
                    Arts & Crafts
                  </Link>
                </li>
                <li>
                  <Link to="/category/outdoor-sports" className="hover:text-toyOrange transition-colors">
                    Outdoor & Sports
                  </Link>
                </li>
                <li>
                  <Link to="/category/baby-toys" className="hover:text-toyOrange transition-colors">
                    Baby Toys
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Help & Support */}
            <div className="md:col-span-2 lg:col-span-2 space-y-3.5">
              <h3 className="text-sm font-bold text-white tracking-wide font-sans">
                Help & Support
              </h3>
              <ul className="space-y-2.5 text-xs lg:text-[13px] text-slate-400">
                <li>
                  <Link to="/track-order" className="hover:text-toyOrange transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-toyOrange transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="hover:text-toyOrange transition-colors">
                    Return & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="hover:text-toyOrange transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/help-center" className="hover:text-toyOrange transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-toyOrange transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 5: About */}
            <div className="md:col-span-2 lg:col-span-2 space-y-3.5">
              <h3 className="text-sm font-bold text-white tracking-wide font-sans">
                About
              </h3>
              <ul className="space-y-2.5 text-xs lg:text-[13px] text-slate-400">
                <li>
                  <Link to="/about" className="hover:text-toyOrange transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link to="/brands" className="hover:text-toyOrange transition-colors">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link to="/affiliate-program" className="hover:text-toyOrange transition-colors">
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-toyOrange transition-colors">
                    Blog / Learn
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-toyOrange transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Top Section on Mobile: Brand Info + Accordions */}
          <div className="block md:hidden pb-6 space-y-6">
            {/* Mobile Brand Info */}
            <div className="space-y-3">
              <Link to="/" className="inline-flex items-center gap-3">
                <ToyBrickLogo />
                <div>
                  <span className="text-lg font-black text-white tracking-wider block font-sans leading-none">
                    TOY CULTURE
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-[0.22em] block mt-1">
                    Play • Learn • Grow
                  </span>
                </div>
              </Link>

              <p className="text-xs text-slate-400 leading-relaxed">
                A wide range of toys from top brands to spark creativity, learning and endless fun for every child.
              </p>

              {/* Mobile Social Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={15} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  aria-label="YouTube"
                >
                  <Youtube size={15} />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  aria-label="Pinterest"
                >
                  <Share2 size={15} />
                </a>
                <a
                  href="https://wa.me/917907012345"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-slate-700/80 bg-slate-800/40 hover:bg-toyOrange hover:border-toyOrange flex items-center justify-center text-slate-300 hover:text-white transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
              </div>
            </div>

            {/* Mobile Accordions */}
            <div className="border-t border-slate-800 pt-2 space-y-1">
              {/* Accordion 1: Shop */}
              <div className="border-b border-slate-800/80">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shop')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-sm font-bold text-white hover:text-toyOrange transition cursor-pointer"
                >
                  <span>Shop</span>
                  {openAccordions.shop ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openAccordions.shop && (
                  <ul className="pb-4 pl-1 space-y-2.5 text-xs text-slate-400 animate-fadeIn">
                    <li><Link to="/shop" className="hover:text-toyOrange">All Toys</Link></li>
                    <li><Link to="/shop?filter=new" className="hover:text-toyOrange">New Arrivals</Link></li>
                    <li><Link to="/shop?filter=bestsellers" className="hover:text-toyOrange">Best Sellers</Link></li>
                    <li><Link to="/shop?filter=offers" className="hover:text-toyOrange">Offers</Link></li>
                    <li><Link to="/shop?filter=gift-ideas" className="hover:text-toyOrange">Gift Ideas</Link></li>
                    <li><Link to="/shop" className="hover:text-toyOrange">Find a Toy</Link></li>
                  </ul>
                )}
              </div>

              {/* Accordion 2: Categories */}
              <div className="border-b border-slate-800/80">
                <button
                  type="button"
                  onClick={() => toggleAccordion('categories')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-sm font-bold text-white hover:text-toyOrange transition cursor-pointer"
                >
                  <span>Categories</span>
                  {openAccordions.categories ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openAccordions.categories && (
                  <ul className="pb-4 pl-1 space-y-2.5 text-xs text-slate-400 animate-fadeIn">
                    <li><Link to="/category/diecast-toys" className="hover:text-toyOrange">Diecast Toys</Link></li>
                    <li><Link to="/category/construction-toys" className="hover:text-toyOrange">Construction Toys</Link></li>
                    <li><Link to="/category/puzzles" className="hover:text-toyOrange">Puzzles</Link></li>
                    <li><Link to="/category/role-play-toys" className="hover:text-toyOrange">Role Play Toys</Link></li>
                    <li><Link to="/category/stem-diy" className="hover:text-toyOrange">STEM & DIY</Link></li>
                    <li><Link to="/category/activity-toys" className="hover:text-toyOrange">Activity Toys</Link></li>
                    <li><Link to="/category/arts-crafts" className="hover:text-toyOrange">Arts & Crafts</Link></li>
                    <li><Link to="/category/outdoor-sports" className="hover:text-toyOrange">Outdoor & Sports</Link></li>
                    <li><Link to="/category/baby-toys" className="hover:text-toyOrange">Baby Toys</Link></li>
                  </ul>
                )}
              </div>

              {/* Accordion 3: Help & Support */}
              <div className="border-b border-slate-800/80">
                <button
                  type="button"
                  onClick={() => toggleAccordion('help')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-sm font-bold text-white hover:text-toyOrange transition cursor-pointer"
                >
                  <span>Help & Support</span>
                  {openAccordions.help ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openAccordions.help && (
                  <ul className="pb-4 pl-1 space-y-2.5 text-xs text-slate-400 animate-fadeIn">
                    <li><Link to="/track-order" className="hover:text-toyOrange">Track Order</Link></li>
                    <li><Link to="/shipping-policy" className="hover:text-toyOrange">Shipping Policy</Link></li>
                    <li><Link to="/refund-policy" className="hover:text-toyOrange">Return & Refund Policy</Link></li>
                    <li><Link to="/faqs" className="hover:text-toyOrange">FAQs</Link></li>
                    <li><Link to="/help-center" className="hover:text-toyOrange">Help Center</Link></li>
                    <li><Link to="/contact" className="hover:text-toyOrange">Contact Us</Link></li>
                  </ul>
                )}
              </div>

              {/* Accordion 4: About */}
              <div className="border-b border-slate-800/80">
                <button
                  type="button"
                  onClick={() => toggleAccordion('about')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-sm font-bold text-white hover:text-toyOrange transition cursor-pointer"
                >
                  <span>About</span>
                  {openAccordions.about ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openAccordions.about && (
                  <ul className="pb-4 pl-1 space-y-2.5 text-xs text-slate-400 animate-fadeIn">
                    <li><Link to="/about" className="hover:text-toyOrange">Our Story</Link></li>
                    <li><Link to="/brands" className="hover:text-toyOrange">Brands</Link></li>
                    <li><Link to="/affiliate-program" className="hover:text-toyOrange">Affiliate Program</Link></li>
                    <li><Link to="/blog" className="hover:text-toyOrange">Blog / Learn</Link></li>
                    <li><Link to="/careers" className="hover:text-toyOrange">Careers</Link></li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 3. VALUE PROPOSITIONS / TRUST BADGES BAR                   */}
          {/* ========================================================== */}
          <div className="border-y border-slate-800/90 py-6 my-6 md:my-8">
            {/* Desktop Row (5 Columns) */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-6 items-center">
              {/* 1. Free Shipping */}
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-slate-200 stroke-[1.5] shrink-0" />
                <div>
                  <h4 className="text-xs lg:text-[13px] font-semibold text-white leading-tight">
                    Free shipping
                  </h4>
                  <p className="text-[11px] lg:text-xs text-slate-400 mt-0.5">
                    above ₹2,000
                  </p>
                </div>
              </div>

              {/* 2. 100% Authentic */}
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-slate-200 stroke-[1.5] shrink-0" />
                <div>
                  <h4 className="text-xs lg:text-[13px] font-semibold text-white leading-tight">
                    100% Authentic
                  </h4>
                  <p className="text-[11px] lg:text-xs text-slate-400 mt-0.5">
                    Products
                  </p>
                </div>
              </div>

              {/* 3. Safe & Secure */}
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-slate-200 stroke-[1.5] shrink-0" />
                <div>
                  <h4 className="text-xs lg:text-[13px] font-semibold text-white leading-tight">
                    Safe & Secure
                  </h4>
                  <p className="text-[11px] lg:text-xs text-slate-400 mt-0.5">
                    Payments
                  </p>
                </div>
              </div>

              {/* 4. Easy Returns */}
              <div className="flex items-center gap-3">
                <PackageOpen className="w-6 h-6 text-slate-200 stroke-[1.5] shrink-0" />
                <div>
                  <h4 className="text-xs lg:text-[13px] font-semibold text-white leading-tight">
                    Easy Returns
                  </h4>
                  <p className="text-[11px] lg:text-xs text-slate-400 mt-0.5">
                    (Conditions apply)
                  </p>
                </div>
              </div>

              {/* 5. Need Help */}
              <div className="flex items-center gap-3">
                <Headphones className="w-6 h-6 text-slate-200 stroke-[1.5] shrink-0" />
                <div>
                  <h4 className="text-xs lg:text-[13px] font-semibold text-white leading-tight">
                    Need Help?
                  </h4>
                  <p className="text-[11px] lg:text-xs text-slate-400 mt-0.5">
                    +91 79070 12345
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Stacked Trust Badges */}
            <div className="flex md:hidden flex-col space-y-4">
              <div className="flex items-center gap-3.5">
                <Truck className="w-5 h-5 text-slate-200 stroke-[1.5] shrink-0" />
                <span className="text-xs font-medium text-slate-200">
                  Free shipping above ₹2,000
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                <ShieldCheck className="w-5 h-5 text-slate-200 stroke-[1.5] shrink-0" />
                <span className="text-xs font-medium text-slate-200">
                  100% Authentic Products
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                <CreditCard className="w-5 h-5 text-slate-200 stroke-[1.5] shrink-0" />
                <span className="text-xs font-medium text-slate-200">
                  Safe & Secure Payments
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                <PackageOpen className="w-5 h-5 text-slate-200 stroke-[1.5] shrink-0" />
                <span className="text-xs font-medium text-slate-200">
                  Easy Returns <span className="text-slate-400">(Conditions apply)</span>
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                <Headphones className="w-5 h-5 text-slate-200 stroke-[1.5] shrink-0" />
                <span className="text-xs font-medium text-slate-200">
                  Need Help? +91 79070 12345
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 4. LOWER ROW: WE ACCEPT, APP DOWNLOAD, WE SHIP ACROSS INDIA */}
          {/* ========================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start my-6">
            {/* Col 1: We Accept */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="text-xs font-semibold text-slate-300">
                We Accept
              </h5>
              <PaymentBadges />
            </div>

            {/* Col 2: Download Our App */}
            <div className="md:col-span-4 md:border-l md:border-slate-800/80 md:pl-8 space-y-3">
              <h5 className="text-xs font-semibold text-slate-300">
                Download Our App
              </h5>
              <div className="flex items-center gap-2.5">
                <GooglePlayBadge />
                <AppStoreBadge />
              </div>
            </div>

            {/* Col 3: We Ship Across India */}
            <div className="md:col-span-4 md:border-l md:border-slate-800/80 md:pl-8 space-y-3">
              <h5 className="text-xs font-semibold text-slate-300">
                We Ship Across India
              </h5>
              <div className="flex items-center gap-3.5">
                <IndiaMapIcon />
                <div className="leading-tight">
                  <span className="block text-xs text-slate-400">
                    Delivering joy to
                  </span>
                  <span className="block text-xs font-bold text-white mt-0.5">
                    19,000+ pincodes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 5. BOTTOM COPYRIGHT & LEGAL LINKS BAR                       */}
          {/* ========================================================== */}
          <div className="border-t border-slate-800/80 pt-6 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p className="order-2 md:order-1 text-center md:text-left">
              © 2025 ToyCulture. All rights reserved.
            </p>

            <div className="order-1 md:order-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-400">
              <Link
                to="/privacy-policy"
                className="hover:text-toyOrange transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-slate-600">|</span>
              <Link
                to="/terms-conditions"
                className="hover:text-toyOrange transition-colors"
              >
                Terms & Conditions
              </Link>
              <span className="text-slate-600">|</span>
              <Link
                to="/sitemap"
                className="hover:text-toyOrange transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
