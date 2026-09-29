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
          
          {/* Subtle Decorative Star Sparkles */}
          <div className="absolute top-6 right-10 text-[#F96515]/30 pointer-events-none hidden md:block">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          <div className="absolute bottom-6 left-8 text-[#F96515]/20 pointer-events-none hidden md:block">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            
            {/* Tagline */}
            <span className="inline-block text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.2em] text-[#F96515] uppercase font-sans">
              STAY IN THE LOOP
            </span>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-[#0F243E] tracking-tight leading-[1.1] font-title">
              Get <span className="text-[#F96515]">10% off</span> your first order
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-[15px] text-[#55657E] font-medium max-w-lg mx-auto leading-relaxed">
              Subscribe to our newsletter for exclusive discounts, new toy drops, and playful learning ideas delivered straight to your inbox.
            </p>

            {/* Subscription Form */}
            <form
              onSubmit={handleSubscribe}
              className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto w-full"
            >
              <div className="relative w-full">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border border-[#E2E8F0] focus:border-[#F96515] focus:outline-none rounded-full text-xs sm:text-sm text-[#0F243E] placeholder-[#94A3B8] shadow-xs transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#F96515] hover:bg-[#EA580C] active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-7 py-3 sm:py-3.5 rounded-full shadow-[0_4px_14px_rgba(249,101,21,0.25)] transition-all cursor-pointer flex-shrink-0 flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
              </button>
            </form>

            {/* Success Feedback message */}
            {isSubscribed && (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 animate-fadeIn pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for subscribing! Your 10% coupon is on its way.</span>
              </div>
            )}

            {/* Micro Trust Guarantee Perks Underneath */}
            <div className="pt-4 sm:pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-[#7C8BA0] font-medium">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#F96515]" />
                <span>Exclusive subscriber discounts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-[#F96515]" />
                <span>Early access to toy sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#F96515]" />
                <span>No spam, unsubscribe anytime</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SubscribeNewsletter;
