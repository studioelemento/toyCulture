import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { buildAgeGroupStats, SHOP_AGE_GROUPS } from '../../../lib/ageGroups';

const skeletonCards = SHOP_AGE_GROUPS;

export const Shopbyage = () => {
  const [ageCards, setAgeCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoadError('');
        const res = await fetch('/api/v1/products?limit=100&sort=name&order=asc');
        if (!res.ok) throw new Error('Could not load products');
        const data = await res.json();
        const list = data.success && Array.isArray(data.data) ? data.data : [];
        if (alive) setAgeCards(buildAgeGroupStats(list));
      } catch (err) {
        console.error('Shop by age load failed:', err);
        if (alive) {
          setLoadError('We could not load age groups right now.');
          setAgeCards(buildAgeGroupStats([]));
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, []);

  const cards = ageCards.length ? ageCards : buildAgeGroupStats([]);

  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        <div className="flex flex-row items-end justify-between mb-6 sm:mb-8 md:mb-10">
          <div className="space-y-1 sm:space-y-1.5">
            <span className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.2em] text-[#55657E] uppercase font-sans">
              SHOP BY AGE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-[#0F243E] tracking-tight leading-tight font-title">
              Find the perfect <br className="block sm:hidden" />
              toy for <span className="text-[#F96515]">every age</span>
            </h2>
          </div>

          <Link
            to="/shop-by-age"
            className="text-xs sm:text-sm md:text-[15px] font-bold text-[#F96515] hover:text-[#EA580C] transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer pb-1"
          >
            <span className="hidden sm:inline">View All Age Groups</span>
            <span className="inline sm:hidden">View All</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

        {loadError ? (
          <p className="text-sm text-rose-600 font-medium mb-4">{loadError}</p>
        ) : null}

        <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
          {(loading ? skeletonCards : cards).map((item) => (
            <Link
              key={item.id}
              to={item.link || `/shop?age=${item.id}`}
              className={`group ${item.bgColor} border ${item.borderColor} rounded-[28px] lg:rounded-[32px] p-4 lg:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${loading ? 'animate-pulse pointer-events-none' : ''}`}
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 flex items-center justify-center bg-white/40">
                {!loading && (
                  <img
                    src={item.image}
                    alt={item.range}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-0.5">
                  <h3 className="text-lg lg:text-xl font-black text-[#0F243E] tracking-tight font-title">
                    {item.range}
                  </h3>
                  <p className="text-xs lg:text-[13px] text-[#55657E] font-medium">
                    {item.subtitle}
                    {!loading && typeof item.count === 'number' ? (
                      <span className="text-[#0F243E]"> · {item.count} toy{item.count === 1 ? '' : 's'}</span>
                    ) : null}
                  </p>
                </div>

                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white text-[#F96515] shadow-xs flex items-center justify-center group-hover:bg-[#F96515] group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:hidden">
          {(loading ? skeletonCards : cards).map((item) => (
            <Link
              key={item.id}
              to={item.link || `/shop?age=${item.id}`}
              className={`group ${item.bgColor} border ${item.borderColor} rounded-2xl p-3 flex items-center justify-between gap-3 transition-all active:scale-[0.99] cursor-pointer ${loading ? 'animate-pulse pointer-events-none' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/50">
                  {!loading && (
                    <img
                      src={item.image}
                      alt={item.range}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-base font-black text-[#0F243E] tracking-tight font-title">
                    {item.range}
                  </h3>
                  <p className="text-xs text-[#55657E] font-medium">
                    {item.subtitle}
                    {!loading && typeof item.count === 'number' ? (
                      <span> · {item.count} toy{item.count === 1 ? '' : 's'}</span>
                    ) : null}
                  </p>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-white text-[#F96515] shadow-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#F96515] group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Shopbyage;
