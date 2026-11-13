import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

export const TopBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBrands(data.data);
        }
      })
      .catch((err) => console.error('Error fetching brands:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-left">
          <span className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.2em] text-[#55657E] uppercase font-sans block mb-1">
            TOP BRANDS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-[#0F243E] tracking-tight leading-tight font-title">
            Shop your <span className="text-[#F96515]">favourite brands</span>
          </h2>
        </div>

        {/* Loading / Empty / Content states */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-3.5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-[#ECEFF2] p-4 h-28 animate-pulse" />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No brands available yet.
          </div>
        ) : (
          <>
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-6 lg:grid-cols-8 gap-3.5 lg:gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="group bg-white rounded-2xl border border-[#ECEFF2] p-4 flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#F96515]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-[#0F243E] group-hover:text-[#F96515] transition-colors font-sans truncate max-w-full">
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {brand.productCount || 0} items
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile Layout */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="bg-white rounded-2xl border border-[#ECEFF2] p-4 flex flex-col items-center justify-center shadow-xs active:scale-98 transition-all aspect-[4/3] text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-[#0F243E] font-sans truncate max-w-full">
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {brand.productCount || 0} items
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default TopBrands;
