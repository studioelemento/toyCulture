import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const categoriesData = [
  {
    id: 'diecast-toys',
    title: 'Diecast Toys',
    slug: 'diecast-toys',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/12/4.png',
    bgColor: 'bg-[#FDF0F0]',
    borderColor: 'border-[#FADCDC]',
  },
  {
    id: 'construction-toys',
    title: 'Construction Toys',
    slug: 'construction-toys-for-kids',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/construction_toys_category-1.webp',
    bgColor: 'bg-[#EDF7FC]',
    borderColor: 'border-[#D6ECFA]',
  },
  {
    id: 'puzzles',
    title: 'Puzzles',
    slug: 'puzzles',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/Puzzles-Category-images.avif',
    bgColor: 'bg-[#FDF8EE]',
    borderColor: 'border-[#FBEECF]',
  },
  {
    id: 'role-play-toys',
    title: 'Role Play Toys',
    slug: 'role-play-toys',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/role_play_toys_category-1.webp',
    bgColor: 'bg-[#FCF1EE]',
    borderColor: 'border-[#FADCD4]',
  },
  {
    id: 'stem-diy',
    title: 'STEM & DIY',
    slug: 'diy-toys',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/do_it_yourself_category-1.webp',
    bgColor: 'bg-[#EEF8F3]',
    borderColor: 'border-[#D2EFE0]',
  },
  {
    id: 'arts-crafts',
    title: 'Arts & Crafts',
    slug: 'art-and-craft-for-kids',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/do_it_yourself_category-1.webp',
    bgColor: 'bg-[#F2EFFC]',
    borderColor: 'border-[#E1DAF9]',
  },
  {
    id: 'activity-toys',
    title: 'Activity Toys',
    slug: 'activity-toys-for-kids',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/Activity-toys-category-images.avif',
    bgColor: 'bg-[#FDF6EB]',
    borderColor: 'border-[#FBE8C8]',
  },
  {
    id: 'outdoor-sports',
    title: 'Outdoor & Sports',
    slug: 'outdoor-sports',
    image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/Activity-toys-category-images.avif',
    bgColor: 'bg-[#EDF7F4]',
    borderColor: 'border-[#D1EFE7]',
  },
  {
    id: 'baby-toys',
    title: 'Baby Toys',
    slug: 'baby-toddler-toys',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/role_play_toys_category-1.webp',
    bgColor: 'bg-[#EDF4FC]',
    borderColor: 'border-[#D4E7F9]',
  },
  {
    id: 'games-more',
    title: 'Games & More',
    slug: 'board-games-for-kids',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/Activity-toys-category-images.avif',
    bgColor: 'bg-[#FDF0EE]',
    borderColor: 'border-[#FBD9D4]',
  },
];

export const ShopbyCategory = () => {
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
            to="/shop-by-category"
            className="text-xs sm:text-sm md:text-[15px] font-bold text-[#F96515] hover:text-[#EA580C] transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer pb-1"
          >
            <span className="hidden sm:inline">View All Categories</span>
            <span className="inline sm:hidden">View All</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Desktop Layout (1440px) - 2 rows x 5 columns grid */}
        <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
          {categoriesData.map((item) => (
            <Link
              key={item.id}
              to={`/category/${item.slug}`}
              className={`group ${item.bgColor} border ${item.borderColor} rounded-[28px] lg:rounded-[32px] p-4 lg:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
            >
              {/* Product Card Image Container */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-white/40 p-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    if (item.fallbackImg) e.currentTarget.src = item.fallbackImg;
                  }}
                />
              </div>

              {/* Title & Circular Arrow Action */}
              <div className="space-y-3 pt-1">
                <h3 className="text-base lg:text-[17px] font-black text-[#0F243E] tracking-tight font-title leading-snug">
                  {item.title}
                </h3>

                {/* White Circle Arrow Action */}
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white text-[#F96515] shadow-xs flex items-center justify-center group-hover:bg-[#F96515] group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Layout (375px) - 2 columns x 5 rows grid matching reference mockup */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {categoriesData.map((item) => (
            <Link
              key={item.id}
              to={`/category/${item.slug}`}
              className={`group ${item.bgColor} border ${item.borderColor} rounded-2xl p-3 flex flex-col justify-between transition-all active:scale-[0.99] cursor-pointer`}
            >
              {/* Product Card Image */}
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 flex items-center justify-center bg-white/40 p-1.5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                  onError={(e) => {
                    if (item.fallbackImg) e.currentTarget.src = item.fallbackImg;
                  }}
                />
              </div>

              {/* Title & Arrow Action */}
              <div className="flex items-center justify-between gap-1 pt-1">
                <h3 className="text-[13px] font-black text-[#0F243E] tracking-tight font-title leading-tight line-clamp-1">
                  {item.title}
                </h3>

                <div className="w-7 h-7 rounded-full bg-white text-[#F96515] shadow-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#F96515] group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ShopbyCategory;
