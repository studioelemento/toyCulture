import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

export const trendingProductsData = [
  {
    id: 'trending-1',
    name: 'Lamborghini Huracán 1:18 Diecast Model',
    slug: 'lamborghini-huracan-1-18-diecast-model',
    brand: 'Maisto',
    price: 2399,
    originalPrice: 2999,
    discount: '-20%',
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/12/4.png',
    inStock: true,
  },
  {
    id: 'trending-2',
    name: 'Magnetic Building Tiles 100 Pieces',
    slug: 'magnetic-building-tiles-100-pieces',
    brand: 'ToysBox',
    price: 1699,
    originalPrice: 1999,
    discount: '-15%',
    rating: 4.7,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/construction_toys_category-1.webp',
    inStock: true,
  },
  {
    id: 'trending-3',
    name: 'DIY Solar Powered Car',
    slug: 'diy-solar-powered-car',
    brand: 'Smartivity',
    price: 899,
    originalPrice: null,
    discount: null,
    rating: 4.6,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/do_it_yourself_category-1.webp',
    inStock: true,
  },
  {
    id: 'trending-4',
    name: 'Wooden Kitchen Set for Kids',
    slug: 'wooden-kitchen-set-for-kids',
    brand: 'Kruzzel',
    price: 3499,
    originalPrice: 3999,
    discount: '-10%',
    rating: 4.8,
    reviewsCount: 73,
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/role_play_toys_category-1.webp',
    inStock: true,
  },
  {
    id: 'trending-5',
    name: 'T-Rex Dinosaur Figure',
    slug: 't-rex-dinosaur-figure',
    brand: 'Schleich',
    price: 1299,
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/Activity-toys-category-images.avif',
    inStock: true,
  },
];

export const TrendingToys = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState({});
  const carouselRef = useRef(null);

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between mb-6 sm:mb-8 md:mb-10">
          <div className="space-y-1 sm:space-y-1.5">
            <span className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.2em] text-[#55657E] uppercase font-sans">
              TRENDING TOYS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-[#0F243E] tracking-tight leading-tight font-title">
              Popular picks <span className="text-[#F96515]">this week</span>
            </h2>
          </div>

          <Link
            to="/shop-by-category"
            className="text-xs sm:text-sm md:text-[15px] font-bold text-[#F96515] hover:text-[#EA580C] transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer pb-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Desktop Carousel Container with Left/Right Navigation Arrows */}
        <div className="relative hidden md:block group/carousel">
          
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            aria-label="Previous items"
            className="absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#0F243E] hover:text-[#F96515] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>

          {/* Product Cards Grid / Scroll Track */}
          <div
            ref={carouselRef}
            className="grid grid-cols-5 gap-4 lg:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2"
          >
            {trendingProductsData.map((product) => {
              const isFav = !!wishlist[product.id];

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-[24px] border border-[#ECEFF2] p-4 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 relative group"
                >
                  {/* Top Bar: Discount Badge & Wishlist Button */}
                  <div className="flex items-center justify-between w-full mb-2">
                    {product.discount ? (
                      <span className="bg-[#F96515] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                        {product.discount}
                      </span>
                    ) : (
                      <span />
                    )}

                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      aria-label="Add to wishlist"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors ml-auto cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-gray-400 stroke-[2]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Image */}
                  <Link
                    to={`/product/${product.slug}`}
                    className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 flex items-center justify-center bg-[#FAF9F5] p-2 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        if (product.fallbackImg) e.currentTarget.src = product.fallbackImg;
                      }}
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-[#8C98A9] block uppercase tracking-wider">
                        {product.brand}
                      </span>

                      <Link
                        to={`/product/${product.slug}`}
                        className="text-[13px] lg:text-[14px] font-bold text-[#0F243E] hover:text-[#F96515] transition-colors line-clamp-2 leading-snug mt-0.5 font-sans cursor-pointer"
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className="flex items-center text-[#F59E0B]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" strokeWidth={0} />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-[#55657E]">
                        {product.rating} ({product.reviewsCount})
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-base lg:text-lg font-black text-[#0F243E]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#94A3B8] line-through font-medium">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full mt-2 py-2.5 bg-[#F96515] hover:bg-[#EA580C] active:scale-[0.98] text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(249,101,21,0.2)] transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" strokeWidth={2.2} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            aria-label="Next items"
            className="absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#0F243E] hover:text-[#F96515] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile Layout (375px) - Stacked Cards matching reference */}
        <div className="flex flex-col gap-3.5 md:hidden">
          {trendingProductsData.map((product) => {
            const isFav = !!wishlist[product.id];

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#ECEFF2] p-3 shadow-xs flex items-center gap-3 relative"
              >
                {/* Left: Image Container with Discount Badge */}
                <div className="relative w-28 h-28 bg-[#FAF9F5] rounded-xl overflow-hidden flex-shrink-0 p-1.5 flex items-center justify-center">
                  {product.discount && (
                    <span className="absolute top-1 left-1 bg-[#F96515] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full z-10">
                      {product.discount}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => {
                      if (product.fallbackImg) e.currentTarget.src = product.fallbackImg;
                    }}
                  />
                </div>

                {/* Right: Details, Rating, Price, Add to Cart */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0 pr-1">
                      <span className="text-[10px] font-semibold text-[#8C98A9] uppercase tracking-wider block">
                        {product.brand}
                      </span>
                      <h3 className="text-xs font-bold text-[#0F243E] line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      aria-label="Add to wishlist"
                      className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 my-1">
                    <div className="flex items-center text-[#F59E0B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-[#F59E0B]" strokeWidth={0} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#55657E]">
                      {product.rating} ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-sm font-black text-[#0F243E]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-[#94A3B8] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2 bg-[#F96515] active:scale-[0.98] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" strokeWidth={2.2} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TrendingToys;
