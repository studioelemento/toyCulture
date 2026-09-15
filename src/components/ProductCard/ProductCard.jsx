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

  const isInCart = cart.some((item) => item.product.id === product.id);

  const mainImage = product.images[0];
  const hoverImage = product.images[1] || product.images[0];

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
            {product.discount && (
              <span className="bg-toyRed text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                {product.discount}
              </span>
            )}
            {product.isHot && (
              <span className="bg-toyOrange text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                Hot
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-800 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                Sold Out
              </span>
            )}
          </div>

          {/* Product Image Link with Hover Swap */}
          <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
            <img
              src={isHovered ? hoverImage : mainImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 transform group-hover:scale-105"
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
              disabled={!product.inStock}
              className={`p-2.5 rounded-full shadow-lg transition-colors flex items-center justify-center ${
                !product.inStock
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
            <div className="text-[11px] font-bold text-toyOrange uppercase tracking-wider mb-1">
              <Link to={`/category/${product.categorySlug}`} className="hover:underline">
                {product.category}
              </Link>
            </div>

            {/* Product Title */}
            <h3 className="text-xs md:text-sm font-bold text-toyText-heading line-clamp-2 mb-2 group-hover:text-toyOrange transition-colors leading-snug">
              <Link to={`/product/${product.slug}`}>{product.name}</Link>
            </h3>

            {/* Rating */}
            <div className="mb-2">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
          </div>

          {/* Prices & Quick Add */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-toyText-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Add to cart text button */}
            <button
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                !product.inStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-toyOrange/10 text-toyOrange hover:bg-toyOrange hover:text-white'
              }`}
            >
              {product.inStock ? '+ Add' : 'Out of stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
