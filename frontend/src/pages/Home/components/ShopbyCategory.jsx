import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderTree } from 'lucide-react';

const COLOR_PALETTES = [
  { bgColor: 'bg-[#FDF0F0]', borderColor: 'border-[#FADCDC]' },
  { bgColor: 'bg-[#EDF7FC]', borderColor: 'border-[#D6ECFA]' },
  { bgColor: 'bg-[#FDF8EE]', borderColor: 'border-[#FBEECF]' },
  { bgColor: 'bg-[#FCF1EE]', borderColor: 'border-[#FADCD4]' },
  { bgColor: 'bg-[#EEF8F3]', borderColor: 'border-[#D2EFE0]' },
  { bgColor: 'bg-[#F2EFFC]', borderColor: 'border-[#E1DAF9]' },
  { bgColor: 'bg-[#FDF6EB]', borderColor: 'border-[#FBE8C8]' },
  { bgColor: 'bg-[#EDF7F4]', borderColor: 'border-[#D1EFE7]' },
  { bgColor: 'bg-[#EDF4FC]', borderColor: 'border-[#D4E7F9]' },
  { bgColor: 'bg-[#FDF0EE]', borderColor: 'border-[#FBD9D4]' },
];

export const ShopbyCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((c, idx) => {
            const palette = COLOR_PALETTES[idx % COLOR_PALETTES.length];
            return {
              id: c.id,
              title: c.name,
              productCount: c.productCount || 0,
              bgColor: palette.bgColor,
              borderColor: palette.borderColor,
            };
          });
          setCategories(formatted);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between mb-6 sm:mb-8 md:mb-10">
          <div className="space-y-1 sm:space-y-1.5">
            <span className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.2em] text-[#55657E] uppercase font-sans">
              SHOP BY CATEGORY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-[#0F243E] tracking-tight leading-tight font-title">
              Explore by <span className="text-[#F96515]">category</span>
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs sm:text-sm md:text-[15px] font-bold text-[#F96515] hover:text-[#EA580C] transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer pb-1"
          >
            <span className="hidden sm:inline">View All Categories</span>
            <span className="inline sm:hidden">View All</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Loading / Empty / Content states */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-white rounded-[28px] border border-[#ECEFF2] p-5 h-48 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No categories found.
          </div>
        ) : (
          <>
            {/* Desktop Layout (1440px) */}
            <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
              {categories.map((item) => (
                <Link
                  key={item.id}
                  to={`/shop?category=${encodeURIComponent(item.title)}`}
                  className={`group ${item.bgColor} border ${item.borderColor} rounded-[28px] lg:rounded-[32px] p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer min-h-[160px]`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-[#F96515] shadow-xs group-hover:scale-110 transition-transform">
                    <FolderTree className="w-6 h-6" />
                  </div>

                  {/* Title & Circular Arrow Action */}
                  <div className="space-y-1 pt-3">
                    <h3 className="text-base lg:text-[17px] font-black text-[#0F243E] tracking-tight font-title leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.productCount} {item.productCount === 1 ? 'product' : 'products'}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <div className="w-9 h-9 rounded-full bg-white text-[#F96515] shadow-xs flex items-center justify-center group-hover:bg-[#F96515] group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Layout (375px) */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {categories.map((item) => (
                <Link
                  key={item.id}
                  to={`/shop?category=${encodeURIComponent(item.title)}`}
                  className={`group ${item.bgColor} border ${item.borderColor} rounded-2xl p-4 flex flex-col justify-between transition-all active:scale-[0.99] cursor-pointer min-h-[130px]`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center text-[#F96515] shadow-xs mb-2">
                    <FolderTree className="w-4 h-4" />
                  </div>

                  <div>
                    <h3 className="text-[13px] font-black text-[#0F243E] tracking-tight font-title leading-tight line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {item.productCount} items
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default ShopbyCategory;
