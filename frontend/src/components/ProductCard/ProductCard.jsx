import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag, Check } from 'lucide-react';
import { StarRating } from '../Rating/StarRating';
import { useCart } from '../../context/CartContext';
import { QuickViewModal } from './QuickViewModal';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart, cart } = useCart();

  const productId = product?.id || product?.slug;
  const productPath = `/product/${productId}`;

  const isInCart = cart.some((item) => (item.product?.id || item.id) === productId);

  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : [product?.image || 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600'];
  const mainImage = images[0];
  const hoverImage = images[1] || images[0];

  return (
    <>
      <div
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-square bg-white overflow-hidden p-4 flex items-center justify-center">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product?.discount && (
              <span className="bg-toyRed text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                {product.discount}
              </span>
            )}
            {product?.isHot && (
              <span className="bg-toyOrange text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                Hot
              </span>
            )}
            {product?.inStock === false && (
              <span className="bg-gray-800 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                Sold Out
              </span>
            )}
          </div>

          {/* Product Image Link with Hover Swap */}
          <Link to={productPath} className="w-full h-full flex items-center justify-center">
            <img
              src={isHovered ? hoverImage : mainImage}
              alt={product?.name || 'Product'}
              className="w-full h-full object-contain transition-transform duration-500 transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
              }}
            />
          </Link>

          {/* Hover Action Buttons */}
          <div className="absolute bottom-3 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="bg-white hover:bg-toyOrange hover:text-white text-gray-700 p-2.5 rounded-full shadow-lg transition-colors flex items-center justify-center"
              title="Quick view"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => addToCart(product)}
              disabled={product?.inStock === false}
              className={`p-2.5 rounded-full shadow-lg transition-colors flex items-center justify-center ${
                product?.inStock === false
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isInCart
                  ? 'bg-toyGreen text-white'
                  : 'bg-toyOrange text-white hover:bg-toyOrange-hover'
              }`}
              title={isInCart ? 'Added to Cart' : 'Add to Cart'}
            >
              {isInCart ? <Check size={16} /> : <ShoppingBag size={16} />}
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-50">
          <div>
            {/* Category tag */}
            {product?.category && (
              <div className="text-[11px] font-bold text-toyOrange uppercase tracking-wider mb-1">
                <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:underline">
                  {product.category}
                </Link>
              </div>
            )}

            {/* Product Title */}
            <h3 className="text-xs md:text-sm font-bold text-toyText-heading line-clamp-2 mb-2 group-hover:text-toyOrange transition-colors leading-snug">
              <Link to={productPath}>{product?.name}</Link>
            </h3>

            {/* Rating */}
            <div className="mb-2">
              <StarRating rating={product?.rating || 4.8} reviewCount={product?.reviews || product?.reviewCount || 0} />
            </div>
          </div>

          {/* Price & Brand Section */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-extrabold text-toyText-heading">
                ₹{Number(product?.price || 0).toLocaleString('en-IN')}
              </span>
              {product?.originalPrice && (
                <span className="text-[11px] text-gray-400 line-through">
                  ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              {product?.brand || 'ToyCulture'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
};
