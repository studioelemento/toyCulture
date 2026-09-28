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
      }, 4000);
    }
  };

  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Newsletter Banner Container */}
        <div className="relative bg-[#FFF9F0] border border-[#F2E8DC] rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 lg:p-12 overflow-hidden shadow-xs">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 z-10">
              
              {/* Header */}
              <div>
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#55657E] uppercase font-sans block mb-1">
                  STAY IN THE LOOP
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-black text-[#0F243E] tracking-tight leading-[1.08] font-title">
                  Kids' happiness <br />
                  delivered to <br className="hidden sm:block" />
                  your <span className="text-[#F96515]">inbox.</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-[15px] text-[#55657E] font-medium leading-relaxed max-w-md mt-2">
                  Be the first to know about new arrivals, exclusive offers and fun updates from Toyculture.
                </p>
              </div>

              {/* Email Form (Desktop Pill vs Mobile Stack) */}
              {isSubscribed ? (
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 flex items-center gap-3 text-[#065F46] max-w-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                  <span className="text-sm font-bold">
                    Thank you for subscribing! Check your inbox soon for exclusive goodies.
                  </span>
                </div>
              ) : (
                <>
                  {/* Desktop Form */}
                  <form
                    onSubmit={handleSubscribe}
                    className="hidden sm:flex items-center bg-white rounded-full border border-[#E2E8F0] p-1.5 pl-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] max-w-lg focus-within:border-[#F96515]/60 focus-within:shadow-[0_4px_16px_rgba(249,101,21,0.1)] transition-all"
                  >
                    <Mail className="w-5 h-5 text-[#94A3B8] flex-shrink-0 mr-3" strokeWidth={2} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-transparent text-sm text-[#0F243E] placeholder-[#94A3B8] font-medium outline-none pr-3"
                    />
                    <button
                      type="submit"
                      className="bg-[#F96515] hover:bg-[#EA580C] active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-full flex-shrink-0 transition-all shadow-[0_4px_12px_rgba(249,101,21,0.25)] cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>

                  {/* Mobile Form */}
                  <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:hidden">
                    <div className="flex items-center bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-xs">
                      <Mail className="w-5 h-5 text-[#94A3B8] flex-shrink-0 mr-2.5" strokeWidth={2} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-transparent text-xs text-[#0F243E] placeholder-[#94A3B8] font-medium outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#F96515] active:scale-98 text-white font-bold text-sm py-3 rounded-xl shadow-xs transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                </>
              )}

              {/* 3 Perks Badges */}
              <div className="flex items-center justify-between sm:justify-start sm:gap-8 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F243E]">
                  <Tag className="w-4 h-4 text-[#F96515]" strokeWidth={2.2} />
                  <span>Exclusive Offers</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#0F243E]">
                  <Star className="w-4 h-4 text-[#F96515]" strokeWidth={2.2} />
                  <span>New Arrivals</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-[#0F243E]">
                  <Gift className="w-4 h-4 text-[#F96515]" strokeWidth={2.2} />
                  <span>Fun Updates</span>
                </div>
              </div>

            </div>

            {/* Right Visual Column (3D Child Holding Gift Box + Doodles) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Warm Arch Shape */}
              <div className="relative w-full max-w-[420px] aspect-[4/3] sm:aspect-square rounded-[36px] bg-[#FDE9C2] flex items-end justify-center overflow-hidden">
                
                {/* 3D Character Illustration */}
                <img
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
                  alt="Child with Gift"
                  className="w-full h-full object-cover object-top mix-blend-multiply drop-shadow-lg"
                />

                {/* Left 3 Orange Radiating Accent Strokes */}
                <div className="absolute top-8 left-4 pointer-events-none select-none">
                  <svg
                    className="w-8 h-8 text-[#F96515] -rotate-12"
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
                </div>

                {/* Right Handwritten "More Play Ahead! ⌣" Accent */}
                <div className="absolute top-6 right-4 sm:right-6 pointer-events-none select-none text-center">
                  <div className="font-handwriting text-[#0F243E] font-bold text-xl sm:text-2xl leading-none rotate-6">
                    More<br />Play<br />Ahead!
                  </div>
                  <div className="mt-1 text-[#0F243E] flex justify-center">
                    <svg className="w-6 h-2 text-[#0F243E]" viewBox="0 0 24 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M 3 2 C 8 7 16 7 21 2" />
                    </svg>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SubscribeNewsletter;
