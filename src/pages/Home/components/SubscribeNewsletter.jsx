import React, { useState } from 'react';
import { Mail, Tag, Star, Gift, CheckCircle2 } from 'lucide-react';

export const SubscribeNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 4500);
    }
  };

  // Reusable Graphic Artwork Component
  const GraphicIllustration = ({ className = "" }) => (
    <div className={`relative w-full max-w-[340px] sm:max-w-[420px] mx-auto flex items-center justify-center ${className}`}>

      {/* Organic Warm Pastel-Yellow Blob in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[360px] md:w-[410px] h-[240px] sm:h-[360px] md:h-[410px] bg-[#FFEBBF] rounded-[52%_48%_62%_38%/42%_58%_42%_58%] -z-0 transform rotate-[-6deg] pointer-events-none"></div>

      {/* Playful Handwritten Text: 'More Play Ahead!' with Curved Smile */}
      <div className="absolute -top-3 sm:-top-6 right-0 sm:right-2 z-20 font-['Caveat'] text-[#0B2545] text-right pointer-events-none select-none">
        <div className="text-2xl sm:text-4xl md:text-[36px] font-bold leading-[0.9] tracking-tight transform rotate-[12deg]">
          <span className="block italic">More</span>
          <span className="block pl-2 sm:pl-3 italic">Play</span>
          <span className="block pl-1 italic">Ahead!</span>
        </div>
        {/* Curved Smile Arc */}
        <div className="flex justify-end pr-2 sm:pr-3 pt-0.5 sm:pt-1">
          <svg className="w-6 h-4 sm:w-8 sm:h-6 text-[#0B2545] transform rotate-[12deg]" viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M6 5 C12 18, 20 18, 26 6" />
          </svg>
        </div>
      </div>

      {/* 3D Character Illustration with smooth edge blend */}
      <div className="relative z-10 w-full overflow-hidden flex items-center justify-center [mask-image:radial-gradient(circle_at_center,black_64%,transparent_98%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_64%,transparent_98%)]">
        <img
          src="/newsletter-boy.jpg"
          alt="Happy child holding toy gift"
          className="w-full h-auto object-contain max-h-[280px] sm:max-h-[380px] md:max-h-[430px] mix-blend-multiply select-none pointer-events-none"
          loading="lazy"
        />
      </div>

    </div>
  );

  return (
    <section className="w-full bg-[#FAF9F5] py-6 sm:py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Newsletter Main Banner Card */}
        <div className="relative bg-[#FFF9EE] border border-[#F2E8DC] rounded-[28px] sm:rounded-[36px] md:rounded-[42px] overflow-hidden px-5 py-7 sm:p-10 md:p-12 lg:px-16 lg:py-14 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left Column (Desktop) / Full Stack Container (Mobile) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 z-10">

              {/* Category Subhead */}
              <div className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.2em] text-[#556987] uppercase font-sans">
                STAY IN THE LOOP
              </div>

              {/* Main Headline */}
              <h2 className="text-[26px] sm:text-4xl md:text-5xl lg:text-[48px] font-black text-[#0B2545] tracking-tight leading-[1.15] font-title">
                Kids' happiness<br />
                delivered to<br className="block sm:hidden" /> your <span className="text-[#FF5500]">inbox.</span>
              </h2>

              {/* Description */}
              <p className="text-[13px] sm:text-base text-[#4E6178] font-normal leading-relaxed max-w-lg">
                Be the first to know about new arrivals, exclusive offers and fun updates from Toyculture.
              </p>

              {/* Mobile Only: Character Illustration placed in the middle */}
              <div className="block lg:hidden my-2 sm:my-4">
                <GraphicIllustration />
              </div>

              {/* Subscription Form */}
              <form onSubmit={handleSubscribe} className="pt-1 sm:pt-2 max-w-xl">

                {/* Desktop Single Pill Container (>= sm) */}
                <div className="hidden sm:flex bg-white rounded-full border border-[#E2E8F0] shadow-sm p-1.5 sm:p-2 items-center gap-2 transition-all focus-within:border-[#FF5500] focus-within:ring-2 focus-within:ring-[#FF5500]/10">
                  <div className="flex items-center w-full pl-3.5 pr-2 py-1.5 sm:py-0">
                    <Mail className="w-5 h-5 text-[#243B53] shrink-0 stroke-[2.2]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-3 pr-2 py-2 text-sm sm:text-base text-[#0B2545] placeholder-[#94A3B8] bg-transparent outline-none border-none font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-auto bg-[#FF5500] hover:bg-[#E64C00] active:scale-[0.98] text-white font-bold text-sm sm:text-base px-8 sm:px-9 py-3 sm:py-3.5 rounded-full transition-all duration-200 shrink-0 shadow-[0_4px_14px_rgba(255,85,0,0.25)] hover:shadow-[0_6px_18px_rgba(255,85,0,0.35)] cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>

                {/* Mobile Separate Stacked Form (< sm) */}
                <div className="flex sm:hidden flex-col gap-3">
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs px-4 py-3.5 flex items-center gap-3 focus-within:border-[#FF5500] focus-within:ring-2 focus-within:ring-[#FF5500]/10">
                    <Mail className="w-5 h-5 text-[#243B53] shrink-0 stroke-[2.2]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full text-sm text-[#0B2545] placeholder-[#94A3B8] bg-transparent outline-none border-none font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF5500] hover:bg-[#E64C00] active:scale-[0.98] text-white font-bold text-base py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(255,85,0,0.25)] transition-all cursor-pointer text-center"
                  >
                    Subscribe
                  </button>
                </div>

                {/* Success Notice */}
                {isSubscribed && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 animate-fadeIn pt-2.5 pl-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Thank you for subscribing! Your perks are on the way.</span>
                  </div>
                )}
              </form>

              {/* Desktop Perks Badges (>= lg) */}
              <div className="hidden lg:flex pt-3 sm:pt-5 flex-wrap items-center gap-6 sm:gap-8">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#FF5500] stroke-[2.4]" />
                  <span className="text-sm font-semibold text-[#1E293B]">
                    Exclusive Offers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FF5500] stroke-[2.4]" />
                  <span className="text-sm font-semibold text-[#1E293B]">
                    New Arrivals
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#FF5500] stroke-[2.4]" />
                  <span className="text-sm font-semibold text-[#1E293B]">
                    Fun Updates
                  </span>
                </div>
              </div>

              {/* Mobile Perks Badges: 3 Columns with Vertical Dividers (< lg) */}
              <div className="grid lg:hidden grid-cols-3 pt-6 sm:pt-8 mt-2 items-center text-center">
                {/* Column 1 */}
                <div className="flex flex-col items-center justify-center pr-2 border-r border-[#E9DFD0]">
                  <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF5500] stroke-[2.2] mb-1.5" />
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E293B] leading-tight">
                    Exclusive<br />Offers
                  </span>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col items-center justify-center px-2 border-r border-[#E9DFD0]">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF5500] stroke-[2.2] mb-1.5" />
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E293B] leading-tight">
                    New<br />Arrivals
                  </span>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col items-center justify-center pl-2">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF5500] stroke-[2.2] mb-1.5" />
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E293B] leading-tight">
                    Fun<br />Updates
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column Graphic (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-5 relative items-center justify-end">
              <GraphicIllustration />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SubscribeNewsletter;



