import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Age group images
import age02Img from 'C:/Users/amnap/.gemini/antigravity-ide/brain/2bcd030e-7b9f-4cda-a4f6-98f88df8e5bf/age_0_2_baby_1790556980448.jpg';
import age35Img from 'C:/Users/amnap/.gemini/antigravity-ide/brain/2bcd030e-7b9f-4cda-a4f6-98f88df8e5bf/age_3_5_girl_1790556999796.jpg';
import age68Img from 'C:/Users/amnap/.gemini/antigravity-ide/brain/2bcd030e-7b9f-4cda-a4f6-98f88df8e5bf/age_6_8_boy_1790557019618.jpg';
import age912Img from 'C:/Users/amnap/.gemini/antigravity-ide/brain/2bcd030e-7b9f-4cda-a4f6-98f88df8e5bf/age_9_12_stem_1790557041067.jpg';
import age13PlusImg from 'C:/Users/amnap/.gemini/antigravity-ide/brain/2bcd030e-7b9f-4cda-a4f6-98f88df8e5bf/age_13_plus_supercar_1790557067784.jpg';

export const ageGroupsData = [
  {
    id: '0-2',
    range: '0 – 2 Years',
    subtitle: 'Early Learning',
    bgColor: 'bg-[#FDF0F0]',
    borderColor: 'border-[#F9DCDC]',
    image: age02Img,
    link: '/category/baby-toddler-toys',
  },
  {
    id: '3-5',
    range: '3 – 5 Years',
    subtitle: 'Imagination & Play',
    bgColor: 'bg-[#EDF7EE]',
    borderColor: 'border-[#DAEFDC]',
    image: age35Img,
    link: '/category/construction-toys-for-kids',
  },
  {
    id: '6-8',
    range: '6 – 8 Years',
    subtitle: 'Explore & Build',
    bgColor: 'bg-[#EAF3FC]',
    borderColor: 'border-[#D4E6F9]',
    image: age68Img,
    link: '/category/diecast-toys',
  },
  {
    id: '9-12',
    range: '9 – 12 Years',
    subtitle: 'Create & Discover',
    bgColor: 'bg-[#F0EDFC]',
    borderColor: 'border-[#DFD7FB]',
    image: age912Img,
    link: '/category/puzzles',
  },
  {
    id: '13-plus',
    range: '13+ Years',
    subtitle: 'Advanced Play',
    bgColor: 'bg-[#FDF6E2]',
    borderColor: 'border-[#F8ECC2]',
    image: age13PlusImg,
    link: '/category/diecast-toys',
  },
];

export const Shopbyage = () => {
  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
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
            to="/shop"
            className="text-xs sm:text-sm md:text-[15px] font-bold text-[#F96515] hover:text-[#EA580C] transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer pb-1"
          >
            <span className="hidden sm:inline">View All Age Groups</span>
            <span className="inline sm:hidden">View All</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Desktop Layout (1440px) - 5 Grid Columns */}
        <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
          {ageGroupsData.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`group ${item.bgColor} border ${item.borderColor} rounded-[28px] lg:rounded-[32px] p-4 lg:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
            >
              {/* Card Image */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.range}
                  className="w-full h-full object-cover object-top mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content & Circular Arrow Action */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <h3 className="text-lg lg:text-xl font-black text-[#0F243E] tracking-tight font-title">
                    {item.range}
                  </h3>
                  <p className="text-xs lg:text-[13px] text-[#55657E] font-medium">
                    {item.subtitle}
                  </p>
                </div>

                {/* White Circle Arrow Button */}
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white text-[#F96515] shadow-xs flex items-center justify-center group-hover:bg-[#F96515] group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Layout (375px) - Stacked Horizontal Cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {ageGroupsData.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`group ${item.bgColor} border ${item.borderColor} rounded-2xl p-3 flex items-center justify-between gap-3 transition-all active:scale-[0.99] cursor-pointer`}
            >
              {/* Left: Thumbnail & Text */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.range}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-base font-black text-[#0F243E] tracking-tight font-title">
                    {item.range}
                  </h3>
                  <p className="text-xs text-[#55657E] font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Right: Circular Arrow Action */}
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
