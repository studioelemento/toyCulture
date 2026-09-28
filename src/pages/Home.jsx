import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Gift, ShieldCheck, CreditCard, Truck, RotateCcw } from 'lucide-react';
import { Shopbyage } from './Shopbyage';
import { ShopbyCategory } from './ShopbyCategory';
import { TrendingToys } from './TrendingToys';
import { BestSeller } from './BestSeller';
import { TopBrands } from './TopBrands';
import { DealoftheDay } from './DealoftheDay';
import { NewArrivals } from './NewArrivals';
import { SubscribeNewsletter } from './SubscribeNewsletter';

// Hero image asset generated to match reference
import heroChildImage from 'C:/Users/amnap/.gemini/antigravity-ide/brain/2bcd030e-7b9f-4cda-a4f6-98f88df8e5bf/hero_boy_wooden_toy_1790556482600.jpg';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-[calc(100vh-140px)] flex flex-col justify-between overflow-x-hidden selection:bg-toyOrange/20 selection:text-toyOrange">
      {/* Hero Section Container */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 md:pt-12 pb-6 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Content & Search */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-6 max-w-xl mx-auto lg:mx-0 text-left">
            
            {/* Tagline / Eyebrow */}
            <div className="flex items-center gap-2 text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.22em] text-[#334155] uppercase font-sans">
              <span>PLAY</span>
              <span className="text-[10px] text-gray-400">•</span>
              <span>LEARN</span>
              <span className="text-[10px] text-gray-400">•</span>
              <span>GROW</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[40px] sm:text-[54px] md:text-[62px] lg:text-[70px] font-black tracking-tight text-[#0F243E] leading-[1.04] font-title">
              Toys for <br />
              <span className="text-[#F96515]">brighter</span> <br />
              tomorrows
            </h1>

            {/* Subheading / Description */}
            <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#55657E] font-normal leading-relaxed max-w-[460px]">
              Discover a world of toys from top brands that spark creativity, learning and endless fun.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-[480px] bg-white rounded-full shadow-[0_2px_14px_rgba(0,0,0,0.04)] border border-[#E2E8F0] p-1.5 sm:p-2 pl-4 sm:pl-5 flex items-center gap-2 sm:gap-3 transition-all focus-within:border-[#F96515]/60 focus-within:shadow-[0_4px_20px_rgba(249,101,21,0.12)]"
            >
              <Search className="w-5 h-5 text-[#94A3B8] flex-shrink-0" strokeWidth={2.2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for toys, brands or categories..."
                className="w-full bg-transparent text-[13px] sm:text-[14px] text-[#0F243E] placeholder-[#94A3B8] font-medium outline-none pr-1 hidden sm:block"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for toys..."
                className="w-full bg-transparent text-[13px] sm:text-[14px] text-[#0F243E] placeholder-[#94A3B8] font-medium outline-none pr-1 block sm:hidden"
              />
              <button
                type="submit"
                aria-label="Search"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F96515] hover:bg-[#EA580C] active:scale-95 text-white flex items-center justify-center flex-shrink-0 transition-all shadow-sm cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.4} />
              </button>
            </form>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full max-w-[480px]">
              <Link
                to="/shop"
                className="bg-[#F96515] hover:bg-[#EA580C] active:scale-[0.98] text-white text-[14px] sm:text-[15px] font-bold px-7 py-3 sm:py-3.5 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(249,101,21,0.25)] transition-all cursor-pointer"
              >
                <span>Shop All Toys</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>

              <Link
                to="/shop"
                className="bg-[#FFF1EB] hover:bg-[#FEE7DC] active:scale-[0.98] text-[#EA580C] text-[14px] sm:text-[15px] font-bold px-7 py-3 sm:py-3.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#FFD8C7]/50"
              >
                <Gift className="w-4 h-4 text-[#EA580C]" strokeWidth={2.3} />
                <span>Find a Toy</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Hero Visual Graphic with Arch & Playful Elements */}
          <div className="lg:col-span-6 relative flex items-center justify-center mt-4 lg:mt-0">
            
            {/* Main Stage with Warm Arch Background */}
            <div className="relative w-full max-w-[580px] aspect-[4/3] sm:aspect-[4/3] rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#FEECC8] shadow-sm flex items-end justify-center">
              
              {/* Child & Toy Setup Image */}
              <img
                src={heroChildImage}
                alt="Child playing with wooden toys"
                className="w-full h-full object-cover object-center transform scale-100 select-none pointer-events-none"
              />

              {/* Decorative Handwritten Accents (Play Learn Grow with curved rays) */}
              <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20 pointer-events-none select-none">
                {/* 3 Curved Orange Accent Strokes */}
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-[#F96515] -rotate-12 mb-1"
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                >
                  <path d="M 8 28 C 12 18 18 10 26 4" />
                  <path d="M 18 34 C 22 24 28 16 34 10" />
                  <path d="M 28 38 C 32 30 36 24 39 18" />
                </svg>

                {/* Handwritten Text */}
                <div className="font-handwriting text-[#0F243E] font-bold text-xl sm:text-2xl lg:text-[28px] leading-[1.1] tracking-wide -rotate-6">
                  <div>Play</div>
                  <div>Learn</div>
                  <div>Grow</div>
                </div>
              </div>

              {/* Wooden Small Board Chalkboard Note in the Background */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-[#EDE5D6]/90 backdrop-blur-xs border border-[#D9CEBA] rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm text-center pointer-events-none select-none max-w-[120px] sm:max-w-[140px] rotate-2">
                <p className="font-handwriting text-[#2D3748] text-xs sm:text-sm font-bold leading-tight">
                  Small<br />
                  Toys<br />
                  Big<br />
                  Possibilities
                </p>
                <span className="text-[#2D3748] text-xs block mt-0.5">♡</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Trust & Feature Badges Bar */}
      <section className="w-full border-t border-[#E8ECEF] bg-white/70 backdrop-blur-xs mt-6 sm:mt-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-6">
          
          {/* Desktop Layout (1440px) */}
          <div className="hidden md:flex items-center justify-between gap-6">
            
            {/* Badge 1: 100% Authentic Products */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0F243E]">
                <ShieldCheck className="w-6 h-6 text-[#0F243E]" strokeWidth={1.8} />
              </div>
              <div className="text-[13px] font-bold text-[#0F243E] leading-tight font-sans">
                100% Authentic<br />Products
              </div>
            </div>

            {/* Badge 2: Secure Payments */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0F243E]">
                <CreditCard className="w-6 h-6 text-[#0F243E]" strokeWidth={1.8} />
              </div>
              <div className="text-[13px] font-bold text-[#0F243E] leading-tight font-sans">
                Secure<br />Payments
              </div>
            </div>

            {/* Badge 3: Pan-India Delivery */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0F243E]">
                <Truck className="w-6 h-6 text-[#0F243E]" strokeWidth={1.8} />
              </div>
              <div className="text-[13px] font-bold text-[#0F243E] leading-tight font-sans">
                Pan-India<br />Delivery
              </div>
            </div>

            {/* Badge 4: Easy Returns */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0F243E]">
                <RotateCcw className="w-6 h-6 text-[#0F243E]" strokeWidth={1.8} />
              </div>
              <div className="text-[13px] font-bold text-[#0F243E] leading-tight font-sans">
                Easy<br />Returns
              </div>
            </div>

            {/* Badge 5: Happy Little Learners Brand Seal */}
            <div className="flex flex-col items-center justify-center text-center pl-4">
              <span className="font-handwriting text-[#0F243E] font-bold text-base lg:text-lg leading-none -rotate-2">
                Happy<br />Little Learners
              </span>
              {/* Playful Orange Smile Curve with Eyes */}
              <div className="mt-1 text-[#F96515] flex flex-col items-center">
                <svg className="w-6 h-2 text-[#F96515]" viewBox="0 0 24 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M 3 2 C 8 7 16 7 21 2" />
                </svg>
              </div>
            </div>

          </div>

          {/* Mobile Layout (375px Grid matching reference mockup) */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            
            {/* Item 1 */}
            <div className="flex items-center gap-2.5 p-1">
              <ShieldCheck className="w-5 h-5 text-[#0F243E] flex-shrink-0" strokeWidth={1.8} />
              <div className="text-[11px] font-bold text-[#0F243E] leading-tight font-sans">
                100% Authentic<br />Products
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-2.5 p-1">
              <CreditCard className="w-5 h-5 text-[#0F243E] flex-shrink-0" strokeWidth={1.8} />
              <div className="text-[11px] font-bold text-[#0F243E] leading-tight font-sans">
                Secure<br />Payments
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-2.5 p-1">
              <Truck className="w-5 h-5 text-[#0F243E] flex-shrink-0" strokeWidth={1.8} />
              <div className="text-[11px] font-bold text-[#0F243E] leading-tight font-sans">
                Pan-India<br />Delivery
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-2.5 p-1">
              <RotateCcw className="w-5 h-5 text-[#0F243E] flex-shrink-0" strokeWidth={1.8} />
              <div className="text-[11px] font-bold text-[#0F243E] leading-tight font-sans">
                Easy<br />Returns
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Shop by Age Section */}
      <Shopbyage />

      {/* Shop by Category Section */}
      <ShopbyCategory />

      {/* Trending Toys Section */}
      <TrendingToys />

      {/* Best Sellers Section */}
      <BestSeller />

      {/* Top Brands Section */}
      <TopBrands />

      {/* Deal of the Day Section */}
      <DealoftheDay />

      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Subscribe Newsletter Section */}
      <SubscribeNewsletter />
    </div>
  );
};
