import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Truck, Shield, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const dealOfTheDayProduct = {
  id: 'deal-of-the-day-lego-space',
  name: 'City Space Base and Rocket Launch Pad',
  slug: 'city-space-base-and-rocket-launch-pad',
  brand: 'LEGO',
  price: 5599,
  originalPrice: 7999,
  discount: '30% OFF',
  rating: 4.8,
  reviewsCount: 124,
  image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80',
  fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/construction_toys_category-1.webp',
  inStock: true,
};

export const DealoftheDay = () => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 24,
    seconds: 36,
  });

  // Dynamic live countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Deal Container Card */}
        <div className="bg-[#FFFDF9] border border-[#EDE7DC] rounded-[32px] p-6 sm:p-8 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          
          {/* Desktop Layout (1440px) */}
          <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading, Subtitle, Timer & Add to Cart */}
            <div className="col-span-4 space-y-6">
              <div>
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#55657E] uppercase font-sans block mb-1">
                  DEAL OF THE DAY
                </span>
                <h2 className="text-3xl lg:text-[42px] font-black text-[#0F243E] tracking-tight leading-[1.1] font-title">
                  A special toy.<br />
                  A <span className="text-[#F96515]">brighter today.</span>
                </h2>
                <p className="text-sm text-[#55657E] font-medium mt-2">
                  Limited time offer on a favourite pick
                </p>
              </div>

              {/* Countdown Timer Boxes */}
              <div className="flex items-center gap-3">
                {/* Hours */}
                <div className="bg-white border border-[#E5E9EC] rounded-2xl w-20 py-3 text-center shadow-xs">
                  <span className="text-2xl font-black text-[#0F243E] block font-title">
                    {formatNumber(timeLeft.hours)}
                  </span>
                  <span className="text-[11px] text-[#7C8BA0] font-medium">Hours</span>
                </div>

                {/* Minutes */}
                <div className="bg-white border border-[#E5E9EC] rounded-2xl w-20 py-3 text-center shadow-xs">
                  <span className="text-2xl font-black text-[#0F243E] block font-title">
                    {formatNumber(timeLeft.minutes)}
                  </span>
                  <span className="text-[11px] text-[#7C8BA0] font-medium">Mins</span>
                </div>

                {/* Seconds */}
                <div className="bg-white border border-[#E5E9EC] rounded-2xl w-20 py-3 text-center shadow-xs">
                  <span className="text-2xl font-black text-[#0F243E] block font-title">
                    {formatNumber(timeLeft.seconds)}
                  </span>
                  <span className="text-[11px] text-[#7C8BA0] font-medium">Secs</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(dealOfTheDayProduct)}
                className="w-full max-w-[280px] py-3.5 bg-[#F96515] hover:bg-[#EA580C] active:scale-[0.98] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(249,101,21,0.25)] transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" strokeWidth={2.4} />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Center Column: Product Visual with 30% OFF Circle Badge */}
            <div className="col-span-5 relative flex items-center justify-center">
              
              {/* Product Visual */}
              <div className="relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">
                <img
                  src={dealOfTheDayProduct.image}
                  alt={dealOfTheDayProduct.name}
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
                  onError={(e) => {
                    if (dealOfTheDayProduct.fallbackImg) {
                      e.currentTarget.src = dealOfTheDayProduct.fallbackImg;
                    }
                  }}
                />

                {/* 30% OFF Circular Badge */}
                <div className="absolute top-2 right-2 sm:right-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F96515] text-white flex flex-col items-center justify-center shadow-lg -rotate-6">
                  <span className="text-base sm:text-lg font-black leading-none font-title">30%</span>
                  <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase leading-none mt-0.5">OFF</span>
                </div>
              </div>

            </div>

            {/* Right Column: Brand, Name, Rating, Price, Guarantee Items */}
            <div className="col-span-3 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#8C98A9] uppercase tracking-wider block">
                  {dealOfTheDayProduct.brand}
                </span>
                <Link
                  to={`/product/${dealOfTheDayProduct.slug}`}
                  className="text-lg lg:text-xl font-black text-[#0F243E] hover:text-[#F96515] transition-colors leading-snug font-title block mt-1"
                >
                  {dealOfTheDayProduct.name}
                </Link>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B]" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#55657E]">
                  {dealOfTheDayProduct.rating} ({dealOfTheDayProduct.reviewsCount})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl lg:text-3xl font-black text-[#0F243E]">
                  ₹{dealOfTheDayProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-[#94A3B8] line-through font-medium">
                  ₹{dealOfTheDayProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* 3 Guarantee Features */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#0F243E]" strokeWidth={1.8} />
                  <span className="text-sm font-bold text-[#0F243E]">Free Delivery</span>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0F243E]" strokeWidth={1.8} />
                  <span className="text-sm font-bold text-[#0F243E]">100% Authentic</span>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#0F243E]" strokeWidth={1.8} />
                  <span className="text-sm font-bold text-[#0F243E]">Easy Returns</span>
                </div>
              </div>

            </div>

          </div>

          {/* Mobile Layout (375px) matching exact vertical structure */}
          <div className="flex flex-col space-y-5 lg:hidden">
            
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#55657E] uppercase font-sans block mb-1">
                DEAL OF THE DAY
              </span>
              <h2 className="text-2xl font-black text-[#0F243E] tracking-tight leading-tight font-title">
                A special toy.<br />
                A <span className="text-[#F96515]">brighter today.</span>
              </h2>
              <p className="text-xs text-[#55657E] font-medium mt-1">
                Limited time offer on a favourite pick
              </p>
            </div>

            {/* Product Image & Badge */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-[#FAF9F5] rounded-2xl p-3">
              <img
                src={dealOfTheDayProduct.image}
                alt={dealOfTheDayProduct.name}
                className="w-full h-full object-contain mix-blend-multiply"
                onError={(e) => {
                  if (dealOfTheDayProduct.fallbackImg) {
                    e.currentTarget.src = dealOfTheDayProduct.fallbackImg;
                  }
                }}
              />

              <div className="absolute top-2 right-2 w-14 h-14 rounded-full bg-[#F96515] text-white flex flex-col items-center justify-center shadow-md">
                <span className="text-sm font-black leading-none font-title">30%</span>
                <span className="text-[9px] font-black tracking-wider uppercase leading-none mt-0.5">OFF</span>
              </div>
            </div>

            {/* Brand, Title, Rating, Price */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#8C98A9] uppercase tracking-wider block">
                {dealOfTheDayProduct.brand}
              </span>
              <h3 className="text-base font-black text-[#0F243E] leading-snug font-title">
                {dealOfTheDayProduct.name}
              </h3>

              <div className="flex items-center gap-1.5 py-0.5">
                <div className="flex items-center text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#55657E]">
                  {dealOfTheDayProduct.rating} ({dealOfTheDayProduct.reviewsCount})
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#0F243E]">
                  ₹{dealOfTheDayProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#94A3B8] line-through font-medium">
                  ₹{dealOfTheDayProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 3 Features */}
            <div className="space-y-2 pt-1 border-t border-gray-200/60">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#0F243E]" strokeWidth={1.8} />
                <span className="text-xs font-bold text-[#0F243E]">Free Delivery</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#0F243E]" strokeWidth={1.8} />
                <span className="text-xs font-bold text-[#0F243E]">100% Authentic</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#0F243E]" strokeWidth={1.8} />
                <span className="text-xs font-bold text-[#0F243E]">Easy Returns</span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="bg-white border border-[#E5E9EC] rounded-xl flex-1 py-2 text-center shadow-xs">
                <span className="text-lg font-black text-[#0F243E] block font-title">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-[10px] text-[#7C8BA0] font-medium">Hours</span>
              </div>

              <div className="bg-white border border-[#E5E9EC] rounded-xl flex-1 py-2 text-center shadow-xs">
                <span className="text-lg font-black text-[#0F243E] block font-title">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-[10px] text-[#7C8BA0] font-medium">Mins</span>
              </div>

              <div className="bg-white border border-[#E5E9EC] rounded-xl flex-1 py-2 text-center shadow-xs">
                <span className="text-lg font-black text-[#0F243E] block font-title">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="text-[10px] text-[#7C8BA0] font-medium">Secs</span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(dealOfTheDayProduct)}
              className="w-full py-3 bg-[#F96515] active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <ShoppingCart className="w-4 h-4" strokeWidth={2.4} />
              <span>Add to Cart</span>
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default DealoftheDay;
