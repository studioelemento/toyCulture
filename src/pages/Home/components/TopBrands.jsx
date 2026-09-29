import React from 'react';
import { Link } from 'react-router-dom';

export const brandsData = [
  {
    id: 'lego',
    name: 'LEGO',
    slug: 'lego',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg',
    fallbackBg: '#E3000B',
  },
  {
    id: 'hot-wheels',
    name: 'Hot Wheels',
    slug: 'hot-wheels',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Hot_Wheels_logo.svg',
    fallbackBg: '#EA1D2C',
  },
  {
    id: 'barbie',
    name: 'Barbie',
    slug: 'barbie',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Barbie_Logo.svg',
    fallbackBg: '#E0218A',
  },
  {
    id: 'play-doh',
    name: 'Play-Doh',
    slug: 'play-doh',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/26/Play-Doh_logo.svg',
    fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Play-Doh_logo.png/512px-Play-Doh_logo.png',
  },
  {
    id: 'fisher-price',
    name: 'Fisher-Price',
    slug: 'fisher-price',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Fisher-Price_logo.svg',
    fallbackBg: '#E2231A',
  },
  {
    id: 'nerf',
    name: 'NERF',
    slug: 'nerf',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Nerf_Logo.svg',
    fallbackBg: '#F36F21',
  },
  {
    id: 'hasbro',
    name: 'Hasbro',
    slug: 'hasbro',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Hasbro_logo.svg',
    fallbackBg: '#0072CE',
  },
  {
    id: 'melissa-doug',
    name: 'Melissa & Doug',
    slug: 'melissa-doug',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Melissa_%26_Doug_Logo.svg/512px-Melissa_%26_Doug_Logo.svg.png',
    fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Melissa_%26_Doug_logo.png',
  },
];

export const TopBrands = () => {
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

        {/* Desktop Layout (1440px) - 8 Columns Side-by-Side */}
        <div className="hidden md:grid grid-cols-8 gap-3.5 lg:gap-4">
          {brandsData.map((brand) => (
            <Link
              key={brand.id}
              to={`/category/${brand.slug}`}
              className="group bg-white rounded-2xl border border-[#ECEFF2] p-4 flex flex-col items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#F96515]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square text-center"
            >
              {/* Brand Logo Container */}
              <div className="w-full flex-1 flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    if (brand.fallbackImg) {
                      e.currentTarget.src = brand.fallbackImg;
                    }
                  }}
                />
              </div>

              {/* Brand Name */}
              <span className="text-xs font-black text-[#0F243E] group-hover:text-[#F96515] transition-colors font-sans mt-2">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Layout (375px) - 2 Columns x 4 Rows Grid matching reference */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {brandsData.map((brand) => (
            <Link
              key={brand.id}
              to={`/category/${brand.slug}`}
              className="bg-white rounded-2xl border border-[#ECEFF2] p-4 flex flex-col items-center justify-center shadow-xs active:scale-98 transition-all aspect-[4/3] text-center"
            >
              {/* Brand Logo */}
              <div className="w-full h-12 flex items-center justify-center mb-2">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-[85%] object-contain"
                  onError={(e) => {
                    if (brand.fallbackImg) {
                      e.currentTarget.src = brand.fallbackImg;
                    }
                  }}
                />
              </div>

              {/* Brand Name */}
              <span className="text-xs font-black text-[#0F243E] font-sans">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopBrands;
