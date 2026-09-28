import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const newArrivalsProducts = [
  {
    id: 'new-1',
    name: 'Remote Control Off-Road Truck',
    slug: 'remote-control-off-road-truck',
    brand: 'PowerCraze',
    price: 2499,
    badge: 'New',
    rating: 4.6,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/12/4.png',
    inStock: true,
  },
  {
    id: 'new-2',
    name: 'Creative Building Blocks Set (200 Pcs)',
    slug: 'creative-building-blocks-set-200-pcs',
    brand: 'ToysBox',
    price: 1299,
    badge: 'New',
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/construction_toys_category-1.webp',
    inStock: true,
  },
  {
    id: 'new-3',
    name: 'Soft Teddy Bear (50 cm)',
    slug: 'soft-teddy-bear-50-cm',
    brand: 'Funskool',
    price: 1499,
    badge: 'New',
    rating: 4.7,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/role_play_toys_category-1.webp',
    inStock: true,
  },
  {
    id: 'new-4',
    name: 'Kids Smart Watch with GPS',
    slug: 'kids-smart-watch-with-gps',
    brand: 'KiddoTech',
    price: 3999,
    badge: 'New',
    rating: 4.5,
    reviewsCount: 72,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500&q=80',
    fallbackImg: 'https://toyculture.in/wp-content/uploads/2025/09/do_it_yourself_category-1.webp',
    inStock: true,
  },
];

export const NewArrivals = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full bg-[#FAF9F5] py-8 sm:py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-left">
          <span className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.2em] text-[#55657E] uppercase font-sans block mb-1">
            NEW ARRIVALS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-[#0F243E] tracking-tight leading-tight font-title">
            Fresh toys, <br className="block sm:hidden" />
            <span className="text-[#F96515]">new adventures</span>
          </h2>
        </div>

        {/* Desktop Layout (1440px) - 4 Columns Grid */}
        <div className="hidden md:grid grid-cols-4 gap-4 lg:gap-6">
          {newArrivalsProducts.map((product) => {
            const isFav = !!wishlist[product.id];

            return (
              <div
                key={product.id}
                className="bg-white rounded-[24px] border border-[#ECEFF2] p-4 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 relative group"
              >
                {/* Top Bar: 'New' Green Badge & Wishlist Button */}
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="bg-[#10B981] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    {product.badge}
                  </span>

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

                {/* Details */}
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

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-base lg:text-lg font-black text-[#0F243E]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Add to Cart */}
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

        {/* Mobile Layout (375px) - 2 Columns x 2 Rows Grid matching reference */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {newArrivalsProducts.map((product) => {
            const isFav = !!wishlist[product.id];

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#ECEFF2] p-2.5 shadow-xs flex flex-col justify-between relative group"
              >
                {/* Badge & Wishlist */}
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="bg-[#10B981] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                    {product.badge}
                  </span>

                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    aria-label="Add to wishlist"
                    className="p-0.5 text-gray-400 hover:text-red-500 ml-auto"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Image */}
                <Link
                  to={`/product/${product.slug}`}
                  className="w-full aspect-square rounded-xl bg-[#FAF9F5] p-1.5 mb-2 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => {
                      if (product.fallbackImg) e.currentTarget.src = product.fallbackImg;
                    }}
                  />
                </Link>

                {/* Details */}
                <div className="space-y-1 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-semibold text-[#8C98A9] uppercase tracking-wider block">
                      {product.brand}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-xs font-bold text-[#0F243E] line-clamp-2 leading-tight"
                    >
                      {product.name}
                    </Link>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 my-0.5">
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
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="text-xs font-black text-[#0F243E]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-1.5 py-1.5 bg-[#F96515] active:scale-[0.98] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" strokeWidth={2.2} />
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

export default NewArrivals;
