import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderTree } from 'lucide-react';
import { attachCategoryPreviewImages, buildCategoryCards, CATEGORY_COLOR_PALETTES } from '../../../lib/categories';

export const ShopbyCategory = ({ variant = 'home' }) => {
  const isHome = variant === 'home';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoadError('');
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/v1/products?limit=100'),
        ]);

        if (!catRes.ok) throw new Error('Could not load categories');

        const catJson = await catRes.json();
        const prodJson = prodRes.ok ? await prodRes.json() : { data: [] };

        const rawCategories = catJson.success && Array.isArray(catJson.data) ? catJson.data : [];
        const products = prodJson.success && Array.isArray(prodJson.data) ? prodJson.data : [];

        const withImages = attachCategoryPreviewImages(rawCategories, products);
        const cards = buildCategoryCards(withImages, {
          requireProducts: true,
          maxItems: isHome ? 10 : null,
        });

        if (alive) setCategories(cards);
      } catch (err) {
        console.error('Shop by category load failed:', err);
        if (alive) {
          setLoadError('We could not load categories right now.');
          setCategories([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, [isHome]);

  const skeletonCount = isHome ? 5 : 8;

  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

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
            to="/shop-by-category"
            className="text-xs sm:text-sm md:text-[15px] font-bold text-[#F96515] hover:text-[#EA580C] transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer pb-1"
          >
            <span className="hidden sm:inline">View All Categories</span>
            <span className="inline sm:hidden">View All</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

        {loadError ? (
          <p className="text-sm text-rose-600 font-medium mb-4">{loadError}</p>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-5">
            {Array.from({ length: skeletonCount }).map((_, n) => (
              <div key={n} className={`rounded-[28px] border border-[#ECEFF2] p-5 h-48 animate-pulse ${CATEGORY_COLOR_PALETTES[n % CATEGORY_COLOR_PALETTES.length].bgColor}`} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No categories with products yet. Check back after adding inventory in admin.
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
              {categories.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`group ${item.bgColor} border ${item.borderColor} rounded-[28px] lg:rounded-[32px] p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer min-h-[160px]`}
                >
                  <div className="w-full aspect-[4/3] rounded-2xl bg-white/50 overflow-hidden flex items-center justify-center mb-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <CategoryFallbackIcon />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base lg:text-[17px] font-black text-[#0F243E] tracking-tight font-title leading-snug line-clamp-2">
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

            <div className="grid grid-cols-2 gap-3 md:hidden">
              {categories.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`group ${item.bgColor} border ${item.borderColor} rounded-2xl p-4 flex flex-col justify-between transition-all active:scale-[0.99] cursor-pointer min-h-[130px]`}
                >
                  <CategoryFallbackIcon small />
                  <div>
                    <h3 className="text-[13px] font-black text-[#0F243E] tracking-tight font-title leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {item.productCount} {item.productCount === 1 ? 'product' : 'products'}
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

function CategoryFallbackIcon({ small = false }) {
  return (
    <div className={`${small ? 'w-9 h-9 rounded-xl mb-2' : 'w-12 h-12 rounded-2xl'} bg-white/80 flex items-center justify-center text-[#F96515] shadow-xs`}>
      <FolderTree className={small ? 'w-4 h-4' : 'w-6 h-6'} />
    </div>
  );
}

export default ShopbyCategory;
